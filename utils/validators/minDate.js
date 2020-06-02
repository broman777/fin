import { helpers } from 'vuelidate/lib/validators'
import moment from 'moment'

export default function (min) {
  return helpers.withParams(
    { type: 'minDate' },
    (value) => {
      if (value) {
        return moment(value).isSameOrAfter(min, 'day')
      } else return true
    }
  )
}
