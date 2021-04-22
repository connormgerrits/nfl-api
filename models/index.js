const Sequelize = require('sequelize')
const { teamsModel } = require('./teams')

const connection = new Sequelize('nfl', 'nfl', 'nFLt3Am5', {
    host: 'localhost', dialect: 'mysql', port: 3306,
})

const Teams = teamsModel(connection, Sequelize)

module.exports = { Teams }

// ***THIS IS THE CONFIGURATION FILE***
// This file will/would import all models and create/export an object for them which 
// is passed the established database connection as well as the sequelize library
// (the latter parameter is included so we don't have to import the sequelize library in every model's file).