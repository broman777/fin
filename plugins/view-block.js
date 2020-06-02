export default ({ store }, inject) => {
  inject('viewBlock', (key) => {
    if (store.state.viewBlocks) {
      const blockItem = store.state.viewBlocks ? store.state.viewBlocks[key] : null
      return blockItem ? blockItem.content : `${key} not found in ${store.state.locale} locale`
    } else {
      return key
    }
  })
}
