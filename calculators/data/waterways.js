// https://www.smartfreightcentre.org/pdf/GLEC-report-on-GHG-Emission-Factors-for-Inland-Waterways-Transport-SFC2018.pdf
// page 9 & 10

const waterwaysFactors = [
    { name: 'Motor vessels ≤ 80m', co2: 29.5 },
    { name: 'Motor vessels 85 – 86m', co2: 20.7 },
    { name: 'Motor vessels 87 – 109m', co2: 18.4 },
    { name: 'Motor vessels 110m', co2: 18.4 },
    { name: 'Motor vessels 135m', co2: 19.0 },
    { name: 'Coupled convoys (163 – 185m)', co2: 17.0 },
    { name: 'Pushed convoy – push boat + 2 barges', co2: 17.3 },
    { name: 'Pushed convoy – push boat + 4/5 barges', co2: 9.7 },
    { name: 'Pushed convoy – push boat + 6 barges', co2: 7.4 },
    { name: 'Tanker vessels 110m', co2: 18.7 },
    { name: 'Tanker vessels 135m', co2: 22.0 },
    { name: 'Container vessels 110m', co2: 25.5 },
    { name: 'Container vessels 135m', co2: 19.8 },
    { name: 'Container vessels – Coupled convoys', co2: 19.7 },
].map(v => {
    return {
        name: v.name,
        factor: v.co2 / 1000
    }
})

module.exports = waterwaysFactors;
