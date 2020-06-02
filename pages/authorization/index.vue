<template>
  <div class="page page__initial-authorization authorization">
    <p class="heading heading-title">
      {{ $t('frontend.login_title') }}
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
        :alias="['', 'mobile_phone']"
        @input="updateInput"
      />
      <s-input
        v-model.trim="formData.password"
        :label="$t('frontend.login_password_label')"
        type="password"
        :show-hide-ico="true"
        :error-message="fieldErrorData('password').message"
        :has-error="fieldErrorData('password').hasError"
        :data="$v.formData.password"
        :alias="['', 'password']"
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
        {{ $t('frontend.login_enter') }}
      </s-button>
      <nuxt-link
        :to="localePath('password-recovery')"
        class="link"
      >
        {{ $t('frontend.login_forgot') }}
      </nuxt-link>
    </form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { required, requiredIf, minLength, maxLength } from 'vuelidate/lib/validators'
import numericMinLength from '~/utils/validators/numericMinLength'
import fieldErrors from '~/mixins/fieldErrors'
export default {
  name: 'Authorization',
  middleware: 'authGuard',
  layout: 'simple',
  components: {},
  mixins: [fieldErrors],
  data: () => ({
    formData: {
      mobile_phone: null,
      password: null,
      inn: null
    },
    isInnRequired: false,
    isSubmitButtonLoading: false
  }),
  computed: {
    ...mapGetters({
      getUserData: 'auth/getUserData'
    })
  },
  watch: {
    //  if mobile_phone changed and not equal to old value
    //  hide inn field
    'formData.mobile_phone': function (val, oldVal) {
      if (val !== oldVal) {
        this.isInnRequired = false
        this.formData.inn = null
      }
    }
  },
  validations() {
    return {
      formData: {
        mobile_phone: {
          required,
          numericMinLength: numericMinLength(10)
        },
        password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(36)
        },
        inn: {
          required: requiredIf(() => { return this.isInnRequired }),
          numericMinLength: numericMinLength(10)
        }
      }
    }
  },
  methods: {
    ...mapActions({
      login: 'auth/login',
      loginWithUrlToken: 'auth/loginWithUrlToken',
      toggleInformalMessage: 'toggleInformalMessage',
      fetchProfile: 'formConstructor/fetchProfile'
    }),
    async onFormSubmit() {
      this.$v.formData.$touch()
      if (this.$v.formData.$error) return
      this.isSubmitButtonLoading = true
      const payload = {
        mobile_phone: this.formData.mobile_phone,
        password: this.formData.password,
        inn: this.formData.inn
      }
      try {
        await this.login(payload)
        if (this.getUserData.is_verified) {
          const isProfileFull = await this.fetchProfile()
          isProfileFull.is_profile_full ? this.$router.push(this.localePath('index')) : this.$router.push(this.localePath('profile'))
        } else {
          this.$router.push(this.localePath('phone-verification'))
        }
      } catch (err) {
        //  460 error code means inn required
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
