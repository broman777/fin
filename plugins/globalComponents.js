import Vue from 'vue'

import SUserMenu from '~/components/shared/SUserMenu'
import SInput from '~/components/shared/SInput'
import SModal from '~/components/shared/SModal'
import SButton from '~/components/shared/SButton'
import SNtf from '~/components/shared/SNtf'
import Vuelidate from 'vuelidate'
import MaskedInput from 'vue-text-mask'
import Multiselect from 'vue-multiselect'
import DatePickerMasked from 'vue2-datepicker-mask'
import VuejsDatePicker from 'vuejs-datepicker'
import Loader from '~/components/loader'

Vue.component('s-user-menu', SUserMenu)
Vue.component('s-button', SButton)
Vue.component('s-input', SInput)
Vue.component('s-modal', SModal)
Vue.component('s-ntf', SNtf)
Vue.use(Vuelidate)
Vue.component('masked-input', MaskedInput)
Vue.component('multiselect', Multiselect)
Vue.component('s-input-datepicker-masked', DatePickerMasked)
Vue.component('datepicker', VuejsDatePicker)
Vue.component('loader', Loader)
