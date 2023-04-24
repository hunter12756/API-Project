'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Event, { foreignKey: 'eventId' });
      Attendance.belongsTo(models.User, { foreignKey: 'userId' });
    }
  };

  Attendance.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM('attending','waitlist','pending'),
        allowNull: false,
        validate: {

        }
      },
    },
    {
      sequelize,
      modelName: "Attendance",
      defaultScope: {
        attributes: {
          exclude: []
        }
      }
    }
  );
  return Attendance;
};
