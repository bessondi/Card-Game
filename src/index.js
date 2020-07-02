import '@/scss/index.scss'
import board from '@/js/Board'


(function() {
  const randomName = Math.floor(Math.random() * Math.floor(10))

  fetch(`https://jsonplaceholder.typicode.com/users/${ randomName || 1 }`)
    .then(response => response.json())
    .then(data => {

      board.create('Player', `${ data.username || 'Ai' }`)
      // console.log( board.players, board.players )
      // console.log( board.players[1].playerCards, board.players[0].playerCards)
    })
})()


// TODO  2 карты - attack & defer
// TODO  бито
// TODO  кнопки действия
// TODO  счетчики карт и надписи
// TODO  стартовую страницу с кнопкой начать


