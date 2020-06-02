import { helpers } from 'vuelidate/lib/validators'

export default function (expression) {
  if (expression) {
    return helpers.withParams(
      { type: 'pattern' },
      (value) => {
        if (value) {
          const regexp = new RegExp(expression.replace(/\//g, ''))
          return regexp.test(value)
        } else return true
      }
    )
  } else return false
}
