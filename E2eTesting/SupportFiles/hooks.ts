const Cucumber = require('cucumber');
import {$, browser, by, element} from 'protractor';
import * as fs from 'fs';
import { config } from '../config/config';
import * as reporter from 'cucumber-html-reporter';
import { mkdirp } from 'mkdirp';
import {LoginPageObject} from '../PageObjects/loginPage';

let BASEURL = browser.baseUrl;
const { Before,After,setDefaultTimeout,registerHandler, registerListener,Status,events } = require("cucumber");
setDefaultTimeout(30 * 1000);
let jsonReports = process.cwd() + "/reports/json";
let htmlReports = process.cwd() + "/reports/html";
let targetJson = jsonReports + "/cucumber_report.json";
let scenarioName;
const Authenticate = new LoginPageObject();
const d  = new Date();
const formatDayMonth = (i) => {
    if (i < 10) {
        return `0${i}`;
    }
    return i;
};
const id = `${formatDayMonth(d.getDate())}${formatDayMonth(d.getMonth() + 1)}${d.getFullYear()}-${d.getHours()}${d.getMinutes()}`;

registerHandler('BeforeScenario', async function (scenario)  {
    scenarioName = scenario.name;
});

Before( async function (event) {
    if(BASEURL.includes('stage')){
        await browser.get("https://ICF:1icf@stage.icf.com/");
    }else {
        await browser.get(BASEURL)
    }

});
Before({tags: "@stage"}, async function () {
    await browser.get('hudexchange-portal/?display=login');
    await Authenticate.LoginAs('SiteAdmin');
});

After(async function (scenarioResult) {
    let world = this;

    if(config.params.AttachAfterScenarioScreenShotInReport){
        let screenShot = await browser.takeScreenshot();
        await world.attach(screenShot, 'image/png');
    }

    await browser.takeScreenshot().then(async (png) =>{
        let stream = await fs.createWriteStream('reports/screenshots/'+scenarioName+'-'+id+'.png');
        await stream.write(new Buffer(png, 'base64'));
        await stream.end();
    });

    if (scenarioResult.isFailed()) {
        if (scenarioResult["failureException"].name === 'NoSuchElementError') {

            if ((scenarioResult["failureException"].stack).includes('Page.ts')){
                let newmessage = (scenarioResult["failureException"].message),
                    firstseperatorIndex = newmessage.indexOf(','),
                    lastseperatorIndex = newmessage.lastIndexOf(')'),
                    elementInError = newmessage.slice((firstseperatorIndex+2),lastseperatorIndex);
                let newstack = (scenarioResult["failureException"].stack),
                    pageIndex = newstack.indexOf('Page.ts');
                pageIndex = pageIndex+7;
                let finalstack = newstack.slice(0,pageIndex),
                    newpageIndex = finalstack.lastIndexOf('/'),
                    pageObjectIndex = finalstack.lastIndexOf('PageObject'),
                    atIndex = finalstack.lastIndexOf('at ');
                let pageFile = finalstack.slice(-(pageIndex-(newpageIndex+1))),
                    pageObject = finalstack.slice((atIndex+3),(pageObjectIndex+10));
                let pageimport = require('../pages/'+pageFile),
                    pageObjectInstance = new pageimport[pageObject]();
                Object.getOwnPropertyNames(pageObjectInstance).forEach(async function (val, idx, array) {
                        if (pageObjectInstance[val] == elementInError){
                            await console.info('The element locator for "'+val+'" is not found on the page "'+pageFile+'". Check the error at the failure step for more error trace');
                            await world.attach('The element locator for "'+val+'" is not found on the page "'+pageFile+'". Check the error at the failure step for more error trace');
                        }
                    }
                );

            }
        }

    }

});



let cucumberReporterOptions = {
    theme: "bootstrap",
    jsonFile: targetJson,
    output: htmlReports + "/cucumber_reporter.html",
    reportSuiteAsScenarios: true
};

let logFn = string => {
    if (!fs.existsSync(jsonReports)) {
        mkdirp.sync(jsonReports);
    }
    try {
        fs.writeFileSync(targetJson, string);
        reporter.generate(cucumberReporterOptions); // invoke cucumber-html-reporter
    } catch (err) {
        if (err) {
            console.log(`Failed to save cucumber test results to json file. 
                             Failed to create html report.
                             `);
            console.log(err);
        }
    }
};
let jsonformatter = new Cucumber.JsonFormatter({
    log: logFn
});
registerListener(jsonformatter);

