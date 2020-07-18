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
    this.isDiscard = false
  }


  create(playerName, pcName) {
    this.players.push(new Player(playerName, 'player'), new Player(pcName, 'pc'))
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
    // TODO АТАКА PC ====================
    if (
      this.turn === 'pc'
      && this.turnState === 'pcAttack'
    ) {
      // младшая не козырная карта, которой можно сходить
      const minCard = this.deck.findMinValCard(this.players[1].playerCards, this.deck.trumpOfGame)
      const $firstCard = function () {
        const $pcHandCards = document.querySelector('.pcHand').children
        if ($pcHandCards.length > 0) {
          for (let i = 0; i < $pcHandCards.length; i++) {
            if ($pcHandCards[i].dataset.rank === minCard.rank
              && $pcHandCards[i].dataset.suit === minCard.suit) {
              return $pcHandCards[i]
            }
          }
        } else {
          return $pcHandCards[0]
        }
      }()

      // делаем проверку возможных карт для защиты игроку
      this.getCardsForDefer($firstCard)

      // pc ходит этой картой
      Player.attack('pcAttack', $firstCard, this.players[1].playerName)

      // меняем ход на игрока для следующего хода
      this.turn = 'player'
      this.turnState = 'playerDefer'

      if (this.deck.cardsForDefer.length < 1) {
        console.log('игроку нечем крыть!')

        this.deck.takeCardsToHand(this.players[1], this.players)
        this.turn = 'pc'
        this.turnState = 'pcAttack'
      }
    }


    // TODO ЗАЩИТА PC ===================
    if (
      this.turn === 'pc'
      && this.turnState === 'pcDefer'
    ) {
      if (this.deck.cardsForDefer.length > 0) {
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

              // устанавливаем слушатель на кнопку для отправки карт в бито
              this.isDiscard = true
              this.deck.addCardsToDiscard(this.players)
            }

          }
        }

      } else {
        console.log('карты берет текущий игрок')
        // карты берет текущий игрок
        this.deck.takeCardsToHand(this.players[1], this.players)

        this.turn = 'player'
        this.turnState = 'playerAttack'
      }
    }
  }


  addListener($clickedCard) {
    const that = this
    $clickedCard.addEventListener('click', addCardToTable)
    function addCardToTable() {
      function playerTakeStep(turnState) {
        // сходить одной картой
        Player.attack(turnState, $clickedCard)
        $clickedCard.removeEventListener('click', addCardToTable)

        // // делаем проверку возможных карт защиты для pc
        // that.getCardsForDefer($clickedCard)

        // // устанавливаем слушатель на кнопку для отправки карт в бито
        // that.deck.addCardsToDiscard(that.players)
      }

      // TODO АТАКА PLAYER ====================
      // ходим любой картой
      if (
        that.turn === 'player'
        && that.turnState === 'playerAttack'
        && !that.isDiscard
      ) {
        playerTakeStep(that.turnState)

        // делаем проверку возможных карт защиты для pc
        that.getCardsForDefer($clickedCard)

        // меняем ход на pc для следующего хода
        that.turn = 'pc'
        that.turnState = 'pcDefer'

        // устанавливаем слушатель на кнопку для отправки карт в бито
        if (that.deck.cardsForDefer.length > 0) {
          that.isDiscard = true
          that.deck.addCardsToDiscard(that.players)
          that.pcTurn()

        } else {
          that.deck.takeCardsToHand(that.players[0], that.players)

          that.turn = 'player'
          that.turnState = 'playerAttack'
        }
      }


      // TODO ЗАЩИТА PLAYER ===================
      // определяем возможные карты для защиты которыми можно ответить
      if (
        that.turn === 'player'
        && that.turnState === 'playerDefer'
      ) {
        // if (that.deck.cardsForDefer.length > 0) {
          for (let c = 0; c < that.deck.cardsForDefer.length; c++) {
            if (
              that.deck.cardsForDefer[c].suit === $clickedCard.dataset.suit
              && that.deck.cardsForDefer[c].rank === $clickedCard.dataset.rank
            ) {
              playerTakeStep(that.turnState)

              that.showCardsForDefer({isShow: false})


              if (that.deck.cardsForDefer.length > 0) {
                // устанавливаем слушатель на кнопку для отправки карт в бито
                that.deck.addCardsToDiscard(that.players)
                that.pcTurn()

                that.isDiscard = true

                // после защиты переходим в наступление
                that.turn = 'player'
                that.turnState = 'playerAttack'

              } else {
                that.deck.takeCardsToHand(that.players[1], that.players)

                that.turn = 'pc'
                that.turnState = 'pcAttack'
              }
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

    this.showCardsForDefer({isShow: true})

    console.log('Карты, которыми можно крыть: ', ...this.deck.cardsForDefer)
  }


  showCardsForDefer(options) {
    // подсвечиваем карты которыми можно крыть
    setTimeout(() => {
      for (let $c = 0; $c < this.deck.$playerHand.children.length; $c++) {
        this.deck.$playerHand.children[$c].classList.remove('cardsForDefer')

        if (options.isShow) {
          for (let c = 0; c < this.deck.cardsForDefer.length; c++) {
            if (
              this.deck.cardsForDefer[c].suit === this.deck.$playerHand.children[$c].dataset.suit
              && this.deck.cardsForDefer[c].rank === this.deck.$playerHand.children[$c].dataset.rank
            ) {
              this.deck.$playerHand.children[$c].classList.add('cardsForDefer')
            }
          }
        }
      }
    }, 1000)
  }


  newRound() {
    if (
      this.players[0].playerCards.length > 0
      && this.players[1].playerCards.length > 0
    ) {
      this.deck.dealCard(this.players[0])
      this.deck.dealCard(this.players[1])
      this.isDiscard = false
      this.whoTurn()

    } else {
      document.querySelector('.game__body').style.display = 'none'
      document.querySelector('.winPage').style.display = 'flex'
      const winPageTitle = document.querySelector('.winPage__title')

      // у игрока остались карты?
      this.players[0].playerCards.length > 0
      ? winPageTitle.innerHTML = `GAME OVER! <br/> THE ${this.players[1].playerName} WIN!`
      : winPageTitle.innerHTML = `GAME OVER! <br/> YOU WIN!`
    }
  }

}


export default new Board()
