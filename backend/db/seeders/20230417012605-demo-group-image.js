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
        url:"https://static.designboom.com",
        preview:true
      },
      {
        groupId:2,
        url:"https://secure.meetupstatic.com/photos",
        preview:true
      },
      {
        groupId:3,
        url:"https://zoaroutdoor.com/wp-content/uploads",
        preview:true
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.eq]: [1, 2, 3] }
    }, {});
  }
};
