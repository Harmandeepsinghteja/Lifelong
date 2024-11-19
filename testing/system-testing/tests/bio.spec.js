import { test, expect } from "@playwright/test";
const {createUniqueDatabaseConnection, runSqlFile} = require('../utils/run-sql-file')
const base_url = 'http://localhost:5175/';

const db = createUniqueDatabaseConnection();

test.describe('Test bio functionality', () => {
    test.beforeEach(async ({ page }) => {
        runSqlFile(db, '../db_scripts/clean.sql');
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

    //TC_010
    test('Test the functionality of creating a profile', async ({page}) => {
        //login to a user account with no bio
        await page.getByRole('heading', {name: 'Login'}).toBeVisible;
        await page.getByLabel('Username').fill('joe');
        await page.getByLabel('Password').fill('User_123');
        await page.getByRole('button', {name: 'Log in'}).click();
        await expect(page.locator('body')).toContainText('Bio');
        //start fill in info
        await page.getByLabel('How old are you?').fill('20');
        await page.getByLabel('What do you do for living?').fill('Farmer');
        await page.getByLabel('Man', {exact: true}).click();
        await page.getByLabel('Prefer not to say', {exact: true}).click();
        await page.getByLabel('Where do you live now?').click();
        await page.getByText('Australia').click();
        await page.locator('button#homeCountry[role="combobox"] + select').selectOption('Prefer not to say')
        await page.locator('text="Marital status:" + *').locator(`button#option-Single[role="radio"]`).click();
        await page.locator(`button#option-Casual Chat[role="radio"]`).click();
        await page.locator(`button#option-Weekly[role="radio"]`).click();
        await page.getByPlaceholder('Share your interests', {exact: false}).fill('I love fishing');
        page.once('dialog', async (dialog) => {
            await expect(dialog.message()).toContain('success');
            await dialog.accept();
        })
        await page.getByRole('button', {name: 'Submit'}).click();
        await expect(pagge.locator('body')).toContain('We are in');
    })

    //TC_011
    test('Verify showing error messages when not entering all fields.', async ({page}) => {
        //login to a user account with no bio
        await page.getByRole('heading', {name: 'Login'}).toBeVisible;
        await page.getByLabel('Username').fill('joe');
        await page.getByLabel('Password').fill('User_123');
        await page.getByRole('button', {name: 'Log in'}).click();
        await expect(page.locator('body')).toContainText('Bio');
        //start fill in info
        await page.getByLabel('How old are you?').fill('25');
        await page.getByLabel('What do you do for living?').fill('Game Designer');
        await page.getByText('What is your gender?').locator(`button#option-Man[role="radio"]`).click();
        await page.getByText('What is your ethnicity?').locator(`button#option-Prefer not to say[role="radio"]`).click();
        await page.locator('button#Country[role="combobox"] + select').selectOption('Poland')
        // don't fill home country
        // await page.locator('button#homeCountry[role="combobox"] + select').selectOption('Prefer not to say')
        await page.getByText('Marital status:').locator(`button#option-Married[role="radio"]`).click();
        await page.locator(`button#option-Letter[role="radio"]`).click();
        await page.locator(`button#option-Monthly[role="radio"]`).click();
        await page.getByPlaceholder('Share your interests', {exact: false}).fill('I love playing video games and designing.');
        page.once('dialog', async (dialog) => {
            await expect(dialog.message()).toContain('Please fill in all required fields');
            await dialog.accept();
        })
        await page.getByRole('button', {name: 'Submit'}).click();
    })


})