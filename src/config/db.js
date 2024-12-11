const { Sequelize } = require("sequelize");

// Load environment variables
require("dotenv").config();

// Create a Sequelize instance
const sequelize = new Sequelize("speaker_booking", "root", "admin", {
  host: "localhost",
  port: 3307, // MySQL port
  dialect: "mysql",
});

module.exports = sequelize;
