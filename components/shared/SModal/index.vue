<template>
  <div :class="modalClassList">
    <div class="modal__body">
      <slot />
      <span
        class="modal__close"
        @click="onModalClose"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    modalClassList() {
      return [
        'modal',
        { 'modal_opened': this.isVisible }
      ]
    }
  },
  methods: {
    onModalClose() {
      this.$emit('closeModal')
    }
  }
}
</script>

<style lang="scss" scoped>
  $base-duration: 0.25s;
  .modal {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
    overflow: auto;
    will-change: auto;
    transition: all $base-duration;
    opacity: 0;
    visibility: hidden;
    z-index: 9999;
    &__body {
      position: relative;
      display: block;
      width: 50%;
      max-height: 100%;
      overflow: auto;
      margin: 0;
      padding: 30px;
      background-color: #ffffff;
      box-shadow: 0 0 2.5rem rgba(0,0,0,0.5);
    }

    &__close {
      font-size: 0;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      cursor: pointer;
      background-color: transparent;
      transition: $base-duration linear;
      &:before, &:after {
        position: absolute;
        content: '';
        width: 1.25rem;
        height: 0.125rem;
        background-color: black;
      }

      &:before {
        transform: rotate(-45deg);
      }

      &:after {
        transform: rotate(45deg);
      }

      &:hover {
        &:before, &:after {
          background-color: red;
        }
      }
    }

    &_opened {
      transform: scale(1);
      opacity: 1;
      visibility: visible;
    }
  }
</style>
