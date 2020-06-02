<template>
  <div class="ntf">
    <i class="ntf-icon">i</i>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SNtf',
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .ntf {
    position: relative;
    padding: 30px 30px 30px 120px;
    margin-bottom: 24px;
    line-height: 1.5;
    min-height: 90px;
    &-icon {
      top: 30px;
      left: 30px;
      position: absolute;
      font-size: 48px;
      font-weight: 600;
      color: #fff;
      text-align: center;
      line-height: 60px;
      width: 60px;
      border-radius: 50%;
      background-color: #86c81c;
    }
    &-title {
      font-size: 18px;
      font-weight: 600;
      font-weight: 600;
    }
    &-success {
      background-color: #f4f8e7;
      color: #1f241d;
    }
    &-warn {
      background-color: #fdebeb;
      color: #000;
      .ntf-icon {
        background-color: #ef3c39;
      }
    }
  }
  @media screen and (max-width: $mobRes) {
    .ntf {
      padding: 20px;
      margin-bottom: 12px;
      &-title {
        margin: 4px 0 6px 50px;
      }
      &-icon {
        font-size: 24px;
        line-height: 30px;
        width: 30px;
        position: absolute;
        top: 20px;
        left: 20px;
      }
    }
  }
</style>
