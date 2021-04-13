import Board from '../ts/Board'
import {CardProperties} from './types'


export default class Card {
  suit: string;
  rank: string;
  value: number;

  constructor(suit: string, rank: string, value: number) {
    this.suit = suit;
    this.rank = rank;
    this.value = value;
  }

  renderCard(card: CardProperties, player?: string): HTMLElement {
    const $card: HTMLElement = document.createElement('div'),
      $top: HTMLElement = document.createElement('div'),
      $bottom: HTMLElement = document.createElement('div'),
      $rank: HTMLElement = document.createElement('span'),
      $rankSuit: HTMLElement = document.createElement('span'),
      $suit: HTMLElement = document.createElement('div')

    $card.classList.add('card', 'card__shirt')
    $top.classList.add('card__top')
    $bottom.classList.add('card__bottom')

    $rank.textContent = card.rank
    $rank.classList.add('card__rank')
    $rankSuit.classList.add('card__rankSuit', card.suit)
    $suit.classList.add('card__suit', card.suit)

    const rankCloneBottom: Node = $rank.cloneNode()
    const rankSuitCloneBottom = $rankSuit.cloneNode()
    rankCloneBottom.textContent = card.rank

    // dataset for listener
    $card.dataset.rank = card.rank
    $card.dataset.suit = card.suit
    $card.dataset.value = String(card.value)

    $top.appendChild($rank)
    $top.appendChild($rankSuit)

    $bottom.appendChild(rankCloneBottom)
    $bottom.appendChild(rankSuitCloneBottom)

    $card.appendChild($top)
    $card.appendChild($suit)
    $card.appendChild($bottom)

    if (player === 'player') {
      Board.addListener($card)
    }

    return $card
  }
}
