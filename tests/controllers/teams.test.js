const chai = require('chai')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { before, beforeEach, afterEach, after, describe, it } = require('mocha')
const { teamsList, singleTeam, newTeam, errTeam } = require('../mocks/teams')
const { getTeams, getTeamById, saveNewTeam } = require('../../controllers/teams')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - Teams', () => {
    let sandbox;
    let stubbedFindAll;
    let stubbedFindOne;
    let stubbedCreate;
    let stubbedSend;
    let stubbedStatus;
    let stubbedStatusDotSend;
    let response;
    
    before(() => {
        sandbox = createSandbox()

        stubbedFindAll = sandbox.stub(models.Teams, 'findAll')
        stubbedFindOne = sandbox.stub(models.Teams, 'findOne')
        stubbedCreate = sandbox.stub(models.Teams, 'create')

        stubbedSend = sandbox.stub()
        stubbedStatus = sandbox.stub()
        stubbedStatusDotSend = sandbox.stub()

        response = { send: stubbedSend, status: stubbedStatus }
    })

    beforeEach(() => {
        stubbedStatus.returns({ send: stubbedStatusDotSend }) // this has to go here else the return will be wiped after each test case runs
    })

    afterEach(() => {
        sandbox.reset() // wipes out the returns of stubs such as stubbedFindAll and resets it after each individual test is run
    })

    after(() => {
        sandbox.restore() // wipes out all of the actual stubs wrapped around the functions after all tests have been run
    })

    describe('getTeams', () => {
        it('Retrieve a list of all teams from the database and send it with response.send()', async () => {
            stubbedFindAll.returns(teamsList)

            await getTeams({}, response)

            expect(stubbedFindAll).to.have.callCount(1)
            expect(stubbedSend).to.have.been.calledWith(teamsList)
        })

        it('Responds with a 500 when an exception is thrown trying to retrieve all teams data from the database', async () => {
            stubbedFindAll.throws('ERROR!')

            await getTeams({}, response)

            expect(stubbedFindAll).to.have.callCount(1)
            expect(stubbedStatus).to.have.been.calledWith(500)
            expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve teams, please try again.')
        })
    })

    describe('getTeamById', () => {
        it('Retrieve a particular team from the database based on its id and send it with response.send()', async () => {
            const request = { params: { id: 33 } }
            stubbedFindOne.returns(singleTeam)

            await getTeamById(request, response)

            expect(stubbedFindOne).to.have.been.calledWith({ where: { id: 33 } })
            expect(stubbedSend).to.have.been.calledWith(singleTeam)
        })

        it('Responds with a 404 when no team is returned from the database', async () => {
            const request = { params: { id: 100 } }
            stubbedFindOne.returns(undefined)

            await getTeamById(request, response)

            expect(stubbedFindOne).to.have.been.calledWith({ where: { id: 100 } })
            expect(stubbedStatus).to.have.been.calledWith(404)
            expect(stubbedStatusDotSend).to.have.been.calledWith("No team with that id exists.")
        })

        it('Responds with a 500 when an exception is thrown trying to retrieve data from the database', async () => {
            const request = { params: { id: -100 } }
            stubbedFindOne.throws('ERROR!')

            await getTeamById(request, response)

            expect(stubbedFindOne).to.have.been.calledWith({ where: { id: -100 } })
            expect(stubbedStatus).to.have.been.calledWith(500)
            expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve team, please try again.')
        })
    })

    describe('saveNewTeam', () => {
        it('Stores a new team in the database and then returns a successful saved record status of 201', async () => {
            const request = { body: newTeam }
            stubbedCreate.returns(newTeam)
            
            await saveNewTeam(request, response)

            expect(stubbedCreate).to.have.been.calledWith(newTeam)
            expect(stubbedStatus).to.have.been.calledWith(201)
            expect(stubbedStatusDotSend).to.have.been.calledWith(newTeam)
        })

        it('Responds with a 400 error message when either incorrect or a lack of data is provided for the new team being created.', async () => {
            const request = { body: errTeam }
            //stubbedCreate.returns(errTeam) // this line won't be reached
            
            await saveNewTeam(request, response)

            expect(stubbedCreate).to.have.callCount(0)
            expect(stubbedStatus).to.have.been.calledWith(400)
            expect(stubbedStatusDotSend).to.have.been.calledWith('The data object you entered is invalid and may be missing data for some elements.')
        })

        it('Responds with a 500 when an exception is thrown trying to create a new team and add it to the database', async () => {
            const request = { body: newTeam }
            stubbedCreate.throws('ERROR!')

            await saveNewTeam(request, response)

            expect(stubbedCreate).to.have.been.calledWith(newTeam)
            expect(stubbedStatus).to.have.been.calledWith(500)
            expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to assimilate new team data, please try again.')
        })
    })
})