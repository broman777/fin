import { helpers } from 'vuelidate/lib/validators'
import moment from 'moment'

export default function (max) {
  return helpers.withParams(
    { type: 'maxDate' },
    (value) => {
      if (value) {
        return moment(max).isSameOrAfter(value, 'day')
      } else return true
    }
  )
}
