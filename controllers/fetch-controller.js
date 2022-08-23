const {ElectricityGrid, CabinClass, Fuels, Waterways, Vehicles} = require('../calculators/data/index.js');

function getSortedList(array, key) {
    return array.sort((a, b) => {
        if (a[key] < b[key]) {
            return -1;
        }
        if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    }).map(e => ({title: e[key], value: e[key]}));
}

async function getGridTypes(req, res) {
    res.json({
        options: getSortedList(ElectricityGrid, 'name'),
        isPaginated: false
    })
}

async function getIWT(req, res) {
    res.json({
        options: Waterways.map(e => ({title: e.name, value: e.name})),
        isPaginated: false
    })
}

async function getCabinClass(req, res) {
    res.json({
        options: CabinClass.map(e => ({title: e.name, value: e.name})),
        isPaginated: false
    })
}

async function getVehicles(req, res) {
    res.json({
        options: Vehicles.map(e => ({title: e.name, value: e.name})),
        isPaginated: false
    })
}

async function getFuels(req, res) {
    res.json({
        options: getSortedList(Fuels, 'name'),
        isPaginated: false
    })
}

module.exports = {
    getGridTypes,
    getIWT,
    getCabinClass,
    getVehicles,
    getFuels
}
