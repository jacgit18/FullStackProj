import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import supertest from "supertest";


import app from "../../src/app";
import { generateJwt } from "../../src/auth/jwtUtil.js";
import { db } from "../../src/data/db.js";
import { addFixtures, flushFixtures, getFixture } from "../fixtures/index.js";

const request = supertest(app);


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
      companyWithAllCorrectProps.company_type = "cm";

      const res = await request
        .post(`/v2/company`)
        // .send(companyWithAllCorrectProps)
        // .set("Authorization", adminUserAuth);

      expect(res.status).toBe(200);

      const selectCompany = await db("company").select("*").where("id", res.body.id);
      expect(res.body.id).toBe(selectCompany[0].id);
      expect(selectCompany.length).toBe(1);

      for (const key of Object.keys(companyWithAllCorrectProps)) {
        expect(res.body[key]).toBe(companyWithAllCorrectProps[key]);
      }
    });

 
    })
  })

