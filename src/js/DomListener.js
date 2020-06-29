import Board from '@/js/Board'

export default class DomListener {
  constructor() {
  }

  addListenerToCard(card, trump) {
    // const check = Table.checker(card)
    // if (!check) {
    // const ctx = this
    card.addEventListener('click', addCardToField)

    function addCardToField() {
      const table = document.querySelector('.table')
      table.appendChild(card)
      document.querySelector('.actionBtn').classList.remove('playerAttack')
      // DomListener.getPlayerCard(card)
      card.removeEventListener('click', addCardToField)

      // ctx.receive(card, 'player', 'pc')
      Board.cardChecker(card, 'player', trump)
    }
    // }
  }

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