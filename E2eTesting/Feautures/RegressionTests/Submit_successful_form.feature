@stage
Feature: Submit a successful questionnarie
  Scenario: Fill the questionnarie, submit the form and check for the successful submission
    Given A user is on the event interview page
    When The user fills the following personal data
    |FirstName|LastName |Phone      |City |State|Zip      |Email|
    |John     |Greesham |1233456789 |FFX  |VA   |22980    |John.greesham@abt.com     |
    And fills the following orgainzation data
    |Organization  |Division|
    |Abt institiute|PPM     |
    And submits the form
    Then A successful submission note is seen
    And A question ID is generated