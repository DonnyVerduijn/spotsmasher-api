
module.exports = ({ Model, relations }) => {
    return class Filter extends Model {
      static get tableName() {
        return "Filter";
      }

      static get relationMappings() {
        return {
          attributes: {
            relation: Model.ManyToManyRelation,
            modelClass: relations().Attribute,
            join: {
              from: "Filter.id",
              to: "Attribute.id",
              through: {
                from: "Filter_Attribute.filterId",
                to: "Filter_Attribute.attributeId"
              }
            }
          },
        };
      }
    }
  }