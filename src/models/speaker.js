const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Speaker = sequelize.define("Speaker", {
  expertise: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pricePerSession: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

Speaker.belongsTo(User, { foreignKey: 'userId' });

module.exports = Speaker;