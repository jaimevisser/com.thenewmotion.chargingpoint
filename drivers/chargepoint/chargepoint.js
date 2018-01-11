'use strict'

const max = Math.max
const round = Math.round

module.exports = {}

module.exports.enhance = function (data) {
    data.e = { connectors: {} }
    delete (data.openingHours)
    data.e.total = data.connectors.length
    data.e.free = data.connectors.filter((conn) => conn.status == 0).length
    data.e.price = data.connectors.reduce((acc, conn) => max(acc, conn.price.perKWh), 0)

    data.e.availablepower = data.connectors.filter(
        (conn) => conn.status == 0
    ).reduce(
        (acc, conn) => max(acc, round((conn.power.phase * conn.power.voltage * conn.power.amperage) / 100) / 10)
        , 0)

    data.e.maxpower = data.connectors.reduce(
        (acc, conn) => max(acc, round((conn.power.phase * conn.power.voltage * conn.power.amperage) / 100) / 10)
        , 0)

    data.e.types = []
    data.connectors.forEach((conn) => {
        if (!data.e.types.includes(conn.connectorType)) data.e.types.push(conn.connectorType)
    })

    if (data.e.types.length > 1) {
        data.e.bytype = {}
        data.e.types.forEach((type) => {
            data.e.bytype[type] = {
                total: data.connectors.filter((conn) => conn.connectorType == type).length,
                free: data.connectors.filter((conn) => conn.connectorType == type && conn.status == 0).length
            }
        })
    }

    return data
}

module.exports.icon = function (point) {
    if (point.provider == 'NewMotion' && point.connectors.length == 1) return 'lolo.svg'
    if (point.serial.startsWith('EVB-P') && point.connectors.length == 1) return 'evbox.svg'
    if (point.serial.startsWith('ICUEVE') && point.connectors.length == 2) return 'icueve2.svg'
    if (point.e.total == 2 && point.e.maxpower == 22.1) return 'public2.svg'
    if (point.e.types.length == 1) return 'plug/' + point.e.types[0].toLowerCase() + '.svg'
}

module.exports.buildDevice = function (device, point) {

    device.icon = module.exports.icon(point)

    const firstplug = '/drivers/chargepoint/assets/plug/' + point.e.types[0].toLowerCase() + '.svg'

    device.capabilities = []
    device.capabilitiesOptions = {}
    device.mobile = {
        'components': [
            {
                'id': 'icon'
            },
            {
                'id': 'sensor',
                'capabilities': [],
                'options': {
                    'icons': {}
                }
            }
        ]
    }

    if (point.connectors.length == 1) {
        device.capabilities.push('occupied')

        device.mobile.components[1].capabilities.push('occupied')
        device.mobile.components[1].options.icons['occupied'] = firstplug

    } else {
        device.capabilities.push('connectors.free')
        device.capabilities.push('connectors.total')

        device.capabilitiesOptions['connectors.free'] = {
            'title': {
                'en': 'Free',
                'nl': 'Vrij'
            }
        }

        device.capabilitiesOptions['connectors.total'] = {
            'title': {
                'en': 'Total',
                'nl': 'Totaal'
            },
            'preventInsights': true
        }

        device.mobile.components[1].capabilities.push('connectors.free')
        device.mobile.components[1].capabilities.push('connectors.total')

        device.mobile.components[1].options.icons['connectors.free'] = firstplug
        device.mobile.components[1].options.icons['connectors.total'] = firstplug
    }

    device.capabilities.push('power.max')
    device.capabilities.push('price')

    device.capabilitiesOptions['power.max'] = {
        'title': {
            'en': 'Power available',
            'nl': 'Vermogen beschikbaar'
        }
    }

    device.mobile.components[1].capabilities.push('power.max')
    device.mobile.components[1].capabilities.push('price')

    device.mobile.components[1].options.icons['power.max'] = '/assets/power.svg';
    device.mobile.components[1].options.icons['price'] = '/assets/euro.svg';

    return device
}

