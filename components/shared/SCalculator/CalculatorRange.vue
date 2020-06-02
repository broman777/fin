<template>
  <div class="calculator__range range">
    <div class="range__header">
      <div class="range__title">
        {{ title }} ( {{ suffix }} )
      </div>
      <div class="range__current-value">
        <div class="form-group">
          <input
            v-model="value"
            type="text"
            name="value"
            maxlength="5"
            pattern="\d{1,5}"
            :min="min"
            :max="max"
            :interval="step"
            @keypress="isNumber($event)"
            @change="handleValueChange(value)"
          >
        </div>
      </div>
    </div>
    <vue-slider
      v-model="value"
      :min="min"
      :max="max"
      :interval="step"
      :dot-size="30"
      :height="15"
      :marks="getMarks"
      :hide-label="true"
      :tooltip="'none'"
      @change="handleValueChange(value)"
    />
    <div class="range__limits">
      <div class="range__min">
        {{ $t('frontend.from') }} {{ min }} {{ suffix }}
      </div>
      <div class="range__max">
        до {{ max }} {{ suffix }}
      </div>
    </div>
  </div>
</template>

<script>
let vueSlider = null
if (process.client) vueSlider = require('vue-slider-component')

export default {
  name: 'CalculatorRange',
  components: {
    vueSlider
  },
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 0
    },
    whenToHideMinPercent: {
      type: Number,
      default: 0
    },
    whenToHideMaxPercent: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    defaultValue: {
      type: Number,
      default: 0
    },
    suffix: {
      type: String,
      default: ''
    },
    suffixMin: {
      type: String,
      default: ''
    },
    suffixMax: {
      type: String,
      default: ''
    },
    tooltipData: {
      type: String,
      default: ''
    },
    isTooltipHintVisible: {
      type: Boolean,
      default: false
    },
    roundNumber: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      value: null,
      marks: [0, 20, 40, 60, 80, 100]
    }
  },
  computed: {
    getMarks(val) {
      const max = this.max / 10
      return val => val % max === 0
    }
  },
  created() {
    this.value = this.defaultValue
  },
  methods: {
    checkRange(input) {
      // check if entered value normal
      let result = 0
      input.length === 0 ? result = parseInt(this.min) : result = parseInt(input)

      if (this.roundNumber !== 0) {
        result = (result % this.roundNumber !== 0) ? Math.ceil(result / this.roundNumber) * this.roundNumber : result
      }
      if (result < this.min) result = this.min
      else if (result > this.max) result = this.max
      this.value = result
      return result
    },
    isNumber(evt) {
      const charCode = (evt.which) ? evt.which : evt.keyCode
      const entered = parseInt(String.fromCharCode(charCode))
      if (isNaN(entered)) evt.preventDefault()
    },
    handleValueChange() {
      this.$emit('change', this.checkRange(this.value))
    }
  }
}
</script>

<style lang='scss' scoped>
.calculator__range {
  margin-bottom: 40px;
   /deep/ .vue-slider {
    padding: 15px 0 !important;
    .vue-slider-rail {
      width: 100%;
      height: 15px;
      border-radius: 15px;
      background-color: #eff6ff;
      cursor: pointer;
      box-shadow: none;
      .vue-slider-process {
        border-radius: 15px;
        background: -webkit-linear-gradient(left, rgb(0, 74, 241) 150px, rgb(255, 39, 119) 100%);
      }
      .vue-slider-dot {
        border-radius: 50%;
        background-color: #ff2777;
        box-shadow: none;
      }
      .vue-slider-mark {
        width: 1px !important;
        height: 14px;
        background-color: #ffffff;
      }
      .vue-slider-mark-active {
        background-color: rgba(#ffffff, .3);
      }
    }
  }
  .range__header {
    display: flex;
    font-size: 18px;
    font-weight: 600;

    justify-content: space-between;
  }
  .range__current-value {
    display: flex;
    align-items: center;
    .form-group {
      max-width: 135px;
      overflow: hidden;
      border: 1px solid $geyser;
      border-radius: 4px;
      min-width: 80px;
    }
    input {
      text-align: center;
      border: 0;
      width: 100%;
      font: 600 18px/43px $font;
    }
  }
  .range__limits {
    display: flex;
    font-size: 13px;
    font-weight: 400;
    color: $bali;

    justify-content: space-between;
  }
}
@media screen and (max-width: 980px) {
  .calculator__range {
    margin-bottom: 36px;
    .range__header {
      font-size: 14px;
      .range__current-value {
        margin-top: -9px;
        .form-group {
          min-height: 32px;
        }
        input {
          font-size: 16px;
          line-height: 30px;
        }
      }
    }
    .range__limits {
      font-size: 10px;
    }
     /deep/ .vue-slider .vue-slider-rail {
      height: 10px !important;
      .vue-slider-dot {
        width: 25px !important;
        height: 25px !important;
      }
    }
  }
}

</style>
