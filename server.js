const express = require('express');
const http = require('http'); // Import the http module
const mongoose = require('mongoose');
const WebSocket = require('ws');
require('dotenv').config();

// Import your new routes
const rndRoutes = require('./routes/rnd');

// Create an Express app
const app = express();

// Use JSON middleware for Express
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/api', rndRoutes);

// Connect to the new MongoDB cluster
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to new MongoDB cluster successfully');

        // Create an HTTP server instead of relying on app.listen()
        const server = http.createServer(app); // Use http.createServer() with Express app

        // Start the HTTP server
        server.listen(process.env.PORT, () => {
            console.log('Express server is running on port', process.env.PORT);
        });

        // Create a WebSocket server
        const wss = new WebSocket.Server({ server });

        // WebSocket server is running
        console.log('WebSocket server is running');

        // Handle WebSocket connections
        wss.on('connection', function connection(ws) {
            console.log('Client connected');

            // Handle messages from clients
            ws.on('message', function incoming(message) {
                console.log('Received message:', message);
                
                // Parse JSON message (assuming it's sent as a string)
                try {
                    const jsonData = JSON.parse(message);
                    console.log('Parsed JSON:', jsonData);

                    // Handle the parsed JSON data
                    // For example, you can access its properties like jsonData.propertyName

                    // Broadcast the received message to all clients
                    wss.clients.forEach(function each(client) {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(message);
                        }
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            });

            // Handle disconnections
            ws.on('close', function close() {
                console.log('Client disconnected');
            });
        });
    })
    .catch((error) => {
        console.error('Error connecting to new MongoDB cluster:', error);
    });
