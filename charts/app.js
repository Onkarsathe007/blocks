const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

// Chart width and height in pixels
const width = 600;
const height = 600;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function createPieChart() {
    const configuration = {
        type: 'pie',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
            datasets: [{
                label: 'Color Distribution',
                data: [12, 19, 3, 5, 2],
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
                    font: {
                        size: 24
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    };

    // Render chart as a buffer
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    // Save image to disk
    fs.writeFileSync('./pie-chart.png', imageBuffer);
    console.log("Pie chart saved as pie-chart.png");
}

createPieChart();
