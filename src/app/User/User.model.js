module.exports = ({ Model, relations }) => {
  return class User extends Model {
    static tableName() {
      return "User";
    }

    static relationMappings() {
      return {
        unlockedSpots: {
          relation: Model.ManyToManyRelation,
          modelClass: relations().Spot,
          join: {
            from: "User.id",
            to: "Spot.id",
            through: {
              from: "User_UnlockedSpot.userId",
              to: "User_UnlockedSpot.spotId"
            }
          }
        },
        media: {
          relation: Model.HasManyRelation,
          modelClass: relations().Media,
          join: {
            from: "User.id",
            to: "Media.userId"
          }
        }
      };
    }
  };
};
