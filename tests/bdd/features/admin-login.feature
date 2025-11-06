Feature: Admin Login
  As an admin user
  I want to log in with my credentials
  So that I can access the admin dashboard

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter "admin@example.com" as email
    And I enter "password123" as password
    And I click the login button
    Then I should be logged in successfully

  Scenario: Admin sees error with invalid credentials
    Given I am on the login page
    When I enter "invalid@example.com" as email
    And I enter "wrongpassword" as password
    And I click the login button
    Then I should see an error message
