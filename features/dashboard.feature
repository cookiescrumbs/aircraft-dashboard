@javascript
Feature: Aircraft Dashboard
    As a remote aircraft operator
    I want a dashboard
    In order to monitor the airspeed, altitude, landing gear and flap adjustments of a remotely operated aircraft

Background:
    Given I load the dashboard
    And the base station transmits the following parameters
        | landing gear     | 0      |
        | flaps            | 2      |
        | altitude         | 18506  |
        | airspeed         | 212    |
    When the base station transmits the following parameters
        | landing gear     | 0      |
        | flaps            | 2      |
        | altitude         | 18506  |
        | airspeed         | 100    |

Scenario: Airspeed
    Then the airspeed dail will be point at 100



