const { test, expect, chromium, Page} = require('@playwright/test');

test.describe('Ixigo tests', async () => {
    let page: Page;
    test.beforeAll(async ({ }) => {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        page = await context.newPage();
        // grant permission of location
        await context.grantPermissions(['geolocation'], { origin: 'https://www.ixigo.com'});
    });

    test('Navigate and search flights', async () => {
        await page.goto('https://www.ixigo.com/');
        await page.locator("//span[contains(text(),'Round Trip')]").click();
        await page.locator("//div[text()='From']/following-sibling::input").type("PUNE");
        await page.waitForTimeout(1000);
        await page.locator("//div[5]/div/div/div[1]/div/div[3]/div/div[contains(@data-acindex, '0')]").click();
        await page.locator("//div[text()='To']/following-sibling::input").type("MANGALORE");
        await page.waitForTimeout(1000);
        await page.locator("//div[5]/div/div/div[3]/div/div[3]/div/div[contains(@data-acindex, '0')]").click();
        // asserting expected from and input data
        await expect(page.locator("//div[text()='From']/following-sibling::input"), "Input and selected data is not matching").toHaveValue("PNQ - Pune");
        // asserting expected from and input data
        await expect(page.locator("//div[text()='To']/following-sibling::input"), "Input and selected data is not matching").toHaveValue("IXE - Mangalore");
        // cant read context of calender 
        // need to declare calender as a widget
        await page.locator("//div[text()='Departure']/following-sibling::input").click();
        // cant read past dates so selected future Jan 03, 2023
        await page.locator("//td[contains(@data-date, '03012023')]").click();
        // clearing input so it should auto-select
        await page.locator("//div[contains(@class, 'remove-date')]").click();
        await page.locator("//button[contains(text(), 'Search')]").click();
        await page.waitForTimeout(3000);  
    });

    test('Ensure sum of flight prices', async () => {
        await page.locator("//div[contains(@class, 'selectedSort')]").click();
        await page.locator("//span[contains(text(), 'QUICKEST')]").click();
        await page.waitForTimeout(2000);
        const first_price = await page.locator("//html/body/div[1]/div/div[4]/div[1]/div[2]/div[4]/div/div[2]/div/div/div/div[1]/div/span[2]").textContent();
        await page.locator("//div[@data-rank='1']/div/div[3]/div/div/button[contains(text(), 'Book')]").click();
        await page.goBack()
        await page.waitForTimeout(1000);
        await page.locator("//div[contains(@class, 'ixi-icon-swap')]").click();
        await page.locator("//div[contains(@class, 'selectedSort')]").click();
        await page.locator("//span[contains(text(), 'QUICKEST')]").click();
        await page.waitForTimeout(2000);
        const second_price = await page.locator("//html/body/div[1]/div/div[4]/div[1]/div[2]/div[4]/div/div[2]/div/div/div/div[1]/div/span[2]").textContent();
        const total_price = +first_price + +second_price;
        // cant assert as there is no footer found with price, thus printing the sum
        console.log(total_price);
    });
});
