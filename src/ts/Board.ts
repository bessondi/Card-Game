import Player from '../ts/Player'
import Deck from '../ts/Deck'
import {CardProperties, PlayerProperties} from './types'
import {startNewGame} from './start'


class Board {
  players: PlayerProperties[]
  deck: Deck
  turn: string
  turnState: string
  isDiscard: boolean

  constructor() {
    this.players = []
    this.deck = new Deck()
    this.turn = ''
    this.turnState = '' // pcAttack : pcDefer -- playerAttack : playerDefer
    this.isDiscard = false
  }

  create(playerName: string, pcName: string): void {
    this.players.push(new Player(playerName, 'player'), new Player(pcName, 'pc'))
    this.getNames(this.players)
    this.deck.generate()
    this.deck.shuffle()

    // определяем козыри
    this.deck.trumpDefine()

    // рендерим колоду
    this.deck.renderDeck()

    // выдаем игрокам карты
    this.deck.dealNewCards(this.players)

    // определяем кто ходит первым
    this.turn = this.deck.firstTurnDefine({
      hands: [this.players[0].playerCards, this.players[1].playerCards],
      trumpOfGame: this.deck.trumpOfGame.suit
    })
    this.turnState = `${this.turn}Attack`

    this.whoTurn()

    // document.querySelector<HTMLElement>('.game__body').addEventListener('click', () => console.log(this.turn, this.turnState))
  }

  whoTurn(): void {
    if (this.turn === 'pc') {
      this.turnState = `${this.turnState}`
      this.pcTurn()
    } else if (this.turn === 'player') {
      this.turnState = `${this.turnState}`
      Player.attack()
    }
  }

  pcTurn(): void {
    // АТАКА PC ====================
    if (
      this.turn === 'pc'
      && this.turnState === 'pcAttack'
    ) {
      // младшая не козырная карта, которой можно сходить
      const minCard = this.deck.findMinValCard(this.players[1].playerCards, this.deck.trumpOfGame)

      const $firstCard = function(): Element {
        const $pcHandCards: HTMLElement[] = Array.prototype.slice.call(document.querySelector('.pcHand').children)

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
        this.deck.takeCardsToHand(this.players[1], this.players)
        this.turn = 'pc'
        this.turnState = 'pcAttack'
      }
    }


    // ЗАЩИТА PC ===================
    if (
      this.turn === 'pc'
      && this.turnState === 'pcDefer'
    ) {
      if (this.deck.cardsForDefer.length > 0) {
        for (let c = 0; c < this.deck.cardsForDefer.length; c++) {
          const pcCards: HTMLElement[] = Array.prototype.slice.call(this.deck.$pcHand.children)

          for (let $c = 0; $c < pcCards.length; $c++) {

            if (
              pcCards[$c].dataset.suit === this.deck.cardsForDefer[c].suit
              && pcCards[$c].dataset.rank === this.deck.cardsForDefer[c].rank
              && this.turnState === 'pcDefer'
            ) {

              // сходить одной картой
              Player.attack('pcDefer', pcCards[$c], this.players[1].playerName)

              // после защиты меняем состояние хода pc на атаку
              this.turn = 'pc'
              this.turnState = 'pcAttack'

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

  addListener($clickedCard: any): void {
    const that = this
    $clickedCard.addEventListener('click', addCardToTable)

    function addCardToTable(): void {
      function playerTakeStep(turnState: string): void {
        // сходить одной картой
        Player.attack(turnState, $clickedCard)
        $clickedCard.removeEventListener('click', addCardToTable)
      }

      // АТАКА PLAYER ====================
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

  getCardsForDefer($card: any): void {
    this.deck.cardsForDefer = []
    let playerCards: CardProperties[]

    if (this.turn === 'player') {
      playerCards = this.players[1].playerCards
    } else if (this.turn === 'pc') {
      playerCards = this.players[0].playerCards
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

    // сортируем карты от меньшего к большему - сперва обычные, потом козыри
    this.deck.cardsForDefer.sort((a, b): number => {
      return a.value - b.value
    })
    // this.deck.cardsForDefer.sort((a, b) => {
      // const trump = this.deck.trumpOfGame.suit
      // console.log(a.suit, b.suit)
      //
      // if (a.suit === trump && b.suit !== trump) return 1
      //   else if ()
      // else return 0
      // else if (a.suit === trump && b.suit !== trump)
    //   return a.suit === trump > b.suit !== trump
    // })

    this.showCardsForDefer({isShow: true})

    console.log('Карты, которыми можно крыть: ', ...this.deck.cardsForDefer)
  }

  showCardsForDefer(options: { isShow: boolean }): void {
    // подсвечиваем карты которыми можно крыть
    setTimeout(() => {
      const playerCards: HTMLElement[] = Array.prototype.slice.call(this.deck.$playerHand.children)

      for (let $c = 0; $c < this.deck.$playerHand.children.length; $c++) {
        playerCards[$c].classList.remove('cardsForDefer')

        if (options.isShow) {
          for (let c = 0; c < this.deck.cardsForDefer.length; c++) {
            if (
              this.deck.cardsForDefer[c].suit === playerCards[$c].dataset.suit
              && this.deck.cardsForDefer[c].rank === playerCards[$c].dataset.rank
            ) {
              playerCards[$c].classList.add('cardsForDefer')
            }
          }
        }
      }
    }, 1000)
  }

  getNames(players: PlayerProperties[]): void {
    const [player, pc] = players
    // console.log(player, pc)

    const $playerName: Element = document.querySelector('.playerName')
    const $pcName: Element = document.querySelector('.pcName')

    if ($playerName.firstChild) {
      $playerName.removeChild($playerName.firstChild)
    } else {
      $playerName.insertAdjacentHTML('afterbegin', `
          <span>${player.playerName}</span>
      `)
    }

    if ($pcName.firstChild) {
      $pcName.removeChild($pcName.firstChild)
    } else {
      $pcName.insertAdjacentHTML('afterbegin', `
          <span>${pc.playerName}</span>
      `)
    }
  }

  newRound(): void {
    if (
      this.players[0].playerCards.length > 0
      && this.players[1].playerCards.length > 0
    ) {
      this.deck.dealCard(this.players[0])
      this.deck.dealCard(this.players[1])
      this.isDiscard = false
      this.whoTurn()

    } else {
      document.querySelector<HTMLElement>('.game__body').style.display = 'none'
      document.querySelector<HTMLElement>('.winPage').style.display = 'flex'
      document.querySelector<HTMLElement>('.winPage__newGameBtn').addEventListener('click', startNewGame)

      // кто выйграл?
      const winPageTitle: HTMLElement = document.querySelector('.winPage__title')
      this.players[0].playerCards.length === 0
      && this.players[1].playerCards.length === 0
        ? winPageTitle.innerHTML = `GAME OVER! <br/><br/> DRAW IN THE GAME!`
        : this.players[0].playerCards.length > 0
        ? winPageTitle.innerHTML = `GAME OVER! <br/><br/> THE ${this.players[1].playerName.toUpperCase()} WIN!`
        : winPageTitle.innerHTML = `GAME OVER! <br/><br/> YOU WIN!`
    }
  }

  clear(): void {
    if (this.players.length !== 0) {
      this.deck.clear()

      this.players[0].playerCards = []
      this.players[1].playerCards = []

      this.deck.deckCards = []
      this.deck.discard = []
      this.deck.trumpOfGame = undefined

      this.turn = ''
      this.turnState = ''
      this.isDiscard = false
    }
  }
}


export default new Board()
