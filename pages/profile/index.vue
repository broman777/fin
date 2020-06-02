<template>
  <div class="page__offers profile">
    <div class="box">
      <p class="heading">
        {{ $t('frontend.profile_title') }}
      </p>
      <!-- <s-datepicker
        v-model="field"
        placeholder="XX.XX.XXXX"
        type="text"
      /> -->
      <s-ntf v-show="!isValid && $v.formData.$dirty" class="ntf-warn">
        <p class="ntf-title">
          {{ $t('frontend.profile_warning-title') }}
        </p>
        <p>
          {{ $t('frontend.profile_warning-text') }}
        </p>
      </s-ntf>
      <div
        v-for="(group, groupAlias) in groupList"
        v-show="!groupList[groupAlias].isHidden"
        :key="groupAlias"
        class="group"
      >
        <p
          v-show="!Array.isArray(group.fields)"
          class="heading-small"
        >
          {{ group.title }}
        </p>
        <div class="data">
          <s-input
            v-for="(input, inputAlias) in group.fields"
            v-show="fieldList[inputAlias].isVisible"
            :key="inputAlias"
            :value="formData[inputAlias]"
            :has-initial="true"
            :has-error="fieldErrorData(inputAlias).hasError"
            :bindings="fieldList[inputAlias].bindings"
            :alias="[groupAlias, inputAlias]"
            :type="input.type"
            :error-message="fieldErrorData(inputAlias).message"
            :error="$v.formData[inputAlias].$error"
            :label="input.title"
            :options="fieldList[inputAlias].values"
            :placeholder="input.placeholder"
            :hint="input.hint"
            @input="updateInput"
          />
        </div>
      </div>
      <!-- accept rules   -->
      <div :class="{'error': !acceptedRules && $v.formData.$dirty}" class="form-group checkbox">
        <label>
          <input v-model="acceptedRules" type="checkbox">
          <span class="txt">{{ $t('frontend.profile_agree-text') }} <a href="#">{{ $t('frontend.profile_agree-link') }}</a></span>
        </label>
      </div>
      <div class="btns">
        <s-button
          theme="red"
          width="300px"
          gap-y="20px"
          @click="sendForm('app')"
        >
          {{ $t('frontend.profile_link-send') }}
        </s-button>
        <s-button
          theme="transparent"
          width="300px"
          gap-y="20px"
          @click="sendForm"
        >
          {{ $t('frontend.profile_link-save') }}
        </s-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { requiredIf, email, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators'
import pattern from '~/utils/validators/pattern'
import date from '~/utils/validators/date'
import minDate from '~/utils/validators/minDate'
import maxDate from '~/utils/validators/maxDate'
import fieldErrors from '~/mixins/fieldErrors'
// import SDatepicker from '~/components/shared/SDatepicker'

export default {
  name: 'Profile',
  middleware: 'authGuard',
  components: {
    // SDatepicker
  },
  mixins: [fieldErrors],
  data() {
    return {
      field: '',
      groupList: {}, // for rendering inputs in html by groups
      fieldList: {}, // initial value list from backend
      formData: {}, // for vuelidate object update
      formSender: null,
      acceptedRules: false
    }
  },
  validations() {
    const v = {
      formData: {}
    }
    for (const i in this.fieldList) {
      const field = this.fieldList[i]
      const rules = field.validationRules
      // set empty vuelidate rule
      v.formData[i] = {}
      // set validation rules from backend list
      if (field.type === 'email') {
        v.formData[i] = { email }
      } else if (field.type === 'date') {
        v.formData[i] = { date }
      }
      if (!Array.isArray(rules)) {
        if (rules.required) v.formData[i].required = requiredIf(() => { return field.isVisible })
        if (rules.minlength) v.formData[i].minLength = minLength(rules.minlength.value)
        if (rules.maxlength) v.formData[i].maxLength = maxLength(rules.maxlength.value)
        if (rules.pattern) v.formData[i].pattern = pattern(rules.pattern.value)
        if (rules.min) v.formData[i].minValue = minValue(rules.min.value)
        if (rules.max) v.formData[i].maxValue = maxValue(rules.max.value)
        if (rules.minDate) v.formData[i].minDate = minDate(rules.minDate.value)
        if (rules.maxDate) v.formData[i].maxDate = maxDate(rules.maxDate.value)
      }
    }
    return v
  },
  computed: {
    ...mapGetters({
      getGroupList: 'formConstructor/getGroupList',
      getFieldList: 'formConstructor/getFieldList',
      getProfileData: 'formConstructor/getProfileData',
      getCalculatorData: 'offer/getCalculatorData'
    }),
    isValid() {
      return !this.$v.formData.$invalid && this.acceptedRules
    }
  },
  async created() {
    await this.fetchProfile()
    await this.fetchMapping('test')
    await this.fetchForm('test')
    this.profileData = this.getProfileData
    this.groupList = this.getGroupList
    this.fieldList = this.getFieldList
    this.formSender = setInterval(() => { this.sendForm('force') }, 20000)
  },
  destroyed() {
    clearInterval(this.formSender)
  },
  methods: {
    ...mapActions({
      fetchForm: 'formConstructor/fetchForm',
      loanRequest: 'offer/loanRequest',
      fetchProfile: 'formConstructor/fetchProfile',
      fetchMapping: 'formConstructor/fetchMapping',
      updateProfile: 'formConstructor/updateProfile',
      toggleInformalMessage: 'toggleInformalMessage'
    }),
    toBackend(data) {
      // TODO: move to helpers & finish backend convert
      const result = {}
      for (const alias in data) {
        const value = data[alias]
        if (value !== null) {
          if (typeof value === 'object' && value.hasOwnProperty('value')) {
            // if value is object (radiogroup/select)
            result[alias] = value.value
          } else {
            // if value other
            result[alias] = value
          }
        }
      }
      return result
    },
    async sendForm(prop) {
      if (prop !== 'force') this.$v.formData.$touch()
      if (this.isValid || prop === 'force') {
        try {
          const alias = (prop === 'force') ? 'test?noLoader=true' : 'test'
          const form = await this.toBackend(this.formData)
          this.updateProfile({ alias: alias, data: form })
          if (prop === 'app' && this.isValid) {
            this.$cookies.set('isLoanRequestApplied', 'true', { maxAge: 300 })
            await this.loanRequest({
              ...this.getCalculatorData,
              mobile_phone: this.getProfileData.mobile_phone,
              inn: this.getProfileData.inn
            })
            this.toggleInformalMessage({
              type: 'success',
              message: this.$t('frontend.app_sent')
            })
            this.$router.push(this.localePath('index'))
          } else if (prop !== 'force') this.toggleInformalMessage({ type: 'success', message: this.$t('frontend.app_success') })
        } catch (err) {
          // if validation error - get errors from backend
          if (err.response.status && err.response.status === 422) {
            this.formErrorMessagesFromApi = err.response.data.data
          } else {
            this.toggleInformalMessage({ type: 'error', message: this.$t('frontend.app_fail') })
            console.warn(err) // if any other errors (not validation)
          }
        }
      } else {
        if (this.$v.formData.$invalid) {
          const invalid = document.querySelector('.form-group.error')
          window.scrollTo(0, invalid.offsetTop)
        } else window.scrollTo(0, 9999)
        this.toggleInformalMessage({ type: 'warning', message: this.$t('frontend.app_warn') })
        console.warn(this.$v.formData)
      }
    },
    updateInput(value, alias, noCheck) {
      this.$set(this.formData, alias, value)
      if (!noCheck) this.$v.formData[alias].$touch()
    }
  }
}
</script>

<style lang="scss">
  .reg_data {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .profile {
    .heading-small {
      display: block;
      width: 100%;
      font-size: 14px;
      line-height: 1.3;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    .heading-hint {
      display: block;
      width: 100%;
      font-size: 14px;
      line-height: 1.3;
      font-weight: 600;
      text-transform: uppercase;
      color: $bali;
      margin-bottom: 12px;
    }
    .data{
      display: flex;
      flex-wrap: wrap;
      margin: 0 0 30px -30px;
      .heading {width: 100%;}
      .form-group {
        width: calc(33.33% - 30px);
        margin: 0 0 35px 30px;
        &.full {
          width: 100%;
          margin-right: 0;
        }
      }
      .form-group.checkbox {
        white-space: nowrap;
        label {
          max-width: calc(100% - 20px);
        }
      }
    }
    .multiselect {
      padding: 0;
    }
    .checkbox {
      margin: -10px 0 50px;
      a {
        color: $radical;
        text-decoration: underline;
        &:hover {
          color: $radical-h;
        }
      }
    }
    .btns {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .s-button {
        margin-right: 24px !important;
      }
    }
  }
  @media screen and (max-width: $mobMax) {
    .profile {
      .checkbox {
        margin-bottom: 30px;
      }
      .data {
        margin: 0 0 12px;
        .form-group {
          width: 100%;
          margin: 0 0 12px;
        }
      }
      .heading {
        margin-bottom: 12px;
        &-small,
        &-hint {
          margin-bottom: 4px;
        }
      }
      .btns {
        flex-direction: column;
        .s-button {
          margin-right: 0 !important;
          max-width: 100%;
        }
      }
    }
  }
</style>
