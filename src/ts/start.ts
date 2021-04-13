import board from '../ts/Board'


export function startNewGame(e: any): void {
  board.clear()

  const randomNameNum: number = Math.floor(Math.random() * Math.floor(10))

  fetch(`https://jsonplaceholder.typicode.com/users/${randomNameNum || 1}`)
    .then(response => response.json())
    .then(data => {
      board.create('Player', `${data.username}`)
    })
    .catch(() => {
      board.create('Player', 'AI')
    })

  e.target.removeEventListener('click', startNewGame)

  document.querySelector<HTMLElement>('.startPage').style.display = 'none'
  document.querySelector<HTMLElement>('.winPage').style.display = 'none'
  document.querySelector<HTMLElement>('.game__body').style.display = 'grid'
}

export default function init() {
  document.querySelector<HTMLElement>('.startPage__newGameBtn').addEventListener('click', startNewGame)
}
