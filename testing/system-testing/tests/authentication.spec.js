import { test, expect } from "@playwright/test";
const {createUniqueDatabaseConnection, runSqlFile} = require('../utils/run-sql-file')
const base_url = 'http://localhost:5173/';

const db = createUniqueDatabaseConnection();

test.describe('Authentication', () => {
    test.beforeEach(async ({ page }) => {
        await runSqlFile(db, '../db_scripts/clean.sql');
        await page.goto(base_url)
    });

    test.afterAll(() => {
        // Close the db
        db.end((endErr) => {
            if (endErr) {
                console.error('Error closing db:', endErr);
            } else {
                console.log('db closed.');
            }
        });
    })

    //TC_004
    test('Test the functionality of logging in an existing account', async ({ page }) => {
        // prepare data
        await runSqlFile(db, '../db_scripts/matched-users.sql');
        // then go to log in page and try to log in
        await page.getByRole('heading', {name: 'Login'}).toBeVisible;
        await page.getByLabel('Username').fill('TestUser');
        await page.getByLabel('Password').fill('TU_123');
        await page.getByRole('button', {name: 'Log in'}).click();
        await expect(page.locator('body')).toContainText('TestMatchedUser');
    })
})