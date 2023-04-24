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
    eventId: {
      type: DataTypes.INTEGER
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1,60],
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      validate: {

      }
    },

  }, {
    sequelize,
    modelName: 'EventImage',
  });
  return EventImage;
};
