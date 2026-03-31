## use-case-1.md

This file provides guidance to Claude Code (claude.ai/code) for the "Colors → Ohms" use case of the application and user interface.

## Description

The user will be able to interact with the application in the following manner:

1. **Color Selection**: When the user clicks on a color band, a pop-up color selector modal window will be displayed showing each color for the user's selection. Each color will have a numeric value When a color is clicked on, the modal window will disappear, and the color selected will be shown for the band on the resistor representation.

2. **First 2 Bands**: User can select from the following colors (numeric value):

    Black = 0
    Brown = 1
    Red = 2
    Orange = 3
    Yellow = 4
    Green = 5
    Blue = 6
    Violet = 7
    Grey = 8
    White = 9

3. **Third Band**: User can select from the following colors (numeric multiplier):

    Black = 1
    Brown = 10
    Red = 100
    Orange = 1000
    Yellow = 10000
    Green = 100000
    Blue = 1000000
    Violet = 10000000

4. **Fourth Band**: User can select from the following colors (tolerance value):

    Gold = +/- 5%
    Silver = +/- 10%

For each color for a band that is selected, the application will calculate the value of the resistance in ohms, and display it in the numeric input/output field, otherwise the field will not display any value.

When the "Reset" button is clicked on, the application will unset the selected colors of the , and clear the numeric input/output value field.

