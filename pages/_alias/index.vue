<template>
  <div class="page__offers profile">
    <div class="box">
      <p class="heading">
        {{ page.title }}
      </p>
      <div v-html="page.content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'StaticPage',
  async asyncData({ store, route, error }) {
    try {
      const page = await store.dispatch('fetchStaticPage', route.params.alias)
      return { page }
    } catch (err) {
      console.log('err', err)
      error({ statusCode: err.response.data.error.code, message: err.response.data.error.message })
    }
  }
}
</script>

<style scoped>

</style>
