
class EntityTracker {
  constructor() {
    this.private = {nextId:1, entities:[]};
  }
  nextId() {
    return (this.private.nextId++).toString(36);
  }
  add(entity) {
    this.private.entities.push(entity);
  }
  remove(id) {
    this.private.entities = this.private.entities.filter(e => e.id !== id);
  }
  get(id) {
    return this.private.entities.filter(e => e.id == id)[0];
  }
  get entities() {
    return this.private.entities;
  }
  get count() {
    return this.private.entities.length;
  }
}

module.exports = EntityTracker;
