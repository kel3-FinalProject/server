'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Reservasi, { 
        foreignKey: 'kamarId' });
    }
  }
  Kamar.init({
    harga: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    class: DataTypes.STRING,
    kapasitas: DataTypes.INTEGER,
    image: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Kamar',
  });
  return Kamar;
};