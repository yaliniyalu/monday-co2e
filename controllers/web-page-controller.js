const {ElectricityGrid, ElectricityCountry, CabinClass, Fuels, Waterways, Vehicles} = require('./../calculators/data')

async function index(req, res) {
    const context = {
        recipeCategory: [
            {name: 'Electricity', url: '/factors/electricity'},
            {name: 'Inland Waterways', url: '/factors/iwt'},
            {name: 'Vehicle', url: '/factors/vehicle'},
            {name: 'Fuel', url: '/factors/fuel'},
            {name: 'Flight', url: '/factors/flight'},
            {name: 'Offset', url: '/factors/offset'},
        ],
        recipes: [
            "When {qty} kWh of energy is produced in {country}, {emission} kg of Co2e is emitted",
            "When {qty} kWh of energy is produced by [grid type (static)], {emission} kg of Co2e is emitted",
            "When {qty} kWh of energy is produced by {grid type}, {emission} kg of Co2e is emitted",
            "When the [transport (static)] travels distance km in the water, {emission} kg of Co2e is emitted",
            "When the {transport} travels {distance} km in the water, {emission} kg of Co2e is emitted",
            "When the [vehicle (static)] travels {distance} km, {emission} kg of Co2e is emitted",
            "When the {vehicle} travels {distance} km, {emission} kg of Co2e is emitted",
            "When the {qty} liter of [fuel (static)] is burned, {emission} kg of Co2e is emitted",
            "When the {qty} liter of {fuel} is burned, {emission} kg of Co2e is emitted",
            "While flying from {airport} to {airport}  in {class} class, {emission} kg of Co2e is emitted",
            "When flown {distance} km in {class} class, {emission} kg of Co2e is emitted",
            "To offset {emission} kg of Co2e in 1 year, {qty} trees should be planted",
            "To plant {qty} trees, donate {amount} dollars to trees.org",
            "To offset {emission} amount of Co2e, donate {amount} dollars to trees.org"
        ],
        units: [
            { name: 'Emission', unit: 'kg Co2e' },
            { name: 'Distance', unit: 'km' },
            { name: 'Energy', unit: 'kWh' },
            { name: 'Fuel', unit: 'liter' },
            { name: 'Airport', unit: 'IATA or ICAO code' },
        ]
    }

    res.render('index.njk', context);
}

function factors(req, res) {
    switch (req.params.factor) {
        case 'electricity':
            return res.render('factors/electricity.njk', {gridTypes: ElectricityGrid, countries: ElectricityCountry});
        case 'iwt':
            return res.render('factors/iwt.njk', {waterways: Waterways});
        case 'vehicle':
            return res.render('factors/vehicle.njk', {vehicles: Vehicles});
        case 'fuel':
            return res.render('factors/fuel.njk', {fuels: Fuels});
        case 'flight':
            return res.render('factors/flight.njk', {cabinClasses: CabinClass});
        case 'offset':
            return res.render('factors/offset.njk');

    }
    const context = {

    }

    res.render('factors.njk', context);
}

function render(page) {
    return (req, res) => {
        res.render(page);
    }
}

module.exports = {
    index,
    factors,
    render
}
