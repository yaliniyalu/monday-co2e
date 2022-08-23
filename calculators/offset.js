const COST_PER_TREE = 0.25;
const TREES_PER_KG_CO2 = 15.7;

const noOfTreesToEliminateCo2 = (emissionInKg) => {
    return emissionInKg / TREES_PER_KG_CO2
}

const donationToEliminateCo2 = (trees) => {
    return trees * COST_PER_TREE
}

module.exports = {
    noOfTreesToEliminateCo2,
    donationToEliminateCo2
}
