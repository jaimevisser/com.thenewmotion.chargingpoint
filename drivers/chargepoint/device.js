'use strict'

const Homey = require('homey')
const TNM = require('../../lib/tnm')
const CP = require('./chargepoint')

const freeconnectors = (data) => data.connectors.filter((conn) => conn.status == 0).length

class Chargepoint extends Homey.Device {
    async onInit() {
        this.updateDevice();
        this.start_update_loop();
    }

    onDeleted() {
        if (this._timer) {
            clearInterval(this._timer)
        }
    }

    start_update_loop() {
        this._timer = setInterval(() => {
            this.updateDevice();
        }, 300000); //5 min
    }

    async updateDevice() {
        const id = this.getData().id
        const data = CP.enhance(await TNM(id))
        const prev = this.getStoreValue('cache')
        await this.setStoreValue('cache', data)

        if (prev.e.free !== null && prev.e.free !== data.e.free) {
            this.getDriver().triggerChanged(this)
            
            if (prev.e.free > data.e.free) {
                this.getDriver().triggerStart(this)
            } else if (prev.e.free < free) {
                this.getDriver().triggerStop(this)
            }

            if (data.e.free == 0) {
                this.getDriver().triggerOccupied(this)
            } else if (data.e.free > 0) {
                this.getDriver().triggerFree(this)
            }
        }

        this.setIfHasCapability('connectors.total', data.e.total)
        this.setIfHasCapability('connectors.free', data.e.free)
        this.setIfHasCapability('power.max', data.e.availablepower)
        this.setIfHasCapability('price', data.e.price)
    }

    setIfHasCapability(cap, value) {
        if (this.hasCapability(cap)) {
            return this.setCapabilityValue(cap, value)
        }
    }
}

module.exports = Chargepoint