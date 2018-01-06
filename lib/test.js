'use strict'
const TNM = require('./tnm')

TNM.near(51.759653, 5.533532, 1000)
    .then(console.log)
    .catch(console.error)