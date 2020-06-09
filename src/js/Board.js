import Player from '@/js/Player'
import Deck from '@/js/Deck'
import Table from '@/js/Table'
import DomListener from '@/js/DomListener'
// import Discard from '@/js/Discard'


class Board extends DomListener {
  constructor() {
    super()
    this.players = [] // игроки -> карты в []  .playerCards
    this.deck = new Deck() // колода -> карты в []  .deckCards   // выданные на руки []  .issuedCards
    this.table = new Table() // стол
    // this.discard = new Discard // бито
  }

  create(playerName, pcName) {
    this.players.push(new Player(playerName), new Player(pcName))

    this.deck.generate()
    this.deck.shuffle()

    const firstCards = this.deck.dealFirstCards(this.players)
    this.defineFirstMove(firstCards.firstMove, firstCards.trumpCard)
  }

  defineFirstMove(decision, trump) {

    // добавляем слушатель на игровую доску
    // const tableCard =
    //   super.addListenerToTable( document.querySelector('.table') )


    if (decision === 'pc') {
      console.log('FIRST-MOVE: ', decision)

      // младшая не козырная карта, которой можно сходить
      const min = this.deck.findMinValCard(this.players[1].playerCards, trump)

      // pc ходит этой картой
      const $firstCard = this.players[1].pcFirstStep(min)
      this.table.update(decision, 'attack', $firstCard)
      // this.pcTurn()
    }

    if (decision === 'player') {
      // const $choice = document.querySelector('.table').childNodes
      this.table.update(decision, 'waitAttack')
      // this.playerTurn()
    }
  }

  playerTurn() {

  }

  pcTurn() {

  }

  //


  // beginRound(table) {
  //   this.rounds.push(table)
  // }
  // action(who, action) {
  //   this.rounds.forEach(table => {
  //     table.update(who, action)
  //   })
  // }
  // finishRound(table) {
  //   this.rounds = this.rounds.filter(r => r !== table)
  // }
}

export default new Board()
