import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import supertest from "supertest";


import app from "../../src/app";
import { generateJwt } from "../../src/auth/jwtUtil.js";
import { db } from "../../src/data/db.js";
import { authHeaderProperty } from "../../src/middlewares/authenticateToken.js";
import { companyHeaderProperty } from "../../src/middlewares/companyIdFromHeaders.js";
import { Material } from "../../src/model/index.js";
import { addFixtures, flushFixtures, getFixture } from "../fixtures/index.js";

const request = supertest(app);



describe("materialController", () => {
  let adminUserAuth: string
  let company_id: string

  beforeEach(async () => {
    await addFixtures()
    // setup admin authentication
    const userInfo: any = getFixture("tfuser", "email", "superadmin@email.com")
    adminUserAuth = `Auth ${generateJwt(userInfo)}`
    // get company_id
    const company = getFixture("company", "name", "getProjectCompany")
    company_id = company.id
  })

  afterEach(async () => {
    await flushFixtures()
  })

  describe('POST material', () => {
    // Test data for a material with all correct properties
    const materialWithAllCorrectPropsOne: any = {
      notes: 'Material created with unit test.',
      name: 'Mock Material 1',
      unit: 'kg',
      rate: 5.0,
    };

    // Test case for a correctly formed request
    it('correctly formed request should succeed', async () => {
      // First material created for the test
      const company: any = getFixture('company', 'name', 'postMaterialCompany');
      company_id = company.id;

      // Make a POST request to create a material
      const res = await request
        .post(`/v2/material/`)
        .send(materialWithAllCorrectPropsOne)
        // .set(authHeaderProperty, adminUserAuth)
        .set(companyHeaderProperty, company_id);

      // Expect a successful response
      expect(res.status).toBe(200);

      // Check that the material was created in the database
      const materialCompanyConnection = await db('material_type')
        .select('*')
        .where('company_id', company_id);

      expect(materialCompanyConnection).toHaveLength(1);
      expect(materialCompanyConnection[0].company_id).toBe(company_id);
    });

    // Nested test suite for error cases
    describe('should error if', () => {
      // Nested test suite for missing necessary fields
      describe('it is missing necessary field:', () => {
        // Test case for each necessary field
        for (const necessaryFieldDefinition of Material.fieldDefinitions.filter(
          (fs: any) => fs.requiredForCreateRequest
        )) {
          it(`${necessaryFieldDefinition.name}`, async () => {
            // Create a test object with the necessary field set to undefined
            const testObj: any = { ...materialWithAllCorrectPropsOne };
            testObj[necessaryFieldDefinition.name] = undefined;

            // Make a POST request with the test object
            const res = await request
              .post(`/v2/material/`)
              .send(testObj)
              .set(authHeaderProperty, adminUserAuth)
              .set(companyHeaderProperty, company_id);

            // Expect a 400 Bad Request response indicating data validation failure
            expect(res.status).toBe(400);
            expect(res.text).toContain('Data validation failed');
          });
        }
      });
    });


  })


})
