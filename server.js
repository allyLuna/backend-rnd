const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const WebSocket = require('ws');
require('dotenv').config();

const rndRoutes = require('./routes/rnd');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use('/api', rndRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to new MongoDB cluster successfully');

        const server = http.createServer(app);

        server.listen(process.env.PORT, () => {
            console.log('Express server is running on port', process.env.PORT);
        });

        const wss = new WebSocket.Server({ server });

        console.log('WebSocket server is running');

        wss.on('connection', function connection(ws) {
            console.log('Client connected');

            ws.on('message', function incoming(message) {
                console.log('Received message:', message);

                try {
                    const jsonData = JSON.parse(message);
                    console.log('Parsed JSON:', jsonData);

                    // Broadcast the received message to all clients
                    const jsonString = JSON.stringify(jsonData);

                    wss.clients.forEach(function each(client) {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(jsonString, (error) => {
                                if (error) {
                                    console.error('Error sending message:', error);
                                } else {
                                    console.log('Message sent successfully');
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            });

            ws.on('close', function close() {
                console.log('Client disconnected');
            });
        });

    })
    .catch((error) => {
        console.error('Error connecting to new MongoDB cluster:', error);
    });
