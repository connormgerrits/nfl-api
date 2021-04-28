const models = require('../models')

let getTeams = async (request, response) => {
    try {
        const teams = await models.Teams.findAll()
        return response.send(teams)
    } catch (error) {
        return response.status(500).send('Unable to retrieve teams, please try again.')
    }
}

let getTeamById = async (request, response) => {
    try {
        const { id } = request.params

        const team = await models.Teams.findOne({ where: { id: parseInt(id) } })

        return team
            ? response.send(team)
            : response.status(404).send("No team with that id exists.")
    } catch (error) {
        return response.status(500).send('Unable to retrieve team, please try again.')
    }
}

let saveNewTeam = async (request, response) => {
    try {
        let { location, mascot, abbreviation, conference, division } = request.body

        if (!location || !mascot || !abbreviation || !conference || !division) {
            return response.status(400).send('The data object you entered is invalid and may be missing data for some elements.')
        }

        const newTeam = await models.Teams.create({ location, mascot, abbreviation, conference, division })
        return response.status(201).send(newTeam)
    } catch (error) {
        return response.status(500).send('Unable to assimilate new team data, please try again.')
    }
}

module.exports = { getTeams, getTeamById, saveNewTeam }