import Deck from '@/js/Deck'
import Player from '@/js/Player'


class Board {
  constructor() {
    this.players = [] // игроки
    this.state = {}
  }

  create(playerName, pcName) {
    this.players.push(new Player(playerName), new Player(pcName))

    const deck = new Deck()
    deck.generate()
    deck.shuffle()

    this.draw(deck)
  }

  draw(deck) {
    // выдаем по 6 карт каждому игроку
    const playerOne = this.players[0]
    const playerTwo = this.players[1]
    playerOne.playerCards.push(...deck.deckCards.slice(0, 6))
    playerTwo.playerCards.push(...deck.deckCards.slice(6, 12))

    // удаляем 12 выданных карт из колоды и помещаем их в массив выданных карт
    deck.issuedCards.push(...deck.deckCards.splice(0, 12))

    // рендер колоды + 13 козырная карта
    const trumpCard = deck.render(deck.deckCards) // объект
    const trumpOfGame = document.querySelector('.trumpOfGame')
    trumpOfGame.classList.add(`${trumpCard.suit}`)

    const playerHand = playerOne.playerCards
    const pcHand = playerTwo.playerCards

    // рендер карт игроков
    const firstMove = deck.renderCard({
      playersHands: [playerHand, pcHand],
      trumpOfGame: trumpCard.suit
    })

    this.defineFirstMove(firstMove)

    // ставим обработчик на карты игрока
    const playerHandCards = document.querySelector('.playerHand').children

    for (let i = 0; i < playerHandCards.length; i++) {
      deck.addEvent(playerHandCards[i])
    }

    // const firstStep = this.firstStep(playerHand, pcHand)
    // console.log(firstStep)

    // ===========================
    // console.log('выданные карты: ', deck.issuedCards)
    // console.log('оставшиеся карты в колоде: ', deck.deckCards)
    // console.log('козыри: ', trumpCard)
    // console.log('козыри: ', trumpCard.suit)
    // console.log('козыри: ', trumpCard)
  }

  defineFirstMove(decision) {

    if (decision === 'pc') {
      console.log('FIRST-MOVE: ', decision)

    }
  }
}

export default new Board()
