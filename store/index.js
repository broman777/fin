import api from '~/config/api'

const state = () => ({
  loading: false,
  blocksList: [],
  apiUrl: '',
  locale: 'ru',
  i18n: [],
  lookups: [],
  languagesList: null,
  viewBlocks: {},
  latestTranslation: {},
  menu: {},
  informalMessage: { }
})

const getters = {
  getFooterMenu: (state) => {
    return state.menu.footer
  },
  getInformalMessage: (state) => {
    return state.informalMessage
  }
}

const actions = {
  async nuxtClientInit({ commit, dispatch }, { req, route }) {
    await dispatch('fetchLanguagesList')
    await dispatch('changeLanguage', route.name ? route.name.split('___')[1] : 'ru')
  },
  async fetchStaticPage(store, alias) {
    try {
      const { data } = await this.$axios.get(api.url.fetchPage(alias))
      return data.data
    } catch (err) {
      console.log('err', err)
      throw err
    }
  },
  async fetchLookups({ commit }, alias) {
    try {
      if (!alias) alias = ''
      else alias = '/' + alias
      const { data } = await this.$axios.get(api.url.fetchLookups(alias))
      commit('SET_LOOKUPS', data.data)
    } catch (err) {
      console.error('GET LOOKUPS LIST ERROR: ', err)
    }
  },
  async fetchI18n({ commit }, alias) {
    try {
      if (!alias) alias = ''
      else alias = '/' + alias
      const { data } = await this.$axios.get(api.url.fetchI18n(alias))
      commit('SET_I18N', data.data)
    } catch (err) {
      console.error('SET_I18N ERROR: ', err)
    }
  },
  async fetchLanguagesList({ commit }) {
    try {
      const { data } = await this.$axios.get(api.url.fetchLanguagesList())
      commit('SET_LANGUAGES_LIST', data.data)
    } catch (err) {
      console.error('GET LANG LIST ERROR: ', err)
    }
  },
  async fetchAllViewBlocks({ commit }) {
    try {
      const { data } = await this.$axios.get(api.url.fetchAllViewBlocks())
      commit('SET_VIEW_BLOCKS_LIST', data.data)
    } catch (err) {
      console.log('err', err)
    }
  },
  async fetchAllConfig({ commit }, alias) {
    try {
      const { data } = await this.$axios.get(api.url.fetchAllConfig(alias))
      commit('SET_CONFIG', data.data)
    } catch (err) {
      console.log('err', err)
    }
  },
  changeLanguage({ commit, dispatch }, code) {
    try {
      this.$axios.setHeader('Accept-Language', code)
      if (this.$cookies.get('locale') !== code) this.$cookies.set('locale', code)
      commit('SET_LOCALE', code)
      dispatch('fetchTranslations', code)
      dispatch('fetchMenu', 'footer')
      dispatch('fetchAllViewBlocks')
    } catch (err) {
      console.log('err', err)
    }
  },
  async fetchTranslations({ commit, dispatch }, code) {
    try {
      if (Object.keys(this.app.i18n.messages).includes(code)) return
      const { data: { data } } = await this.$axios.get(api.url.fetchI18n())
      this.app.i18n.setLocaleMessage(code, data)
      commit('SET_LATEST_TRANSLATION', { key: code, value: data })
    } catch (err) {
      throw err
    }
  },
  async fetchMenu({ commit }, alias) {
    try {
      const { data } = await this.$axios.get(api.url.fetchMenu(alias))
      commit('SET_MENU', { key: alias, value: data.data })
    } catch (err) {
      console.log('err fetching menu ' + alias, err)
    }
  },
  toggleInformalMessage({ commit }, message) {
    commit('SET_INFORMAL_MESSAGE', message)
    setTimeout(() => {
      commit('CLEAR_INFORMAL_MESSAGE')
    }, 6000)
  }
}

const mutations = {
  SET_LOOKUPS(state, payload) {
    state.lookups = payload
  },
  SET_LANGUAGES_LIST(state, payload) {
    state.languagesList = payload
  },
  SET_LOCALE(state, payload) {
    state.locale = payload
  },
  SET_VIEW_BLOCKS_LIST(state, payload) {
    state.viewBlocks = payload
  },
  SET_CONFIG(state, payload) {
    state.config = payload
  },
  SET_SITE_URL(state, payload) {
    state.siteUrl = payload
  },
  SET_I18N(state, payload) {
    state.i18n = payload
  },
  SET_LATEST_TRANSLATION(state, { key, value }) {
    state.latestTranslation = { [key]: value }
  },
  SET_MENU(state, { key, value }) {
    state.menu[key] = value
  },
  SET_LOADING(state, payload) {
    state.loading = payload
  },
  SET_INFORMAL_MESSAGE(state, payload) {
    state.informalMessage = payload
  },
  CLEAR_INFORMAL_MESSAGE(state) {
    state.informalMessage = {}
  }
}
export default {
  getters,
  state,
  actions,
  mutations
}
