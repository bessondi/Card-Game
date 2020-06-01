// import Round from '@/js/Round'

export default class DomListener {
  constructor() {
  }

  addListenerToCard(card) {
    // const check = Round.checker(card)
    // if (!check) {
      card.addEventListener('click', addCardToField)
      // eslint-disable-next-line no-inner-declarations
      function addCardToField() {
        const table = document.querySelector('.table')
        table.appendChild(card)
        document.querySelector('.actionBtn').classList.remove('playerAttack')
        // DomListener.getPlayerCard(card)
        card.removeEventListener('click', addCardToField)
      }
    // }
  }

}