'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId:1,
        url:"www.deez1.com",
        previw:true
      },
      {
        groupId:2,
        url:"www.deez2.com",
        previw:true
      },
      {
        groupId:3,
        url:"www.deez3.com",
        previw:true
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options.tableName, {
      id: { [Op.eq]: [1, 2, 3] }
    }, {});
  }
};
