export default class Player {
  constructor(name, type) {
    this.playerName = name
    this.playerCards = []
    this.type = type
  }

  static attack(turn, $card, whoTurn = 'Your') {
    const $table = document.querySelector('.table')
    const $actionBtn = document.querySelector('.actionBtn')
    $actionBtn.classList.add('active')

    const throwCard = ($c) => $table.appendChild($c)

    switch (turn) {
      case 'pcAttack':
        $actionBtn.innerHTML = `${whoTurn} Turn`
        setTimeout(() => {
          throwCard($card)
          $actionBtn.innerHTML = `Your Turn`
        }, 1000)
        break

      case 'pcDefer':
        $actionBtn.innerHTML = `${whoTurn} Turn`
        setTimeout(() => {
          throwCard($card)
          $actionBtn.innerHTML = 'Discard!'
          $actionBtn.classList.add('discardState')
        }, 1000)
        break

      case 'playerAttack':
        throwCard($card)
        $actionBtn.innerHTML = 'Turn!'
        break

      case 'playerDefer':
        throwCard($card)
        $actionBtn.innerHTML = 'Discard!'
        $actionBtn.classList.add('discardState')
        break

      default:
        $actionBtn.innerHTML = `${whoTurn} Turn`
        $actionBtn.classList.remove('discardState', 'grabState')
    }
  }

}