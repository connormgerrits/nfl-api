const teamsModel = (connection, Sequelize) => {
    return connection.define('teams', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        location: { type: Sequelize.STRING },
        mascot: { type: Sequelize.STRING },
        abbreviation: { type: Sequelize.STRING },
        conference: { type: Sequelize.STRING },
        division: { type: Sequelize.STRING },
    }, { paranoid: true })
}

module.exports = { teamsModel }