let currentYearIndex = 0; 
const years = ['1970 Population', '1980 Population', '1990 Population', '2000 Population', '2010 Population', '2015 Population', '2020 Population', '2022 Population'];
const dataUrl = 'https://raw.githubusercontent.com/amaank3/amaank3.github.io/main/world_population.csv';

document.getElementById('refreshButton').addEventListener('click', function() {
    updateBarChart(years[currentYearIndex]);
    updateLineChart();
    currentYearIndex = (currentYearIndex + 1) % years.length; 
});
function updateBarChart(year) {
    console.log('Updating Bar Chart for year:', year);
    const spec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        description: 'Population by continent for ' + year,
        data: { url: dataUrl },
        transform: [
            {
                aggregate: [{ op: 'sum', field: year, as: 'TotalPopulation' }],
                groupby: ['Continent']
            }
        ],
        mark: 'bar',
        encoding: {
            x: { field: 'Continent', type: 'nominal' },
            y: { field: 'TotalPopulation', type: 'quantitative', scale: { domain: [0, 5000000000] } },
            color: { field: 'Continent', type: 'nominal' }
        }
    };
    vegaEmbed('#barChart', spec);
}
function updateLineChart() {
    console.log('Updating Line Chart to include year index:', currentYearIndex);
    const spec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        description: 'Population over years',
        data: { url: dataUrl },
        transform: [
            ...Array(currentYearIndex + 1).fill().map((_, i) => ({
                filter: `datum['${years[i]}'] != null`,
                calculate: `'${years[i].split(' ')[0]}'`, as: 'Year'
            })),
            { fold: years.slice(0, currentYearIndex + 1), as: ['Year', 'Population'] },
            { filter: { field: 'Population', gt: 0 } }
        ],
        mark: 'line',
        encoding: {
            x: { field: 'Year', type: 'ordinal' },
            y: { field: 'Population', type: 'quantitative', aggregate: 'sum' },
            color: { field: 'Continent', type: 'nominal' }
        }
    };
    vegaEmbed('#lineChart', spec);
}
updateBarChart(years[currentYearIndex]);
updateLineChart();





