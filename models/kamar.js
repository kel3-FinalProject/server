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
      Kamar.hasMany(models.Reservasi, { 
        foreignKey: 'kamarId' });
    }
  }
  Kamar.init({
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate : {
        notNull: {
          msg: "input tidak boleh null"
        },
        notEmpty: {
          ms: "input tidak boleh string kosong"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "input tidak boleh null"
        },
        notEmpty: {
          msg: "input tidak boleh string kosong"
        }
      }
    },
    Class: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "input tidak boleh null"
        },
        notEmpty: {
          msg: "input tidak boleh string kosong"
        }
      }
      },
    kapasitas: {
      type: DataTypes.INTEGER,
      validate: {
        len: [0, 8],
      }
    },
    image: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Kamar',
  });
  return Kamar;
};