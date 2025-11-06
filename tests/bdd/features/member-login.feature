Feature: Member Login
  As a member user
  I want to log in with my credentials
  So that I can access my job applications

  Scenario: Member logs in with valid credentials
    Given I am on the login page
    When I enter "member@example.com" as email
    And I enter "password123" as password
    And I click the login button
    Then I should be logged in successfully

  Scenario: Member cannot log in without password
    Given I am on the login page
    When I enter "member@example.com" as email
    And I click the login button
    Then I should see an error message
