'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservasi.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Reservasi.belongsTo(models.Kamar, {
        foreignKey: 'kamarId'
      });
    }
  }
  Reservasi.init({
    userId: DataTypes.INTEGER,
    kamarId: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    tanggal_checkin: DataTypes.DATE,
    tanggal_checkout: DataTypes.DATE,
    status: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reservasi',
  });
  return Reservasi;
};