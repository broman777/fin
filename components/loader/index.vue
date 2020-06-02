<template>
  <div v-if="loading" class="loader">
    <div class="loader__circle" />
  </div>
</template>

<style lang="scss" scoped>
  @keyframes rotate {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }
  .loader {
    background-color: #fff;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    &__circle {
      &:before {
        content:'';
        position: absolute;
        top: 7px;
        left: 7px;
        right: 7px;
        bottom: 7px;
        border-radius: 50%;
        background-color: #fff;
      }
      position: relative;
      animation: rotate 0.6s infinite linear;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      background: linear-gradient(to bottom, #ff2777, #2643f7);
    }
  }
</style>

<script>
export default {
  name: 'Loader',
  props: {
    loading: Boolean
  }
}
</script>
