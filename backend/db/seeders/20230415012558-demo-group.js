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
        name: "General Gamers",
        about: "We are people who love to casually game: smash bros, stardew valley, mario kart, and party games",
        type: "In person",
        private: false,
        city: "New York City",
        state: "New York"
      },
      {
        organizerId: 2,
        name: "CSGO Group",
        about: "We are mid-high ELO CSGO group looking for new members, we host tournaments, scrims, and more",
        type: "Online",
        private: false,
        city: "Los Angeles",
        state: "California"
      },
      {
        organizerId: 3,
        name: "League of Legends Clan",
        about: "We are a LoL clan that are always looking for new members to play and have fun with! We offer scrims, coaching, practices, and have a e-sports team as well",
        type: "Online",
        private: true,
        city: "Dallas",
        state: "Texas"
      },
      {
        organizerId: 3,
        name: "OSU!",
        about: "Come enjoy the fun popular rhythm game known as Osu! that comes with four different modes, Standar, mania, taiko, and catch. We host weekly tournaments with prize pools as well!",
        type: "Online",
        private: true,
        city: "Dallas",
        state: "Texas"
      },
      {
        organizerId: 3,
        name: "Terraria",
        about:"Chill group to play terraria with, modded and vanilla playthroughs offered, come grind!",
        type: "Online",
        private: true,
        city: "Atlanta",
        state: "Georgia"
      },

    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options)
  }
};
