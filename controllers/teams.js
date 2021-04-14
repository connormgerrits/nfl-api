const models = require('../models')

let getTeams = async (request, response) => {
    const teams = await models.Teams.findAll()
    return response.send(teams)
}

let getTeamById = async (request, response) => {
    const { id } = request.params

    const team = await models.Teams.findOne({ where: { id: parseInt(id) } })

    return team
        ? response.send(team)
        : response.send("No team with that id exists.")
}

let saveNewTeam = async (request, response) => {
    let { id, location, mascot, abbreviation, conference, division } = request.body

    if (!location || !mascot || !abbreviation || !conference || !division) {
        return response.status(400).send('The data object you entered is invalid and may be missing data for some elements.')
    }

    const newTeam = await models.Teams.create({ id, location, mascot, abbreviation, conference, division })

    return response.status(201).send(newTeam)
}

module.exports = { getTeams, getTeamById, saveNewTeam }