'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId:1,
        groupId:2,
        status:"co-host"
      },
      {
        userId:1,
        groupId:1,
        status:"waitlisted"
      },
      {
        userId:3,
        groupId:3,
        status:"pending"
      },


    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: {[Op.in]:['co-host','member','pending']}
    }, {});
  }
};
