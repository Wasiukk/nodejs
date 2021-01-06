const http = require('http');
const app = require('./app');

// ustawienie portu
const port = process.env.port || 3000;

//stworzenie serwera
const server = http.createServer(app);

//uruchomienie serwera
server.listen(port);
