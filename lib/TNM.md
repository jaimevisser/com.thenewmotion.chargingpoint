# Very simple TheNewMotion API
```js
const TNM = require('./tnm')
```

## Get all charging points near a location
Lat, Lon, distance (km)
returns a promise

```js
TNM.near(51.759622, 5.533371, .7)
```

## Get a single charging point
Charging point ID
returns a promise

```js
TNM(183332)
```