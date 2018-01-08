'use strict'

const Homey = require('homey')
const TNM = require('../../lib/tnm')
const max = Math.max
const round = Math.round

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
        const data = await TNM(id)
        const cache = this.getStoreValue('cache')
        await this.setStoreValue('cache', data)

        const connectors = data.connectors.length
        const free = freeconnectors(data)
        const prevfree = freeconnectors(cache)
        let power = 0

        if (free > 0) {
            let filtered = data.connectors.filter(
                (conn) => conn.status == 0
            )

            power = filtered.reduce(
                (acc, conn) => max(acc, round((conn.power.phase * conn.power.voltage * conn.power.amperage) / 100) / 10)
                , 0)
        }

        const price = data.connectors.reduce((acc, conn) => max(acc, conn.price.perKWh), 0)

        if (prevfree === null) {
        } else if (prevfree !== free) {
            if (prevfree > free) {
                this.getDriver().triggerStart(this)
                this.getDriver().triggerChanged(this)
            } else if (prevfree < free) {
                this.getDriver().triggerStop(this)
                this.getDriver().triggerChanged(this)
            }

            if (free == 0) {
                this.getDriver().triggerOccupied(this)
            } else if (free > 0) {
                this.getDriver().triggerFree(this)
            }
        }

        if (this.hasCapability('connectors.total')) await this.setCapabilityValue('connectors.total', connectors)
        if (this.hasCapability('connectors.free')) await this.setCapabilityValue('connectors.free', free)
        if (this.hasCapability('power.max')) await this.setCapabilityValue('power.max', power)
        if (this.hasCapability('price')) await this.setCapabilityValue('price', price)
    }
}

module.exports = Chargepoint