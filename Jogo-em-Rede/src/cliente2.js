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
const readline = __importStar(require("readline"));
const rline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const client = new net.Socket();
client.connect(3000, 'localhost', () => {
    client.write('Olá, eu sou o cliente 2');
});
client.on('connect', () => {
    console.log('$ Conectado ao servidor\n');
});
client.on('data', (data) => {
    console.log(`(Server) ${data.toString()}`); // mensagem recebida do servidor
});
client.on('end', () => {
    console.log('$ Desconectado do servidor');
});
rline.on('line', (input) => {
    if (input === '/end') {
        client.end();
        rline.close();
    }
    else {
        client.write(input);
    }
});
