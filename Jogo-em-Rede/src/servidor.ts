import * as net from 'net'
import * as fs from 'fs'

// array que armazena as conexões
const connectedUsers = new Map<net.Socket, string>();
let sockets: net.Socket[] = []
let matches: number[] = []
let counter = 1 // quantidade de partidas/rodadas
let value_1: number, value_2: number, result: number

// gera novos valores aleatórios para cada rodada
const nova_jogada = (): void => {
   value_1 = Math.floor(Math.random() * (10 - 1 + 1)) + 1
   value_2 = Math.floor(Math.random() * (10 - 1 + 1)) + 1
   result = value_1 + value_2
}

// envia uma mensagem para todos os clientes conectados ao servidor
const message_all = (message: string, origin?: net.Socket): void => {
   sockets.forEach((player) => {
      if (player === origin) return
      player.write(message)
   })
}

const get_matchesStr = (): string => {
   let matchesStr: string = ''

   sockets.forEach((player) => {
      if (player == sockets[sockets.length - 1]) {
         matchesStr += `${connectedUsers.get(player)}-${matches[sockets.indexOf(player)]}`
      } else {
         matchesStr += `${connectedUsers.get(player)}-${matches[sockets.indexOf(player)]}-`
      }
   })

   return matchesStr
}

const get_matchesInfo = (): string => {
   let info = ''
   let lines = fs.readFileSync('./matches.txt').toString().split('\n')
   let i = 0
   let b = 1
   
   while (lines[i] != null) {
      const line = lines[i].split('-')
      info += `\nPartida ${i + 1}\n`

      for (let a = 0; a < line.length; a += 2){
         info += `(${line[a]}): ${line[b]}\n`
         b += 2
      }

      i++
      b = 1
   }

   return info
}

const server: net.Server = net.createServer((socket: net.Socket) => {
   console.log(`$ Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`)
   connectedUsers.set(socket, `${socket.remotePort}`)
   sockets.push(socket)
   matches.push(0)

   if (sockets.length >= 2) { // jogo inicia quando houver 2 clientes conectados
      message_all(`Partida ${counter}`)

      nova_jogada()
      message_all(` ${value_1} + ${value_2} = ?`) // envia os operandos da nova rodada para todos os jogadores
   }
   
   socket.on('data', (data: Buffer) => { // função que trata os dados enviados pelo cliente ao servidor
      if (data.toString().indexOf('/nickname') === 0) {
         let nickname = data.toString().replace('/nickname ', '')
         
         message_all(`Jogador "${connectedUsers.get(socket)}" agora é "${nickname}"`, socket)
         connectedUsers.set(socket, nickname)
      } else if (data.toString() === '/partidas') { // se o jogador digitar '/partidas'
         socket.write(get_matchesInfo()) // envia uma string contendo as informações das partidas
      } else {
         message_all(`${connectedUsers.get(socket)}: ${data.toString()}`, socket)
      }

      if (data.toString() === `${result}`) { // se o jogador digitou o valor do resultado, venceu a rodada
         matches[sockets.indexOf(socket)]++ // atualiza o array de pontuações na posição do vencedor
         
         console.log(`$ (${socket.remotePort}) Pontuou`)

         for (let value of matches) { // percorre o array de pontuações
            if (value === 2) { // se o valor da posição corrente for igual a 2, o cliente na mesma posição no array de sockets é o vencedor
               message_all(`\n$ ${connectedUsers.get(sockets[matches.indexOf(2)])} venceu!`, socket)
               socket.write('Você venceu!')
               let matches_string = get_matchesStr()

               try{
                  let file = fs.readFileSync('./matches.txt', 'utf-8') // conteúdo do arquivo .txt
                  
                  if (file.charAt(file.length - 1) !== '\n') { // se o último caractere do arquivo não for uma quebra de linha, adiciona
                     file += '\n'
                  }

                  fs.writeFileSync('./matches.txt', file + matches_string) // atualiza os placares
               } catch (error) {
                  console.error(`Erro: ${error}`)
               }

               sockets.forEach((player) => {
                  player.end() // desconecta todos jogadores
               })

               matches_string = ''
               matches = [] // esvazia vetor do placar

               return // return para não ser gerada uma nova rodada
            }
         }

         nova_jogada()
         message_all(`\Partida ${counter} \n ${value_1} + ${value_2} = ?`)
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
