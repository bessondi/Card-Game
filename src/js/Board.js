import Player from '@/js/Player'
import Deck from '@/js/Deck'
import DomListener from '@/js/DomListener'
import Discard from '@/js/Discard'


class Board extends DomListener {
  constructor() {
    super()
    this.players = [] // игроки -> карты в []  .playerCards --- [0] - player, [1] - pc
    this.deck = new Deck() // колода -> карты в []  .deckCards   // выданные на руки []  .issuedCards
    // this.table = new Table() // стол
    this.discard = new Discard() // бито
    this.turn = ''
  }

  create(playerName, pcName) {
    this.players.push(new Player(playerName), new Player(pcName))
    this.deck.generate()
    this.deck.shuffle()
    const round = this.deck.dealFirstCards(this.players)

    this.turn = round.firstTurn

    if (this.turn === 'pc') {
      this.pcFirstTurn(round.trumpSuit)
    } else if (this.turn === 'player') {
      // this.playerTurn()
    }
  }

  cardsForDeferChecker($card, trumpSuit) {
    // console.log($card)
    // const $tableCards = document.querySelector('.table').childNodes.length

    this.deck.cardsForDefer = []
    let playerCards

    if (this.turn === 'player') {
      playerCards = this.players[1].playerCards
    } else if (this.turn === 'pc') {
      playerCards = this.players[0].playerCards
      // убрать выброшенную карту
      // playerCards = playerCards.filter( (c) => c.rank !== card.dataset.rank && c.value !== card.dataset.value )
    }

    for (let c = 0; c < playerCards.length; c++) {
      if (
        // козырные карты рангом выше
        trumpSuit === playerCards[c].suit
        && playerCards[c].value > $card.dataset.value

        // карты по масти рангом выше
        || $card.dataset.suit === playerCards[c].suit
        && playerCards[c].value > $card.dataset.value

        // выбрать козырные, если нет по масти рангом выше
        || $card.dataset.suit !== trumpSuit
        && trumpSuit === playerCards[c].suit
      ) {
        this.deck.cardsForDefer.push(playerCards[c])
      }
    }
    console.log(...this.deck.cardsForDefer)
    return this.deck.cardsForDefer

  }

  pcFirstTurn(trumpCard) {
    // младшая не козырная карта, которой можно сходить
    const minCard = this.deck.findMinValCard(this.players[1].playerCards, trumpCard)
    const $firstCard = function() {
      const $pcHandCards = document.querySelector('.pcHand').children
      for (let i = 0; i < $pcHandCards.length; i++) {
        if ($pcHandCards[i].dataset.rank === minCard.rank
          && $pcHandCards[i].dataset.suit === minCard.suit) {
          return $pcHandCards[i]
        }
      }
    }()

    // pc ходит этой картой
    // this.table.update('pc', 'attack', $firstCard)
    Player.attack('pc', $firstCard)

    // делаем проверку возможных карт для защиты игроку
    this.cardsForDeferChecker($firstCard, trumpCard.suit)

    // меняем ход на игрока для следующего хода
    this.turn = 'player'
  }

  playerTurn($clickedCard, deckTrumpCard) {

    const $table = document.querySelector('.table')
    const $actionBtn = document.querySelector('.actionBtn')

    $clickedCard.addEventListener('click', addCardToTable)
    const that = this

    function addCardToTable() {
      // console.log(that.turn)
      // console.log(this)

      for (let c = 0; c < that.deck.cardsForDefer.length; c++) {
        if (
          that.deck.cardsForDefer[c].suit === $clickedCard.dataset.suit
          && that.deck.cardsForDefer[c].rank === $clickedCard.dataset.rank
        ) {
          // console.log('возможные карты')
          $table.appendChild($clickedCard)
          $actionBtn.classList.remove('playerAttack')
          $clickedCard.removeEventListener('click', addCardToTable)
        }
      }

      if (that.deck.cardsForDefer.length === 0 && that.turn === 'player') {
        // console.log('любая карта')
        $table.appendChild($clickedCard)
        $actionBtn.classList.remove('playerAttack')
        $clickedCard.removeEventListener('click', addCardToTable)
        // that.turn === 'pc'
      }
    }
  }


  // addListenerToCard(card, trump) {
  //   // super.addListenerToCard(card, trump, this.cardsForDefer);
  //
  //   card.addEventListener('click', addCardToField)
  //   const ctx = this
  //
  //   function addCardToField() {
  //
  //     // const cardsForDefer =
  //     // Board.cardsForDeferChecker(card, 'player', trump)
  //     // console.log(cardsForDefer)
  //
  //     // if (cardsForDefer) {
  //     // const table = document.querySelector('.table')
  //     ctx.table.appendChild(card)
  //     document.querySelector('.actionBtn').classList.remove('playerAttack')
  //     // DomListener.getPlayerCard(card)
  //     card.removeEventListener('click', addCardToField)
  //     }
  // }
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
