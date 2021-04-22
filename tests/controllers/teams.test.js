const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { describe, it } = require('mocha')
const { teamsList, singleTeam, newTeam } = require('../mocks/teams')
const { getTeams, getTeamById, saveNewTeam } = require('../../controllers/teams')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - Teams', () => {
    describe('getTeams', () => {
        it('retrieve a list of all teams from the database and send it with response.send()', async () => {
            const stubbedFindAll = sinon.stub(models.Teams, 'findAll').returns(teamsList)
            const stubbedSend = sinon.stub()
            const response = { send: stubbedSend }

            await getTeams({}, response)

            expect(stubbedFindAll).to.have.callCount(1)
            expect(stubbedSend).to.have.been.calledWith(teamsList)
        })
    })

    describe('getTeamById', () => {
        it('Retrieve a particular team from the database based on its id and send it with response.send()', async () => {
            const request = { params: { id: 33 } }
            const stubbedFindOne = sinon.stub(models.Teams, 'findOne').returns(singleTeam)
            const stubbedSend = sinon.stub()
            const response = { send: stubbedSend }

            await getTeamById(request, response)

            expect(stubbedFindOne).to.have.been.calledWith({ where: { id: 33 } })
            expect(stubbedSend).to.have.been.calledWith(singleTeam)
        })
    })

    describe('saveNewTeam', () => {
        it('Stores a new team in the database and then returns a successful saved record status of 201', async () => {
            const request = { body: newTeam }
            const stubbedSend = sinon.stub()
            const stubbedStatus = sinon.stub().returns({ send: stubbedSend }) // I get how this works but is the need to 'return' something here semantically correct/necessary? Wouldn't it be simpler if status and response were able to both just exist as properties of the response object?
            const response = { status: stubbedStatus }
            const stubbedCreate = sinon.stub(models.Teams, 'create').returns(newTeam)
            
            await saveNewTeam(request, response)

            expect(stubbedCreate).to.have.been.calledWith(newTeam)
            expect(stubbedStatus).to.have.been.calledWith(201)
            expect(stubbedSend).to.have.been.calledWith(newTeam)
        })
    })
})