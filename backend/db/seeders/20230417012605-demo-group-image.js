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
        url:"https://i.imgur.com/JBI0wxv.png",
        preview:true
      },
      {
        groupId:2,
        url:"https://i.imgur.com/3JImW6K.png",
        preview:true
      },
      {
        groupId:3,
        url:"https://i.imgur.com/Tz2dOsC.png",
        preview:true
      },
      {
        groupId:4,
        url:"https://i.imgur.com/t4tvlna.png",
        preview:true
      },
      {
        groupId:5,
        url:"https://i.imgur.com/HUoGq0f.png",
        preview:true
      }


    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options)
  }
};
