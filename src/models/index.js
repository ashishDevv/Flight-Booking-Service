
const { Sequelize } = require('sequelize')


const sequelize = new Sequelize('airline_db', 'root', 'YOUR_PASSWORD', {
    host: 'localhost',
    dialect: 'mysql'
  });

  
module.exports = sequelize;


  