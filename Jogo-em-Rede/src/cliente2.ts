import * as net from 'net'
import * as readline from 'readline'

// interface de entrada e saída pelo terminal
const rline = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
})

const client: net.Socket = new net.Socket()

client.connect(3000, 'localhost', () => {
   client.write('Olá, eu sou o cliente 2')
})

client.on('connect', () => {
   console.log('$ Conectado ao servidor\n') // mensagem impressa no momento da conexão do cliente
})

client.on('data', (data: Buffer) => {
   console.log(`(Server) ${data.toString()}`) // mensagem recebida do servidor
})

client.on('end', () => {
   console.log('$ Desconectado do servidor')
})

// método chamado toda vez que uma nova linha for lida pelo terminal
rline.on('line', (input: string) => {
   if (input === '/end') { // se '/end' for digitado no terminal, encerra a conexão do cliente e a interface de i/o
      client.end()
      rline.close()
   } else { // caso contrário, envia o input para o servidor
      client.write(input)
   }
})
