export function isPhoneFilled(value) {
  if (value === '') return true

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value.length < 9)
    }, 500)
  })
}
