// models/venue.js
'use strict';

const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.hasMany(models.Event, { foreignKey: 'venueId' });
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
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIAML,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },{
    sequelize,
    modelName: 'Venue',
  });

  return Venue;
};
