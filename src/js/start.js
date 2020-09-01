import board from '@/js/Board'


export function startNewGame(e) {
  board.clear()

  const randomName = Math.floor(Math.random() * Math.floor(10))

  fetch(`https://jsonplaceholder.typicode.com/users/${ randomName || 1 }`)
    .then(response => response.json())
    .then(data => {
      board.create('Player', `${data.username}`)
    })
    .catch(() => {
      board.create('Player', 'AI')
    })

  e.target.removeEventListener('click', startNewGame)

  document.querySelector('.startPage').style.display = 'none'
  document.querySelector('.winPage').style.display = 'none'
  document.querySelector('.game__body').style.display = 'grid'
}