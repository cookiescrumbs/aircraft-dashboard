@javascript
Feature: Aircraft Dashboard
    As a remote aircraft operator
    I want a dashboard
    In order to monitor the airspeed, altitude, landing gear and flap adjustments of a remotely operated aircraft

Background:
    Given the operator loads the dashboard
    And the base station transmits the following parameters
        | landing gear     | 0      |
        | flaps            | 2      |
        | altitude         | 18506  |
        | airspeed         | 212    |

Scenario: Gauge displaying the airspeed summary
    Then the airspeed summary will contain the following values
        | min              | 212    |
        | max              | 212    |
        | avg              | 212    |
    When the base station transmits the following parameters
        | landing gear     | 1      |
        | flaps            | 4      |
        | altitude         | 20000  |
        | airspeed         | 100    |
    When the base station transmits the following parameters
        | landing gear     | 1      |
        | flaps            | 4      |
        | altitude         | 18200  |
        | airspeed         | 450    |
    Then the airspeed summary will contain the following values
        | min              | 100    |
        | max              | 450    |
        | avg              | 254    |

Scenario: Gauge displaying the altitude summary
    Then the altitude summary will contain the following values
        | min              | 18506  |
        | max              | 18506  |
        | avg              | 18506  |
    When the base station transmits the following parameters
        | landing gear     | 1      |
        | flaps            | 4      |
        | altitude         | 20000  |
        | airspeed         | 100    |
    When the base station transmits the following parameters
        | landing gear     | 1      |
        | flaps            | 4      |
        | altitude         | 18200  |
        | airspeed         | 450    |
    Then the altitude summary will contain the following values
        | min              | 18200    |
        | max              | 20000    |
        | avg              | 18902    |

Scenario: Airspeed dial
    Then the airspeed dail will be point at 212
    When the base station transmits the following parameters
        | landing gear     | 1      |
        | flaps            | 4      |
        | altitude         | 20000  |
        | airspeed         | 100    |
    Then the airspeed dail will be point at 100

Scenario: Altitude dial
    Then the altitude dail will be pointing at 18506
    When the base station transmits the following parameters
        | landing gear     | 1      |
        | flaps            | 4      |
        | altitude         | 20000  |
        | airspeed         | 100    |
    Then the altitude dail will be pointing at 20000

Scenario: Flaps gauge
    Then the flaps gauge will be toggled to 2
    When the base station transmits the following parameters
        | landing gear     | 1      |
        | flaps            | 4      |
        | altitude         | 20000  |
        | airspeed         | 100    |
    Then the flaps gauge will be toggled to 4

Scenario: Landing gear switch
    Then the landing gear will be "OFF"
    When the base station transmits the following parameters
        | landing gear     | 1      |
        | flaps            | 4      |
        | altitude         | 20000  |
        | airspeed         | 100    |
    Then the landing gear will be "ON"

Scenario: Operator toggles the landing gear and the base station recieves a message
    Then the landing gear will be "OFF"
    When the user flicks the landing gear switch "ON" and a message is sent to the base station
    Then the landing gear will be "ON"
    When the user flicks the landing gear switch "OFF" and a message is sent to the base station
    Then the landing gear will be "OFF"

Scenario: Operator slides the flaps slider and the base station recieves a message
    Then the flaps will be at 2
    When the user slides the flaps to 5 and a message is sent to the base station
    Then the flaps will be at 5

# Scenario: Conn
#     And the dashboard is connected to the base station
#     When the dashboard is disconnected from the base station
#     Then the dashboard is connected to the base station

