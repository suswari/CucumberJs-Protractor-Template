import { Config,browser } from 'protractor';
export let config: Config = {

    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    SELENIUM_PROMISE_MANAGER: false,
    baseUrl:'www.yourApplicationURI.com',
    params:{
        AttachAfterScenarioScreenShotInReport:true
    },
    capabilities: {
        browserName: 'chrome',
        'chromeOptions': {
        }
    },

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    specs: [
        '../Features/*/*.feature',

    ],

    onPrepare: () => {
        browser.ignoreSynchronization = true;// leave this as true unless your application has modules which uses angular. Marking this as false would raise timeout issue
        browser.manage().window().maximize();//On mac, though the command is to maximize, the browser to maximized not to fit the screen
        browser.manage().timeouts().implicitlyWait(5000);
    },


    cucumberOpts: {
        compiler: "ts:ts-node/register",
        strict: true,
        format: ['pretty'],
        require: ['path to stepdefinitions', '../../RegressionTests/*.ts','../../SmokeTests/*.ts'],
        tags: ['@stage','@smokeTests'],
    }
};
