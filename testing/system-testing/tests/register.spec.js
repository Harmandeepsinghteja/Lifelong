import { test, expect } from "@playwright/test";
const {createUniqueDatabaseConnection, runSqlFile} = require('../utils/run-sql-file')
const base_url = 'http://localhost:5175/';

const db = createUniqueDatabaseConnection();

test.describe('Test register functionality', () => {
  test.beforeEach(async ({ page }) => {
    //clean database
    runSqlFile(db, '../db_scripts/clean.sql')
    await page.goto(base_url + 'signup')
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

  // TC_001
  test('Test the functionality of signing up', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Sign Up');
    await page.getByPlaceholder('Choose a username').fill('TestUser');
    await page.getByPlaceholder('Create a password').fill('TU_123');
    await page.getByPlaceholder('Confirm password').fill('TU_123');
    await page.getByLabel('I consent:').check();
    page.once('dialog', async (dialog) => {
      await expect(dialog.message()).toContain('success');
      await dialog.accept();
    })
    await page.getByRole('button', {name: 'Sign Up'}).click();
    await page.waitForURL('**/bio')
    await expect(page.url()).toBe(base_url+"bio");
    await expect(page.locator('body')).toContainText('Your Bio', {ignoreCase: true});
  });

  //TC_002
  test('Verify showing error messages when entering invalid password', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Sign Up');
    await page.getByPlaceholder('Username').fill('TestUser');
    await page.getByPlaceholder('Create a password').fill('invalidpassword');
    await page.getByPlaceholder('Confirm password').fill('invalidpassword');
    await page.getByLabel('I consent:').check();
    page.once('dialog', async (dialog) => {
      await expect(dialog.message()).toBe('Password requirements are not met. Please enter passwords again to meet requirements.');
      await dialog.accept();
    });
    await page.getByRole('button', {name: 'Sign Up'}).click();
  });

  // TC_003
  test('Verify showing error messages when username already exists', async ({ page }) => {
    await page.goto(base_url+'signup')
    await page.getByPlaceholder('Username').fill('charlie');
    await page.getByPlaceholder('Create a password').fill('User_123');
    await page.getByPlaceholder('Confirm password').fill('User_123');
    await page.getByLabel('I consent:').check();
    // expect username already exists
    page.once('dialog', async (dialog) => {
      await expect(dialog.message()).toBe('Username already exists');
      await dialog.accept();
    });
    await page.getByRole('button', {name: 'Sign Up'}).click();
  });
});