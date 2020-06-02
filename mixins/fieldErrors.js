export default {
  data: () => ({
    formErrorMessagesFromApi: {}
  }),
  methods: {
    fieldErrorData(field) {
      return {
        hasError:
          this.$v.formData[field].$error ||
          Boolean(this.formErrorMessagesFromApi[field]),
        message:
          this.formErrorMessagesFromApi[field] || this.generateErrorMessage(field)
      }
    },
    onFieldInput(field) {
      this.formErrorMessagesFromApi[field] = null
    },
    generateErrorMessage(field) {
      const validator = this.$v.formData[field]
      const msg = this.$store.state.formConstructor.fieldList[field]
      for (const key in validator.$params) {
        if (field === 'mobile_phone') {
          if (key === 'required' && !validator[key]) return this.$t('frontend.phone-required')
          if (key === 'numericMinLength' && !validator[key]) return this.$t('frontend.numeric-min-length')
        }
        else if (field === 'password') {
          if (key === 'required' && !validator[key]) return this.$t('frontend.password-required')
          if (key === 'minLength' && !validator[key]) return this.$t('frontend.min-length')
          if (key === 'maxLength' && !validator[key]) return this.$t('frontend.max-length')
        }
        else if (field === 'currentPassword') {
          if (key === 'required' && !validator[key]) return this.$t('frontend.enter-old-password')
          if (key === 'minLength' && !validator[key]) return this.$t('frontend.min-length')
          if (key === 'maxLength' && !validator[key]) return this.$t('frontend.max-length')
        }
        else if (field === 'newPassword') {
          if (key === 'required' && !validator[key]) return this.$t('frontend.enter-new-password')
          if (key === 'minLength' && !validator[key]) return this.$t('frontend.min-length')
          if (key === 'maxLength' && !validator[key]) return this.$t('frontend.max-length')
        }
        else if (field === 'confirmPassword') {
          if (key === 'required' && !validator[key]) return this.$t('frontend.enter-new-password-twice')
          if (key === 'maxLength' && !validator[key]) return this.$t('frontend.max-length')
          if (key === 'sameAs' && !validator[key]) return this.$t('frontend.password-same-as')
        }
        else if (field === 'inn') {
          if (key === 'required' && !validator[key]) return this.$t('frontend.inn-required')
          if (key === 'numericMinLength' && !validator[key]) return this.$t('frontend.inn-min-length')
        }
        else if (field === 'code') {
          if (key === 'required' && !validator[key]) return this.$t('frontend.sms-code-required')
          if (key === 'numericMinLength' && !validator[key]) return this.$t('frontend.sms-code-min-length')
        }
        else if (msg && !Array.isArray[msg.validationRules] && !validator[key]) {
          if (Object(msg.validationRules[key]).hasOwnProperty('errorMessage') && msg.validationRules[key].errorMessage != '') return msg.validationRules[key].errorMessage
          if (key === 'minValue' && msg.validationRules.min.errorMessage != '') return msg.validationRules.min.errorMessage
          if (key === 'maxValue' && msg.validationRules.max.errorMessage != '') return msg.validationRules.max.errorMessage
          if (key === 'minLength' && msg.validationRules.minlength.errorMessage != '') return msg.validationRules.minlength.errorMessage
          if (key === 'maxLength' && msg.validationRules.maxlength.errorMessage != '') return msg.validationRules.maxlength.errorMessage
          if (key === 'minDate' && msg.validationRules.minDate.errorMessage != '') return msg.validationRules.minDate.errorMessage
          if (key === 'maxDate' && msg.validationRules.maxDate.errorMessage != '') return msg.validationRules.maxDate.errorMessage
        }
        else {
          if (key === 'required' && !validator[key]) return this.$t('frontend.error_default')
          if (key === 'email' && !validator[key]) return this.$t('frontend.error_email')
          if (key === 'minLength' && !validator[key]) return this.$t('frontend.error_min-length')
          if (key === 'maxLength' && !validator[key]) return this.$t('frontend.error_max-length')
        }
      }
    }
  }
}
