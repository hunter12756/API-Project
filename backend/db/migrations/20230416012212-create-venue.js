"use strict";
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Venues', {
      id: {
        allowNull:false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
        }
      },
      address: {
        type: Sequelize.STRING,

      },
      city: {
        type: Sequelize.STRING,

      },
      state: {
        type: Sequelize.STRING,

      },
      lat: {
        type: Sequelize.DECIMAL,

      },
      lng: {
        type: Sequelize.DECIMAL,
        
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
    },options);
  },
down: async (queryInterface, Sequelize) => {
  options.tableName = "Venues";
  return queryInterface.dropTable(options.tableName);
}
};
