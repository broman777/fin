import environment from '../static/environment.json'
const BASE_URL_API = environment.baseUrl

const auth = {
  login() {
    return `${BASE_URL_API}/auth/sign-in`
  },
  tokenLogin() {
    return `${BASE_URL_API}/auth/token-sign-in`
  },
  setConstantPassword() {
    return `${BASE_URL_API}/setup/password/set-new`
  },
  passwordRecovery() {
    return `${BASE_URL_API}/auth/password/restore`
  },
  passwordRecoveryVerifyCode() {
    return `${BASE_URL_API}/auth/password/confirm-code`
  },
  passwordRecoveryChange() {
    return `${BASE_URL_API}/auth/password/change`
  },
  changePassword() {
    return `${BASE_URL_API}/cabinet/profile/change-password`
  },
  verifyCode() {
    return `${BASE_URL_API}/setup/verification/verify`
  },
  resendVerifyCode() {
    return `${BASE_URL_API}/setup/verification/resend-code`
  },
  refreshToken() {
    return `${BASE_URL_API}/auth/refresh-token?noLoader=true`
  }
}

const offer = {
  loan() { return `${environment.partnerUrl}/application/create?noLoader=true` },
  offersRequest() { return `${BASE_URL_API}/cabinet/offer/list?noLoader=true` },
  resetOffers() { return `${BASE_URL_API}/cabinet/offer/reset?noLoader=true` }
}

const url = {
  fetchFields(alias) { return `${BASE_URL_API}/form-template/form/${alias}` },
  fetchProfile() { return `${BASE_URL_API}/cabinet/profile` },
  profileCard() { return `${BASE_URL_API}/cabinet/card/fields?noLoader=true` },
  fetchMapping(alias) { return `${BASE_URL_API}/form-template/mapping/${alias}` },
  fetchAllViewBlocks() { return `${BASE_URL_API}/system/blocks` },
  fetchViewBlockByAlias(alias) { return `${BASE_URL_API}/system/blocks/${alias}` },
  fetchConfig(alias) { return `${BASE_URL_API}/system/configs${alias}` },
  fetchI18n() { return `${BASE_URL_API}/system/i18n` },
  fetchLanguagesList() { return `${BASE_URL_API}/system/languages` },
  fetchLookups(alias) { return `${BASE_URL_API}/system/lookups${alias}` },
  fetchMenu(alias) { return `${BASE_URL_API}/system/menu/${alias}` },
  fetchPage(alias) { return `${BASE_URL_API}/system/pages/${alias}` },
  fetchPosts(alias) { return `${BASE_URL_API}/system/posts${alias}` },
  fetchRedirect() { return `${BASE_URL_API}/system/redirect-rule` },
  updateProfile(alias) { return `${BASE_URL_API}/cabinet/profile/${alias}` },
  bannerList() { return `${BASE_URL_API}/content/contractor/banner-list` }
}

export default { auth, url, offer }
