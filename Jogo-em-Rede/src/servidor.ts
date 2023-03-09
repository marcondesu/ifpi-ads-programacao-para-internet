import * as net from 'net'

// array que armazena as conexões
let sockets: net.Socket[] = []

const server: net.Server = net.createServer((socket: net.Socket) => {
   console.log(`$ Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`)
   sockets.push(socket)
   
   socket.on('data', (data: Buffer) => { // função que trata os dados enviados pelo cliente ao servidor
      console.log(`(${socket.remotePort}): ${data.toString()}`) // mensagem do cliente é mostrada no terminal
   })

   socket.on('end', () => { // função chamada ao cliente ser desconectado
      console.log(`$ Cliente ${socket.remoteAddress}:${socket.remotePort} desconectado\n---------------------------`)

      // remover cliente do array ao ser desconectado
      const index = sockets.indexOf(socket)
      if (index !== -1) {
         sockets.splice(index, 1) // remove a conexão desconectada do array de sockets
      }
   })
})

server.listen(3000, () => { // servidor está 'ouvindo' na porta 3000 (clientes se conectarão nela)
   console.log('$ Servidor inicializado na porta 3000\n')
})
