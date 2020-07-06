import Player from '@/js/Player'
import Deck from '@/js/Deck'
import DomListener from '@/js/DomListener'


class Board extends DomListener {
  constructor() {
    super()
    this.players = [] // игроки -> карты в []  .playerCards --- [0] - player, [1] - pc
    this.deck = new Deck() // колода -> карты в []  .deckCards   // выданные на руки []  .issuedCards
    // this.table = new Table() // стол
    this.turn = ''
  }

  create(playerName, pcName) {
    this.players.push(new Player(playerName), new Player(pcName))
    this.deck.generate()
    this.deck.shuffle()
    this.turn = this.deck.dealFirstCards(this.players)

    if (this.turn === 'pc') {
      this.pcTurn('firstRound')
    } else if (this.turn === 'player') {
      Player.attack()
    }
  }

  pcTurn(firstRound) {
    if (firstRound) {
      // младшая не козырная карта, которой можно сходить
      const minCard = this.deck.findMinValCard(this.players[1].playerCards, this.deck.trumpOfGame)
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
      this.cardsForDeferChecker($firstCard)

      // меняем ход на игрока для следующего хода
      this.turn = 'player'
    }

    // TODO добавить защиту картой для pc
    // for (let c = 0; c < this.deck.cardsForDefer.length; c++) {
    //   if (
    //     this.deck.cardsForDefer[c].suit === $clickedCard.dataset.suit
    //     && this.deck.cardsForDefer[c].rank === $clickedCard.dataset.rank
    //     && this.turn === 'player'
    //   ) {
    //     takeStep()
    //   }
    // }
  }

  playerTurn($clickedCard) {
    const that = this


    const $actionBtn = document.querySelector('.actionBtn')
    $actionBtn.addEventListener('click', addCardsToDiscard)
    function addCardsToDiscard(){

       // TODO добавить отправку карт в бито по нажатию экшн-кнопки
      // // отправляем карты в бито по нажатию кнопки
      // const cardsInGame = that.players[0].playerCards.filter(c => {
      //   // console.log(c.suit !== $clickedCard.dataset.suit)
      //
      //   return c.suit !== $clickedCard.dataset.suit
      //   && c.rank !== $clickedCard.dataset.rank
      // })
      // that.deck.discard.push(cardsInGame)
      // console.log(that.deck.discard)
      //
      // $actionBtn.removeEventListener('click', addCardsToDiscard)
    }


    $clickedCard.addEventListener('click', addCardToTable)
    function addCardToTable() {
      function takeStep() {
        // сходить одной картой
        Player.attack('player', $clickedCard)
        $clickedCard.removeEventListener('click', addCardToTable)

        // делаем проверку возможных карт защиты для pc
        that.cardsForDeferChecker($clickedCard)

        // меняем ход на pc для следующего хода
        that.turn = 'pc'

        // кроем карту игрока картой pc
        that.pcTurn()
      }

      // определяем возможные карты для защиты которыми можно ответить
      for (let c = 0; c < that.deck.cardsForDefer.length; c++) {
        if (
          that.deck.cardsForDefer[c].suit === $clickedCard.dataset.suit
          && that.deck.cardsForDefer[c].rank === $clickedCard.dataset.rank
          && that.turn === 'player'
        ) {
          takeStep()
        }
      }

      // или ходим любой картой
      if (that.deck.cardsForDefer.length === 0 && that.turn === 'player') {
        takeStep()
      }
    }
  }

  cardsForDeferChecker($card) {
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
        this.deck.trumpOfGame.suit === playerCards[c].suit
        && playerCards[c].value > $card.dataset.value

        // карты по масти рангом выше
        || $card.dataset.suit === playerCards[c].suit
        && playerCards[c].value > $card.dataset.value

        // выбрать козырные, если нет по масти рангом выше
        || $card.dataset.suit !== this.deck.trumpOfGame.suit
        && this.deck.trumpOfGame.suit === playerCards[c].suit
      ) {
        this.deck.cardsForDefer.push(playerCards[c])
      }
    }

    console.log(...this.deck.cardsForDefer)
    return this.deck.cardsForDefer
  }

}

export default new Board()
