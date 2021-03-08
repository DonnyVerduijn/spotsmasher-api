const { uuid } = require("uuidv4");

// SELECT f.cluster_id, id
// 	 FROM (SELECT ST_ClusterDBSCAN(location, eps := .05, minPoints := 5)
//     OVER () AS cluster_id, location
//     FROM "Spot") as f  WHERE cluster_id is not null
  

// SELECT  count(cluster_id) as count, *
//   FROM (SELECT ST_ClusterDBSCAN(location, eps := .05, minPoints := 5)
//    OVER () AS cluster_id
//    FROM "Spot") sq
// group by sq.cluster_id
// order by count

// SELECT ST_AsText(ST_GeometricMedian(ST_Collect(f.location))) as geom, count(f.cluster_id) as count, f.cluster_id
// 	 FROM (SELECT ST_ClusterDBSCAN(location, eps := .05, minPoints := 5)
//     OVER () AS cluster_id, location
//     FROM "Spot") as f  WHERE cluster_id is not null
// 	GROUP BY f.cluster_id
// ORDER BY count DESC

module.exports = ({ models, knex }) => {
  const createModifiers = modifiers(knex, models);
  let spotAttributeId;
  let parkAttributeId;

  const getAttributeByName = name =>
    models.Attribute.query()
      .select("id")
      .where("name", name)
      .first();

  getAttributeByName("spot")
    .then(attribute => {
      attribute ? (spotAttributeId = attribute.id.toString()) : null;
    })
    .error(err => {
      throw new Error('db not ready')
    });
  getAttributeByName("park")
    .then(attribute => {
      attribute ? (parkAttributeId = attribute.id.toString()) : null;
    })
    .error(err =>{
      throw new Error('db not ready')
    });

  return {
    async list(fields, queryInput) {
      const input = withInputDefaults(queryInput);
      const query = models.Spot.query().modify(query => {
        const withModifier = createModifiers(query, knex, models);

        withModifier.fields({
          id: !!fields.results.id,
          slug: !!fields.results.slug,
          title: !!fields.results.title,
          description: !!fields.results.description,
        });
        withModifier.location(!!fields.results.location);
        withModifier.createdAt(!!fields.results.created_at);
        withModifier.distance(
          !!fields.results.distance,
          input.filters.SelectedPlace.location
        );

        withModifier.relations({
          attributes: !!fields.results.attributes,
          media: !!fields.results.media
        });

        withModifier.isUnlocked(input.user.id);

        const {
          TypeFilter,
          SpotObjectsFilter,
          SpotOptionsFilter,
          ParkDisciplinesFilter,
          ParkOptionsFilter
        } = input.filters;

        const typeAttributes = {
          park: {
            selected: TypeFilter.selected.indexOf(parkAttributeId) !== -1,
            filters: [ParkDisciplinesFilter, ParkOptionsFilter]
          },
          spot: {
            selected: TypeFilter.selected.indexOf(spotAttributeId) !== -1,
            filters: [SpotObjectsFilter, SpotOptionsFilter]
          }
        };

        withModifier.typeFilter(typeAttributes, () => {
          withModifier.range(
            input.filters.SelectedPlace.location,
            input.filters.RangeFilter.value
          );
        });

        withModifier.groupBy("Spot.id");
        withModifier.range(
          input.filters.SelectedPlace.location,
          input.filters.RangeFilter.value
        );
        withModifier.limit(input.filters.limit);
        withModifier.offset(input.filters.offset);
        withModifier.orderBy(input.filters.OrderingFilter);
      });

      return {
        id: uuid(),
        __typename: "SpotSearchResponse",
        results: await query,
        total: await query.resultSize()
      };
    },
    async getById(id) {
      return await models.Spot.query()
        .select("*")
        .select(knex.raw(asGeoJSON("location")))
        .eager("media")
        .findById(id);
    },
    async update(fields, args) {
      return await models.Spot.query().findById(args.id);
    },
    async insert() {
      return await models.Spot.query().findById(
        "051a79cc-f37d-48a2-8129-08f18dcfe3ab"
      );
    },
    async delete() {
      return await models.Spot.query().findById(
        "051a79cc-f37d-48a2-8129-08f18dcfe3ab"
      );
    }
  };
};

const modifiers = (knex, models) => query => {
  return {
    fields: fields => {
      Object.keys(fields).forEach(key => {
        if (fields[key.toString()]) query.select(`Spot.${key}`);
      });
    },
    createdAt: field => {
      if (field) query.select(knex.raw(extractEpoch("created_at")));
    },
    location: field => {
      if (field) query.select(knex.raw(asGeoJSON("location")));
    },
    distance: (field, center) => {
      if (field || center)
        query.select(knex.raw(distance("location", makePoint(center))));
    },
    relations: relations => {
      query.eager(`[${spreadObjectKeys(relations)}]`);
    },
    isUnlocked: userId => {
      query.select(
        models.Spot.relatedQuery("grantedUsers")
          .where("userId", userId)
          .orWhereExists(
            models.Spot.relatedQuery("attributes").where("name", "indoor")
          )
          .count()
          .as("isUnlocked")
      );
    },
    typeFilter: (types, addModifiers) => {
      const getAttributeByTypeKey = (typeKey, useOr) => {
        const method = useOr ? "orWhereExists" : "whereExists";
        query[method.toString()](
          models.Spot.relatedQuery("attributes").where(
            "attributes.name",
            typeKey
          )
        );
      };

      const filterByAttributeIds = attributeIds =>
        query.whereExists(
          models.Spot.relatedQuery("attributes").whereIn(
            "attributes.id",
            attributeIds
          )
        );

      Object.keys(types).forEach((typeKey, index) => {
        if (types[typeKey.toString()].selected) {
          const useOr = index !== 0;
          getAttributeByTypeKey(typeKey, useOr);

          types[typeKey.toString()].filters.forEach(filter => {
            if (filter.selected.length > 0)
              filterByAttributeIds(filter.selected);
          });
          addModifiers();
        }
      });
    },
    groupBy: column => {
      query.groupBy(column);
    },
    offset: offset => {
      if (offset) query.offset(offset);
    },
    limit: limit => {
      if (limit) query.limit(limit);
    },
    range: (center, range) => {
      if (center && range) query.whereRaw(within(makePoint(center), range));
    },
    orderBy: orderBy => {
      if (orderBy)
        query.orderBy(orderBy.column.toLowerCase(), orderBy.direction);
    }
  };
};

const makePoint = ({ longitude, latitude }) =>
  `geography(ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))`;
const within = (point, range) =>
  `ST_DWITHIN(location, ${point}, ${range}) = true`;
const distance = (column, point) =>
  `ST_Distance(${column}, geography(${point}), false) as distance`;

const extractEpoch = column => `EXTRACT(epoch FROM ${column}) as ${column}`;
const asGeoJSON = column => `ST_asGeoJSON(${column}, 15, 5) as ${column}`;

const spreadObjectKeys = object =>
  Object.keys(object).reduce(
    (acc, rel) => (object[rel.toString()] ? [...acc, rel] : acc),
    []
  );

const withInputDefaults = input =>
  Object.assign(
    {},
    {
      filters: {
        limit: 10,
        OrderingFilter: {
          column: "NAME",
          direction: "ASC"
        },
        RangeFilter: {
          value: 10000
        },
        SelectedPlace: {
          location: {
            latitude: 4,
            longitude: 52
          },
          name: "hello world"
        }
      },
      user: {
        id: 0
      }
    },
    input
  );
