// chartGenerator.js
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

const width = 600;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function createPieChart() {
    const configuration = {
        type: 'pie',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
            datasets: [{
                data: [12, 19, 30, 50, 2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Sample Pie Chart',
                    font: { size: 20 }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    };

    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    fs.writeFileSync('./pie-chart.png', buffer);
    console.log("✅ Pie chart generated: pie-chart.png");
}

module.exports = { createPieChart };
