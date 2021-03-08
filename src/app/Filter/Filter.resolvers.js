
module.exports = ({ Filter }) => ({
    Query: {
      TypeFilter: () => Filter.getByName('Types'),
      SpotObjectsFilter: () => Filter.getByName('SpotObjects'),
      SpotOptionsFilter: () => Filter.getByName('SpotOptions'),
      ParkDisciplinesFilter: () => Filter.getByName('ParkDisciplines'),
      ParkOptionsFilter: () => Filter.getByName('ParkOptions')
    },
  });
  