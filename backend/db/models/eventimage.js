'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    static associate(models) {
      EventImage.belongsTo(models.Event, { foreignKey: 'eventId' });
    }
  }
  EventImage.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    eventId: {
      type: DataTypes.INTEGER,
      onDelete:"CASCADE"
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    preview: {
      type: DataTypes.BOOLEAN,
    },

  }, {
    sequelize,
    modelName: 'EventImage',
  });
  return EventImage;
};
