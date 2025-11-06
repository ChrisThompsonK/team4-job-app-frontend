Feature: User Authentication Variants
  Testing login with different user types and scenarios

  Scenario Outline: Different user types logging in
    Given I am on the login page
    When I enter "<email>" as email
    And I enter "<password>" as password
    And I click the login button
    Then the login result should be "<expected>"

    Examples:
      | email               | password      | expected |
      | admin@example.com   | password123   | success  |
      | member@example.com  | password123   | success  |
      | invalid@example.com | wrongpassword | error    |
      | test@example.com    | test123       | error    |
