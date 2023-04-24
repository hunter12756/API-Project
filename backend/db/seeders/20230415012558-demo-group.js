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
        name: "Lovers of dance",
        about: "We are the people who really love to dance here.",
        type: "In person",
        private: false,
        city: "New York City",
        state: "New York"
      },
      {
        organizerId: 2,
        name: "Animal fans",
        about: "We love animals here",
        type: "In person",
        private: false,
        city: "Los Angeles",
        state: "California"
      },
      {
        organizerId: 3,
        name: "Business networkers",
        about: "We like to do business and network.",
        type: "Online",
        private: true,
        city: "Dallas",
        state: "Texas"
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options.tableName, {
      id: { [Op.eq]: [1, 2, 3] }
    }, {});
  }
};
