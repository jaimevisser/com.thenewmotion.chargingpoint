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

        await this.setCapabilityValue('connectors.total', connectors)
        await this.setCapabilityValue('connectors.free', free)
    }
}

module.exports = Chargepoint