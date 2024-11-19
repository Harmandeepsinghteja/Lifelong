import { test, expect } from "@playwright/test";
require('dotenv').config();
const base_url = process.env.TEST_URL;

// TC_001
test('test the functionality of signing up', async ({ page }) => {
  await page.goto(base_url+'/signup');
  await page.getByPlaceholder('Choose a username').click();
  await page.getByPlaceholder('Choose a username').fill('TestUser1');
  await page.getByPlaceholder('Create a password').click();
  await page.getByPlaceholder('Create a password').fill('TU_123');
  await page.getByPlaceholder('Confirm password').click();
  await page.getByPlaceholder('Confirm password').fill('TU_123');
  await page.getByLabel('I consent:').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.getByRole('heading')).toContainText('Your Bio');
});

//TC_002
test('test showing error messages when entering invalid password', async ({ page }) => {
  await page.goto(base_url+'/signup');
  await page.getByPlaceholder('Choose a username').click();
  await page.getByPlaceholder('Choose a username').fill('TestUser2');
  await page.getByPlaceholder('Create a password').click();
  await page.getByPlaceholder('Create a password').fill('invalidpasword');
  await page.getByPlaceholder('Confirm password').click();
  await page.getByPlaceholder('Confirm password').fill('invalidpassword');
  await page.getByPlaceholder('Create a password').click();
  await page.getByPlaceholder('Confirm password').click();
  await page.getByLabel('I consent:').check();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.getByRole('heading')).toContainText('Sign Up');
});

// TC_003
test('Verify showing error messages when username already exists', async ({ page }) => {
  await page.goto(base_url+'/signup');
  await page.getByPlaceholder('Choose a username').click();
  await page.getByPlaceholder('Choose a username').fill('TestUser3');
  await page.getByPlaceholder('Create a password').click();
  await page.getByPlaceholder('Create a password').fill('TU_123');
  await page.getByPlaceholder('Confirm password').click();
  await page.getByPlaceholder('Confirm password').fill('TU_123');
  await page.getByLabel('I consent:').check();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await page.getByRole('button', { name: 'T', exact: true }).click();
  await page.getByText('Log out').click();
  await page.getByRole('link', { name: 'Sign Up Here' }).click();
  await page.getByPlaceholder('Choose a username').click();
  await page.getByPlaceholder('Choose a username').fill('TestUser3');
  await page.getByPlaceholder('Create a password').click();
  await page.getByPlaceholder('Create a password').fill('TU_123');
  await page.getByPlaceholder('Confirm password').click();
  await page.getByPlaceholder('Confirm password').fill('TU_123');
  await page.getByLabel('I consent:').check();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await expect(page.getByRole('heading')).toContainText('Sign Up');
});