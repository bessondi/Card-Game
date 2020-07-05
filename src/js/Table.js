import DomListener from '@/js/DomListener'

export default class Table extends DomListener {
  constructor() {
    super()

    // this.cardsForDefer = []

    // this.table = document.querySelector('.table')
    // this.cards = this.table.getElementsByClassName('card')
    //
    // this.playerCards = []
    // this.pcCards = []
  }


  // update(who, action, card) {
  //
  //   // super.addListenerToTable( this.table )
  //   const actionBtn = document.querySelector('.actionBtn')
  //
  //   if (who === 'pc') {
  //     switch (action) {
  //       case 'attack':
  //         setTimeout(() => {
  //           this.table.appendChild(card)
  //
  //           // this.receiver = super.receive(card, who, 'player')
  //           this.turn = 'player'
  //           this.pcCards.push(card)
  //
  //           actionBtn.innerHTML = 'ВЗЯТЬ'
  //           actionBtn.classList.toggle('active')
  //
  //           // this.statusOfGame = 'attack'
  //         }, 200)
  //       break
  //
  //       // case 'defend':
  //       //   this.statusOfGame = 'defend'
  //     //   break
  //       //
  //       // case 'finish':
  //       //   this.roundCards[who] = this.initialState
  //     //   break
  //       //
  //       // default:
  //       //   this.roundCards[who] = this.initialState
  //     }
  //   }
  //
  //   if (who === 'player') {
  //     switch (action) {
  //       case 'attack':
  //         actionBtn.innerHTML = 'ВАШ ХОД!'
  //         actionBtn.classList.add('playerAttack')
  //
  //         this.turn = 'pc'
  //         // this.playerCards.push(card)
  //
  //         // this.statusOfGame = 'attack'
  //       break
  //
  //       // case 'defend':
  //       //   this.statusOfGame = 'defend'
  //       // break
  //
  //       // case 'finish':
  //       //   // this.table = --this.table
  //     //   break
  //       //
  //       // default:
  //       //   this.roundCards[who] = this.initialState
  //     }
  //   }
  //
  //
  //   // if (table.childNodes) {
  //   //   this.checker(table.childNodes)
  //   // }
  //
  //
  // }


  // static checker(card) {
  //   const table = document.querySelector('.table').childNodes
  //   for (let i = 0; i < table.length; i++) {
  //
  //     if ( card === table[i] ) {
  //       return true
  //     }
  //   }
  // }

}