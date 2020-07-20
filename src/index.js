import '@/scss/index.scss'
import board from '@/js/Board'


(function() {
  const startBtn = document.querySelector('.startPage__newGameBtn')
  startBtn.addEventListener('click', startNewGame)

  function startNewGame() {
    const randomName = Math.floor(Math.random() * Math.floor(10))

    fetch(`https://jsonplaceholder.typicode.com/users/${ randomName || 1 }`)
      .then(response => response.json())
      .then(data => {
        board.create('Player', `${data.username}`)
        // console.log( board.players )
        // console.log( board.players[1].playerCards, board.players[0].playerCards)
      })
      .catch(() => {
        board.create('Player', 'AI')
      })

    startBtn.removeEventListener('click', startNewGame)

    document.querySelector('.startPage').style.display = 'none'
    document.querySelector('.game__body').style.display = 'grid'
  }
})()

// TODO - счетчики карт и надписи
