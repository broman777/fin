<template>
  <div class="page page__set-password authorization">
    <div class="box">
      <p class="heading">
        Установите пароль
      </p>
      <p class="sub-heading">
        Введите постоянный пароль
      </p>
      <form
        novalidate
        class="authorization-form"
        @submit.prevent="onFormSubmit"
      >
        <s-input
          v-model.trim="formData.newPassword"
          :label="$t('frontend.login_pwd_label2')"
          type="password"
          :show-hide-ico="true"
          :error-message="fieldErrorData('newPassword').message"
          :has-error="fieldErrorData('newPassword').hasError"
          :data="$v.formData.newPassword"
          :validation="$v.formData.newPassword"
          :alias="['', 'newPassword']"
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
      </form>
    </div>
  </div>
</template>
<script>
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import fieldErrors from '~/mixins/fieldErrors'
export default {
  name: 'SetPasswordPage',
  middleware: 'authGuard',
  layout: 'simple',
  mixins: [fieldErrors],
  data: () => ({
    formData: {
      newPassword: null,
      confirmPassword: null
    },
    isSubmitButtonLoading: false
  }),
  computed: {},
  validations() {
    return {
      formData: {
        newPassword: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(36)
        },
        confirmPassword: {
          required,
          maxLength: maxLength(36),
          sameAs: sameAs('newPassword')
        }
      }
    }
  },
  methods: {
    ...mapActions({
      setPassword: 'auth/setPassword',
      toggleInformalMessage: 'toggleInformalMessage'
    }),
    async onFormSubmit() {
      this.$v.formData.$touch()
      if (this.$v.formData.$error) return
      this.isSubmitButtonLoading = true
      const payload = {
        newPassword: this.formData.newPassword,
        confirmPassword: this.formData.confirmPassword
      }
      try {
        await this.setPassword(payload)
        this.$router.push(this.localePath('profile'))
        this.toggleInformalMessage({ type: 'success', message: this.$t('frontend.app_password_set') })
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
  .page__set-password.authorization {
    .set-password-form {
      width: 100%;
    }
  }
}
</style>
