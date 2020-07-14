export default class Player {
  constructor(name, type) {
    this.playerName = name
    this.playerCards = []
    this.type = type
  }

  static attack(turn, $card, whoTurn = 'ВАШ') {
    const $table = document.querySelector('.table')
    const $actionBtn = document.querySelector('.actionBtn')
    $actionBtn.classList.add('active')

    const throwCard = ($c) => $table.appendChild($c)


    switch (turn) {
      case 'pcAttack':
        $actionBtn.innerHTML = `ХОДИТ ${whoTurn}`
        setTimeout(() => {
          throwCard($card)
          $actionBtn.innerHTML = `ВАШ ХОД`
        }, 1000)
        break

      case 'pcDefer':
        $actionBtn.innerHTML = `ХОДИТ ${whoTurn}`
        setTimeout(() => {
          throwCard($card)
          $actionBtn.innerHTML = 'БИТО!'
          $actionBtn.classList.toggle('discardState')
        }, 1000)
        break

      case 'playerAttack':
        throwCard($card)
        $actionBtn.innerHTML = 'ХОД!'
        // $actionBtn.classList.toggle('grabState')
        break

      case 'playerDefer':
        throwCard($card)
        $actionBtn.innerHTML = 'БИТО!'
        $actionBtn.classList.toggle('discardState')
        break

      default:
        $actionBtn.innerHTML = `${whoTurn} ХОД`
        $actionBtn.classList.remove('discardState', 'grabState')
        // $actionBtn.classList.toggle('grabState')
    }
  }

}