import { test, expect } from "@playwright/test";
const {createUniqueDatabaseConnection, runSqlFile} = require('../utils/run-sql-file')
const base_url = 'http://localhost:5175/';

const db = createUniqueDatabaseConnection();

test.describe('Test authentication', () => {
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

    //TC_004
    test('Test the functionality of logging in an existing account when user has bio and matched penpal', async ({ page }) => {
        await page.getByRole('heading', {name: 'Login'}).toBeVisible;
        await page.getByLabel('Username').fill('charlie');
        await page.getByLabel('Password').fill('User_123');
        await page.getByRole('button', {name: 'Log in'}).click();
        await expect(page.locator('body')).toContainText('snoopy');
    })

    //TC_005
    test('Test the functionality of logging in an existing account when user has bio and no matched penpal', async ({ page }) => {
        await page.getByRole('heading', {name: 'Login'}).toBeVisible;
        await page.getByLabel('Username').fill('frank');
        await page.getByLabel('Password').fill('User_123');
        await page.getByRole('button', {name: 'Log in'}).click();
        await expect(page.locator('body')).toContainText('We are in');
    })

    //TC_006
    test('Test the functionality of logging in an existing account when user has no bio and no matched penpal', async ({ page }) => {
        await page.getByRole('heading', {name: 'Login'}).toBeVisible;
        await page.getByLabel('Username').fill('joe');
        await page.getByLabel('Password').fill('User_123');
        await page.getByRole('button', {name: 'Log in'}).click();
        await expect(page.locator('body')).toContainText('Bio');
    })

    //TC_007
    test('Verifying showing error messages when entering wrong password', async ({ page }) => {
        await page.getByRole('heading', {name: 'Login'}).toBeVisible;
        await page.getByLabel('Username').fill('charlie');
        await page.getByLabel('Password').fill('wrongpassword');
        page.once('dialog', async (dialog) => {
            await expect(dialog.message()).toContain('Invalid password');
            await dialog.accept()
        })
        await page.getByRole('button', {name: 'Log in'}).click();
    })

    //TC_008
    test('Verifying showing error messages when entering wrong username', async ({ page }) => {
        await page.getByRole('heading', {name: 'Login'}).toBeVisible;
        await page.getByLabel('Username').fill('wronguser');
        await page.getByLabel('Password').fill('User_123');
        page.once('dialog', async (dialog) => {
            await expect(dialog.message()).toContain('User not found');
            await dialog.accept()
        })
        await page.getByRole('button', {name: 'Log in'}).click();
    })

    //TC_009
    test('Test the functionality of logging out', async ({ page }) => {
        // first log in
        await page.getByRole('heading', {name: 'Login'}).toBeVisible;
        await page.getByLabel('Username').fill('charlie');
        await page.getByLabel('Password').fill('User_123');
        page.once('dialog', async (dialog) => {
            await expect(dialog.message()).toContain('User not found');
            await dialog.accept()
        })
        await page.getByRole('button', {name: 'Log in'}).click();
        // then log out
        await page.getByRole('button', {name: 'C'}).click()
        await page.getByText('Log out').click()
        await expect(page.locator('body')).toContainText('Log in')
    })
})