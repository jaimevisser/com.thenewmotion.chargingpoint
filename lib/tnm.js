'use strict'
const Got = require('got')
const HS = require('./haversine')

async function getSinglePoint(id) {
    let url = 'https://my.newmotion.com/api/map/points/' + id
    
    return (await Got(url, { json: true })).body
}

async function getChargingPoints(lat, lon, radius) {
    let bounds = HS.square({lat:lat,lon:lon}, radius)

    let url = 'https://my.newmotion.com/api/map/markers/' + bounds[0].lon + '/' + bounds[1].lon + '/' + bounds[0].lat + '/' + bounds[1].lat + '/22'
    let points = (await Got(url, { json: true })).body
    let promises = points.map((point) => getSinglePoint(point.locationId))

    return await Promise.all(promises)
}

module.exports = getSinglePoint
module.exports.near = getChargingPoints