<template>
  <div class="layout__simple">
    <TheHeader is-simple />
    <nuxt />
    <TheFooter is-simple />
    <s-informal-modal />
  </div>
</template>
<script>
import TheHeader from '~/components/shared/TheHeader/index.vue'
import TheFooter from '~/components/shared/TheFooter/index.vue'
import SInformalModal from '~/components/shared/SInformalModal/index.vue'
export default {
  components: {
    TheHeader,
    TheFooter,
    SInformalModal
  }
}
</script>
<style lang="scss">
.layout__simple {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  border: 1px solid $selago;
  background-color: #ffffff;
  .box {
    justify-content: center;
  }
  .copyright {color: $bali;
  }
  .footer-bottom {
    border-top: none;

    justify-content: center;
  }
}

</style>
