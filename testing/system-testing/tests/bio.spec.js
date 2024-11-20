import { test, expect } from "@playwright/test";
import { createUniqueDatabaseConnection, runSqlFile } from "../utils/run-sql-file";
require('dotenv').config();
const base_url = process.env.TEST_URL;
const db = createUniqueDatabaseConnection();
test.describe("Test Case Group: Bio", ()=>{
  test.beforeAll(()=>{
    runSqlFile(db, "../db_scripts/clean.sql");
  })

//TC_010
test('Test the functionality of creating a profile', async ({page}) => {
    await page.goto(base_url);
    await page.getByRole('link', { name: 'Sign Up Here' }).click();
    await page.getByPlaceholder('Choose a username').click();
    await page.getByPlaceholder('Choose a username').fill('TestUser10');
    await page.getByPlaceholder('Create a password').click();
    await page.getByPlaceholder('Create a password').fill('TU_123');
    await page.getByPlaceholder('Confirm password').click();
    await page.getByPlaceholder('Confirm password').fill('TU_123');
    await page.locator('form div').filter({ hasText: 'I consent:' }).click();
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await page.getByLabel('How old are you?').click();
    await page.getByLabel('How old are you?').fill('20');
    await page.getByLabel('What do you do for living?').click();
    await page.getByLabel('What do you do for living?').fill('Farmer');
    await page.getByLabel('Man', { exact: true }).click();
    await page.getByLabel('Asian').click();
    await page.getByLabel('Where do you live now?').click();
    await page.getByLabel('Australia').click();
    await page.getByLabel('Where was your home country?').click();
    await page.getByLabel('Argentina').getByText('Argentina').click();
    await page.locator('div').filter({ hasText: /^Single$/ }).click();
    await page.getByLabel('Casual Chat').click();
    await page.getByLabel('Weekly').click();
    await page.getByPlaceholder('Share your interests, hobbies').click();
    await page.getByPlaceholder('Share your interests, hobbies').fill('I love fishing.');
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#root')).toContainText('We are in');
})

//TC_011
test('test showing error messages when not entering all fields.', async ({page}) => {
    await page.goto(base_url);
    await page.getByRole('link', { name: 'Sign Up Here' }).click();
    await page.getByPlaceholder('Choose a username').click();
    await page.getByPlaceholder('Choose a username').fill('TestUser11');
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
    await page.getByLabel('How old are you?').click();
    await page.getByLabel('How old are you?').fill('20');
    await page.getByLabel('What do you do for living?').click();
    await page.getByLabel('What do you do for living?').fill('Farmer');
    await page.getByLabel('Man', { exact: true }).click();
    await page.getByLabel('Asian').click();
    await page.getByLabel('Where do you live now?').click();
    await page.getByLabel('Australia').click();
    await page.getByLabel('Single').click();
    await page.getByLabel('Casual Chat').click();
    await page.getByLabel('Weekly').click();
    await page.getByPlaceholder('Share your interests, hobbies').click();
    await page.getByPlaceholder('Share your interests, hobbies').fill('I love fishing.');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('alert')).toContainText('Please fill in all required fields.');
});
})