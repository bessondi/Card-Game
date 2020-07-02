import Card from '@/js/Card'
// import Board from '@/js/Board'


export default class Deck extends Card {
  constructor() {
    super()
    this.deckCards = [] // карты в колоде
    // this.issuedCards = [] // выданные карты
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

  dealCards(player, count) {
    // if (player === player[0]) {
    //   super.addListenerToCard(playerHandCards[i], trumpCard.suit)
    // }

    player.playerCards.push(...this.deckCards.splice(0, count))

    // удаляем 12 выданных карт из колоды и помещаем их в массив выданных карт
    // this.issuedCards.push(...this.deckCards.splice(0, 12))
  }

  renderDeck(deck) { // отрисовываем колоду
    const $cardsDeck = document.querySelector('.deck')
    let indent = 0

    deck.forEach((c, i, d) => {
      const card = super.renderCard(c)

      if (c === d[0]) { // первая карта в массиве, дом-колоде (визуально последняя)
        card.classList.add('card__trump')
      } else {
        card.style.right = `${indent}em` // остальная колода
        card.style.bottom = `${indent}em`
        indent += 0.02
      }

      $cardsDeck.appendChild(card)
    })
  }

  dealFirstCards(players) {
    // выдаем по 6 карт каждому игроку из deckCards
    const [playerOne, playerTwo] = players
    this.dealCards(playerOne, 6)
    this.dealCards(playerTwo, 6)

    // рендерим колоду
    this.renderDeck(this.deckCards) // массив карт-объектов

    // определяем козырь по первой (13й) карте после всех выданных
    const trumpCard = this.deckCards[0]
    const $trumpOfGame = document.querySelector('.trumpOfGame')
    $trumpOfGame.classList.add(`${trumpCard.suit}`)

    // определяем кто ходит первым
    const firstTurn = this.firstTurnDefine({
      hands: [playerOne.playerCards, playerTwo.playerCards],
      trumpOfGame: trumpCard.suit
    })

    // ставим обработчик на карты игрока
    super.addPlayerCardsListener(trumpCard)

    return {firstTurn: firstTurn, trumpSuit: trumpCard}
  }

  firstTurnDefine(options) {
    const {hands, trumpOfGame} = options
    const [playerOneCards, playerTwoCards] = hands

    const minVal1 = []
    const minVal2 = []

    playerOneCards.forEach(c => {
      document.querySelector('.playerHand')
        .appendChild(this.renderCard(c))

      c.suit === trumpOfGame ? minVal1.push(c.value) : null
    })
    playerTwoCards.forEach(c => {
      document.querySelector('.pcHand')
        .appendChild(this.renderCard(c))

      c.suit === trumpOfGame ? minVal2.push(c.value) : null
    })

    const playerMinValueCard = Math.min(...minVal1)
    const pcMinValueCard = Math.min(...minVal2)

    // console.log(`Di - ${playerMinValueCard} // Pc - ${pcMinValueCard}`)

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
    return cards.filter(c => c.suit !== trump.suit)
      .reduce((prev, curr) => prev.value < curr.value ? prev : curr)
  }


  // deal() { // выдаем 1 карту из начала колоды и помещаем ее в массив выданных карт
  //   const issueCard = this.deckCards.shift()
  //   this.issuedCards.push(issueCard)
  //   return issueCard
  // }
  //
  // clear() {
  //   this.deckCards = []
  // }
  //
  // replace() { // добавляем в начало колоды первую карту из выданных
  //   console.log(this.deckCards.unshift(this.issuedCards.shift()))
  // }
  //
  // print() {
  //   if (!this.deckCards.length) {
  //     console.log('Колода не сформирована')
  //   } else {
  //     for (let c = 0; c < this.deckCards.length; c++) {
  //       console.log(this.deckCards[c])
  //     }
  //   }
  // }

}
