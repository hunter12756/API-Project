'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: '123 Disney Lane',
        city: 'New York',
        state: 'NY',
        lat: 23.12,
        lng:18.23
      },
      {
        groupId: 2,
        address: '124 Disney Road',
        city: 'Orlando',
        state: 'FL',
        lat: 23.12,
        lng:18.23
      },
      {
        groupId: 3,
        address: 'United States',
        city: null,
        state:null,
        lat: null,
        lng:null
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.eq]: [1,2,3] }
    }, {});
  }
};
