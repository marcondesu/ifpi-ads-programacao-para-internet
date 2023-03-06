import * as net from 'net'

// cria uma instância do servidor TCP
// recebe uma função que é executada sempre que um novo cliente se conecta ao servidor
const server: net.Server = net.createServer()

server.on('connection', (socket: net.Socket) => {
   console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`)
   socket.write('Olá, cliente!\n')
   
   server.on('data', (data: Buffer) => {
      console.log(`Mensagem do cliente: ${data.toString()}`)
   })
   
   server.on('end', () => {
      console.log('Cliente desconectado\n')
   })
})

server.listen(3000, () => {
   console.log('Servidor inicializado na porta 3000')
})
