import { helpers } from 'vuelidate/lib/validators'

export default function (minLength) {
  if (!minLength) return true
  return helpers.withParams(
    { type: 'numericMinLength' }, (value) => {
      if (!value) return true
      const onlyNumbers = value.replace(/\D/g, '')
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(onlyNumbers.length >= minLength)
        }, 500)
      })
    }
  )
}
