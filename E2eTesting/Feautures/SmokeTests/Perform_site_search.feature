Feature: Submit a successful questionnarie
  Scenario Outline: Fill the questionnarie, submit the form and check for the successful submission
    Given A user is on the site search page
    When The user searches for "<search text>" on site search
    Then Only the appropriate results are shown
    And No matches found message is seen if none of the results are found for the text
    Examples:
    |search text|
    |"organization"|
    |472839|
    |emhasis@@@|
