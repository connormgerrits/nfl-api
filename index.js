const express = require('express')
const bodyParser = require('body-parser')
const { getTeams, getTeamById, saveNewTeam } = require('./controllers/teams')

const app = express()

app.get('/teams', getTeams)

app.get('/teams/:id', getTeamById)

// app.use('body-parser')

app.post('/teams', bodyParser.json(), saveNewTeam)

app.all('*', (request, response) => {
    return response.status(404).send("There ain't nothin here!")
})

app.listen(1337, () => {
    console.log("Listening on port 1337...")
})