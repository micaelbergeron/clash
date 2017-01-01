import uuid from 'uuid/v4';


export default class Actor {
  constructor() {
    this.id = uuid();
    this.hp = 0;
    this.ac = 0;
    this.saves = {
      reflex: 0,
      fortitude: 0,
      will: 0,
    }
  }
}
