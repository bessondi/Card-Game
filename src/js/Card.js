import DomListener from '@/js/DomListener'
import Board from '@/js/Board'


export default class Card extends DomListener {
  constructor(suit, rank, value) {
    super()
    this.suit = suit;
    this.rank = rank;
    this.value = value;
  }

  renderCard(card, trump) {
    const $card = document.createElement('div'),
      $top = document.createElement('div'),
      $bottom = document.createElement('div'),
      $rank = document.createElement('span'),
      $rankSuit = document.createElement('span'),
      $suit = document.createElement('div')

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

    // dataset for listener
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

    if (trump) {
      // super.addListenerToCard($card, trump)
      Board.playerTurn($card, trump.suit)
    }

    return $card
  }

  // addCardsListener(trumpCard) {
  //   const $deckCards = document.querySelector('.deck').childNodes
  //   const $pcHandCards = document.querySelector('.pcHand').childNodes
  //   const $playerHandCards = document.querySelector('.playerHand').childNodes
  //
  //   for (let i = 0; i < $deckCards.length; i++) {
  //     super.addListenerToCard($deckCards[i], trumpCard.suit)
  //   }
  //   for (let i = 0; i < $pcHandCards.length; i++) {
  //     super.addListenerToCard($pcHandCards[i], trumpCard.suit)
  //   }
  //   for (let i = 0; i < $playerHandCards.length; i++) {
  //     super.addListenerToCard($playerHandCards[i], trumpCard.suit)
  //   }
  // }

  // addPlayerCardsListenerNew(playerCards, trumpCard) {
  //   const $playerHandCards = document.querySelector('.playerHand').children
  //   console.log(playerCards)
  //   console.log($playerHandCards)
  //   // playerCards.filter(c => {
  //   //     return c.rank === $playerHandCards.dataset.rank
  //   //     && c.suit === $playerHandCards.dataset.suit
  //   // })
  //
  //   for (let i = 0; i < $playerHandCards.length; i++) {
  //     // if (
  //     //   playerCards[i].rank === $playerHandCards.dataset.rank
  //     //   && playerCards[i].suit === $playerHandCards.dataset.suit
  //     // ) {
  //     super.addListenerToCard($playerHandCards[i], trumpCard.suit)
  //     // }
  //   }
  // }

}
