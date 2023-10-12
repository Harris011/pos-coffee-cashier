'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction_detail.belongsTo(models.transaction, {foreignKey: 'transaction_id'});
      transaction_detail.belongsTo(models.product, {foreignKey: 'product_id'});
    }
  }
  transaction_detail.init({
    total_quantity: DataTypes.INTEGER,
    price_on_date: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    transaction_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'transaction_detail',
  });
  return transaction_detail;
};