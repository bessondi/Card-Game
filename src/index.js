import '@/scss/index.scss'
import board from '@/js/Board'


board.create('Di', 'Ai')

console.log( board.players[1].playerCards, board.players[0].playerCards)