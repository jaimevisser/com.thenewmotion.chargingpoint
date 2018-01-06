'use strict'

const Homey = require('homey')
const TNM = require('../../lib/tnm')

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

        TNM.near(Location.getLatitude(), Location.getLongitude(), 1000)
            .then(function (points) {
                let devices = points.map((point) => {
                    let icon = "icon.svg"

                    if (point.provider == "NewMotion" && point.connectors.length == 1) icon = "lolo.svg"
                    if (point.serial.startsWith("EVB-P")) icon = "evbox.svg"
                    if (point.serial.startsWith("ICUEVE") && point.connectors.length == 2) icon = "icueve2.svg"

                    return {
                        name: point.address.trim() + ", " + point.city.trim() + " (" + point.provider.trim() + ")",
                        data: point,
                        icon: icon
                    }
                })

                callback(null, devices)
            })
            .catch((err) => callback(err, null))
    }
}

module.exports = ChargepointDriver