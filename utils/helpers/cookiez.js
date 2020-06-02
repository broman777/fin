export default {
  get(name) {
    const matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([$?*|{}\]\\^])/g, '\\$1') + '=([^;]*)'
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
  },

  set(name, value, options) {
    options = options || {}

    let expires = options.expires

    if (typeof expires === 'number' && expires) {
      const date = new Date()
      date.setTime(date.getTime() + expires * 1000)
      expires = options.expires = date
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString()
    }

    value = encodeURIComponent(value)

    let updatedCookie = `${name}=${value}`

    for (const propName in options) {
      updatedCookie += '; ' + propName
      const propValue = options[propName]
      if (!propValue) {
        updatedCookie += '=' + propValue
      }
    }

    document.cookie = updatedCookie
  },

  delete(name) {
    this.set(name, '', {
      expires: -1
    })
  },

  isUserGuest() {
    return Boolean(this.get('accessToken') && this.get('refreshToken')) === false
  },

  isUserLoggedInUnverified() {
    return Boolean(this.get('accessToken') && this.get('refreshToken')) && (this.get('userIsVerified') === 'false')
  },

  isUserLoggedInVerified() {
    return Boolean(this.get('accessToken') && this.get('refreshToken')) && (this.get('userIsVerified') === 'true')
  },

  isUserHasPassword() {
    return Boolean(this.get('refreshToken')) && (this.get('userHasPassword') === 'true')
  },

  logoutUser() {
    this.delete('accessToken')
    this.delete('refreshToken')
    this.delete('userId')
    this.delete('userInn')
    this.delete('userIsVerified')
    this.delete('userHasPassword')
    this.delete('passwordRecoveryPhone')
    this.delete('passwordRecoveryInn')
    this.delete('passwordRecoveryToken')
  }
}
