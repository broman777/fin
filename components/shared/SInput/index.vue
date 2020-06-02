<template>
  <div
    :class="{
      disabled,
      'error' : isErrorClass ,
      'select' : type == 'select',
      'checkbox' : type == 'checkbox',
      'radio' : type == 'radio'
    }"
    class="form-group"
  >
    <!-- masked datepicker -->
    <s-input-datepicker-masked
      v-if="type == 'date'"
      v-model="model"
      :class="{'has-content':model || searching}"
      :lang="dateCfg"
      :disabled="disabled"
      :editable="true"
      date-format="YYYY-MM-DD"
      format="dd.MM.yyyy"
      @input="change(model)"
      @focus="focus()"
      @blur="unfocus()"
    />
    <!-- masked datepicker -->

    <!-- checkbox -->
    <input
      v-else-if="type == 'checkbox'"
      :id="alias.join('-')"
      v-model="model"
      type="checkbox"
      :disabled="disabled"
      @input="change(!model)"
    >

    <!-- select -->
    <multiselect
      v-else-if="type == 'select'"
      v-model="model"
      :class="{'has-content':model || isFocused}"
      :options="options"
      placeholder=""
      label="title"
      track-by="title"
      :searchable="searchable"
      :show-labels="false"
      @open="focus()"
      @close="unfocus()"
      @input="change(model)"
    >
      <span slot="noOptions">{{ $t('frontend.select_no-options') }}</span>
      <span slot="noResult">{{ $t('frontend.select_no-results') }}</span>
    </multiselect>
    <div
      v-else-if="type === 'radio'"
      class="radiogroup"
    >
      <label
        v-for="radio in options"
        :key="radio.value"
      >
        <input
          v-model="model"
          type="radio"
          :name="alias.join('-')"
          :value="radio"
          @input="change(radio)"
        >
        {{ radio.title }}
      </label>
    </div>

    <!-- phone input -->
    <masked-input
      v-else-if="type === 'phone'"
      v-model="model"
      :mask="mask"
      :disabled="disabled"
      type="text"
      :class="{'has-content':model}"
      @input="change(model)"
      @focus="focus"
      @blur="unfocus"
    />

    <!-- other input -->
    <masked-input
      v-else
      :id="alias.join('-')"
      v-model="model"
      :mask="mask"
      :disabled="disabled"
      :type="fieldType"
      :class="{'has-content':model}"
      @input="change(model)"
      @focus="focus"
      @blur="unfocus"
    />

    <!-- additional data for input -->
    <span
      v-if="type != 'checkbox'"
      class="focus-border"
    />
    <label
      v-if="label"
      :for="alias.join('-')"
    >
      {{ label }}
    </label>
    <i
      v-if="showHideIco"
      class="show-hide-ico"
      :class="{ 'active': isPasswordVisible }"
      @click="togglePasswordVisibility"
    />
    <div class="msg msg_error">
      {{ errorMessage }}
    </div>
    <div
      v-if="isFocused && hint && type != 'select'"
      class="hint"
    >
      {{ hint }}
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapMutations } from 'vuex'
import 'vue2-datepicker/locale/ru'
// import SDatepicker from '~/components/shared/SDatepicker'
export default {
  name: 'SInput',
  components: {
    // SDatepicker
  },
  props: {
    value: {
      type: [Object, Array, String, Boolean, Number, Date],
      default: () => null
    },
    bindings: {
      type: [Array],
      default: () => []
    },
    showHideIco: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: 'Необходимо заполнить'
    },
    hasError: {
      type: Boolean,
      default: false
    },
    hasInitial: {
      type: Boolean,
      default: false
    },
    alias: {
      type: Array,
      default: () => ([])
    },
    label: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    options: {
      type: [Object, Array],
      default: () => {}
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    error: {
      type: Boolean,
      default: false
    },
    maskType: {
      type: String,
      default: '',
      validator(value) {
        return ['phone', 'inn', 'phone-code', 'pesel', 'date', ''].includes(value)
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searching: false,
      isPasswordVisible: false,
      fieldType: this.type,
      model: null,
      isFocused: false,
      dateCfg: {
        formatLocale: {
          firstDayOfWeek: 1
        },
        monthBeforeYear: false
      },
      datepickerValue: '',
      datepickerDate: '',
      shortcuts: [
        {
          text: 'Today',
          start: new Date(),
          end: new Date()
        }
      ]
    }
  },
  computed: {
    isErrorClass() {
      return this.type !== 'select' && this.type !== 'checkbox' && this.type !== 'radio' ? Boolean(!this.isFocused && (this.error || this.hasError)) : Boolean(this.error || this.hasError)
    },
    searchable() {
      return this.options.length > 5
    },
    hasValue() {
      return this.model.length > 0
    },
    mask() {
      let mask = this.maskType
      if (this.type === 'phone') mask = this.type
      switch (mask) {
        case 'phone':
          return ['+', '3', '8', '(', '0', /[3-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]
        case 'inn':
          return [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        case 'phone-code':
          return [/\d/, /\d/, /\d/, /\d/]
        case 'pesel':
          return [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        case 'date':
          return [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]
        default:
          return false
      }
    }
  },
  watch: {
    value: function (newVal) {
      this.setValue(this.alias[1], newVal)
    }
  },
  created() {
    const alias = this.alias[1]
    if ((this.type === 'select' || this.type === 'radio') && this.options.length) {
      // set first option as selected
      // this.default = this.options[0]
    } else if ((this.type === 'checkbox')) {
      // this.setValue(this.alias[1], true)
    }
    if (this.hasInitial) this.change(this.$store.state.formConstructor.fieldList[alias].value, true)
  },
  methods: {
    ...mapMutations({
      setOptions: 'formConstructor/SET_OPTIONS',
      setVisibility: 'formConstructor/SET_VISIBILIY'
    }),
    setValue(alias, val, noTouch) {
      this.model = val
      this.$emit('input', val, alias, noTouch)
    },
    change(value, noTouch) {
      // convert date for datepicker
      if (value instanceof Date) value = moment(value).format('YYYY-MM-DD')
      // set value
      this.setValue(this.alias[1], value, noTouch)
      // check bindings list
      if (this.bindings.length) {
        for (const i in this.bindings) {
          const binding = this.bindings[i]
          if (binding['checkbox-binding']) {
            const child = binding['checkbox-binding'].field
            const showVal = JSON.parse(binding['checkbox-binding'].value)
            this.setVisibility([child, value === showVal])
          }
          if (binding['values-to-value']) {
            const child = binding['values-to-value'].field
            const options = binding['values-to-value'].value
            if (value !== null) {
              const selected = value.value
              this.setOptions([child, options[selected]])
              this.setValue(child, options[selected][0])
            } else {
              this.setOptions([child])
              this.setValue(child, null)
            }
          }
          if (binding['city-to-region']) {
            const child = binding['city-to-region'].field
            const options = binding['city-to-region'].value
            if (value && value !== null) {
              const selected = value.value
              this.setOptions([child, options[selected]])
            } else {
              this.setOptions([child])
            }
            this.setValue(child, null, noTouch)
            if (child === 'district') {
              this.setValue('city', '', noTouch)
              this.setOptions(['city'])
            }
          }
          if (binding['select-binding']) {
            const child = binding['select-binding'].field
            const showVal = binding['select-binding'].value
            const isVisible = (value != null && value.value === showVal)
            this.setVisibility([child, isVisible])
          }
        }
      }
    },
    togglePasswordVisibility() {
      if (this.isPasswordVisible) {
        this.fieldType = 'password'
      } else {
        this.fieldType = 'text'
      }
      this.isPasswordVisible = !this.isPasswordVisible
    },
    dateToValue(date) {
      if (!date) return
      const day = (`0${date.getDate()}`).slice(-2)
      const month = (`0${date.getMonth() + 1}`).slice(-2)
      const year = date.getFullYear()
      this.model = `${day}.${month}.${year}`
    },
    valueToDate() {
      if (!this.model) return
      if (this.model.match(/\d/g).join('').length < 8) return
      const dateArr = this.model.split('.')
      const year = dateArr[2]
      const month = parseInt(dateArr[1]) - 1
      const day = parseInt(dateArr[0])
      const newDate = new Date(year, month, day)
      this.datepickerDate = newDate
    },
    saveDateInputValue() {
      this.valueToDate()
      this.$emit('setTrackingData', this.tracking)
      this.$emit('input', this.model)
    },
    saveDateCalendarValue(date) {
      this.dateToValue(date)
      this.$emit('input', this.model)
    },
    focus() {
      this.isFocused = true
    },
    unfocus() {
      this.isFocused = false
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 45px;
  .debug {
    position: absolute!important;
    display:block;
    font-size: 0.8em!important;
    color: #999;
    right: 0;
    bottom: -12px;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  input[type=text],
  input[type=password],
  input[type=email],
  input[type=tel],
  input[type=number],
  .multiselect,
  .mx-datepicker {
    z-index: 5;
    display: block;
    width: 100% !important;
    margin-top: 18px;
    padding: 6px 0;
    font-size: 13px;
    color: $space;
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid $geyser;
    background-color: transparent;
     ~ label {
      position: absolute;
      top: 24px;
      left: 0;
      width: 100%;
      font-size: 13px;
      text-align: left;
      color: $bali;
      pointer-events: none;
      transition: .3s;
    }
    &:focus ~ label {
      top: 0;
      font-size: 10px;
      font-weight: 600;
      color: $bali;
      transition: .3s;
    }
    &:focus ~ .hint {
      display: block;
    }
     ~ .focus-border {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 10;
      width: 0;
      height: 1px;
      background-color: $ribon;
      transition: .3s;
    }
    &:focus ~ .focus-border {
      width: 100%;
      transition: .3s;
    }
    &.has-content ~ label {
      top: 0;
      font-size: 10px;
      font-weight: 600;
      transition: .3s;
    }
  }
  /deep/ .mx-datepicker {
    padding: 0;
    z-index: 100;
    /deep/ {
      input {
        background-color: transparent;
        z-index: 10;
        display: block;
        width: 100%;
        border: 0;
        border-radius: 0;
        line-height: normal;
        height: auto;
        box-shadow: none;
        padding: 6px 0;
        height: 28px;

        &::placeholder { font-size: 0; }
      }
    }
    .mx-input-icon__calendar {
      width: 15px;
      margin-right: 8px;
      background-image: url('~assets/img/calendar-i.svg') !important;
    }
  }
  .msg {
    position: absolute;
    top: 50px;
    left: 0;
    font-size: 11px;
    text-align: left;
    color: $geyser;
    pointer-events: none;
    opacity: 0;
    transition: all .2s;
    &.msg_error {
      color: $error;
    }
    &.msg_success {
      color: $success;
    }
  }
  &.checkbox {
    flex-direction: row;
    align-items: flex-end;
    label {
      padding: 3px 8px 4px;
    }
  }
  &.radio {
    justify-content: flex-end;
    &>label {
      position: absolute;
      top: 0;
      font-size: 10px;
      font-weight: 600;
      color: $bali;
      transition: .3s;
    }
    .radiogroup {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      label {
        cursor: pointer;
        margin: 0;
      }
      input {
        margin-right: 8px;
      }
    }
  }
}
.form-group.error {
  transition: all .2s;
  input[type=text], input[type=password], input[type=email], input[type=tel], input[type=number] {
    color: $error;
    border-bottom: 1px solid $error;
     ~ label {
      color: $error;
    }
    &:focus ~ label {
      color: $error;
    }
    &:focus ~ .focus-border, &.has-content ~ .focus-border {
      background-color: $error;
    }
  }
  .msg_error {
    opacity: 1;
  }
  /deep/ {
    .multiselect,
    .mx-datepicker {
      border-bottom: 1px solid $error;
      input {
        @include placeholder($error);
      }
      & ~ label {
        color: $error;
      }
      path {
        fill: $error;
      }
    }
  }
}
.form-group.success {
  input[type=text] {
    border-bottom: 1px solid $success;
     ~ .focus-border {
      background-color: $success;
    }
    &:focus ~ .focus-border, &.has-content ~ .focus-border {
      background-color: $success;
    }
  }
  .msg_success {
    top: 50px;
    opacity: 1;
  }
}
.form-group.disabled {
  input[type=text] {
    border-bottom: 1px solid rgba($geyser, .5);
     ~ label {
      color: rgba($bali, .5);
    }
  }
}
.form-group.radio {
  margin-bottom: 20px;
  label {
    display: flex;

    align-items: center;
  }
  span {
    position: relative;
    padding-left: 8px;
    font-size: 13px;
    &.txt {
      display: inline-block;
      font-weight: normal;
      text-transform: none;
      cursor: pointer;
    }
  }
  &.disabled {
    opacity: .5;
    input[type=radio] {
      background-color: $selago;
    }
  }
}
input[type=radio] {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 0;
  color: #ffffff;
  vertical-align: top;
  border-radius: 10%;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  transition: all .15s ease-out 0s;

  -ms-appearance: none;
  -o-appearance: none;
}

input[type=radio] {
  border: 1px solid $geyser;
  border-radius: 50%;
  background-color: #ffffff;
  &:checked {
    &:before {
      background: $radical;
      transform: scale(1);
    }
  }
  &:before {
    display: block;
    width: 8px;
    height: 8px;
    margin: 5px;
    border-radius: 50%;
    content: "";
    transition: all ease-out 250ms;
    transform: scale(0);
  }
}
.form-group {
  &.error {
    /deep/ .mx-datepicker .mx-input:focus {
      background-color: #fff;
    }
  }
  .show-hide-ico {
    position: absolute;
    right: 0;
    top: 24px;
    z-index: 15;
    cursor: pointer;
    @include sprite ("show-hide-ico");
    &.active {
      @include sprite ("show-hide-ico_active");
    }
  }
  .hint {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    font-size: 12px;
    line-height: 20px;
    padding: 14px 20px;
    margin-top: 16px;
    background-color: $lilac;
    z-index: 105;
    display: none;
    &:before {
      content:"";
      background-color: $lilac;
      width: 16px;
      height: 16px;
      display: block;
      position: absolute;
      top: -8px;
      left: 50%;
      transform: rotate(45deg);
      margin-left: -8px;
    }
  }
  .vdp-datepicker {
    width: 100%;
    &:after {
      content:"";
      z-index: -1;
      position: absolute;
      right: 0;
      top: 4px;
      @include sprite('date');
    }
  }
  &.select {
    cursor: pointer;
    .multiselect {
      width: 100%;
      color: $space;
      background-color: transparent;
      &:hover {
        .multiselect__select:before {
          @include sprite ("multiselect-arrow_hover");
        }
      }
    }
    &.has-content label {
      top: 0;
      font-size: 10px;
      font-weight: 600;
      transition: .3s;
    }
    &.disabled {
      opacity: .5;
      .multiselect:hover .multiselect__select:before {
        @include sprite("multiselect-arrow_static");
      }
    }
    &.error {
      label {
        color: $error;
      }
      .multiselect__tags {
        border-color: $error;
      }
      .multiselect__single {
        color: $error;
      }
      .multiselect .multiselect__select:before {
        @include sprite("multiselect-arrow_error");
      }
    }
  }
}

@media screen and (max-width: $mobMax) {
  .form-group {
    min-height: 39px;
    margin-bottom: 16px;
    input[type=text], input[type=password], input[type=email], input[type=tel], input[type=number], .multiselect, .vdp-datepicker {
      margin-top: 10px;
      & ~ label {
        top: 15px;
      }
    }
    .show-hide-ico {
      top: 14px;
    }
    &.error {
      .msg {
        width: 100%;
        top: auto!important;
        position: relative;
      }
    }
    &.radio {
      .radiogroup {
        margin-top: 8px;
        label {
          margin-top: 8px;
        }
      }
    }
    &.checkbox {
      min-height: 0;
      flex-wrap: wrap;
      label {
        padding: 3px 8px 4px;
      }
    }
  }
}
</style>
