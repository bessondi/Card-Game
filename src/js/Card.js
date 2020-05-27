export default class Card {
  constructor(suit, rank, value) {
    this.suit = suit;
    this.rank = rank;
    this.value = value;
  }

  renderCard(options) {
    if (options) {
      const {playersHand, card} = options

      const $card = document.createElement('div')
      const $top = document.createElement('div')
      const $bottom = document.createElement('div')
      const $rank = document.createElement('span')
      const $rankSuit = document.createElement('span')
      const $suit = document.createElement('div')

      if(playersHand) {
        const playerOneCards = playersHand[0]
        const playerTwoCards = playersHand[1]

        playerOneCards.forEach( c => {
          const handOne = document.querySelector('.playerHand')
          handOne.appendChild(this.renderCard( {card: c}))
        })
        playerTwoCards.forEach( c => {
          const handTwo = document.querySelector('.pcHand')
          handTwo.appendChild(this.renderCard( {card: c}))
        })
      }

      if (card) {
        $card.classList.add('card', 'card__shirt')
        $top.classList.add('card__top')
        $bottom.classList.add('card__bottom')

        $rank.innerHTML = card.rank
        $rank.classList.add('card__rank')
        $rankSuit.classList.add('card__rankSuit', card.suit.toLowerCase())
        $suit.classList.add('card__suit', card.suit.toLowerCase())

        const rankCloneBottom = $rank.cloneNode()
        const rankSuitCloneBottom = $rankSuit.cloneNode()
        rankCloneBottom.innerHTML = card.rank

        // data for listener
        $card.dataset.rank = card.rank
        $card.dataset.suit = card.suit.toLowerCase()
        $card.dataset.value = card.value

        $top.appendChild($rank)
        $top.appendChild($rankSuit)

        $bottom.appendChild(rankCloneBottom)
        $bottom.appendChild(rankSuitCloneBottom)

        $card.appendChild($top)
        $card.appendChild($suit)
        $card.appendChild($bottom)


        // const hand = document.querySelector('.playerHand')
        // console.log(hand)
        $card.addEventListener('click', (e)=>{
          console.log(e.currentTarget.dataset.value, e.currentTarget.dataset.suit)
        })


        return $card
      }

    } else {
      throw new Error('Cards is not has been received!')
    }
  }

}