
class Entity {
  constructor(id, name) {
    this.data      = {};
    this.data.id   = id;
    this.data.name = name;
  }
  get id() {
    return this.data.id;
  }
  get name() {
    return this.data.name;
  }
}

module.exports = Entity;
