import Player from '@/js/Player'
import Deck from '@/js/Deck'
import DomListener from '@/js/DomListener'


class Board extends DomListener {
  constructor() {
    super()
    this.players = [] // игроки [0]-player, [1]-pc  -->  карты в [] - players[n].playerCards
    this.deck = new Deck() // колода -> карты - deck.deckCards = []  /  выданные на руки - deck.issuedCards = []
    this.turn = '' // кто ходит
    this.turnState = '' // состояние хода: pcAttack : pcDefer -- playerAttack : playerDefer
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

    // определяем кто ходит первым
    this.turn = this.deck.firstTurnDefine({
      hands: [this.players[0].playerCards, this.players[1].playerCards],
      trumpOfGame: this.deck.trumpOfGame.suit
    })
    this.turnState = `${this.turn}Attack`

    this.whoTurn()

    document.querySelector('.game__body').addEventListener('click', () => console.log(this.turn, this.turnState))
  }


  whoTurn() {
    if (this.turn === 'pc') {
      this.turnState = `${this.turnState}`
      this.pcTurn()
    } else if (this.turn === 'player') {
      this.turnState = `${this.turnState}`
      Player.attack()
    }
  }


  pcTurn() {

    // АТАКА PC =====================
    if (this.turn === 'pc' && this.turnState === 'pcAttack') {
      // младшая не козырная карта, которой можно сходить
      const minCard = this.deck.findMinValCard(this.players[1].playerCards, this.deck.trumpOfGame)
      const $firstCard = function () {
        const $pcHandCards = document.querySelector('.pcHand').children
        for (let i = 0; i < $pcHandCards.length; i++) {
          if ($pcHandCards[i].dataset.rank === minCard.rank
            && $pcHandCards[i].dataset.suit === minCard.suit) {
            return $pcHandCards[i]
          }
        }
      }()

      // делаем проверку возможных карт для защиты игроку
      this.getCardsForDefer($firstCard)

      // pc ходит этой картой
      // this.table.update('pc', 'attack', $firstCard)
      Player.attack('pc', $firstCard, this.players[1].playerName)

      // меняем ход на игрока для следующего хода
      this.turn = 'player'
      this.turnState = 'playerDefer'
      // console.log('АТАКА PC')
      // console.log('ХОДИТ ', this.turn, this.turnState)
    }
    // }

    // ЗАЩИТА PC ===================
    if (this.turn === 'pc' && this.turnState === 'pcDefer') {

      for (let c = 0; c < this.deck.cardsForDefer.length; c++) {
        for (let $c = 0; $c < this.deck.$pcHand.children.length; $c++) {

          if (
            this.deck.$pcHand.children[$c].dataset.suit === this.deck.cardsForDefer[c].suit
            && this.deck.$pcHand.children[$c].dataset.rank === this.deck.cardsForDefer[c].rank
            && this.turnState === 'pcDefer'
          ) {

            // делаем проверку возможных карт защиты для pc
            // console.log('$DEFER CARD ', this.deck.$pcHand.children[$c].dataset.rank, this.deck.$pcHand.children[$c].dataset.suit)

            // сходить одной картой
            Player.attack('pcDefer', this.deck.$pcHand.children[$c], this.players[1].playerName)

            // после защиты меняем состояние хода pc на атаку
            this.turn = 'pc'
            this.turnState = 'pcAttack'
            // console.log('ЗАЩИТА PC')
            // console.log('ХОДИТ ', this.turn, this.turnState)

            // this.pcTurn({isAttack: true})

            // устанавливаем слушатель на кнопку для отправки карт в бито
            this.deck.addCardsToDiscard(this.players)
          }
        }
      }
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

        // // делаем проверку возможных карт защиты для pc
        // that.getCardsForDefer($clickedCard)

        // // устанавливаем слушатель на кнопку для отправки карт в бито
        // that.deck.addCardsToDiscard(that.players)
      }

      // АТАКА PLAYER =====================
      // ходим любой картой
      if (
        // TODO проверить смену ходов, добавить стэйт хода
        // that.deck.cardsForDefer.length === 0
        // || that.deck.discard.length !== 0 &&
        that.turn === 'player'
        && that.turnState === 'playerAttack'
      ) {
        takeStep()

        // делаем проверку возможных карт защиты для pc
        that.getCardsForDefer($clickedCard)

        // меняем ход на pc для следующего хода
        that.turn = 'pc'
        that.turnState = 'pcDefer'
        // console.log('АТАКА Player')
        // console.log('ХОДИТ ', that.turn, that.turnState)

        // устанавливаем слушатель на кнопку для отправки карт в бито
        that.deck.addCardsToDiscard(that.players)

        // TODO кроем карту игрока картой pc
        that.pcTurn()
      }


      // ЗАЩИТА PLAYER ===================
      // определяем возможные карты для защиты которыми можно ответить
      if (
        that.turn === 'player'
        && that.turnState === 'playerDefer'
      ) {
        for (let c = 0; c < that.deck.cardsForDefer.length; c++) {
          if (
            that.deck.cardsForDefer[c].suit === $clickedCard.dataset.suit
            && that.deck.cardsForDefer[c].rank === $clickedCard.dataset.rank
          ) {
            takeStep()

            // после защиты переходим в наступление
            that.turn = 'player'
            that.turnState = 'playerAttack'
            // console.log('ЗАЩИТА Player')
            // console.log('ХОДИТ ', that.turn, that.turnState)

            // устанавливаем слушатель на кнопку для отправки карт в бито
            that.deck.addCardsToDiscard(that.players)

            that.pcTurn()
          }
        }
      }

    }
  }


  getCardsForDefer($card) {
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
    // console.log('Карты, ДО: '.toUpperCase(), ...this.deck.cardsForDefer)

    // сортируем карты от меньшего к большему - сперва обычные, потом козыри
    // const sortBy = [{prop: 'value', direction: 1}, {prop: 'suit', direction: -1}]
    // this.deck.cardsForDefer.sort(function(a, b){
    //   let i = 0, result = 0;
    //
    //   while (i < sortBy.length && result === 0) {
    //     result = sortBy[i].direction * (
    //         a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1
    //         : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1
    //         : 0)
    //       )
    //     i++
    //   }
    //   return result
    // })

    // сортируем карты от меньшего к большему - сперва обычные, потом козыри
    // TODO корректно отсортировать по мастям
    this.deck.cardsForDefer.sort((a, b) => {
      return a.value - b.value
    })
    this.deck.cardsForDefer.sort((a, b) => {
      return a.suit === this.deck.trumpOfGame.suit > b.suit !== this.deck.trumpOfGame.suit
    })

    console.log('Карты, которыми можно крыть: '.toUpperCase(), ...this.deck.cardsForDefer)
  }


  newRound() {
    this.deck.dealCard(this.players[0])
    this.deck.dealCard(this.players[1])

    this.whoTurn()
  }

}

export default new Board()
