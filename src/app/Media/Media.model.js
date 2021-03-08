module.exports = ({ Model, relations }) => {
  return class Media extends Model {
    static get tableName() {
      return "Media";
    }

    static get relationMappings() {
      return {
        user: {
          relation: Model.BelongsToOneRelation,
          modelClass: relations().User,
          join: {
            from: "Media.userId",
            to: "User.id"
          }
        },
        spot: {
          relation: Model.BelongsToOneRelation,
          modelClass: relations().Spot,
          join: {
            from: 'Media.userId',
            to: 'Spot.id'
          }
        }
      };
    }
  };
};
