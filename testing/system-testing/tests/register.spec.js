import { test, expect } from "@playwright/test";
const {runSqlFile} = require('../utils/run-sql-file')
const base_url = 'http://localhost:5175/';

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    //clean database
    runSqlFile('../db_scripts/lifelong_db.sql')
    await page.goto(base_url + 'signup/')
  });

  test('Test the functionality of signing up', async ({ page }) => {
    await expect(page.getByPlaceholder('Choose a username')).toBeVisible();
    await page.getByPlaceholder('Username').fill('TC_001_username');
    await page.getByPlaceholder('Create a password').fill('TC_001_password');
    await page.getByPlaceholder('Confirm password').fill('TC_001_password');
    await page.getByLabel('I consent:').check();
    page.on('dialog', async (dialog) => {
      await expect(dialog.message()).toBe('Sign up success!');
      await dialog.accept();
    })
    await page.getByRole('button', {name: 'Sign Up'}).click();
    await page.waitForURL('**/bio')
    await expect(page.url()).toBe(base_url+"bio");
    await expect(page.getByRole('heading', {name :'Your Bio'})).toBeVisible();
  });

  test('Verify showing error messages when entering invalid password', async ({ page }) => {
    await expect(page.getByPlaceholder('Choose a username')).toBeVisible();
    await page.getByPlaceholder('Username').fill('TC_001_username');
    await page.getByPlaceholder('Create a password').fill('invalidpassword');
    await page.getByPlaceholder('Confirm password').fill('invalidpassword');
    await page.getByLabel('I consent:').check();
    page.on('dialog', async (dialog) => {
      await expect(dialog.message()).toBe('Password requirements are not met. Please enter passwords again to meet requirements.');
      await dialog.accept();
    })
    await page.getByRole('button', {name: 'Sign Up'}).click();
  });


});