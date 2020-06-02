import { helpers } from 'vuelidate/lib/validators'

export default helpers.withParams(
  { type: 'select' },
  (value) => {
    if (value) return true
    else return false
  }
)
