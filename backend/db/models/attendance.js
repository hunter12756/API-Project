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
      id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
      },
      eventId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM('attending','waitlist','pending'),
      },
    },
    {
      sequelize,
      modelName: "Attendance",

    }
  );
  return Attendance;
};
