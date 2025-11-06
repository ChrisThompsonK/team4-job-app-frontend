Feature: Create Job
  As an admin
  I want to create a new job posting
  So that I can attract qualified candidates

  Scenario: Admin successfully creates a job
    Given I am on the home page
    When I navigate to create job page
    And I fill in the job form with valid data
    And I submit the job form
    Then I should see job creation success message

  Scenario: Admin cannot create job with missing required fields
    Given I am on the create job page
    When I submit the job form without filling required fields
    Then I should see validation error messages
