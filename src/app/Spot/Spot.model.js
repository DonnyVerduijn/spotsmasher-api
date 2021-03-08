module.exports = ({ Model, relations }) => {
  return class Spot extends Model {
    static get tableName() {
      return "Spot";
    }

    static get relationMappings() {
      return {
        grantedUsers: {
          relation: Model.ManyToManyRelation,
          modelClass: relations().User,
          join: {
            from: "Spot.id",
            to: "User.id",
            through: {
              from: "User_UnlockedSpot.spotId",
              to: "User_UnlockedSpot.userId"
            }
          }
        },
        attributes: {
          relation: Model.ManyToManyRelation,
          modelClass: relations().Attribute,
          join: {
            from: "Spot.id",
            to: "Attribute.id",
            through: {
              from: "Spot_Attribute.spotId",
              to: "Spot_Attribute.attributeId"
            }
          }
        },
        media: {
          relation: Model.HasManyRelation,
          modelClass: relations().Media,
          join: {
            from: 'Spot.id',
            to: 'Media.spotId'
          }
        }
      };
    }
  };
};
