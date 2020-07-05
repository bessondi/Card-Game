export default class Player {
  constructor(name) {
    this.playerName = name;
    this.playerCards = [];
  }

  static attack(who, $card) {
    const $table = document.querySelector('.table')
    const $actionBtn = document.querySelector('.actionBtn')

    if (who === 'pc') {
      // const cards = []

      setTimeout(() => {
        $table.appendChild($card)
        // cards.push(card)

        $actionBtn.innerHTML = 'ВЗЯТЬ'
        $actionBtn.classList.toggle('active')

        // this.statusOfGame = 'attack'
      }, 200)
    }

    // if (who === 'player') {}

    }

  static defer(who, $card) {

  }

  // pc take a step
  // pcFirstStep(card) {
  //   const $pcHandCards = document.querySelector('.pcHand').children
  //   let result
  //   for (let i = 0; i < $pcHandCards.length; i++) {
  //     if ($pcHandCards[i].dataset.rank === card.rank
  //       && $pcHandCards[i].dataset.suit === card.suit) {
  //       result = $pcHandCards[i]
  //     }
  //   }
  //   return result
  // }
  // playerFirstStep() {
  //
  // }
  // send(message, to) {
  //   this.table.send(message, this, to)
  // }
  //
  // receive(message, from) {
  //   console.log(`${from.name} => ${this.name}: ${message}`)
  // }

}