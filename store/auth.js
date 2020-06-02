import api from '@/config/api'

const state = () => ({
  accessToken: null,
  refreshToken: null,
  passwordRecoveryToken: null,
  userData: null
})

const getters = {
  getIsUserLoggedIn: state => Boolean(state.userData && state.accessToken && state.refreshToken),
  getIsUserVerified: state => Boolean((state.userData && state.userData.is_verified) && state.accessToken && state.refreshToken),
  getUserData: state => state.userData,
  getPasswordRecoveryToken: state => state.passwordRecoveryToken
}

const actions = {
  async login({ dispatch }, payload) {
    try {
      const response = await this.$axios.post(api.auth.login(), payload)
      dispatch('setAuthTokens', { accessToken: response.headers['x-bearer-token'], refreshToken: response.headers['x-refresh-token'] })
      dispatch('setUserData', {
        id: response.data.data.id,
        inn: response.data.data.inn,
        mobilePhone: response.data.data.mobile_phone,
        isVerified: response.data.data.is_verified,
        hasPassword: response.data.data.has_password
      })
    } catch (err) {
      throw err
    }
  },
  async loginWithUrlToken({ dispatch }, payload) {
    try {
      await dispatch('logout')
      const response = await this.$axios.post(api.auth.tokenLogin(), payload)
      dispatch('setAuthTokens', { accessToken: response.headers['x-bearer-token'], refreshToken: response.headers['x-refresh-token'] })
      dispatch('setUserData', {
        id: response.data.data.id,
        inn: response.data.data.inn,
        mobilePhone: response.data.data.mobile_phone,
        isVerified: response.data.data.is_verified,
        hasPassword: response.data.data.has_password
      })
      this.$router.push(this.app.localePath('phone-verification'))
    } catch (err) {
      throw err
    }
  },
  logout({ commit, dispatch }) {
    commit('LOGOUT_USER')
    this.$cookies.remove('accessToken')
    this.$cookies.remove('refreshToken')
    this.$cookies.remove('userId')
    this.$cookies.remove('userInn')
    this.$cookies.remove('userPhone')
    this.$cookies.remove('userIsVerified')
    this.$cookies.remove('userHasPassword')
    this.$cookies.remove('passwordRecoveryPhone')
    this.$cookies.remove('passwordRecoveryInn')
    this.$cookies.remove('passwordRecoveryToken')
    this.dispatch('formConstructor/clearProfile')
    this.dispatch('formConstructor/clearFieldList')
    this.dispatch('formConstructor/clearGroupList')
    this.dispatch('formConstructor/clearMapping')

    // fieldList:Object
    // groupList:Object
    // mapping:Obj
    // commit('formConstructor/CLEAR_PROFILE')

    if (!(this.$router.currentRoute.name.includes('authorization') && Boolean(this.$router.currentRoute.query.token))) {
      this.$router.push(this.app.localePath('authorization'))
    }
  },
  setAuthTokens({ commit, getters }, { accessToken, refreshToken }) {
    if (accessToken) {
      commit('SET_ACCESS_TOKEN', accessToken)
      this.$cookies.set('accessToken', accessToken)
    }
    if (refreshToken) {
      commit('SET_REFRESH_TOKEN', refreshToken)
      this.$cookies.set('refreshToken', refreshToken)
    }
  },
  async refreshToken({ state, dispatch }) {
    try {
      const response = await this.$axios.post(api.auth.refreshToken(), { token: this.$cookies.get('refreshToken') })
      dispatch('setAuthTokens', { accessToken: response.headers['x-bearer-token'], refreshToken: response.headers['x-refresh-token'] })
      this.$axios.setToken(response.headers['x-bearer-token'], 'Bearer')
    } catch (err) {
      this.dispatch('logout')
      throw err
    }
  },
  setUserData({ commit }, { id, inn, mobilePhone, isVerified, hasPassword }) {
    commit('SET_USER_DATA', {
      id: id,
      inn: inn,
      mobile_phone: mobilePhone,
      is_verified: isVerified,
      has_password: hasPassword
    })
    this.$cookies.set('userId', id)
    this.$cookies.set('userInn', inn)
    this.$cookies.set('userPhone', mobilePhone)
    this.$cookies.set('userIsVerified', isVerified)
    this.$cookies.set('userHasPassword', hasPassword)
  },
  async setPassword({ commit }, payload) {
    try {
      await this.$axios.post(api.auth.setConstantPassword(), payload)
      this.$cookies.set('userHasPassword', true)
    } catch (err) {
      throw err
    }
  },
  async passwordRecovery({ commit }, payload) {
    try {
      const { data: { data } } = await this.$axios.post(api.auth.passwordRecovery(), payload)
      this.$cookies.set('passwordRecoveryToken', data.verificationToken)
      this.$cookies.set('passwordRecoveryPhone', payload.mobile_phone)
      this.$cookies.set('passwordRecoveryInn', payload.inn)
      commit('SET_PASSWORD_RECOVERY_TOKEN', data)
    } catch (err) {
      throw err
    }
  },
  async passwordRecoveryConfirmPhone({ dispatch }, payload) {
    try {
      await this.$axios.post(api.auth.passwordRecoveryVerifyCode(), payload)
    } catch (err) {
      throw err
    }
  },
  async passwordRecoveryNew({ commit }, payload) {
    try {
      await this.$axios.post(api.auth.passwordRecoveryChange(), payload)
      this.$cookies.remove('passwordRecoveryToken')
      this.$cookies.remove('passwordRecoveryPhone')
      this.$cookies.set('passwordRecoveryInn')
    } catch (err) {
      throw err
    }
  },
  async setNewPassword({ commit, dispatch }, payload) {
    try {
      await this.$axios.put(api.auth.changePassword(), payload)
      // dispatch('toggleInformalMessage', { type: 'error', message: this.$t('frontend.app_fail') })
    } catch (err) {
      throw err
    }
  },
  async verifyPhone({ dispatch }, payload) {
    try {
      await this.$axios.post(api.auth.verifyCode(), payload)
      this.$cookies.set('userIsVerified', true)
    } catch (err) {
      throw err
    }
  },
  async resendVerifyPhone({ dispatch }) {
    try {
      await this.$axios.post(api.auth.resendVerifyCode())
    } catch (err) {
      throw err
    }
  }
}

const mutations = {
  SET_ACCESS_TOKEN(state, accessToken) {
    state.accessToken = accessToken
  },
  SET_REFRESH_TOKEN(state, refreshToken) {
    state.refreshToken = refreshToken
  },
  LOGOUT_USER(state) {
    state.accessToken = null
    state.refreshToken = null
    state.userData = {}
    this.$cookies.remove('accessToken')
    this.$cookies.remove('refreshToken')
  },
  SET_USER_DATA(state, payload) {
    state.userData = payload
  },
  SET_PASSWORD_RECOVERY_TOKEN(state, payload) {
    state.passwordRecoveryToken = payload.verificationToken
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
