export default class Player {
  constructor(name) {
    this.playerName = name;
    this.playerCards = [];
  }

  static move(value, suit) {
    console.log(value, suit)
  }

}