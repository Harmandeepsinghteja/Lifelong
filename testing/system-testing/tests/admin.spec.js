import { test, expect } from "@playwright/test";
import { createUniqueDatabaseConnection, runSqlFile } from "../utils/run-sql-file";
require('dotenv').config();
const base_url = process.env.TEST_ADMIN_URL;
const db = createUniqueDatabaseConnection();
test.describe("Test Case Group: Admin", ()=>{
  test.beforeAll(()=>{
    runSqlFile(db, "../db_scripts/clean.sql");
  })

  //TC_012
test('Test if admin can log in.', async ({ page }) => {
  await page.goto(base_url);
  await page.getByPlaceholder('Enter Admin username').click();
  await page.getByPlaceholder('Enter Admin username').fill('admin');
  await page.getByPlaceholder('Enter your password').click();
  await page.getByPlaceholder('Enter your password').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
});


//TC_013
test('Test showing error messages when entering wrong credentials', async ({ page }) => {
  await page.goto(base_url);
  await page.getByPlaceholder('Enter Admin username').click();
  await page.getByPlaceholder('Enter Admin username').fill('admin');
  await page.getByPlaceholder('Enter your password').click();
  await page.getByPlaceholder('Enter your password').fill('wrongpassword');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('heading')).toContainText('Login');
});

//TC_014
test('Test if admin can log out', async ({ page }) => {
  await page.goto(base_url);
  await page.getByPlaceholder('Enter Admin username').click();
  await page.getByPlaceholder('Enter Admin username').fill('admin');
  await page.getByPlaceholder('Enter your password').click();
  await page.getByPlaceholder('Enter your password').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
  await expect(page.getByRole('heading')).toContainText('Login');
});
})

