'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.hasMany(models.transaction_detail, {foreignKey: 'transaction_id'});
      transaction.belongsTo(models.users, {foreignKey: 'user_id'});
      transaction.belongsTo(models.status, {foreignKey: 'status_id'});
    }
  }
  transaction.init({
    user_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};