export default class Player {
  constructor(name) {
    this.playerName = name;
    this.playerCards = [];
  }

  // pc take a step
  pcFirstStep(card) {
    const $pcHandCards = document.querySelector('.pcHand').children
    let result
    for (let i = 0; i < $pcHandCards.length; i++) {
      if ($pcHandCards[i].dataset.rank === card.rank
        && $pcHandCards[i].dataset.suit === card.suit) {
        result = $pcHandCards[i]
      }
    }
    return result
  }
}