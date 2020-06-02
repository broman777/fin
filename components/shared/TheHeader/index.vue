<template>
  <header>
    <div class="box">
      <nuxt-link :to="localePath('index')" class="logo" />
      <div v-if="!isSimple" class="header_right">
        <div class="phones-list dt" v-html="$viewBlock('phones')" />
        <s-user-menu />
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: 'TheHeader',
  props: {
    'isSimple': Boolean
  }
}
</script>
<style lang="scss">
  header {
    border-bottom: 1px solid $selago;
    background-color: #ffffff;
    .box {
      display: flex;
      height: 75px;
      align-items: center;
      justify-content: space-between;
    }
  }
  .logo {
    display: block;
    @include sprite("logo");
  }

  .header_right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .phones-list {
      color: $bali;
      li {
        display: inline-block;
        vertical-align: top;
        &:before {
          content: "/ ";
        }
        &:first-child:before {
          content: "";
        }
      }
    }
  }

</style>
