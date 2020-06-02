import axios from 'axios'
import api from './api'

export default async function () {
  const fetchLocaleList = async function () {
    try {
      const { data } = await axios.get(api.url.fetchLanguagesList())
      return data.data
    } catch (err) {
      throw err
    }
  }

  const localeList = await fetchLocaleList()

  // We need code below, if we have one language on our site
  //
  const defaultLocale = localeList.find(locale => locale.is_default) ? localeList.find(locale => locale.is_default).code : localeList[0].code
  //
  // const fetchTranslationList = async function () {
  //   try {
  //     const { data } = await (await fetch(`${apiUrl}/v1/system/i18n?language=${defaultLocale}`)).json()
  //     return { [localeList[0].code]: data }
  //   } catch (err) {
  //     throw err
  //   }
  // }
  //
  // const messages = await fetchTranslationList()

  const locales = localeList.map(locale => ({
    code: locale.code,
    iso: locale.locale,
    name: locale.title
  }))

  return {
    locales,
    defaultLocale,
    vueI18n: {
      // messages
    }
  }
}
