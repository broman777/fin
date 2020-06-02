export default function (obj) {
  let paramsString = ''
  for (const key in obj) {
    paramsString += `${key}=${obj[key]}&`
  }
  return `?${paramsString.slice(0, -1)}`
}
