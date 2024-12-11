const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const Speaker = require("./speaker");

const Session = sequelize.define("Session", {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  timeSlot: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('booked', 'completed', 'cancelled', 'blocked'),
    allowNull: false,
    defaultValue: 'booked', // default status for booked sessions
  }
});

// Associate Session with User and Speaker
Session.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Session.belongsTo(Speaker, { foreignKey: "speakerId", onDelete: "CASCADE" });

module.exports = Session;