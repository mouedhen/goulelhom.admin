class Storage {

  constructor() {
    this.storage = localStorage
  }

  get(key) {
    return this.storage.getItem(key)
  }

  set(key, value) {
    this.storage.setItem(key, value)
  }

  remove(key) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }

  has(key) {
    return this.get(key) !== null
  }
}

export {Storage}
