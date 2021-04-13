import Card from './Card'
import {CardProperties, PlayerProperties} from './types'
import Board from '../ts/Board'


export default class Deck extends Card {
  deckCards: Array<CardProperties>
  discard: Array<CardProperties>
  cardsForDefer: Array<CardProperties>
  trumpOfGame: CardProperties
  $deck: Element
  $pcHand: Element
  $playerHand: Element
  $discard: Element
  $trumpOfGame: Element

  constructor(suit?: string, rank?: string, value?: number) {
    super(suit, rank, value)
    this.deckCards = []
    this.discard = []
    this.cardsForDefer = []
    this.trumpOfGame = null

    this.$deck = document.querySelector('.deck')
    this.$pcHand = document.querySelector('.pcHand')
    this.$playerHand = document.querySelector('.playerHand')
    this.$discard = document.querySelector('.discard')
    this.$trumpOfGame = document.querySelector('.trumpOfGame')
  }

  generate(): void {
    const suits: Array<string> = ['clubs', 'diamonds', 'spades', 'hearts'],
      ranks: Array<string> = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
      values: Array<number> = [6, 7, 8, 9, 10, 11, 12, 13, 14]

    for (let s = 0; s < suits.length; s++) {
      for (let r = 0; r < ranks.length; r++) {
        this.deckCards.push(new Card(suits[s], ranks[r], values[r]))
      }
    }
  }

