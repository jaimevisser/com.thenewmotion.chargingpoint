'use strict'

const Homey = require('homey')
const TNM = require('../../lib/tnm')
const CP = require('./chargepoint')

function capabilities() {
    return [
        "connectors.free",
        "connectors.total",
        "power.max",
        "price"
    ]
}

function capabilitiesOptions() {
    return {
        "connectors.free": {
            "title": {
                "en": "Free",
                "nl": "Vrij"
            }
        },
        "connectors.total": {
            "title": {
                "en": "Total",
                "nl": "Totaal"
            },
            "preventInsights": true
        },
        "power.max": {
            "title": {
                "en": "Power available",
                "nl": "Vermogen beschikbaar"
            }
        }
    }
}

function mobile() {
    return {
        "components": [
            {
                "id": "icon"
            },
            {
                "id": "sensor",
                "capabilities": [
                    "connectors.free",
                    "connectors.total",
                    "power.max",
                    "price"
                ],
                "options": {
                    "icons": {
                        "connectors.free": "/assets/plug/type2.svg",
                        "connectors.total": "/assets/plug/type2.svg",
                        "power.max": "/assets/power.svg",
                        "price": "/assets/euro.svg"
                    }
                }
            }
        ]
    }
}

class ChargepointDriver extends Homey.Driver {

    onInit() {
        this._flowTriggerStart = new Homey.FlowCardTriggerDevice('start').register()
        this._flowTriggerStop = new Homey.FlowCardTriggerDevice('stop').register()
        this._flowTriggerChanged = new Homey.FlowCardTriggerDevice('changed').register()
        this._flowTriggerOccupied = new Homey.FlowCardTriggerDevice('occupied').register()
        this._flowTriggerFree = new Homey.FlowCardTriggerDevice('free').register()
    }

    triggerStart(device) {
        this._flowTriggerStart
            .trigger(device, {}, {})
            .then(this.log)
            .catch(this.error)
    }

    triggerStop(device) {
        this._flowTriggerStop
            .trigger(device, {}, {})
            .then(this.log)
            .catch(this.error)
    }

    triggerChanged(device) {
        this._flowTriggerChanged
            .trigger(device, {}, {})
            .then(this.log)
            .catch(this.error)
    }

    triggerOccupied(device) {
        this._flowTriggerOccupied
            .trigger(device, {}, {})
            .then(this.log)
            .catch(this.error)
    }

    triggerFree(device) {
        this._flowTriggerFree
            .trigger(device, {}, {})
            .then(this.log)
            .catch(this.error)
    }

    onPairListDevices(data, callback) {
        const Location = Homey.ManagerGeolocation

        TNM.near(Location.getLatitude(), Location.getLongitude(), 10000)
            .then(function (points) {
                const devices = points.map((point) => {
                    point = CP.enhance(point)

                    return CP.buildDevice({
                        name: point.address.trim() + ", " + point.city.trim() + " (" + point.provider.trim() + ")",
                        data: { id: point.id },
                        store: { cache: point },
                        capabilities: capabilities(),
                        capabilitiesOptions: capabilitiesOptions(),
                        mobile: mobile()
                    }, point)
                })

                callback(null, devices)
            })
            .catch((err) => callback(err, null))
    }
}

module.exports = ChargepointDriver