import cookiez from '~/utils/helpers/cookiez'
export default function ({ app, store, isServer, res, route, redirect }) {
  //  if route is /authorization and has query token
  if (route.name.includes('authorization') && Boolean(route.query.token)) {
    store.dispatch('auth/loginWithUrlToken', { token: route.query.token })
    //  if route is /authorization and has query credit_sum & credit_term
  } else if (route.name.includes('authorization') && (Boolean(route.query.credit_sum) && Boolean(route.query.credit_term))) {
    localStorage.setItem('landingCreditSum', route.query.credit_sum)
    localStorage.setItem('landingCreditTerm', route.query.credit_term)
    redirect(app.localePath('authorization'))
  } else if (cookiez.isUserGuest()) {
    // if guest
    const disallowedRouteListForGuest = [
      'index',
      'offers',
      'set-password',
      'password-change',
      'phone-verification',
      'profile'
    ]
    const isGuestOnDisallowedPage = disallowedRouteListForGuest.find(pageName => route.name && route.name.includes(pageName))
    if (isGuestOnDisallowedPage) redirect(app.localePath('authorization'))
  } else if (cookiez.isUserLoggedInUnverified()) {
    // if user logged and unverified
    const disallowedRouteListForUnverifiedUser = [
      'index',
      'offers',
      'set-password',
      'password-change',
      'password-recovery',
      'authorization',
      'profile'
    ]
    const isUnverifiedUserOnDisallowedPage = disallowedRouteListForUnverifiedUser.find(pageName => route.name && route.name.includes(pageName))
    if (isUnverifiedUserOnDisallowedPage) redirect(app.localePath('phone-verification'))
  } else if (cookiez.isUserLoggedInVerified() && !cookiez.isUserHasPassword()) {
    // if user logged and verified but need to set constant password
    const disallowedRouteListForUserNeedPassword = [
      'index',
      'authorization',
      'offers',
      'password-change',
      'password-recovery',
      'phone-verification',
      'profile'
    ]
    const isUserNeedPasswordOnDisallowedPage = disallowedRouteListForUserNeedPassword.find(pageName => route.name && route.name.includes(pageName))
    if (isUserNeedPasswordOnDisallowedPage) redirect(app.localePath('set-password'))
  } else {
    // if user logged and verified and has password
    const disallowedRouteListForUser = [
      'authorization',
      'phone-verification',
      'set-password',
      'password-recovery',
      'password-recovery-confirm-phone',
      'password-recovery-new-password'
    ]
    const isUserOnDisallowedPage = disallowedRouteListForUser.find(pageName => route.name && route.name.includes(pageName))
    if (isUserOnDisallowedPage) redirect(app.localePath('index'))
  }
}
