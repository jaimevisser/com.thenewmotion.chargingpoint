'use strict'

const Homey = require('homey')
const TNM = require('../../lib/tnm')

class Chargepoint extends Homey.Device {
    async onInit() {
        this.updateDevice();
        this.start_update_loop();
    }

    start_update_loop() {
        setInterval(() => {
            this.updateDevice();
        }, 300000); //5 min
    }

    async updateDevice() {
        let id = this.getData().id
        let data = await TNM(id)

        let connectors = data.connectors.length
        let free = data.connectors.filter((conn) => conn.status == 0).length
        let prevfree = this.getCapabilityValue('connectors.free')

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
    }
}

module.exports = Chargepoint