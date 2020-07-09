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

    // определяем козыри
    this.deck.trumpDefine()

    // рендерим колоду
    this.deck.renderDeck() // массив карт-объектов

    // выдаем игрокам карты
    this.deck.dealNewCards(this.players)

    this.turn = this.deck.firstTurnDefine({
      hands: [this.players[0].playerCards, this.players[1].playerCards],
      trumpOfGame: this.deck.trumpOfGame.suit
    })

    this.whoTurn()
  }


  pcTurn(options) {
    const {firstTurn, $attackCard} = options
    if (firstTurn) {
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
      console.log('BOARD ', this.turn)
    }

    // TODO добавить защиту картой для pc
    if ($attackCard) {
      console.log($attackCard)

      // TODO делаем проверку какой картой pc может ответить на основе атакующей

      // console.log(this.deck.cardsForDefer)
      //
      // for (let c = 0; c < this.deck.cardsForDefer.length; c++) {
      //   console.log(this.deck.cardsForDefer[c].rank, $attackCard.dataset.rank)
      //
      //   if (
      //     this.deck.cardsForDefer[c].suit === $attackCard.dataset.suit
      //     && this.deck.cardsForDefer[c].rank === $attackCard.dataset.rank
      //     && this.turn === 'pc'
      //   ) {
      //     console.log('this.deck.cardsForDefer[c]')
      //     // Player.pcDefer(this.deck.cardsForDefer[c])
      //     // this.turn = 'player'
      //   }
      // }
    }
  }


  addListener($clickedCard) {
    $clickedCard.addEventListener('click', addCardToTable)
    const that = this

    function addCardToTable() {

      function takeStep() {
        // сходить одной картой
        Player.attack('player', $clickedCard)
        $clickedCard.removeEventListener('click', addCardToTable)

        // делаем проверку возможных карт защиты для pc
        that.cardsForDeferChecker($clickedCard)

        // устанавливаем слушатель на кнопку для отправки карт в бито
        that.deck.addCardsToDiscard(that.players)
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

      // TODO проверить смену ходов
      // или ходим любой картой
      if (
        that.deck.cardsForDefer.length === 0
        || that.deck.discard.length !== 0
        && that.turn === 'player'
      ) {
        takeStep()

        // меняем ход на pc для следующего хода
        that.turn = 'pc'
        console.log('BOARD ', that.turn)

        // TODO кроем карту игрока картой pc
        that.pcTurn({$attackCard: $clickedCard})
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

    console.log('Карты, которыми можно крыть: '.toUpperCase(), ...this.deck.cardsForDefer)
    return this.deck.cardsForDefer
  }


  whoTurn() {
    console.log('BOARD ', this.turn)
    if (this.turn === 'pc') {
      this.pcTurn({firstTurn: true})
    } else if (this.turn === 'player') {
      Player.attack()
    }
  }


  // TODO новый раунд: проверяем чей ход, активируем кнопку
  newRound() {
    this.deck.dealCard(this.players[0])
    this.deck.dealCard(this.players[1])

    this.whoTurn()


  }

}

export default new Board()
