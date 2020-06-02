import cookiez from '~/utils/helpers/cookiez'

let authTokenRequest

// It used to avoid multiple refresh token requests for every 401 error code
function getAuthToken(store) {
  if (!authTokenRequest) {
    authTokenRequest = store.dispatch('auth/refreshToken')
    authTokenRequest.then(resetAuthTokenRequest, resetAuthTokenRequest)
  }
  return authTokenRequest
}

function resetAuthTokenRequest() {
  authTokenRequest = null
}

export default function ({ $axios, store, redirect }) {
  $axios.onRequest((config) => {
    const accessToken = store.state.auth.accessToken || cookiez.get('accessToken')
    if (config.url.indexOf('noLoader') === -1) store.commit('SET_LOADING', true)
    if (accessToken) {
      // $axios.setHeader('Authorization', `Bearer ${accessToken}`)
      config.headers.common.Authorization = `Bearer ${accessToken}`
    }
    return config
  })
  $axios.onResponse(() => {
    store.commit('SET_LOADING', false)
  })
  $axios.onError((error) => {
    store.commit('SET_LOADING', false)
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      return getAuthToken(store)
        .then((response) => {
          originalRequest._retry = true
          // We have bug without this line, because of old header left in repeated request sometimes
          originalRequest.headers.Authorization = `Bearer ${store.state.auth.accessToken}`
          return $axios(originalRequest)
        })
        .catch((err) => {
          throw err
        })
    }
    return Promise.reject(error)
  })
}
