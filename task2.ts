const { test, expect, chromium, Page} = require('@playwright/test');

test.describe('Luma website', async () => {
    let page: Page;
    test.beforeAll(async ({ }) => {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        page = await context.newPage();
    });

    test('Cloth checkout test', async () => {
        await page.goto('https://magento.softwaretestingboard.com/');
        await page.hover("//a[contains(@class, 'ui-corner-all')]/span/following-sibling::span[contains(text(), 'Women')]");
        await page.hover("//a[contains(@class, 'ui-corner-all')]/span/following-sibling::span[contains(text(), 'Tops')]");
        await page.getByRole("menuitem", { name: "Hoodies & Sweatshirts"}).click();
        await page.waitForTimeout(1000);
        // selecting 36 items per page
        await page.locator("#limiter").last();
        await page.waitForTimeout(1000);
        await page.locator("//div[contains(text(), 'Price')]").click();
        await page.locator("//span[contains(text(), '$50.00')]/following-sibling::span[contains(text(), '$59.99')]").click();
        await page.locator("//a[contains(text(), 'Autumn Pullie')]").click();
        await page.locator("//div[contains(@aria-label, 'L')][1]").click();
        await page.locator("//div[contains(@aria-label, 'Green')]").click();
        const price = await page.locator("//div[contains(@class, 'product-info-price')]/div/span/span[contains(@class, 'price-final_price')]/span[contains(@class, 'price-wrapper')]/span[contains(@class, 'price')]").textContent();
        await page.locator("//button/span[contains(text(), 'Add to Cart')]").click();
        await page.waitForTimeout(3000);
        await page.locator("//a[contains(@class, 'showcart')]").click();
        await page.locator("//button[contains(@class, 'action primary checkout')]").click();
        await page.waitForTimeout(5000);
        await page.locator("//input[contains(@data-bind, 'textInput: email')]").type("something@email.com");
        await page.locator("//input[contains(@name, 'firstname')]").type("John");
        await page.locator("//input[contains(@name, 'lastname')]").type("Doe");
        await page.locator("//select[contains(@name, 'country_id')]").selectOption({ label: 'India' });
        await page.locator("//select[contains(@name, 'region_id')]").selectOption({ label: 'Maharashtra' });
        await page.locator("//input[contains(@name, 'postcode')]").type("411037");
        await page.locator("//input[contains(@name, 'company')]").type("Source.One Private Limited");
        await page.locator("//input[contains(@name, 'street[0]')]").type("Maharshi Nagar");
        await page.locator("//input[contains(@name, 'city')]").type("Pune");
        await page.locator("//input[contains(@name, 'telephone')]").type("8888800000");
        await page.locator("//input[contains(@value, 'flatrate_flatrate')]").check();
        await page.waitForTimeout(3000);
        await page.locator("//button/span[contains(text(), 'Next')]").click();
        // check and assert if earlier item is what we have selected
        await page.locator("//strong[contains(@aria-level, '1')]").click();
        await expect(page.locator("//div/strong[contains(@class, 'product-item-name')]"), "Earlier selected item does not match").toContainText("Autumn Pullie");
        const order_total = await page.locator("//strong/span[contains(@class, 'price')]").textContent();
        // test should fail as flat rate addup will increase order total
        await expect(page.locator("//strong/span[contains(@class, 'price')]").textContent(), "Selected item price does not match with order total").toHaveValue(price);  
    });
});
