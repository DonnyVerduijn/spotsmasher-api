module.exports = ({ Spot }) => ({
  Query: {
    Spot: (obj, args) => {
      // console.log(args);
      return Spot.getById(args.id);
    },
    SpotSearchResponse: async (obj, { fields, input }) => {
      return Spot.list(fields, input).then(result => result);
    }
  },
  Mutation: {
    updateSpot: (obj, { id, input }) => {
      return Spot.update(id, input);
    },
    createSpot: (obj, { input }) => {
      return Spot.insert(input);
    },
    deleteSpot: (obj, { id }) => {
      return Spot.delete(id);
    },
    unlockSpot: (obj, { id }) => {
      return Spot.create(id);
    }
  },
  SpotUnion: {
    __resolveType: value => {
      // return value.isUnlocked ? "UnlockedSpot" : "LockedSpot";
      return "UnlockedSpot";
    }
  }
});
