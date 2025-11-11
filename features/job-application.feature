Feature: Job Application Flow
  As a user
  I want to browse available jobs and navigate to job details
  So that I can view job information and apply for positions

  Scenario: User can view jobs and navigate to job details
    Given I am on the job listings page
    When I view the available jobs
    Then I should see the "Available Job Roles" heading
    And I should see at least one "View Details" link
    When I click on the first "View Details" link
    Then I should be navigated to the job detail page
    And I should see the job information
    And I should see an apply or login link
