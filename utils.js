
const COST_PER_TREE = 0.25;
const TREES_PER_KG_CO2 = 15.7;


const getElectricityEmissionByGivenFactor = (usageInKwH, factor) => {
    return usageInKwH * factor;
}

const getNoOfTreesToEliminateCo2 = (emissionInKg) => {
    return emissionInKg / TREES_PER_KG_CO2
}

const getDonationToEliminateCo2 = (trees) => {
    return trees * COST_PER_TREE
}

module.exports = {
    getElectricityEmissionByCountry,
    getElectricityEmissionByGivenFactor
}
