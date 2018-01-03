'use strict'

const Got = require('got')
const Haversine = require('new-point-haversine')

async function getSinglePoint(id) {
    let url = 'https://my.newmotion.com/api/map/points/' + id
    
    return (await Got(url, { json: true })).body
}

async function getChargingPoints(lat, lon, radius) {
    let bounds = Object.assign({},
        Haversine.getLatitudeBounds(lat, radius, 'km'),
        Haversine.getLongitudeBounds(lat, lon, radius, 'km'))

    let url = 'https://my.newmotion.com/api/map/markers/' + bounds.lowerLong + '/' + bounds.upperLong + '/' + bounds.lowerLat + '/' + bounds.upperLat + '/22'
    let points = (await Got(url, { json: true })).body
    let promises = points.map((point) => getSinglePoint(point.locationId))

    return await Promise.all(promises)
}

module.exports = getSinglePoint
module.exports.near = getChargingPoints