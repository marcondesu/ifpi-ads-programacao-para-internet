"use strict";
exports.__esModule = true;
var net = require("net");
// cria uma instância do servidor TCP
// recebe uma função que é executada sempre que um novo cliente se conecta ao servidor
var server = net.createServer();
server.on('connection', function (socket) {
    console.log("Cliente conectado: ".concat(socket.remoteAddress, ":").concat(socket.remotePort));
    socket.write('Olá, cliente!\n');
    server.on('data', function (data) {
        console.log("Mensagem do cliente: ".concat(data.toString()));
    });
    server.on('end', function () {
        console.log('Cliente desconectado\n');
    });
});
server.listen(3000, function () {
    console.log('Servidor inicializado na porta 3000');
});
