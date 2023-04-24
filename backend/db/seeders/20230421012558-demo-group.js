'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Evening Tennis on the Water',
        about: 'Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.',
        type: 'In person',
        private:true,
        city:'New York',
        state:'NY'
      },
      {
        organizerId: 2,
        name: 'Ballet on the River',
        about: 'Practicing ballet while enjoying the beatiful scenary on the rio grande river',
        type: 'In person',
        private:true,
        city:'Roswell',
        state:'NM'
      },
      {
        organizerId: 3,
        name: 'Playing tag',
        about: 'Intense game of playing tag very competitive and playing for cash prize',
        private:false,
        city:'New York',
        state:'NY'
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options.tableName, {
      id: { [Op.eq]: [1, 2, 3] }
    }, {});
  }
};
