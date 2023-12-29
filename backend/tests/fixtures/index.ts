// Docs can be found at: http://city41.github.io/node-sql-fixtures/
// @ts-ignore
import sqlFixtures from 'sql-fixtures'

import { db } from "../../src/data/db.js"
import clientFixtures from "./client.js"
import companyFixtures from "./company.js"
import companyUserFixtures from "./company_user.js"
import fileFixtures from "./file.js"
import projectCompanyFixtures from "./project_company.js"
import projectUserFixtures from "./project_user.js"
import tfAdminFixtures from "./tf_admin.js"
import userFixtures from "./user.js"
import { FixtureTable } from "./util/index.js"

// ** MUST BE ADDED IN ORDER OF FOREIGN KEY DEPENDENCIES
const fixtureTablesOrderedByDependency: FixtureTable[] = [
  userFixtures,
  tfAdminFixtures,
  companyFixtures,
  companyUserFixtures,
  clientFixtures,
  projectCompanyFixtures,
  projectUserFixtures,
  fileFixtures,
]

// Allows us easy access to fixtures
let Fixtures: any = {}
export function getFixture(table: string, field?: string, value?: any): any {
  // some flexibility here, can get the entire table or just one row
  const item = field === undefined
    ? Fixtures[table]
    : Fixtures[table]?.find((row: any) => row[field] === value)
  if (item === undefined) throw new Error('cant find this fixture, please double check inputs')
  return item
}

const SqlFixturesDataSpec: any[] = fixtureTablesOrderedByDependency.map(
  (ft) => {
    const dataSpec: {[key: string]: any[]} = {}
    dataSpec[ft.tableName] = Object.keys(ft.data).map((key: string) => ft.data[key])
    return dataSpec
  }
)

export async function addFixtures(): Promise<void> {
  // TODO: add a check to make sure we don't add the same fixture twice
  // TODO check if there are existing fixtures -- if so, run flush fixtures first
  // need to reset our Fixtures accessor first
  Fixtures = {}
  const fixtureFactory = new sqlFixtures(db)
  for (let dataSpec of SqlFixturesDataSpec) {
    await fixtureFactory.create(dataSpec).then(
      (sqlData: any) => {
        // add new sql data to object
        for (let tableName of Object.keys(sqlData)) {
          Fixtures[tableName] = sqlData[tableName]
        }
      }, // don't need to know if its successful
      (e: any) => {
        console.log('THERE WAS AN ERROR WITH SQL FIXTURES')
        console.log(Object.keys(dataSpec))
        console.log(e)
      }
    )
  }
}

export async function flushFixtures(): Promise<void> {
  // have to flush in reverse order of dependencies
  for (let fixtureTable of fixtureTablesOrderedByDependency.slice().reverse()) {
    // only flush if we should
    if (fixtureTable.alwaysFlush) {
      await db(fixtureTable.tableName).delete()
    }
  }
}
