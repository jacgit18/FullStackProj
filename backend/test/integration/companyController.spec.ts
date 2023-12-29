import chai from "chai"
import chaiHttp from "chai-http"
import "mocha"
import { v4 as createUuid } from "uuid"
import {beforeEach} from "mocha"

import app from "../../src/app.js"
import {addFixtures, getFixture, flushFixtures} from "../fixtures/index.js"
import {db} from "../../src/data/db.js"
import {generateJwt} from "../../src/auth/jwtUtil.js"
import {authHeaderProperty} from "../../src/middlewares/authenticateToken.js"
import { Company } from "../../src/model/index.js"

chai.use(chaiHttp)
const expect = chai.expect

describe("companyController", () => {

  let adminUserAuth: string

  beforeEach(async () => {
    await addFixtures()
    // setup admin authentication
    const userInfo: any = getFixture('tfuser', 'email', 'superadmin@email.com')
    adminUserAuth = `Auth ${generateJwt(userInfo)}`
  })

  afterEach(async () => {
    await flushFixtures()
  })


  describe('POST create company', () => {
    const companyWithAllCorrectProps: any = {
      name: "Construction Company",
    }
    it("Successfully create a GC", async () => {
      companyWithAllCorrectProps.company_type = "cm"

      return chai.request(app)
        .post(`/v2/company`)
        .send(companyWithAllCorrectProps)
        .set(authHeaderProperty, adminUserAuth)
        .then(async (res) => {
          expect(res.status).to.equal(200)
          const selectCompany = await db('company').select('*').where('id', res.body.id)
          expect(res.body.id).to.equal(selectCompany[0].id)
          expect(selectCompany.length).to.equal(1)
          // double check that all of these properties and the generated id were returned
         for (let key of Object.keys(companyWithAllCorrectProps)) {
           expect(res.body[key], `${key} was not updated correctly`).to.equal(companyWithAllCorrectProps[key])
          }
        })
    })
    it("Successfully create a Sub", async () => {
      companyWithAllCorrectProps.company_type = "trade"

      return chai.request(app)
        .post(`/v2/company`)
        .send(companyWithAllCorrectProps)
        .set(authHeaderProperty, adminUserAuth)
        .then(async (res) => {
          expect(res.status).to.equal(200)

          const selectCompany = await db('company').select('*').where('id', res.body.id)
          expect(res.body.id).to.equal(selectCompany[0].id)
          expect(selectCompany.length).to.equal(1)

         // double check that all of these properties and the generated id were returned
         for (let key of Object.keys(companyWithAllCorrectProps)) {
          expect(res.body[key], `${key} was not updated correctly`).to.equal(companyWithAllCorrectProps[key])
          }
        })
    })

    describe('should error if', () => {
      describe('it is missing necessary field:', () => {
        for (let necessaryFieldDefinition of Company.fieldDefinitions.filter((fs) => fs.requiredForCreateRequest)) {
          it(`${necessaryFieldDefinition.name}`, () => {
            const testObj: any = {...companyWithAllCorrectProps}
            testObj[necessaryFieldDefinition.name] = undefined
            return chai.request(app).post(`/v2/company`)
              .send(testObj)
              .set(authHeaderProperty, adminUserAuth)
              .then(res => {
                expect(res.status).to.equal(400)
                expect(res.text).to.include('Data validation failed')
              })
          })
        }
      })
    })
    it("Attempt to Create Company when you're not a superadmin", () => {
      const userInfo: any = getFixture('tfuser', 'email', 'imjustnormalandconnected@email.com')
      const connectedNonAdminUserAuth = `Auth ${generateJwt(userInfo)}`

      return chai.request(app)
        .post(`/v2/company`)
        .send(companyWithAllCorrectProps)
        .set(authHeaderProperty, connectedNonAdminUserAuth)
        .then(res => {
          expect(res.status).to.equal(401)
        })
    })
    it('Attempt to create a company with an invalid type', async () => {
      companyWithAllCorrectProps.created_by = getFixture('tfuser', 'email', 'superadmin@email.com').id
      companyWithAllCorrectProps.company_type = "TrAdE"

      return chai.request(app)
        .post(`/v2/company`)
        .send(companyWithAllCorrectProps)
        .set(authHeaderProperty, adminUserAuth)
        .then(async (res) => {
          expect(res.status).to.equal(400)
        })
    })

  })


})
