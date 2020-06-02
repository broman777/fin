import api from '@/config/api'
import Vue from 'vue'

export const state = () => ({
  groupList: [], // grouped field list
  mapping: [], // mapping rules
  fieldList: {}, // blank field list
  profileData: {}, // profile data from backend
  profileCard: {},
  profileCalculatorData: {}
})

export const getters = {
  getMapping: state => state.mapping,
  getGroupList: state => state.groupList,
  getFieldList: state => state.fieldList,
  getProfileData: state => state.profileData,
  getProfileCalculatorData: state => state.profileCalculatorData,
  getProfileCard: (state) => {
    const card = []
    for (const i in state.profileCard) {
      for (const [key, value] of Object.entries(state.profileData)) {
        if (key === state.profileCard[i].field) {
          card.push({
            field: state.profileCard[i].field,
            title: state.profileCard[i].title,
            value: value
          })
        }
      }
    }
    return card
  }
}

export const actions = {
  async fetchForm({ commit }, alias) {
    try {
      const { data } = await this.$axios.get(api.url.fetchFields(alias))
      commit('SAVE_FORM', data.data)
    } catch (err) {
      throw err
    }
  },
  async fetchProfile({ commit }) {
    try {
      const { data } = await this.$axios.get(api.url.fetchProfile())
      commit('SET_PROFILE', data.data)
      commit('SET_PROFILE_CALC_DATA', {
        credit_sum: data.data.profileData.credit_sum,
        credit_term: data.data.profileData.credit_term
      })
      return data.data
    } catch (err) {
      throw err
    }
  },
  async fetchMapping({ commit }, alias) {
    try {
      const { data } = await this.$axios.get(api.url.fetchMapping(alias))
      commit('SET_MAPPING', data.data)
    } catch (err) {
      throw err
    }
  },
  async updateProfile({ commit }, payload) {
    try {
      await this.$axios.put(api.url.updateProfile(payload.alias), payload.data)
    } catch (err) {
      throw err
    }
  },
  async fetchProfileCard({ commit }) {
    try {
      const { data } = await this.$axios.get(api.url.profileCard())
      commit('SET_PROFILE_CARD', data.data)
    } catch (err) {
      throw err
    }
  },
  clearProfile({ commit }) {
    commit('CLEAR_PROFILE')
  },
  clearFieldList({ commit }) {
    commit('CLEAR_FIELD_LIST')
  },
  clearGroupList({ commit }) {
    commit('CLEAR_GROUP_LIST')
  },
  clearMapping({ commit }) {
    commit('CLEAR_MAPPING')
  }
}

export const mutations = {
  SET_VALUE(state, data) {
    // set root value
    Vue.set(state.fieldList[data[0]], 'isVisible', data[1])
  },
  SET_VISIBILIY(state, data) {
    if (state.fieldList[data[0]]) {
      // set visibility of field
      state.fieldList[data[0]].isVisible = data[1]
      // set visibility of group
      const group = state.fieldList[data[0]].group
      let visible = 0
      for (const alias in state.groupList[group].fields) {
        if (state.fieldList[alias].isVisible) visible++
      }
      state.groupList[group].isHidden = (visible === 0)
    }
  },
  SET_OPTIONS(state, data) {
    // save options to store
    if (typeof data[1] !== 'boolean') return
    state.fieldList[data[0]].values = (data[1]) ? data[1] : state.fieldList[data[0]].initialOptions
  },
  SET_MAPPING(state, data) {
    // save mapping rules
    state.mapping = data
  },
  SAVE_FORM(state, response) {
    // save groped fields for rendering
    state.groupList = response
    // save ungroped field list for data & options store
    for (const i in response) {
      for (const j in response[i].fields) {
        // save mapping property
        const prop = state.mapping[j]
        // save blank field from group
        Vue.set(state.fieldList, j, response[i].fields[j])
        // save group alias for blank field
        Vue.set(state.fieldList[j], 'group', i)
        // set visibility of field
        Vue.set(state.fieldList[j], 'isVisible', true)
        // save options for select/radiogroup
        if (response[i].fields[j].values.length) {
          const options = response[i].fields[j].values
          // set initial option list in store
          Vue.set(state.fieldList[j], 'initialOptions', options)
          // if has default flag exists
          if (options[0].hasOwnProperty('is_default')) {
            for (const k in options) {
              // find default value and set it
              if (options[k].is_default) {
                Vue.set(state.fieldList[j], 'value', options[k])
              }
            }
          }
          // if property in profile data exists & its
          if (state.profileData[prop]) {
            for (const l in options) {
              if (String(options[l].value) === state.profileData[prop]) {
                state.fieldList[j].value = options[l]
              }
            }
          }
        } else {
          Vue.set(state.fieldList[j], 'value', (state.profileData[prop]) ? state.profileData[prop] : null)
        }
      }
    }
  },
  SET_PROFILE(state, response) {
    // save profile data in form after get mapping rules
    for (const i in response.profileData) {
      if (response.profileData[i] !== null && response.profileData[i] !== 0) {
        if (typeof response.profileData[i] !== 'string') state.profileData[i] = String(response.profileData[i])
        else state.profileData[i] = response.profileData[i]
      }
    }
  },
  SET_PROFILE_CALC_DATA(state, payload) {
    state.profileCalculatorData = payload
  },
  SET_PROFILE_CARD(state, payload) {
    state.profileCard = payload
  },
  CLEAR_PROFILE(state) {
    state.profileData = []
  },
  CLEAR_FIELD_LIST(state) {
    state.fieldList = {}
  },
  CLEAR_GROUP_LIST(state) {
    state.groupList = []
  },
  CLEAR_MAPPING(state) {
    state.mapping = []
  }
}
