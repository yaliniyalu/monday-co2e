const {ElectricityGrid, Fuels, Waterways, Vehicles} = require('./data')
const FlightCalculator = require('./flight')
const Offset = require('./offset')
const Electricity = require('./electricity')

const transformCountry = value => value.countryCode

function calculateEmission(qty, name, dataset) {
    const factor = dataset.find(e => e.name === name)?.factor ?? 0
    return qty * factor
}

const Schema = {
    'electricity-country': {
        inputs: [
            {id: 'countryColumnId', transform: transformCountry},
            {id: 'energyColumnId'}
        ],
        calculate: (country, energy) => energy * Electricity.factorByCountry(country)
    },
    'electricity-grid-type': {
        inputs: ['gridTypeColumnId', 'energyColumnId'],
        calculate: (type, energy) => calculateEmission(energy, type, ElectricityGrid)
    },
    'electricity-static-grid-type': {
        inputs: ['gridType','energyColumnId'],
        calculate: (type, energy) => calculateEmission(energy, type, ElectricityGrid)
    },
    'iwt': {
        inputs: ['iwtColumnId', 'distanceColumnId'],
        calculate: (type, distance) => calculateEmission(distance, type, Waterways)
    },
    'iwt-static': {
        inputs: ['iwt', 'distanceColumnId'],
        calculate: (type, distance) => calculateEmission(distance, type, Waterways)
    },
    'vehicle': {
        inputs: ['vehicleTypeColumnId', 'distanceColumnId'],
        calculate: (type, distance) => calculateEmission(distance, type, Vehicles)
    },
    'vehicle-static': {
        inputs: ['vehicleType', 'distanceColumnId'],
        calculate: (type, distance) => calculateEmission(distance, type, Vehicles)
    },
    'fuel': {
        inputs: ['fuelColumnId', 'qtyColumnId'],
        calculate: (type, qty) => calculateEmission(qty, type, Fuels)
    },
    'fuel-static': {
        inputs: ['fuel', 'qtyColumnId'],
        calculate: (type, qty) => calculateEmission(qty, type, Fuels)
    },
    'flight': {
        inputs: ['cabinClassColumnId', 'fromColumnId', 'toColumnId'],
        calculate: async (cabin, from, to) => FlightCalculator.emissionByDistance(await FlightCalculator.getDistance(from, to), cabin)
    },
    'flight-distance': {
        inputs: ['cabinClassColumnId', 'distanceColumnId'],
        calculate: (cabin, distance) => FlightCalculator.emissionByDistance(distance, cabin)
    },
    'offset-co2e': {
        inputs: ['emissionColumnId'],
        calculate: (emission) => Offset.noOfTreesToEliminateCo2(emission),
        output: 'trees'
    },
    'offset-amount': {
        inputs: ['treesColumnId'],
        calculate: (trees) => Offset.donationToEliminateCo2(trees),
        output: 'amount'
    },
    'donate-emission': {
        inputs: ['emissionColumnId'],
        calculate: (emission) => Offset.donationToEliminateCo2(Offset.noOfTreesToEliminateCo2(emission)),
        output: 'amount'
    },
    'add': {
        inputs: ['columnId1', 'columnId2', 'columnId3', 'columnId4', 'columnId5', 'columnId6'],
        calculate: (...values) => values.reduce((a, b) => a + (b ?? 0), 0),
        output: 'sum'
    }
}

async function calculate(id, fields) {
    const schema = Schema[id]
    if (!schema) {
        return null
    }

    const inputs = schema.inputs.map(input => {
        if (typeof input === 'string' || input instanceof String) {
            return fields[input]
        }

        const value = fields[input.id]
        return input.transform ? input.transform(value) : value
    })

    const output = schema.output ?? 'emission'

    return {[output]: await schema.calculate(...inputs)}
}

module.exports = calculate

