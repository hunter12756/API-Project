'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        userId: 1,
        status: "attending"
      },
      {
        eventId: 1,
        userId: 2,
        status: "waitlist"
      },
      {
        eventId: 2,
        userId: 3,
        status: "pending"
      },
      {
        eventId: 2,
        userId: 1,
        status: "waitlist"
      },
      {
        eventId: 3,
        userId: 2,
        status: "pending"
      },
      {
        eventId: 3,
        userId: 3,
        status: "attending"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options.tableName, {
      id: { [Op.eq]: [1,2,3] }
    }, {});
  }
};
