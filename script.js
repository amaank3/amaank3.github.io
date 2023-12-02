let currentYearIndex = 2; // Start from the third element (year 1990) as 1970 and 1980 are already included
const years = ['1970 Population', '1980 Population', '1990 Population', '2000 Population', '2010 Population', '2015 Population', '2020 Population', '2022 Population'];
const dataUrl = 'https://raw.githubusercontent.com/amaank3/amaank3.github.io/main/world_population.csv';

document.getElementById('refreshButton').addEventListener('click', function() {
    if (currentYearIndex < years.length) {
        updateVisualization();
    }
});

function transformData(data, year) {
    return data.map(d => ({
        'Continent': d.Continent,
        'Population': d[year],
        'Year': year.split(' ')[0] // Extracts the year number from the string
    }));
}

function updateVisualization() {
    vegaEmbed('#vis', {
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
    });

    currentYearIndex++;
}

// Initial load with 1970 and 1980 data
updateVisualization();




