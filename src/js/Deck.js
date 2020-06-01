import Card from '@/js/Card'
import Board from '@/js/Board'


export default class Deck extends Card {
  constructor() {
    super()
    this.deckCards = [] // карты в колоде
    this.issuedCards = [] // выданные на руки карты
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

  render(deck) { // отрисовываем колоду
    const $cardsDeck = document.querySelector('.deck')
    let trump
    let indent = 0

    deck.forEach((c, i, d) => {
      const card = super.renderCard({card: c})

      if (c === d[0]) { // первая карта в массиве
        trump = c
        card.classList.add('card__trump')
      } else {
        card.style.right = `${indent}em`
        card.style.bottom = `${indent}em`
        indent += 0.02
      }

      $cardsDeck.appendChild(card)
    })

    return trump
  }

  dealFirstCards(players) {
    // выдаем по 6 карт каждому игроку
    const playerOne = players[0]
    const playerTwo = players[1]
    playerOne.playerCards.push(...this.deckCards.slice(0, 6))
    playerTwo.playerCards.push(...this.deckCards.slice(6, 12))

    // удаляем 12 выданных карт из колоды и помещаем их в массив выданных карт
    this.issuedCards.push(...this.deckCards.splice(0, 12))

    // рендер колоды + 13 козырная карта
    const trumpCard = this.render(this.deckCards) // объект
    const trumpOfGame = document.querySelector('.trumpOfGame')
    trumpOfGame.classList.add(`${trumpCard.suit}`)

    // рендер карт игроков и определяем кто ходит первым
    const playerHand = playerOne.playerCards
    const pcHand = playerTwo.playerCards
    const firstMove = this.renderCard({
      playersHands: [playerHand, pcHand],
      trumpOfGame: trumpCard.suit
    })
    Board.defineFirstMove(firstMove, trumpCard)

    // ставим обработчик на карты игрока
    const playerHandCards = document.querySelector('.playerHand').children
    for (let i = 0; i < playerHandCards.length; i++) {
      super.addListenerToCard(playerHandCards[i])
    }
  }

  // deal() {  // выдаем 1 карту из начала колоды и помещаем ее в массив выданных карт
  //   let issueCard = this.deckCards.shift()
  //   this.issuedCards.push(issueCard)
  //   return issueCard
  // }

  findMinValCard(cards, trump) {
    return cards.filter(c => c.suit !== trump.suit)
      .reduce((prev, curr) => prev.value < curr.value ? prev : curr )
  }

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
