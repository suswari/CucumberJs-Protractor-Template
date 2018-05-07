import { EventFormObjects } from '../../../PageObjects/eventFormPage';
import { defineSupportCode } from 'cucumber';

defineSupportCode(function ({Given,When, Then }) {
    let search: SearchPageObject = new SearchPageObject();

    Given(/^A user is on the event interview page$/, async () => {
        //await
    });
    When(/^The user fills the following personal data$/, async () => {
        //await
    });
    When(/^(?:The user|)fills the following orgainzation data$/, async () => {
        //await
    });
    When(/^(?:The user|)submits the form$/, async () => {
        //await
    });
    Then(/^A successful submission note is seen$/, async () => {
        //await
    });
    Then(/^A question ID is generated$/, async () => {
        //await
    });
})