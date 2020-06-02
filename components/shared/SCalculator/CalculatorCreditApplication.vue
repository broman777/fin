<template>
  <div
    class="credit-application"
  >
    <ul class="credit-application__info">
      <li
        v-for="infoItem in infoList"
        :key="infoItem.title"
        class="info__item"
      >
        <div class="info__title">
          {{ infoItem.title }}
        </div>
        <div class="info__value">
          {{ infoItem.value }} {{ infoItem.suffix }}
        </div>
      </li>
    </ul>
    <s-button
      :to="localePath('confirm-application')"
      theme="red"
      class="credit-application__button-take-credit"
      width="240px"
      gap-x="initial"
    >
      {{ $t('frontend.send-application') }}
    </s-button>
  </div>
</template>

<script>
export default {
  name: 'CalculatorCreditApplication',
  props: {
    sum: {
      type: Number,
      default: 0
    },
    days: {
      type: Number,
      default: 0
    },
    date: {
      type: String,
      default: ''
    }
  },
  computed: {
    infoList() {
      return [
        {
          title: this.$t('frontend.loan-term'),
          suffix: this.$t('frontend.days'),
          value: this.days
        },
        {
          title: this.$t('frontend.modal_credit-sum'),
          suffix: '₴',
          value: this.sum
        },
        {
          title: this.$t('frontend.maturity-day'),
          value: this.date
        }
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.credit-application {
  display: flex;
  min-height: 95px;
  padding: 25px 30px;
  margin-top: -16px;
  background-color: $zumor;
  align-items: center;
  justify-content: space-between;
  .s-button {
    max-width: 24%;
  }
  .credit-application__info {
    display: flex;
    min-width: 66%;
    justify-content: space-between;
    li {
      display: inline-flex;

      align-items: center;
    }
    .info__title {
      margin-right: 8px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      color: $bali;
    }
    .info__value {
      width: 64px;
      margin-right: 8px;
    }
  }
}
@media screen and (max-width: 980px) {
  .credit-application {
    width: 100%;
    max-width: 280px;
    min-height: initial;
    padding: 0;
    margin: 0 auto;
    .credit-application__info {
      display: none;
    }
    .s-button {
      max-width: none;
      width: 100% !important;
    }
  }
}

</style>
