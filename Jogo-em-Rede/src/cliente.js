"use strict";
exports.__esModule = true;
var net = require("net");
var client = new net.Socket();
client.connect(3000, 'localhost', function () {
    console.log('Conectado ao servidor');
    client.write('Olá, eu sou o cliente 1');
});
client.on('data', function (data) {
    console.log("Mensagem do servidor: ".concat(data.toString()));
    client.write('Vou desconectar');
    client.end();
});
client.on('end', function () {
    console.log('Desconectado do servidor');
});
