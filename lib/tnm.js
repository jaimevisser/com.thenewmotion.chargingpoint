'use strict'
const http = require('http.min')
const HS = require('./haversine')

async function getSinglePoint(id) {
    let url = 'https://my.newmotion.com/api/map/points/' + id

    return (await http.json(url))
}

async function getChargingPoints(lat, lon, radius) {
    let bounds = HS.square({ lat: lat, lon: lon }, radius)

    let url = 'https://my.newmotion.com/api/map/markers/' + bounds[0].lon + '/' + bounds[1].lon + '/' + bounds[0].lat + '/' + bounds[1].lat + '/22'
    let points = (await http.json(url))
    let promises = points.map((point) => getSinglePoint(point.locationId))

    return await Promise.all(promises)
}

module.exports = getSinglePoint
module.exports.near = getChargingPoints