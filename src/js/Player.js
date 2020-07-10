export default class Player {
  constructor(name) {
    this.playerName = name
    this.playerCards = []
  }

  static attack(turn, $card, whoTurn = 'ВАШ') {
    const $table = document.querySelector('.table')
    const $actionBtn = document.querySelector('.actionBtn')
    $actionBtn.classList.add('active')

    switch (turn) {
      case 'pc':
        $actionBtn.innerHTML = `ХОД \n${whoTurn}`
        setTimeout(() => {
          $table.appendChild($card)
          $actionBtn.innerHTML = 'ВЗЯТЬ'
        }, 1000)
        break

      case 'player':
        $table.appendChild($card)
        $actionBtn.innerHTML = 'БИТО!'
        break

      case 'pcDefer':
        $actionBtn.innerHTML = `ХОД \n${whoTurn}`
        setTimeout(() => {
          $table.appendChild($card)
          $actionBtn.innerHTML = 'БИТО!'
        }, 1000)
        break

      default: $actionBtn.innerHTML = `ХОД ${whoTurn}` // 'ВАШ ХОД'

        break
    }
  }

  takeCard() {
  // TODO если нет карт для защиты - берем карту экшн-кнопкой

  }

  // static pcDefer($card) {
  //   console.log($card)
  // }

}