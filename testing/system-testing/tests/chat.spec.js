import { test, expect } from "@playwright/test";
import { createUniqueDatabaseConnection, runSqlFile } from "../utils/run-sql-file";
require('dotenv').config();
const base_url = process.env.TEST_URL;
const db = createUniqueDatabaseConnection();
test.describe("Test Case Group: Chat", ()=>{
  test.beforeAll(()=>{
    runSqlFile(db, "../db_scripts/clean.sql");
  })

//TC_015
test('Test if users can send messages', async ({ page }) => {
    await page.goto(base_url);
    await page.getByPlaceholder('Enter your username').click();
    await page.getByPlaceholder('Enter your username').fill('charlie');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('User_123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('Type a message...').click();
    await page.getByPlaceholder('Type a message...').fill('Hello\n');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('#root')).toContainText('Hello');
  });

//TC_016
test('Test if user can unmatch', async ({ page }) => {
    await page.goto(base_url);
    await page.getByPlaceholder('Enter your username').click();
    await page.getByPlaceholder('Enter your username').fill('charlie');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('User_123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('button', { name: 'C' }).click();
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.getByText('Unmatch').click();
    await expect(page.locator('#root')).toContainText('We are in');
  });
})