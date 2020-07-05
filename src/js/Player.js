export default class Player {
  constructor(name) {
    this.playerName = name;
    this.playerCards = [];
  }

  static attack(turn, $card) {
    const $table = document.querySelector('.table')
    const $actionBtn = document.querySelector('.actionBtn')
    $actionBtn.classList.add('active')

    switch (turn) {
      case 'pc':
        setTimeout(() => {
          $table.appendChild($card)
          $actionBtn.innerHTML = 'ВЗЯТЬ'
        }, 200)
        break

      case 'player':
        $table.appendChild($card)
        $actionBtn.innerHTML = 'БИТО!'
        break

      default: $actionBtn.innerHTML = 'ВАШ ХОД!'
        break
    }

    // if (turn === 'waiting') {
    //   $actionBtn.innerHTML = 'ВАШ ХОД!'
    //   $actionBtn.classList.toggle('active')
    // }
    //
    // if (turn === 'pc') {
    //   setTimeout(() => {
    //     $table.appendChild($card)
    //     $actionBtn.innerHTML = 'ВЗЯТЬ'
    //   }, 200)
    // }
    //
    // if (turn === 'player') {
    //   $table.appendChild($card)
    //   $actionBtn.innerHTML = 'БИТО!'
    //   $actionBtn.classList.toggle('active')
    // }
  }

}