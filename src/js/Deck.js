import Card from '@/js/Card'


export default class Deck extends Card {
  constructor() {
    super()
    this.deckCards = [] // карты в колоде
    this.issuedCards = [] // выданные на руки карты
  }

  generate() {
    const suits = ['Clubs', 'Diamonds', 'Spades', 'Hearts'],
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

  render(deck) {  // отрисовываем колоду
    const $cardsDeck = document.querySelector('.deck')
    let trump
    let indent = 0

    deck.forEach((c, i, d) => {
      const card = super.renderCard( {card: c} )

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


  // clear() {
  //   this.deckCards = []
  // }
  //
  // deal() {  // выдаем 1 карту из начала колоды и помещаем ее в массив выданных карт
  //   let issueCard = this.deckCards.shift()
  //   this.issuedCards.push(issueCard)
  //   return issueCard
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
