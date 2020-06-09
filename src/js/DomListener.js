// import Table from '@/js/Table'

export default class DomListener {
  constructor() {
  }

  addListenerToCard(card) {
    // const check = Table.checker(card)
    // if (!check) {
    card.addEventListener('click', addCardToField)

    function addCardToField() {
      const table = document.querySelector('.table')
      table.appendChild(card)
      document.querySelector('.actionBtn').classList.remove('playerAttack')
      // DomListener.getPlayerCard(card)
      card.removeEventListener('click', addCardToField)
    }

    // }
  }

  addListenerToTable(table) {
    const observer = new MutationObserver(nodeChangerListener)
    observer.observe(table, {childList: true})

    let card
    function nodeChangerListener(mutationRecords) {
      card = {
        value: mutationRecords[0].addedNodes[0].dataset.value,
        suit: mutationRecords[0].addedNodes[0].dataset.suit
      }
      // console.log(firstCard)
    }

    this.collector(card)
  }

  collector(card) {
    return card
  }

}