'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  up:async (queryInterface, Sequelize) =>{
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      venueId: {
        allowNull:true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Venues',
        }
      },
      groupId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Groups',
          key: 'id'
        }
      },
      name: {
        allowNull:false,
        type: Sequelize.STRING
      },
      description: {
        allowNull:false,
        type: Sequelize.TEXT
      },
      type: {
        allowNull:false,
        type: Sequelize.ENUM("Online", "In Person")
      },
      capacity: {
        allowNull:false,
        type: Sequelize.INTEGER
      },
      price: {
        allowNull:false,
        type: Sequelize.DECIMAL
      },
      startDate: {
        allowNull:false,
        type: Sequelize.DATE
      },
      endDate: {
        allowNull:false,
        type: Sequelize.DATE
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
    options.tableName = 'Events';
    return queryInterface.dropTable(options.tableName);
  }
};
