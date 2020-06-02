<template>
  <div class="page page__phone-verification authorization">
    <div class="box">
      <p class="heading">
        Верификация номера
      </p>

      <p class="sub-heading">
        {{ $t('frontend.login_restore-code') }}
      </p>
      <form
        class="authorization-form"
        @submit.prevent="onFormSubmit"
      >
        <s-input
          v-model.trim="formData.code"
          :label="'Код пароль'"
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
          type="button"
          theme="red"
          gap-y="19px"
          :is-loading="isSubmitButtonLoading"
        >
          {{ $t('frontend.send') }}
        </s-button>

        <span>{{ $t('frontend.no-sms-code') }}</span>
        <span
          class="link"
          @click="resendVerifyCode()"
        >
          {{ $t('frontend.resend-one-more') }}
        </span>
      </form>
    </div>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators'
import numericMinLength from '~/utils/validators/numericMinLength'
import { mapActions } from 'vuex'
import fieldErrors from '~/mixins/fieldErrors'
export default {
  name: 'PhoneVerificationPage',
  middleware: 'authGuard',
  layout: 'simple',
  mixins: [fieldErrors],
  data: () => ({
    formData: { code: null },
    isSubmitButtonLoading: false
  }),
  validations() {
    return {
      formData: {
        code: { required, numericMinLength: numericMinLength(4) }
      }
    }
  },
  methods: {
    ...mapActions({
      verifyPhone: 'auth/verifyPhone',
      toggleInformalMessage: 'toggleInformalMessage',
      fetchProfile: 'formConstructor/fetchProfile',
      resendVerifyPhone: 'auth/resendVerifyPhone'
    }),
    async onFormSubmit() {
      this.$v.formData.$touch()
      if (this.$v.formData.$error) return
      this.isSubmitButtonLoading = true
      const payload = { code: this.formData.code }
      try {
        await this.verifyPhone(payload)
        this.$router.push(this.localePath('profile'))
      } catch (err) {
        if (err.response.status && err.response.status === 400) {
          this.toggleInformalMessage({ type: 'error', message: this.$t('frontend.app_fail') })
        } else {
          this.formErrorMessagesFromApi = err.response.data.data
        }
      }
      this.isSubmitButtonLoading = false
    },
    async resendVerifyCode() {
      try {
        await this.resendVerifyPhone()
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
.page__phone-verification {
  .link {
    display: inline-flex;
  }
  .link__back {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    transition: initial;

    align-items: center;
    i {
      margin-right: 8px;

      @include sprite("back-arrow");
    }
    &:hover i {
      @include sprite("back-arrow_hover");
    }
  }
  span {
    font-size: 14px;
    color: $bali;
  }
}
@media screen and (max-width: 980px) {
  .page__phone-verification {
    .link__back {
      top: -35px;
      right: initial;
      left: 0;
    }
    &.authorization {
      padding-top: 96px;
    }
  }
}

</style>
