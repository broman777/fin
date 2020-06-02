<template>
  <div :class="{loading}">
    <loader v-if="loading" :loading="loading" />
    <the-header />
    <nuxt />
    <the-footer />
    <s-informal-modal v-if="!isObjectEmpty(getInformalMessage)" />
  </div>
</template>
<script>
import TheHeader from '~/components/shared/TheHeader/index.vue'
import TheFooter from '~/components/shared/TheFooter/index.vue'
import SInformalModal from '~/components/shared/SInformalModal/index.vue'

import { mapGetters } from 'vuex'
export default {
  components: {
    TheHeader,
    TheFooter,
    SInformalModal
  },
  computed: {
    ...mapGetters({ getInformalMessage: 'getInformalMessage' }),
    loading() { return this.$store.state.loading }
  },
  created() {
    this.mergeTranslations()
  },
  methods: {
    isObjectEmpty(obj) {
      return Object.entries(obj).length === 0 && obj.constructor === Object
    },
    mergeTranslations() {
      if (Object.keys(this.$store.state.latestTranslation)) {
        const locale = Object.keys(this.$store.state.latestTranslation)[0]
        this.$i18n.mergeLocaleMessage(locale, this.$store.state.latestTranslation[locale])
      }
    }
  }
}
</script>
<style media="screen">
  .loading {
    height: 100vh!important;
    width: 100%!important;
    overflow: hidden;
  }
</style>
