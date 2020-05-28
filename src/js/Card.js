import Player from '@/js/Player'

export default class Card {
  constructor(suit, rank, value) {
    this.suit = suit;
    this.rank = rank;
    this.value = value;
  }

  renderCard(options) {
    if (options) {
      const {playersHands, trumpOfGame, card} = options

      const $card = document.createElement('div'),
            $top = document.createElement('div'),
            $bottom = document.createElement('div'),
            $rank = document.createElement('span'),
            $rankSuit = document.createElement('span'),
            $suit = document.createElement('div')

      if (playersHands) {
        const [playerOneCards, playerTwoCards] = playersHands

        const minVal1 = []
        const minVal2 = []

        playerOneCards.forEach((c, i, a) => {
          const handOne = document.querySelector('.playerHand')
          handOne.appendChild(this.renderCard({card: c}))

          c.suit === trumpOfGame ? minVal1.push(c.value) : null
        })
        playerTwoCards.forEach((c, i, a) => {
          const handTwo = document.querySelector('.pcHand')
          handTwo.appendChild(this.renderCard({card: c}))

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

      if (card) {
        $card.classList.add('card', 'card__shirt')
        $top.classList.add('card__top')
        $bottom.classList.add('card__bottom')

        $rank.innerHTML = card.rank
        $rank.classList.add('card__rank')
        $rankSuit.classList.add('card__rankSuit', card.suit)
        $suit.classList.add('card__suit', card.suit)

        const rankCloneBottom = $rank.cloneNode()
        const rankSuitCloneBottom = $rankSuit.cloneNode()
        rankCloneBottom.innerHTML = card.rank

        // data for listener
        $card.dataset.rank = card.rank
        $card.dataset.suit = card.suit
        $card.dataset.value = card.value

        $top.appendChild($rank)
        $top.appendChild($rankSuit)

        $bottom.appendChild(rankCloneBottom)
        $bottom.appendChild(rankSuitCloneBottom)

        $card.appendChild($top)
        $card.appendChild($suit)
        $card.appendChild($bottom)

        // $card.addEventListener('click', (e)=>{
        // eslint-disable-next-line max-len
        //   console.log(e.currentTarget.dataset.value, e.currentTarget.dataset.suit)
        // })

        return $card
      }
    } else {
      throw new Error('Cards is not has been received!')
    }
  }

  // defineFirstMove() {
  //
  // }

  addEvent(el) {
    el.addEventListener('click', (e) => {
      Player.move(e.currentTarget.dataset.value, e.currentTarget.dataset.suit)
    })
  }
}