  shuffle(): void {
    let currentIndex: number = this.deckCards.length,
      randomIndex: number,
      tempValue: CardProperties

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      tempValue = this.deckCards[currentIndex]
      this.deckCards[currentIndex] = this.deckCards[randomIndex]
      this.deckCards[randomIndex] = tempValue
    }
  }

  renderDeck(): void {
    // отрисовываем колоду с отступом между картами
    let indent: number = 0

    this.deckCards.forEach((c, i, d) => {
      // отрисовываем карты которые не выдали игрокам
      const $card: HTMLElement = super.renderCard(c)

      if (c === d[d.length - 1]) { // последняя карта в массиве и дом-колоде
        $card.classList.add('card__trump')
      } else {
        $card.style.right = `${indent}em` // остальная колода
        $card.style.bottom = `${indent}em`
        indent += 0.02
      }

      this.$deck.appendChild($card)
    })

    // TODO - добавить счетчик карт колоды
  }

  dealNewCards(players: Array<PlayerProperties>): void {
    // выдаем карты каждому игроку из deckCards и рендерим их
    this.dealCard(players[0])
    this.dealCard(players[1])
  }

  dealCard(player: PlayerProperties): void {
    if (this.$deck.childNodes.length !== 0) {
      // выдаем новые карты пока не будет 6 карт на руках и рендерим их
      for (let i = player.playerCards.length; i < 6; i++) {
        player.playerCards.push(...this.deckCards.splice(0, 1))

        if (player.playerName === 'Player') {
          Board.addListener(this.$deck.childNodes[0])
          this.$playerHand.appendChild(this.$deck.childNodes[0])
        } else {
          this.$pcHand.appendChild(this.$deck.childNodes[0])
        }
      }
    }
  }

  trumpDefine(): void {
    // определяем козырь по последней карте в колоде
    this.trumpOfGame = this.deckCards[this.deckCards.length-1]
    this.$trumpOfGame.classList.add(`${this.trumpOfGame.suit}`)
  }

  firstTurnDefine(options: { hands: any[]; trumpOfGame: string }): string {
    const {hands, trumpOfGame} = options
    const [player, pc] = hands

    const minVal1: any[] = []
    const minVal2: any[] = []

    player.forEach((c: { suit: string; value: any }) => {
      c.suit === trumpOfGame ? minVal1.push(c.value) : null
    })
    pc.forEach((c: { suit: string; value: any }) => {
      c.suit === trumpOfGame ? minVal2.push(c.value) : null
    })

    const playerMinValueCard: number = Math.min(...minVal1)
    const pcMinValueCard: number = Math.min(...minVal2)

    if (playerMinValueCard === Infinity && pcMinValueCard === Infinity) {
      return 'player'
    } else if (playerMinValueCard === Infinity) {
      return 'pc'
    } else if (pcMinValueCard === Infinity) {
      return 'player'
    } else {
      return playerMinValueCard < pcMinValueCard ? 'player' : 'pc'
    }
  }

  findMinValCard(cards: CardProperties[], trump: { suit: any; rank?: string; value?: number }): CardProperties {
    if (cards.length > 1) {
      const cardsWithoutTrump: any[] = cards.filter(c => c.suit !== trump.suit)
      const cardsWithTrump: any[] = cards.filter(c => c.suit === trump.suit)

      return cardsWithoutTrump.length > 0
        ? cardsWithoutTrump.reduce((prev, curr) => prev.value < curr.value ? prev : curr, 0)
        : cardsWithTrump.reduce((prev, curr) => prev.value < curr.value ? prev : curr, 0)
    } else {
      return cards[0]
    }
  }

  addCardsToDiscard(playersHandCards: any[]): void {
    const that = this

    function addCardsToDiscard(): void {
      const $cardsInGame: Element = document.querySelector('.table')

      // переносим карты-объекты из рук в массив бито
      const [player, pc] = playersHandCards
      const cards: any[] = Array.prototype.slice.call($cardsInGame.children)

      function compareCards(hand: { suit?: string; rank?: string; value?: number; playerCards?: CardProperties[] }): void {
        for (let i = cards.length-1; i >= 0; i--) {
          hand.playerCards.forEach( (c, n) => {
            if (
              c.suit === cards[i].dataset.suit
              && c.rank === cards[i].dataset.rank
            ) {
              that.discard.push(...hand.playerCards.splice(n, 1))
            }
          })
        }
      }
      compareCards(player)
      compareCards(pc)

      // отправляем $карты в $бито по нажатию кнопки
      while ($cardsInGame.childNodes.length > 0) {
        // переносим 1ю (все) ноду карт в div.discard
        that.$discard.appendChild($cardsInGame.firstChild)
      }

      // начинаем новый уровень
      Board.newRound()
    }

    setTimeout(() => addCardsToDiscard(), 2000)
  }

  takeCardsToHand(target: { playerCards: CardProperties[]; playerName: string; type: string }, players: any[]) {
    console.log('НЕТ КАРТ ДЛЯ ЗАЩИТЫ')
    console.log('target', target)

    const [player, pc] = players

    const $actionBtn: Element = document.querySelector('.actionBtn')
    $actionBtn.innerHTML = `Take a Card`
    $actionBtn.classList.remove('discardState')
    $actionBtn.classList.add('grabState')

    function takeCards(): void {
      const $cardsInGame: HTMLCollection = document.querySelector('.table').children // живая коллекция
      const $playerHand: Element = document.querySelector(`.playerHand`)
      const $pcHand: Element = document.querySelector(`.pcHand`)

      // перебор карт на столе
      for (let $c = $cardsInGame.length - 1; $c >= 0; $c--) {

        // перебор карт у текущего игрока
        target.playerCards.forEach((c, i) => {
          if (
          // @ts-ignore
          c.suit === $cardsInGame[$c].dataset.suit && c.rank === $cardsInGame[$c].dataset.rank
          ) {
            target.playerName === player.playerName
              ? pc.playerCards.push(...player.playerCards.splice(i, 1))
              : player.playerCards.push(...pc.playerCards.splice(i, 1))
          }
        })
      }

      // отправляем $карты в $руку
      while ($cardsInGame.length > 0) {
        const newCard = $cardsInGame[0]

        if (target.type === 'pc') {
          Board.addListener(newCard)
        }

        // переносим 1ю (все) ноду карты
        target.type === 'player'
          ? $pcHand.appendChild(newCard)
          : $playerHand.appendChild(newCard)
      }

      // начинаем новый уровень
      Board.newRound()
    }

    setTimeout(() => takeCards(), 2500)
  }

  clear() {
    this.deckCards = []
    this.discard = []
    this.cardsForDefer = []
    this.trumpOfGame = undefined
    this.$trumpOfGame.classList.remove('clubs', 'diamonds', 'hearts', 'spades')

    function removeCardNodes(parent: Element): void {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    }

    removeCardNodes(this.$playerHand)
    removeCardNodes(this.$pcHand)
    removeCardNodes(this.$deck)
    removeCardNodes(this.$discard)
  }
}
