'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId:1,
        url: 'www.deez1.com',
        preview:true
      },
      {
        eventId:2,
        url: 'www.deez2.com',
        preview:false
      },
      {
        eventId:3,
        url: 'www.deez3.com',
        preview:true
      },


    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options)
  }
};
