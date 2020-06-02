<template>
  <section class="page__offers">
    <div class="box">
      <p class="heading">Новая заявка</p>
      <p class="sub-heading">Подтвердите, пожалуйста, актуальность данных</p>
      <div class="offer">
        <ul class="offer_params">
          <li
            v-for="(item, i) in getProfileCard"
            :key="`item-${i}`"
          >
            {{ item.title }}
            <span>{{ item.value }}</span>
          </li>
        </ul>
      </div>
      <s-button
        theme="red"
        type="button"
        gap-y="20px"
        @click="sendRequest"
      >
        {{ $t('frontend.send-application') }}
      </s-button>
      <s-button
        :to="localePath('profile')"
        theme="transparent"
      >
        {{ $t('frontend.change-data') }}
      </s-button>
      <nuxt-link to="/" class="offer_discard">
        Отменить подачу заявки
      </nuxt-link>
    </div>
  </section>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  middleware: 'authGuard',
  data: () => ({
    userPhone: null,
    userInn: null
  }),
  computed: {
    ...mapGetters({
      getCalculatorData: 'offer/getCalculatorData',
      getUserData: 'auth/getUserData',
      getProfileCard: 'formConstructor/getProfileCard'
    })
  },
  mounted() {
    this.userPhone = this.$cookies.get('userPhone')
    this.userInn = this.$cookies.get('userInn')
  },
  methods: {
    ...mapActions({
      loanRequest: 'offer/loanRequest',
      toggleInformalMessage: 'toggleInformalMessage'
    }),
    async sendRequest() {
      try {
        await this.loanRequest({
          ...this.getCalculatorData,
          mobile_phone: this.userPhone,
          inn: this.userInn
        })
        this.$cookies.set('isLoanRequestApplied', 'true', { maxAge: 300 })
        //  redirect to dashboard
        this.$router.push(this.localePath('index'))
        //  show informal success message
        this.toggleInformalMessage({
          type: 'success',
          message: 'Ваша заявка принята! Идет поиск предложений, пожалуйста, ожидайте.'
        })
      } catch (err) {
        this.toggleInformalMessage({ type: 'error', message: this.$t('frontend.app_fail') })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .page__offers {
    text-align: center;
    .heading {
      text-align: center;
      margin-bottom: 24px;
    }
    .offer {
      box-shadow: initial;
      border: 0;
    }
    .s-button {
      max-width: 300px;
      margin-left: auto;
    }
  }
  .offer {
    color: $bali;
    display: block;
    width: 100%;
    max-width: 360px;
    margin: 24px auto 40px;
    @include shadow(#fff);
    text-align: left;
    font-weight: 600;
    text-transform: uppercase;
    &_partner {
      color: $space;
      height: 73px;
      font-size: 14px;
      border-bottom: 1px solid $mystic;
      padding: 6px 28px;
      @include flex(space-between, center);
      margin-bottom: 20px;
      img {
        display: block;
        max-width: 50%;
        max-height: 100%;
      }
    }
    &_params {
      padding: 14px 28px 32px;
      li {
        font-size: 11px;
        border-bottom: 1px solid $selago;
        padding: 18px 0 12px;
      }
      span {
        text-transform: none;
        display: block;
        font-size: 13px;
        line-height: 1.3;
        color: $space;
        font-weight: normal;
        margin-top: 4px;
        position: relative;
        overflow: hidden;
        word-wrap: break-word;
      }
    }
    &_login {
      display: block;
      width: 100%;
      background-color: $zumor;
      padding: 10px 28px 40px;
      label {
        font-size: 11px;
        @include flex(space-between, inherit);
        border-bottom: 1px solid #fff;
        padding-top: 7px;
        line-height: 36px;
      }
      input {
        max-width: 50%;
        border: none;
        outline: none;
        background: transparent!important;
        text-align: right;
        padding: 0;
        color: $space;
        &::placeholder {
          color: $space;
        }
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        box-shadow: 0 0 0 30px $zumor inset !important;
        -webkit-box-shadow: 0 0 0 30px $zumor inset !important;
      }
    }
    &_discard {
      color: $radical;
      display: block;
      max-width: 300px;
      margin: 20px auto;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
      &:hover {
        color: $radical-h;
      }
    }
  }
</style>
