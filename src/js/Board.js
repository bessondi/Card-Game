import Player from '@/js/Player'
import Deck from '@/js/Deck'
import Round from '@/js/Round'
import DomListener from '@/js/DomListener'
// import Discard from '@/js/Discard'


class Board extends DomListener {
  constructor() {
    super()
    this.players = [] // игроки
    this.deck = new Deck() // колода
    this.rounds = [] // раунды
    // this.discard = new Discard // бито
  }

  create(playerName, pcName) {
    this.players.push(new Player(playerName), new Player(pcName))

    this.deck.generate()
    this.deck.shuffle()
    this.deck.dealFirstCards(this.players)
  }

  defineFirstMove(decision, trump) {

    if (decision === 'pc') {
      console.log('FIRST-MOVE: ', decision)

      // младшая не козырная карта, которой можно сходить
      const min = this.deck.findMinValCard(this.players[1].playerCards, trump)

      // pc ходит этой картой
      const $firstCard = this.players[1].pcFirstStep(min)
      this.beginRound( new Round($firstCard) )
      this.action(decision, 'attack')
    }

    if (decision === 'player') {
      const $choice = document.querySelector('.table').childNodes
      this.beginRound( new Round($choice) )
      this.action(decision, 'attack')
    }
  }

  //

  beginRound(round) {
    this.rounds.push(round)
  }
  action(who, action) {
    this.rounds.forEach(round => {
      round.update(who, action)
    })
  }
  // finishRound(round) {
  //   this.rounds = this.rounds.filter(r => r !== round)
  // }


}

export default new Board()

// ============================================
// const game = new Board()
// const r1 = new Round()
//
// game.beginRound(r1)
// game.action('')
// console.log(r1.round)
// export default game
// ============================================
