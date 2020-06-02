<template>
  <div>
    <calculator-range
      ref="calculatorSum"
      :min="calculator.sum.min"
      :max="calculator.sum.max"
      :step="500"
      :round-number="100"
      :default-value="calculator.sum.value"
      :title="$t('frontend.loan-sum')"
      :suffix="'₴'"
      @change="onSumValueChange"
    />
    <calculator-range
      ref="calculatorTerm"
      :min="calculator.term.min"
      :max="calculator.term.max"
      :step="1"
      :default-value="calculator.term.value"
      :title="$t('frontend.loan-term-need')"
      :suffix="$t('frontend.days')"
      @change="onDayValueChange"
    />
    <calculator-credit-application
      :sum="calculator.sum.value"
      :days="calculator.term.value"
      :commission="calculatedCommission"
      :date="calculatedDate"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import CalculatorRange from './CalculatorRange'
import CalculatorCreditApplication from './CalculatorCreditApplication'

export default {
  name: 'SCalculator',
  components: {
    CalculatorRange,
    CalculatorCreditApplication
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      calculator: {
        term: {
          value: 18,
          min: 3,
          max: 30
        },
        sum: {
          value: 3500,
          min: 1000,
          max: 30000
        }
      },
      calulatorData: {}
    }
  },
  computed: {
    ...mapGetters({
      getCalculatorData: 'offer/getCalculatorData',
      getProfileCalculatorData: 'formConstructor/getProfileCalculatorData'
    }),
    calculatedInterest() {
      return Number(this.calculator.sum.value * this.calculator.term.value * (0.01 / 100))
    },
    calculatedBaseCommission() {
      return Number(0 * this.calculator.sum.value / 100)
    },
    calculatedCommission() {
      return this.roundNumber(this.calculatedInterest + this.calculatedBaseCommission)
    },
    calculatedDate() {
      const date = new Date(new Date().getTime() + (this.calculator.term.value * 24 * 60 * 60 * 1000))
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() // if day is 1, 2, 3 etc make it 01, 02
      const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1 // same with month
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    },
    isProfileCalculatorData() {
      if (parseInt(this.getProfileCalculatorData.credit_sum) || this.getProfileCalculatorData.credit_term) {
        return (parseInt(this.getProfileCalculatorData.credit_sum) && parseInt(this.getProfileCalculatorData.credit_sum) !== 0) && (this.getProfileCalculatorData.credit_term && this.getProfileCalculatorData.credit_term !== 0)
      } else {
        return false
      }
    }
  },
  watch: {
    'calculator': {
      handler(val) {
        this.setCalculatorData({
          credit_term: this.calculator.term.value,
          credit_sum: this.calculator.sum.value
        })
      },
      deep: true
    }
  },
  mounted() {
    if (localStorage.getItem('landingCreditSum') && localStorage.getItem('landingCreditTerm')) {
      this.calulatorData = {
        credit_sum: parseInt(localStorage.getItem('landingCreditSum')),
        credit_term: parseInt(localStorage.getItem('landingCreditTerm'))
      }
    } else if (this.isProfileCalculatorData) {
      this.calulatorData = {
        credit_sum: parseInt(this.getProfileCalculatorData.credit_sum),
        credit_term: parseInt(this.getProfileCalculatorData.credit_term)
      }
    }

    if (this.calulatorData.credit_sum < this.calculator.sum.min) {
      this.calculator.sum.value = this.calculator.sum.min
      this.$refs.calculatorSum.value = this.calculator.sum.value
    } else if (this.calulatorData.credit_sum > this.calculator.sum.max) {
      this.calculator.sum.value = this.calculator.sum.max
      this.$refs.calculatorSum.value = this.calculator.sum.value
    } else if (this.calulatorData.credit_term < this.calculator.term.min) {
      this.calculator.term.value = this.calculator.term.min
      this.$refs.calculatorTerm.value = this.calculator.term.value
    } else if (this.calulatorData.credit_term > this.calculator.term.max) {
      this.calculator.term.value = this.calculator.term.max
      this.$refs.calculatorTerm.value = this.calculator.term.value
    } else {
      this.calculator.sum.value = this.calulatorData.credit_sum
      this.$refs.calculatorSum.value = this.calculator.sum.value
      this.calculator.term.value = this.calulatorData.credit_term
      this.$refs.calculatorTerm.value = this.calculator.term.value
    }
    // this.setCalculatorData({
    //   credit_term: this.calculator.term.value,
    //   credit_sum: this.calculator.sum.value
    // })
  },
  methods: {
    ...mapActions({
      setCalculatorData: 'offer/setCalculatorData'
    }),
    onSumValueChange(val) {
      if (val < this.calculator.sum.min) val = this.calculator.sum.min
      else if (val > this.calculator.sum.max) val = this.calculator.sum.max
      this.calculator.sum.value = Number(val)
    },
    onDayValueChange(val) {
      this.calculator.term.value = Number(val)
    },
    roundNumber(num) {
      return Number(Math.round(num + 'e' + 1) + 'e-' + 1)
    }
  }
}
</script>

<style lang='scss' scoped>
.calculator {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  &_homepage, &_static-page {
    .calculator {
      &__part {
        &_range {
          flex: 1;
          width: calc(100% / 3 * 2 + 0px);
        }

        &_credit-application {
          width: calc(100% / 3 + 0px);
          min-width: 313px;
        }
      }
    }
  }

  &_homepage {
    min-height: 413px;

    .calculator {
      &__button-take-credit {
        display: none;
      }
    }
  }

  &_registration {
    width: 293px;

    .calculator {
      &__part {
        &_range {
          border: none;

          order: 2;
        }

        &_credit-application {
          background: linear-gradient(to bottom, #3ba7b3 0%, #26887e 100%);

          order: 1;

          &__button-take-credit {
            display: none;
          }

          &_range-visible-in-registration {
            height: 200px;
            overflow: hidden;
          }
        }
      }
    }
  }

  &_aside {
    flex-direction: column;
    width: 100%;

    .calculator {
      &__part {
        &_range {
          border: none;
        }
      }
      &__button-take-credit {
        margin: 0 20px;
      }
    }
  }

  &.card {
    padding: 0;
  }

  &__title {
    position: relative;
    width: 100%;
    height: 58px;
    padding: 17px 20px 17px 83px;
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;
    color: #ffffff;
    background: linear-gradient(
    150deg,
    #48c379 0%,
    #48c37a 80%,
    #37a483 80%,
    #37a483 92%,
    #42ab7a 92%,
    #42ab7a 100%
    );

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, .35) 0%,
      rgba(255, 255, 255, .2) 30%,
      rgba(255, 255, 255, 0) 60%,
      rgba(255, 255, 255, 0) 100%
      );
      content: "";
    }
  }

  &__part {
    &_range {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      padding: 42px 30px 15px 30px;
      border-right: 1px solid #dbdbdb;

      justify-content: flex-start;
    }

    &_credit-application {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 38px 20px 20px;

      justify-content: flex-start;
    }
  }
}

.button-done-aside-registration {
  margin-left: auto;
}

</style>
