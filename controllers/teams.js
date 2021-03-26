const teams = require('../teams')

let getTeams = (request, response) => {
    return response.send(teams)
}

let getTeamById = (request, response) => {
    const { id } = request.params

    const team = teams.find((team) => team.id === parseInt(id))

    return team
        ? response.send(team)
        : response.send("No team with that id exists.")
}

let saveNewTeam = (request, response) => {
    let { id, location, mascot, abbreviation, conference, division } = request.body

    if (!location || !mascot || !abbreviation || !conference || !division) {
        return response.status(400).send('The data object you entered is invalid and may be missing data for some elements.')
    }

    else if (!id && location && mascot && abbreviation && conference && division) {
        id = parseInt(teams[teams.length-1].id) + 1
    }

    const newTeam = { id, location, mascot, abbreviation, conference, division }
    teams.push(newTeam)

    return response.status(201).send(newTeam)
}

module.exports = { getTeams, getTeamById, saveNewTeam }