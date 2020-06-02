<template>
  <div class="page page__error">
    <div class="content">
      <span class="logo" />
      <p class="err">404</p>
      <h1 class="heading">
        {{ $t('frontend.404_title') }}
      </h1>
      <p>
        {{ $t('frontend.404_subtitle') }}
      </p>
      <nuxt-link :to="localePath('index')" class="btn">
        {{ $t('frontend.404_home') }}
      </nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Error',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style scoped lang="scss">
  .page__error {
    background-color: #fff;
    text-align: center;
    color: $space;
    height: 100vh;
    min-height: 360px;
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 0;
  }
  .heading {
    line-height: 40px;
    font-weight: 600;
    margin-bottom: 34px;
  }
  .err {
    text-align: center;
    color: $zumor;
    font-weight: 700;
    font-size: 180px;
    margin-bottom: 34px;
  }
  .btn{
    width: 100%;
    max-width: 240px;
    margin: 40px auto 0;
    color: #fff;
    @include btn(43px, 8px, $radical, $radical-h);
  }
  .content {
    max-width: 460px;
    position: relative;
    z-index: 10;
  }
  .logo {
    display: block;
    @include sprite('logo');
    margin: 0 auto 52px;
  }
  @media screen and (max-width: $mobRes) {
    .logo {
      margin-bottom: 34px;
    }
    .err {
      font-size: 100px;
    }
    .heading{
      line-height: 30px;
      margin-bottom: 50px;
    }
    .content {
      max-width: 290px;
    }
    .btn {
      margin-top: 50px;
    }
  }
</style>
