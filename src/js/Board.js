import Player from '@/js/Player'
import Deck from '@/js/Deck'
import Table from '@/js/Table'
import DomListener from '@/js/DomListener'
import Discard from '@/js/Discard'


class Board extends DomListener {
  constructor() {
    super()
    this.players = [] // игроки -> карты в []  .playerCards
    this.deck = new Deck() // колода -> карты в []  .deckCards   // выданные на руки []  .issuedCards
    this.table = new Table() // стол
    this.discard = new Discard() // бито
    this.turn = ''
  }

  create(playerName, pcName) {
    this.players.push(new Player(playerName), new Player(pcName))

    this.deck.generate()
    this.deck.shuffle()

    const firstCards = this.deck.dealFirstCards(this.players)
    // this.table.turn = firstCards.firstMove
    // this.defineFirstMove(firstCards.firstMove, firstCards.trumpCard)
    // this.table.register(this.players)

    const firstMove = firstCards.firstMove
    const trumpSuit = firstCards.trumpCard

    if (firstMove === 'pc') {
      // console.log('FIRST-MOVE: ', decision)
      this.pcTurn(firstMove, trumpSuit)
    }
    // else if (firstMove === 'player') {
    //   this.playerTurn(firstMove)
    // }
  }

  // playerTurn(decision) {
  //   this.table.update(decision, 'attack')
  // }

  pcTurn(decision, trump) {
    // младшая не козырная карта, которой можно сходить
    const min = this.deck.findMinValCard(this.players[1].playerCards, trump)

    // pc ходит этой картой
    const $firstCard = this.players[1].pcFirstStep(min)
    this.table.update(decision, 'attack', $firstCard)
    this.cardChecker($firstCard, 'pc', trump.suit)
  }

  cardChecker(card, p, trump) {

    console.log(card)
    // console.log(trump)
    const cardsForDefer = []
    let playerCards

    if (p === 'player') {
      playerCards = this.players[1].playerCards
    } else if (p === 'pc') {
      playerCards = this.players[0].playerCards

      // убрать выброшенную карту
      // playerCards = playerCards.filter( (c) => c.rank !== card.dataset.rank && c.value !== card.dataset.value )
    }

    console.log( playerCards )

    for (let c = 0; c < playerCards.length; c++) {
      if (
        // козырные карты рангом выше
        trump === playerCards[c].suit
        && playerCards[c].value > card.dataset.value

        // карты по масти рангом выше
        || card.dataset.suit === playerCards[c].suit
        && playerCards[c].value > card.dataset.value

        // выбрать козырные, если нет по масти рангом выше
        || card.dataset.suit !== trump
        && trump === playerCards[c].suit
      ) {
        cardsForDefer.push(playerCards[c])
      }
    }
    console.log(cardsForDefer)
    return cardsForDefer
  }


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
