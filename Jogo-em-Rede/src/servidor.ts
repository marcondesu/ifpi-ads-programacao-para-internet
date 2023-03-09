import * as net from 'net'

// array que armazena as conexões
let sockets: net.Socket[] = []
let scoreboard: number[] = []
let value_1: number, value_2: number, result: number

const nova_jogada = (): void => {
   value_1 = Math.floor(Math.random() * (10 - 1 + 1)) + 1
   value_2 = Math.floor(Math.random() * (10 - 1 + 1)) + 1
   result = value_1 + value_2
}

const message_all = (message: string): void => {
   sockets.forEach((player) => {
      player.write(message)
   })
}

const server: net.Server = net.createServer((socket: net.Socket) => {
   console.log(`$ Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`)
   sockets.push(socket)
   scoreboard.push(0)

   if (sockets.length === 2) { // jogo inicia quando houver 2 clientes conectados
      message_all('Jogo iniciado.')

      nova_jogada()
      message_all(` ${value_1} + ${value_2} = ?`)

      for (let value of scoreboard) {
         if (value === 2) {
            message_all(`$ Jogador ${sockets[scoreboard.indexOf(2)]} venceu!`)
         }
      }
   }
   
   socket.on('data', (data: Buffer) => { // função que trata os dados enviados pelo cliente ao servidor
      if (data.toString() === `${result}`) {
         scoreboard[sockets.indexOf(socket)]++
         
         console.log(`$ (${socket.remotePort}) Pontuou`)

         nova_jogada()
         message_all(`\nNova rodada\n ${value_1} + ${value_2} = ?`)
      }
   })

   socket.on('end', () => { // função chamada ao cliente ser desconectado
      console.log(`$ Cliente desconectado: ${socket.remoteAddress}:${socket.remotePort}`)

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
