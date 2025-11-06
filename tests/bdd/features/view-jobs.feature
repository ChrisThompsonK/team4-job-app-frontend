Feature: View Jobs
  As a user
  I want to view available job listings
  So that I can find and apply for jobs

  Scenario: User views all jobs
    Given I am on the home page
    When I click on "View All Jobs"
    Then I should see a list of jobs

  Scenario: User views job details
    Given I am on the jobs page
    When I click on the first job
    Then I should see the job details
