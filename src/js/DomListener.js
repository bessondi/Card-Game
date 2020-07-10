// import Board from '@/js/Board'

export default class DomListener {
  constructor() {
  }

  // addListenerToCard($clickedCard, deckTrumpCard) {
  //   $clickedCard.addEventListener('click', addCardToTable)
  //
  //
  //   function addCardToTable() {
  //     // const cardsForDefer = Board.getCardsForDefer($clickedCard, deckTrumpCard.suit) // arr {}
  //     // const $table = document.querySelector('.table')
  //     // const $actionBtn = document.querySelector('.actionBtn')
  //     //
  //     // // console.log($card)
  //     // console.log($clickedCard, deckTrumpCard)
  //
  //     // for (let c = 0; c < cardsForDefer.length; c++) {
  //       // console.log(cardsForDefer[c].suit === $card.dataset.suit)
  //       // console.log(cardsForDefer[c].rank === $card.dataset.rank)
  //
  //       // $table.appendChild($card)
  //       // $actionBtn.classList.remove('playerAttack')
  //       // $card.removeEventListener('click', addCardToTable)
  //
  //       // if (
  //       //   cardsForDefer[c].suit === $card.dataset.suit
  //       //   && cardsForDefer[c].rank === $card.dataset.rank
  //       // ) {
  //       //   console.log('возможные карты')
  //       //
  //       //   $table.appendChild($card)
  //       //   $actionBtn.classList.remove('playerAttack')
  //       //   $card.removeEventListener('click', addCardToTable)
  //
  //       // }
  //       // else {
  //       //   console.log('любая карта')
  //       //
  //       //   $table.appendChild($card)
  //       //   $actionBtn.classList.remove('playerAttack')
  //       //   $card.removeEventListener('click', addCardToTable)
  //       // }
  //
  //     // }
  //   }
  // }

  // addListenerToTable(table) {
  //   const observer = new MutationObserver(nodeChangerListener)
  //   observer.observe(table, {childList: true})
  //
  //   let card
  //   function nodeChangerListener(mutationRecords) {
  //     card = {
  //       value: mutationRecords[0].addedNodes[0].dataset.value,
  //       suit: mutationRecords[0].addedNodes[0].dataset.suit
  //     }
  //     // console.log(firstCard)
  //   }
  //
  //   this.collector(card)
  // }
  //
  // collector(card) {
  //   return card
  // }
  // receive(card, from, to) {
  //   // console.log(card.dataset.value)
  //   // console.log(card.dataset.suit)
  //
  //   return {
  //     value: card.dataset.value,
  //     suit: card.dataset.suit,
  //     from: from,
  //     to: to
  //   }
  // }

}