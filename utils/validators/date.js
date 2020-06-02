import { helpers } from 'vuelidate/lib/validators'

export default helpers.withParams(
  { type: 'date' },
  value => !isNaN(Date.parse(value))
)
