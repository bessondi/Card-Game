import Card from '@/js/Card'
import Board from '@/js/Board'


export default class Deck extends Card {
  constructor() {
    super()
    this.deckCards = []
    this.discard = []
    this.cardsForDefer = []
    this.trumpOfGame = undefined

    this.$deck = document.querySelector('.deck')
    this.$pcHand = document.querySelector('.pcHand')
    this.$playerHand = document.querySelector('.playerHand')
    this.$discard = document.querySelector('.discard')
    this.$trumpOfGame = document.querySelector('.trumpOfGame')
  }

  generate() {
    const suits = ['clubs', 'diamonds', 'spades', 'hearts'],
      ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
      values = [6, 7, 8, 9, 10, 11, 12, 13, 14]

    for (let s = 0; s < suits.length; s++) {
      for (let r = 0; r < ranks.length; r++) {
        this.deckCards.push(new Card(suits[s], ranks[r], values[r]))
      }
    }
  }

  shuffle() {
    let currentIndex = this.deckCards.length,
      randomIndex,
      tempValue

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      tempValue = this.deckCards[currentIndex]
      this.deckCards[currentIndex] = this.deckCards[randomIndex]
      this.deckCards[randomIndex] = tempValue
    }
  }

  renderDeck() {
    // отрисовываем колоду с отступом между картами
    let indent = 0

    this.deckCards.forEach((c, i, d) => {
      // отрисовываем карты которые не выдали игрокам
      const card = super.renderCard(c)

      if (c === d[d.length - 1]) { // последняя карта в массиве и дом-колоде
        card.classList.add('card__trump')
      } else {
        card.style.right = `${indent}em` // остальная колода
        card.style.bottom = `${indent}em`
        indent += 0.02
      }

      this.$deck.appendChild(card)
    })

    // TODO - добавить счетчик карт колоды
  }

  dealNewCards(players) {
    // выдаем карты каждому игроку из deckCards и рендерим их
    this.dealCard(players[0])
    this.dealCard(players[1])
  }

  dealCard(player) {
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

  trumpDefine() {
    // определяем козырь по последней карте в колоде
    this.trumpOfGame = this.deckCards[this.deckCards.length-1]

    this.$trumpOfGame.classList.add(`${this.trumpOfGame.suit}`)
  }

  firstTurnDefine(options) {
    const {hands, trumpOfGame} = options
    const [player, pc] = hands

    const minVal1 = []
    const minVal2 = []

    player.forEach(c => {
      c.suit === trumpOfGame ? minVal1.push(c.value) : null
    })
    pc.forEach(c => {
      c.suit === trumpOfGame ? minVal2.push(c.value) : null
    })

    const playerMinValueCard = Math.min(...minVal1)
    const pcMinValueCard = Math.min(...minVal2)

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

  findMinValCard(cards, trump) {
     if (cards.length > 1) {
       const cardsWithoutTrump = cards.filter(c => c.suit !== trump.suit)
       const cardsWithTrump = cards.filter(c => c.suit === trump.suit)

      return cardsWithoutTrump.length > 0
        ? cardsWithoutTrump.reduce((prev, curr) => prev.value < curr.value ? prev : curr, 0)
        : cardsWithTrump.reduce((prev, curr) => prev.value < curr.value ? prev : curr, 0)
    } else {
      return cards[0]
    }
  }

  addCardsToDiscard(playersHandCards){
    const that = this

    function addCardsToDiscard(){
      const $cardsInGame = document.querySelector('.table')

      // переносим карты-объекты из рук в массив бито
      const [player, pc] = playersHandCards
      const cards = Array.prototype.slice.call($cardsInGame.children)

      function compareCards(hand) {
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

  takeCardsToHand(target, players) {
    console.log('НЕТ КАРТ ДЛЯ ЗАЩИТЫ')
    console.log('target', target)

    const [player, pc] = players

    const $actionBtn = document.querySelector('.actionBtn')
    $actionBtn.innerHTML = `Take a Card`
    $actionBtn.classList.remove('discardState')
    $actionBtn.classList.add('grabState')

    function takeCards() {
      const $cardsInGame = document.querySelector('.table')
      const $playerHand = document.querySelector(`.playerHand`)
      const $pcHand = document.querySelector(`.pcHand`)

      // перебор карт на столе
      for (let $c = $cardsInGame.children.length-1; $c >= 0; $c--) {

        // перебор карт у текущего игрока
        target.playerCards.forEach((c, i) => {
          if (
            c.suit === $cardsInGame.children[$c].dataset.suit
            && c.rank === $cardsInGame.children[$c].dataset.rank
          ) {
            target.playerName === player.playerName
              ? pc.playerCards.push(...player.playerCards.splice(i, 1))
              : player.playerCards.push(...pc.playerCards.splice(i, 1))
          }
        })
      }

      // отправляем $карты в $руку
      while ($cardsInGame.childNodes.length > 0) {
        const newCard = $cardsInGame.childNodes[0]

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

    function removeCardNodes(parent) {
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
