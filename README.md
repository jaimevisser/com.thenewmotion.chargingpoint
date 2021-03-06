# The New Motion
Unofficial app for The New Motion. Adds support for EV charging points found on https://my.thenewmotion.com.

Time to develop this app was donated by
![Hightech ICT](http://www.hightechict.nl/wp-content/uploads/2013/04/logo-HT-ICT.png)

## What's new?
* Stable release
* Single connector points have a simpler mobile card

## Getting started
Add a new device for your charging point. The app uses your Homeys location to find the nearest charging points. For now this is in a fixed 1km square around Homeys location.

## Usage
* In the flow editor use the triggers to start a flow when someone starts/stops charging or when there are free connectors.
* Use the "Free" connectors tag to check the number of free connectors.

## Supported devices
* All charging points on https://my.thenewmotion.com. Special icons for:
    * The New Motion LoLo
    * ICU EVE with two connectors
    * EV-Box
    * Public chargers (22kw, two connectors)

## Changelog

### 1.0.0
* Stable release
* Single connector points have a simpler mobile card

### 0.0.4
* Image for 22kw public chargers
* Refactoring and bugfixes

### 0.0.3
* Available power shown
* Price shown
* Less dependencies in node_modules

### 0.0.2
Fix node modules

### 0.0.1 Very first beta release
Beta release