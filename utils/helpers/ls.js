export default {
  set (name, value) {
    if (process.browser) return localStorage.setItem(name, JSON.stringify(value))
  },
  get (name) {
    if (process.browser) return JSON.parse(localStorage.getItem(name))
  },
  update (name, obj) {
    if (!process.browser) return
    let lsItem = this.get(name)
    lsItem = Object.assign(lsItem, obj)
    this.set(name, lsItem)
  },
  remove (name) {
    if (process.browser) return localStorage.removeItem(name)
  }
}
