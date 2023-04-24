'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.hasMany(models.EventImage, { foreignKey: 'eventId', onDelete:'CASCADE' });
      Event.hasMany(models.Venue, { foreignKey: 'eventId', onDelete:'CASCADE'  });
      Event.belongsTo(models.Venue, { foreignKey: 'venueId' , onDelete:'CASCADE' });
      Event.belongsTo(models.Group, { foreignKey: 'groupId' , onDelete:'CASCADE' });
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('pending'),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
