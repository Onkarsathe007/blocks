// server.js
const express = require('express');
const path = require('path');
const { createPieChart } = require('./chartGenerator');

const app = express();
const PORT = 3000;

// Generate the chart before starting the server
createPieChart().then(() => {
    // Serve static files like images
    app.use('/static', express.static(path.join(__dirname)));

    // Route: Home
    app.get('/', (req, res) => {
        res.send(`<h1>Welcome to Pie Chart Server</h1>
                  <p>View the chart here: <a href="/chart">/chart</a></p>`);
    });

    // Route: Show the chart image
    app.get('/chart', (req, res) => {
        res.send(`
            <h2>Pie Chart</h2>
            <img src="/static/pie-chart.png" alt="Pie Chart" style="max-width: 100%; height: auto;">
        `);
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});
