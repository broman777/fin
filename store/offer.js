import api from '@/config/api'

const state = () => ({
  formData: {},
  calculatorData: {
    credit_sum: 0,
    credit_term: 0
  },
  isLoanRequestApplied: false,
  offers: [],
  showcases: []
})

const getters = {
  getFormData: state => state.formData,
  getCalculatorData: state => state.calculatorData,
  getOffers: state => state.offers,
  getShowcases: state => state.showcases,
  getIsLoanRequestApplied: state => state.isLoanRequestApplied
}

const actions = {

  setCalculatorData({ commit }, payload) {
    try {
      commit('SET_CALCULATOR_DATA', payload)
    } catch (err) {
      throw err
    }
  },

  async loanRequest({ commit, dispatch }, payload) {
    try {
      await dispatch('resetPartnerOffers')
      localStorage.removeItem('landingCreditSum')
      localStorage.removeItem('landingCreditTerm')
      await this.$axios.post(
        api.offer.loan(),
        payload,
        { headers: { 'Authorization': 'Bearer cd969fee-463b-4886-9813-219545365104' } }
      )
      commit('SET_LOAN_REQUEST', true)
    } catch (err) {
      throw err
    }
  },

  async fetchOffers({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(api.offer.offersRequest())
      commit('SET_OFFERS', data.data)
    } catch (err) {
      throw err
    }
  },

  async fetchShowcases({ commit }) {
    try {
      const { data } = await this.$axios.get(api.url.bannerList())
      commit('SET_SHOWCASE', data.data)
    } catch (err) {
      throw err
    }
  },

  async resetPartnerOffers({ dispatch }) {
    try {
      await this.$axios.put(api.offer.resetOffers())
    } catch (err) {
      throw err
    }
  }

}

const mutations = {
  SET_FORM_DATA(state, payload) {
    state.formData = payload
  },
  SET_CALCULATOR_DATA(state, payload) {
    state.calculatorData = payload
  },
  SET_LOAN_REQUEST(state, payload) {
    state.isLoanRequestApplied = payload
  },
  SET_OFFERS(state, payload) {
    state.offers = payload
  },
  SET_SHOWCASE(state, payload) {
    state.showcases = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
