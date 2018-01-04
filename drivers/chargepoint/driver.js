'use strict'

const Homey = require('homey')
const TNM = require('../../lib/tnm')

class ChargepointDriver extends Homey.Driver {

    onPairListDevices(data, callback) {

        const Location = Homey.ManagerGeolocation

        TNM.near(Location.getLatitude(), Location.getLongitude(), 1)
            .then(function (points) {
                let devices = points.map((point) => {
                    return {
                        name: point.address.trim() + ", " + point.city.trim() + " (" + point.provider.trim() + ")",
                        data: {
                            id: point.id
                        }
                    }
                })

                callback(null, devices)
            })
            .catch((err) => callback(err, null))
    }
}

module.exports = ChargepointDriver