'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 2,
        name: "Smash Bros Tournament",
        description: "Join your friends in a Smash bros tournament! Switches provided and prizes will be given out as well! Will last three days so gather your friends and come along",
        type: "In person",
        capacity: 20,
        price: 20,
        startDate: new Date("2021-10-28"),
        endDate: new Date("2021-10-31")
      },
      {
        venueId: 2,
        groupId: 1,
        name: "CSGO: Team Tryouts",
        description: "We are hosting team tryouts, we have two openings on our main roster and will be taking 30 people and seeing who the two best will be!",
        type: "Online",
        capacity: 30,
        price: 15,
        startDate: new Date("2023-06-30"),
        endDate: new Date("2023-06-31")
      },
      {
        venueId: 3,
        groupId: 3,
        name: "League Jungle Coaching",
        description: "Come join our High Elo coaching session with guest star and top korean pro, Faker",
        type: "Online",
        capacity: 100,
        price: 5,
        startDate: new Date("2023-07-31"),
        endDate: new Date("2023-08-02")
      },
      {
        venueId: 2,
        groupId: 4,
        name: "Amateur Osu Tournament",
        description: "We are hosting our very first Osu! Tournament, feel free to join! We offer different tiers for different skill levels, join today!",
        type: "Online",
        capacity: 200,
        price: 5,
        startDate: new Date("2023-09-02"),
        endDate: new Date("2023-09-05")
      },
      {
        venueId: 3,
        groupId: 5,
        name: "Terraria Calamity Playthrough",
        description: "Signup to join a complete Calamity playthrough, we will have snacks, beverages, and more provided while everyone enjoys beating Calamity!",
        type: "In person",
        capacity: 5,
        price: 10,
        startDate: new Date("2023-010-20"),
        endDate: new Date("2023-10-31")
      },

    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options)
  }
};
