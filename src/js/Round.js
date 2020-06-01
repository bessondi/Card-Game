// import DomListener from '@/js/DomListener'

export default class Round {
  constructor(card) {
    // super()
    this.initialState = []
    this.statusOfGame
    this.card = card
    this.roundState = {
      player: [],
      pc: []
    }
  }


  update(who, action) {
    const table = document.querySelector('.table')
    const actionBtn = document.querySelector('.actionBtn')

    // console.log(this.card)

    if (who === 'pc') {
      switch (action) {

        case 'attack':
          setTimeout(() => {
            table.appendChild(this.card)
            this.roundState.pc.push(this.card)

            actionBtn.innerHTML = 'ВЗЯТЬ'
            actionBtn.classList.toggle('active')
            this.statusOfGame = 'attack'
          }, 200)
        break

        // case 'defend':
        //   this.statusOfGame = 'defend'
      //   break
        //
        // case 'finish':
        //   this.roundState[who] = this.initialState
      //   break
        //
        // default:
        //   this.roundState[who] = this.initialState
      }
    }
    //
    if (who === 'player') {
      switch (action) {

        case 'attack':
          actionBtn.innerHTML = 'ВАШ ХОД!'
          actionBtn.classList.add('playerAttack')
          this.statusOfGame = 'attack'
          this.roundState.player.push(this.card)
        break

        case 'defend':
          this.statusOfGame = 'defend'
        break

        // case 'finish':
        //   // this.round = --this.round
      //   break
        //
        // default:
        //   this.roundState[who] = this.initialState
      }
    }


    // if (table.childNodes) {
    //   this.checker(table.childNodes)
    // }
  }

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