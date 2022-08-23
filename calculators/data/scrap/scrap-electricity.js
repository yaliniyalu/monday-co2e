const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require("path");

// https://calculator.carbonfootprint.com/calculator.aspx

(async () => {
    const browser = await puppeteer.launch(
        {
            // headless: false,
        }
    );
    const page = await browser.newPage();
    await page.goto('https://calculator.carbonfootprint.com/calculator.aspx');

    // get all countries
    const countries = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#ctl05_cczLocation_ddlCountry option')).map(e => ({
            code: e.getAttribute('value'),
            name: e.innerText
        }));
    });

    const electricityFactors = [];

    for (const country of countries) {
        // select country
        await page.evaluate(country => {
            const select = document.querySelector('#ctl05_cczLocation_ddlCountry');
            select.value = country.code;
            select.dispatchEvent(new Event('change'));
        }, country);

        await page.waitForNetworkIdle();
        await page.waitForSelector('.rtsUL > li:nth-child(2) > a');

        // goto house page
        await page.click('.rtsUL > li:nth-child(2) > a');
        await page.waitForSelector('#ctl05_chsHouse_txtElecFactor');

        // get electricity conversion factor
        const electricityConversionFactor = await page.evaluate(() => {
            return document.querySelector('#ctl05_chsHouse_txtElecFactor').value;
        });

        electricityFactors.push({
            country: country,
            electricityConversionFactor: electricityConversionFactor
        });

        console.log(`${country.name} - ${electricityConversionFactor}`);

        await page.click('.rtsUL > li:nth-child(1) > a');
        await page.waitForNetworkIdle();
    }

    fs.writeFileSync(path.resolve(__dirname, '../electricityFactorsByCountry.json'), JSON.stringify(electricityFactors));

    await browser.close();
})();
