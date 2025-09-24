# Wheel Color Detector Component

## Overview
The Wheel Color Detector component is designed to detect the color under the spinner in the wheel game and provide the corresponding multiplier. This component enhances the user experience by providing real-time feedback about the current position of the wheel.

## Features
- Real-time color detection based on wheel position
- Dynamic multiplier display based on the detected color
- Visual representation of the current segment
- Integration with the existing wheel game

## Implementation Details

### ColorDetector Component
The `ColorDetector.jsx` component is responsible for:
1. Detecting the current segment under the spinner
2. Extracting the color and multiplier information
3. Displaying this information in a user-friendly way
4. Notifying parent components about changes via callback

### Integration with GameWheel
The `GameWheel.jsx` component has been updated to:
1. Include the ColorDetector component
2. Pass the necessary props (wheelPosition, wheelData, segments)
3. Handle color detection callbacks
4. Update the multiplier based on the detected color

### Multiplier Logic
The multiplier values are determined based on the color of the wheel segment:
- Each color on the wheel corresponds to a specific multiplier
- The multiplier is updated in real-time as the wheel spins
- When the wheel stops, the final multiplier is based on the color under the spinner

## Usage
The ColorDetector component is used within the GameWheel component and doesn't need to be used separately. The GameWheel component handles all the necessary logic for color detection and multiplier calculation.

## Technical Details
- The component uses the wheel position and segment information to calculate the current segment
- The calculation takes into account the rotation of the wheel
- The component updates whenever the wheel position changes
- The component provides visual feedback about the detected color and multiplier
