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

module.exports = { getTeams, getTeamById }