"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
// array que armazena as conexões
let sockets = [];
let scoreboard = [];
let value_1, value_2, result;
const nova_jogada = () => {
    value_1 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    value_2 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    result = value_1 + value_2;
};
const message_all = (message) => {
    sockets.forEach((player) => {
        player.write(message);
    });
};
const server = net.createServer((socket) => {
    console.log(`$ Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);
    sockets.push(socket);
    scoreboard.push(0);
    if (sockets.length === 2) { // jogo inicia quando houver 2 clientes conectados
        message_all('Jogo iniciado.');
        nova_jogada();
        message_all(` ${value_1} + ${value_2} = ?`);
        for (let value of scoreboard) {
            if (value === 2) {
                message_all(`$ Jogador ${sockets[scoreboard.indexOf(2)]} venceu!`);
            }
        }
    }
    socket.on('data', (data) => {
        if (data.toString() === `${result}`) {
            scoreboard[sockets.indexOf(socket)]++;
            console.log(`$ (${socket.remotePort}) Pontuou`);
            nova_jogada();
            message_all(`\nNova rodada\n ${value_1} + ${value_2} = ?`);
        }
    });
    socket.on('end', () => {
        console.log(`$ Cliente desconectado: ${socket.remoteAddress}:${socket.remotePort}`);
        // remover cliente do array ao ser desconectado
        const index = sockets.indexOf(socket);
        if (index !== -1) {
            sockets.splice(index, 1); // remove a conexão desconectada do array de sockets
        }
    });
});
server.listen(3000, () => {
    console.log('$ Servidor inicializado na porta 3000\n');
});
