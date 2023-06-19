// models/venue.js
'use strict';

const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.hasMany(models.Event, { foreignKey: 'venueId' ,onDelete:'CASCADE',hooks:true});
      Venue.belongsTo(models.Group, { foreignKey: 'groupId' });
    }
  }
 Venue.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey: true,
      autoIncrement: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.DECIMAL,
    },
    lng: {
      type: DataTypes.DECIMAL,
    },
  },{
    sequelize,
    modelName: 'Venue',
  });

  return Venue;
};
