import * as net from 'net'

// array que armazena as conexões
let sockets: net.Socket[] = []
let scoreboard: number[] = []
let value_1: number, value_2: number, result: number

// gera novos valores aleatórios para cada rodada
const nova_jogada = (): void => {
   value_1 = Math.floor(Math.random() * (10 - 1 + 1)) + 1
   value_2 = Math.floor(Math.random() * (10 - 1 + 1)) + 1
   result = value_1 + value_2
}

// envia uma mensagem para todos os clientes conectados ao servidor
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
      message_all(` ${value_1} + ${value_2} = ?`) // envia os operandos da nova rodada para todos os jogadores
   }
   
   socket.on('data', (data: Buffer) => { // função que trata os dados enviados pelo cliente ao servidor
      if (data.toString() === `${result}`) { // se o jogador digitou o valor do resultado, venceu a rodada
         scoreboard[sockets.indexOf(socket)]++ // atualiza o array de pontuações na posição do vencedor
         
         console.log(`$ (${socket.remotePort}) Pontuou`)

         for (let value of scoreboard) { // percorre o array de pontuações
            if (value === 2) { // se o valor da posição corrente for igual a 2, o cliente na mesma posição no array de sockets é o vencedor
               message_all(`\n$ Jogador ${sockets[scoreboard.indexOf(2)].remotePort} venceu!`)

               sockets.forEach((player) => {
                  player.end() // desconecta todos jogadores
               })

               return // return para não ser gerada uma nova rodada
            }
         }

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
