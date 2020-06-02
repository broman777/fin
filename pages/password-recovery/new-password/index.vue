<template>
  <div class="page page__password-recovery authorization">
    <div class="box">
      <p class="heading">
        {{ $t('frontend.login_restore-title') }}
      </p>
      <p class="sub-heading">
        {{ $t('frontend.login_restore-new') }}
      </p>
      <form
        novalidate
        class="authorization-form"
        @submit.prevent="onFormSubmit"
      >
        <s-input
          v-model.trim="formData.password"
          :label="$t('frontend.login_pwd_label2')"
          type="password"
          :show-hide-ico="true"
          :error-message="fieldErrorData('password').message"
          :has-error="fieldErrorData('password').hasError"
          :data="$v.formData.password"
          :validation="$v.formData.password"
          :alias="['', 'password']"
          @input="updateInput"
        />
        <s-input
          v-model.trim="formData.confirmPassword"
          :label="$t('frontend.login_pwd_label3')"
          type="password"
          :show-hide-ico="true"
          :error-message="fieldErrorData('confirmPassword').message"
          :has-error="fieldErrorData('confirmPassword').hasError"
          :data="$v.formData.confirmPassword"
          :validation="$v.formData.confirmPassword"
          :alias="['', 'confirmPassword']"
          @input="updateInput"
        />
        <s-button
          theme="red"
          type="button"
          gap-y="19px"
          :is-loading="isSubmitButtonLoading"
        >
          Далее
        </s-button>
        <nuxt-link
          :to="localePath('authorization')"
          class="link"
        >
          {{ $t('frontend.login_back-enter') }}
        </nuxt-link>
      </form>
    </div>
  </div>
</template>
<script>
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import fieldErrors from '~/mixins/fieldErrors'
export default {
  name: 'PhoneConfirmPage',
  middleware: 'authGuard',
  layout: 'simple',
  mixins: [fieldErrors],
  data: () => ({
    formData: {
      code: null,
      password: null,
      confirmPassword: null
    },
    isSubmitButtonLoading: false
  }),
  computed: {
    ...mapGetters({ getPasswordRecoveryToken: 'auth/getPasswordRecoveryToken' })
  },
  validations() {
    return {
      formData: {
        password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(36)
        },
        confirmPassword: {
          required,
          maxLength: maxLength(36),
          sameAs: sameAs('password')
        }
      }
    }
  },
  methods: {
    ...mapActions({
      passwordRecoveryNew: 'auth/passwordRecoveryNew',
      toggleInformalMessage: 'toggleInformalMessage'
    }),
    async onFormSubmit() {
      this.$v.formData.$touch()
      if (this.$v.formData.$error) return
      this.isSubmitButtonLoading = true
      const payload = {
        password: this.formData.password,
        confirmPassword: this.formData.confirmPassword,
        token: this.$cookies.get('passwordRecoveryToken')
      }
      try {
        await this.passwordRecoveryNew(payload)
        this.$router.push(this.localePath('authorization'))
      } catch (err) {
        if (err.response.status && err.response.status === 400) {
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
@media screen and (max-width: 980px) {
  .page__password-recovery.authorization {
    .authorization-form {
      width: 100%;
    }
  }
}
</style>
