'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organizerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      name: {

        type: Sequelize.STRING
      },
      about: {

        type: Sequelize.TEXT
      },
      type: {

        type: Sequelize.ENUM('Online', 'In person')
      },
      private: {

        type: Sequelize.BOOLEAN
      },
      city: {
        allowNull:false,
        type: Sequelize.STRING
      },
      state: {
        allowNull:false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    },options);
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.dropTable(options.tableName);
  }
};
