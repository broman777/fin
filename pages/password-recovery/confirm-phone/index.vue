<template>
  <div class="page page__password-recovery authorization">
    <div class="box">
      <p class="heading">
        {{ $t('frontend.login_restore-title') }}
      </p>
      <p class="sub-heading">
        {{ $t('frontend.login_restore-code') }}
      </p>
      <form
        novalidate
        class="authorization-form"
        @submit.prevent="onFormSubmit"
      >
        <s-input
          v-model.trim="formData.code"
          :label="$t('frontend.login_code-label')"
          type="text"
          mask-type="phone-code"
          placeholder-char="x"
          :error-message="fieldErrorData('code').message"
          :has-error="fieldErrorData('code').hasError"
          :data="$v.formData.code"
          :validation="$v.formData.code"
          :alias="['', 'code']"
          @input="updateInput"
        />
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
        <span> {{ $t('frontend.no-sms-code') }} </span>
        <span
          class="link"
          @click="resendConfirmCode"
        >
          {{ $t('frontend.resend-one-more') }}
        </span>
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import numericMinLength from '~/utils/validators/numericMinLength'
import fieldErrors from '~/mixins/fieldErrors'
export default {
  name: 'PhoneConfirmPage',
  middleware: 'authGuard',
  layout: 'simple',
  mixins: [fieldErrors],
  data: () => ({
    formData: { code: null },
    isSubmitButtonLoading: false
  }),
  computed: {
    ...mapGetters({ getPasswordRecoveryToken: 'auth/getPasswordRecoveryToken' })
  },
  validations() {
    return {
      formData: {
        code: { required, numericMinLength: numericMinLength(4) }
      }
    }
  },
  methods: {
    ...mapActions({
      passwordRecoveryConfirmPhone: 'auth/passwordRecoveryConfirmPhone',
      passwordRecovery: 'auth/passwordRecovery',
      toggleInformalMessage: 'toggleInformalMessage'
    }),
    async onFormSubmit() {
      this.$v.formData.$touch()
      if (this.$v.formData.$error) return
      this.isSubmitButtonLoading = true
      const payload = {
        code: this.formData.code,
        token: this.$cookies.get('passwordRecoveryToken')
      }
      try {
        await this.passwordRecoveryConfirmPhone(payload)
        this.$router.push(this.localePath('password-recovery-new-password'))
      } catch (err) {
        if (err.response.status && err.response.status === 400) {
          this.toggleInformalMessage({ type: 'error', message: this.$t('frontend.app_fail') })
        } else {
          this.formErrorMessagesFromApi = err.response.data.data
        }
      }
      this.isSubmitButtonLoading = false
    },
    async resendConfirmCode() {
      const payload = {
        mobile_phone: this.$cookies.get('passwordRecoveryPhone'),
        inn: this.$cookies.get('passwordRecoveryInn')
      }
      try {
        await this.passwordRecovery(payload)
        this.toggleInformalMessage({ type: 'success', message: this.$t('frontend.resend_verify_code') })
      } catch (err) {
        if (err.response.status && err.response.status === 400) {
          this.toggleInformalMessage({ type: 'error', message: this.$t('frontend.app_fail') })
        } else {
          this.formErrorMessagesFromApi = err.response.data.data
        }
      }
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
.authorization-form {
  span {
    display: flex;
    justify-content: center;
    margin: 20px 0 0;
    font-size: 14px;
    color: $bali;
  }
}
@media screen and (max-width: 980px) {
  .page__password-recovery.authorization {
    .authorization-form {
      width: 100%;
    }
  }
}
</style>
