import Card from '@/js/Card'
import Board from '@/js/Board'


export default class Deck extends Card {
  constructor() {
    super()
    this.deckCards = [] // карты в колоде
    this.discard = [] // бито
    this.cardsForDefer = [] // карты для защиты
    this.trumpOfGame = undefined

    this.$deck = document.querySelector('.deck')
    this.$pcHand = document.querySelector('.pcHand')
    this.$playerHand = document.querySelector('.playerHand')
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
        // console.log('выдал карту')
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

    const $trumpOfGame = document.querySelector('.trumpOfGame')
    $trumpOfGame.classList.add(`${this.trumpOfGame.suit}`)
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

    // console.log(`player - ${playerMinValueCard} // pc - ${pcMinValueCard}`)

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
    // TODO поправить сравнение всех козырей в руке в конце игры
    if (cards.length > 1) {
      return cards.filter(c => c.suit !== trump.suit)
        .reduce((prev, curr) => prev.value < curr.value ? prev : curr)
    } else {
      return cards[0]
    }
  }


  addCardsToDiscard(playersHandCards){
    // добавляем слушатель на экшн-кнопку для отправки карт в бито по нажатию
    const $actionBtn = document.querySelector('.actionBtn')
    // $actionBtn.innerHTML = 'БИТО!'
    $actionBtn.addEventListener('click', addCardsToDiscard)

    const that = this

    function addCardsToDiscard(){
      const $cardsInGame = document.querySelector('.table')
      const $discard = document.querySelector('.discard')

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
              // console.log('карты игрока ', hand.playerCards)
              // console.log('бито ', that.discard)
            }
          })
        }
      }
      compareCards(player)
      compareCards(pc)

      // отправляем $карты в $бито по нажатию кнопки
      while ($cardsInGame.childNodes.length > 0) {
        // переносим 1ю (все) ноду карт в div.discard
        $discard.appendChild($cardsInGame.childNodes[0])
      }

      // удаляем слушатель с кнопки
      $actionBtn.removeEventListener('click', addCardsToDiscard)

      // начинаем новый уровень
      Board.newRound()
    }

    // setTimeout(() => addCardsToDiscard(), 1000)
  }


  takeCardsToHand(target, players) { // {}, [{}, {}]
    // TODO сравнить массивы карт игроков с картами на $столе
    // TODO если карта своя - перенести только ноду
    // TODO если карта чужая - перенести и ноду и объект к игроку
    console.log('НЕТ КАРТ ДЛЯ ЗАЩИТЫ')

    const [player, pc] = players

    // добавляем слушатель на экшн-кнопку для отправки карт игроку
    const $actionBtn = document.querySelector('.actionBtn')
    $actionBtn.innerHTML = `БЕРУ`
    $actionBtn.classList.add('grabState')

    // const that = this
    function takeCards() {

      // console.log('B-playerC', player.playerCards)
      // console.log('B-pcC', pc.playerCards)

      const $cardsInGame = document.querySelector('.table')
      // const $hand = document.querySelector(`.${target.type}Hand`)
      const $playerHand = document.querySelector(`.playerHand`)
      const $pcHand = document.querySelector(`.pcHand`)

      // перебор карт на столе
      for (let $c = $cardsInGame.children.length-1; $c >= 0; $c--) {

        // перебор карт у текущего игрока
        target.playerCards.forEach((c, i) => {
          // console.log(c.suit, $cardsInGame.children[$c].dataset.suit)
          // console.log(c.rank, $cardsInGame.children[$c].dataset.rank)
          if (
            c.suit === $cardsInGame.children[$c].dataset.suit
            && c.rank === $cardsInGame.children[$c].dataset.rank
          ) {
            target.playerName === player.playerName
              ? pc.playerCards.push(...player.playerCards.splice(i, 1))
              : player.playerCards.push(...pc.playerCards.splice(i, 1))

            // console.log(target.playerCards.length)
          }
        })
      }

      // console.log('A-playerC', player.playerCards)
      // console.log('A-pcC', pc.playerCards)

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

      // удаляем слушатель с кнопки
      $actionBtn.removeEventListener('click', takeCards)

      // начинаем новый уровень
      Board.newRound()
    }

    // if (target.playerName === 'pc') {
      setTimeout(() => takeCards(), 3000)
    // } else {
    //   $actionBtn.addEventListener('click', takeCards)
    // }
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
