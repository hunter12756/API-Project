'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 2,
        name: "Picnic at the park",
        description: "Join your fellow New Yorkers for a sunny day in Central Park!",
        type: "In person",
        capacity: 20,
        price: 20,
        startDate: new Date("2021-10-28"),
        endDate: new Date("2021-10-31")
      },
      {
        venueId: 2,
        groupId: 1,
        name: "Disco at the zoo",
        description: "Get down with the penguins and the tigers.",
        type: "In person",
        capacity: 30,
        price: 15,
        startDate: new Date("2023-06-30"),
        endDate: new Date("2023-06-30")
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Skate and stuff",
        description: "Come skate board and show off tricks",
        type: "In person",
        capacity: 100,
        price: 5,
        startDate: new Date("2023-07-31"),
        endDate: new Date("2023-07-31")
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options)
  }
};
