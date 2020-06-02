<template>
  <section class="page page__password-change">
    <div class="box">
      <form
        class="form-centered"
        @submit.prevent="onFormSubmit"
      >
        <p class="heading">
          {{ $t('frontend.login_pwd_change-title') }}
        </p>
        <s-input
          v-model.trim="formData.currentPassword"
          :label="$t('frontend.login_pwd_label1')"
          type="password"
          :error-message="fieldErrorData('currentPassword').message"
          :has-error="fieldErrorData('currentPassword').hasError"
          :data="$v.formData.currentPassword"
          :alias="['', 'currentPassword']"
          @input="updateInput"
        />

        <s-input
          v-model.trim="formData.newPassword"
          :label="$t('frontend.login_pwd_label2')"
          type="password"
          :error-message="fieldErrorData('newPassword').message"
          :has-error="fieldErrorData('newPassword').hasError"
          :data="$v.formData.newPassword"
          :alias="['', 'newPassword']"
          :show-hide-ico="true"
          @input="updateInput"
        />

        <s-input
          v-model.trim="formData.confirmPassword"
          :label="$t('frontend.login_pwd_label2')"
          type="password"
          :error-message="fieldErrorData('confirmPassword').message"
          :has-error="fieldErrorData('confirmPassword').hasError"
          :data="$v.formData.confirmPassword"
          :alias="['', 'confirmPassword']"
          :show-hide-ico="true"
          @input="updateInput"
        />

        <s-button
          theme="red"
          type="button"
          width="300px"
        >
          {{ $t('frontend.login_pwd_change-btn') }}
        </s-button>
      </form>
    </div>
  </section>
</template>
<script>
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import fieldErrors from '~/mixins/fieldErrors'
export default {
  name: 'PasswordChangePage',
  middleware: 'authGuard',
  mixins: [fieldErrors],
  data: () => ({
    formData: {
      currentPassword: null,
      newPassword: null,
      confirmPassword: null
    },
    isSubmitButtonLoading: false
  }),
  validations() {
    return {
      formData: {
        currentPassword: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(36)
        },
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
      setNewPassword: 'auth/setNewPassword',
      toggleInformalMessage: 'toggleInformalMessage'
    }),
    async onFormSubmit() {
      this.$v.formData.$touch()
      if (this.$v.formData.$error) return
      this.isSubmitButtonLoading = true
      const payload = {
        currentPassword: this.formData.currentPassword,
        newPassword: this.formData.newPassword,
        confirmPassword: this.formData.confirmPassword
      }
      try {
        await this.setNewPassword(payload)
        this.toggleInformalMessage({ type: 'success', message: this.$t('frontend.app_password_changed') })
        this.$v.formData.$reset()
        this.formData = {
          currentPassword: null,
          newPassword: null,
          confirmPassword: null
        }
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
<style lang="scss">
.page__password-change {
  min-height: calc(100vh - 262px);
  padding: 68px 0;
  color: $space;
  background-color: #ffffff;
  .heading {
    margin-bottom: 34px;
  }
  .form-group {
    display: inline-flex;
    width: 300px;
    margin-right: 26px;
    margin-bottom: 50px;
  }
}
@media screen and (max-width: 980px) {
  .page__password-change {
    padding: 60px 20px;
    .form-group {
      width: 100%;
      margin-right: 0;
      margin-bottom: 34px;
    }
    .s-button {
      width: 100% !important;
    }
  }
}

</style>
