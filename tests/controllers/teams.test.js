const { describe, it } = require('mocha')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { getTeams, getTeamById, saveNewTeam } = require('../../controllers/teams')
const models = require('../../models')

chai.use(sinonChai)
const { expect } = chai

