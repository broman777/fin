<template>
  <div class="page page__password-recovery authorization">
    <p class="heading">
      {{ $t('frontend.login_restore-title') }}
    </p>
    <form
      novalidate
      class="authorization-form"
      @submit.prevent="onFormSubmit"
    >
      <s-input
        v-model="formData.mobile_phone"
        :label="$t('frontend.login_phone_label')"
        type="tel"
        mask-type="phone"
        :error-message="fieldErrorData('mobile_phone').message"
        :has-error="fieldErrorData('mobile_phone').hasError"
        :data="$v.formData.mobile_phone"
        :validation="$v.formData.mobile_phone"
        :alias="['', 'mobile_phone']"
        @input="updateInput"
      />
      <div
        v-if="isInnRequired"
        class="inn-required"
      >
        <s-input
          v-model="formData.inn"
          :label="$t('frontend.login_inn_label')"
          type="tel"
          mask-type="inn"
          placeholder-char="x"
          :error-message="fieldErrorData('inn').message"
          :has-error="fieldErrorData('inn').hasError"
          :data="$v.formData.inn"
          :validation="$v.formData.inn"
          :alias="['', 'inn']"
          @input="updateInput"
        />
      </div>
      <s-button
        theme="red"
        type="button"
        gap-y="19px"
        :is-loading="isSubmitButtonLoading"
      >
        {{ $t('frontend.login_next') }}
      </s-button>
      <nuxt-link
        :to="localePath('authorization')"
        class="link"
      >
        {{ $t('frontend.login_back-enter') }}
      </nuxt-link>
    </form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { required, requiredIf } from 'vuelidate/lib/validators'
import numericMinLength from '~/utils/validators/numericMinLength'
import fieldErrors from '~/mixins/fieldErrors'
export default {
  name: 'PasswordRecoveryPage',
  middleware: 'authGuard',
  layout: 'simple',
  components: {},
  mixins: [fieldErrors],
  data: () => ({
    formData: {
      mobile_phone: null,
      inn: null
    },
    isInnRequired: false,
    isSubmitButtonLoading: false
  }),
  watch: {
    //  if mobile_phone changed and not equal to old value
    //  hide inn field
    'formData.mobile_phone': function (val, oldVal) {
      if (val !== oldVal) {
        this.isInnRequired = false
      }
    }
  },
  validations() {
    return {
      formData: {
        mobile_phone: { required, numericMinLength: numericMinLength(10) },
        inn: {
          required: requiredIf(() => { return this.isInnRequired }),
          numericMinLength: numericMinLength(10)
        }
      }
    }
  },
  methods: {
    ...mapActions({
      passwordRecovery: 'auth/passwordRecovery',
      toggleInformalMessage: 'toggleInformalMessage'
    }),
    async onFormSubmit() {
      this.$v.formData.$touch()
      if (this.$v.formData.$error) return
      this.isSubmitButtonLoading = true
      const payload = {
        mobile_phone: this.formData.mobile_phone,
        inn: this.formData.inn
      }
      try {
        await this.passwordRecovery(payload)
        this.$router.push(this.localePath('password-recovery-confirm-phone'))
      } catch (err) {
        if (err.response.status && err.response.status === 460) {
          this.isInnRequired = true
          this.toggleInformalMessage({ type: 'warning', message: this.$t('frontend.login_inn') })
        } else if (err.response.status && err.response.status === 400) {
          this.toggleInformalMessage({ type: 'error', message: this.$t('frontend.app_fail') })
        } else {
          this.formErrorMessagesFromApi = err.response.data.data
        }
      }
      this.isSubmitButtonLoading = false
    },
    updateInput(value, alias) {
      this.$v.formData[alias].$model = value || null
      this.$v.formData[alias].$touch()
      this.onFieldInput(alias)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
