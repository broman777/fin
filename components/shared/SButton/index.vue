<template>
  <div
    :style="styleList"
    :class="classList"
  >
    <!-- if nuxt link -->
    <nuxt-link
      v-if="to && !external"
      :to="to"
      :params="params"
    >
      <span
        class="button__text"
      >
        <slot />
      </span>
    </nuxt-link>
    <!-- if nuxt link -->

    <!-- if external link -->
    <a
      v-else-if="to && external"
      :href="to"
      target="_blank"
    >
      <slot />
    </a>
    <!-- if external link -->

    <!-- if button -->
    <button
      v-else
      :disabled="isDisabled"
      @click="onButtonClick"
    >
      <span
        class="button__text"
      >
        <slot />
      </span>
    </button>
    <!-- if button -->

    <div class="s-button__loader">
      <div class="loader__circle" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SButton',
  props: {
    type: {
      type: String,
      default: null
    },
    external: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: null
    },
    params: {
      type: Object,
      default: null
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isCenter: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'radical'
    },
    fontWeight: {
      type: Number,
      default: 700
    },
    fontSize: {
      type: Number,
      default: 14
    },
    size: {
      type: String,
      default: 'medium'
    },
    width: {
      type: String,
      default: 'auto'
    },
    block: {
      type: Boolean,
      default: false
    },
    gapX: {
      type: String,
      default: null
    },
    gapY: {
      type: String,
      default: '0px'
    }
  },
  computed: {
    styleList() {
      return [
        { 'margin-bottom': this.gapY ? this.gapY : 'auto' },
        { 'margin-right': this.gapX ? this.gapX : 'auto' },
        { 'width': this.width },
        { 'min-width': this.block ? '100%' : 0 }
      ]
    },
    classList() {
      return [
        's-button',
        `s-button_${this.theme}`,
        { 's-button_center': this.isCenter },
        { 's-button_disabled': this.isDisabled },
        { 's-button_is-loading': this.isLoading }
      ]
    }
  },
  methods: {
    onButtonClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes rotate {
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}
button, a {
  display: flex;
  width: 100%;
  height: 45px;
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
  border: 0;
  border-radius: 7px;
  outline: none;
  transition: all .3s;

  align-items: center;
  justify-content: center;
}
.s-button {
  position: relative;
  display: flex;
  width: 100%;
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
  border: 0;
  border-radius: 7px;
  outline: none;
  transition: all .3s;

  align-items: center;
  justify-content: center;
  &__loader {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    opacity: 0;
    pointer-events: none;
    .loader__circle {
      &:before {
        content:'';
        position: absolute;
        top: 7px;
        left: 7px;
        right: 7px;
        bottom: 7px;
        border-radius: 50%;
        background-color: #ff2777;
      }
      position: relative;
      animation: rotate 0.6s infinite linear;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      background: linear-gradient(to bottom, #ff2777, #2643f7);
    }
  }
  &_red {
    button, a {
      background-color: $radical;
      &:hover {background-color: $radical-h;
      }
    }
  }
  &_transparent {
    button, a {
      color: $radical;
      border: 1px solid $radical;
      background-color: transparent;
      &:hover {
        color: $radical-h;
        border-color: $radical-h;
      }
    }
  }
  &_center {
    margin: 0 auto;
  }
  &_is-loading {
    pointer-events: none;
    .s-button__loader { opacity: 1; }
    .button__text { display: none; }
  }
}

</style>
