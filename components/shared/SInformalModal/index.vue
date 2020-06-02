<template>
  <div
    v-if="!isObjectEmpty(getInformalMessage)"
    :class="informalModalClasses"
  >
    <div class="s-informal-modal_text">{{ getInformalMessage.message }}</div>
    <i
      class="s-informal-modal_close"
      @click="$store.commit('CLEAR_INFORMAL_MESSAGE')"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SInformalModal',
  data: () => ({}),
  computed: {
    ...mapGetters({
      getInformalMessage: 'getInformalMessage'
    }),
    informalModalClasses() {
      return [
        's-informal-modal',
        this.getInformalMessage.type === 'error' ? `s-informal-modal_error` : null,
        this.getInformalMessage.type === 'success' ? `s-informal-modal_success` : null,
        this.getInformalMessage.type === 'warning' ? `s-informal-modal_warning` : null
      ]
    }
  },
  watch: {},
  mounted() {},
  methods: {
    isObjectEmpty(obj) {
      return Object.entries(obj).length === 0 && obj.constructor === Object
    }
  }
}
</script>

<style scoped lang="scss">
  .s-informal-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 20;
    background-color: #cad3df;
    height: 70px;
    padding: 0 20px;
    &_success {
        background-color: rgba($success, 0.9);
    }
    &_warning {
        background-color: rgba($warning, 0.9);
    }
    &_error {
        background-color: rgba($error, 0.9);
    }
    &_text {
        color: #fff;
        font-size: 13px;
        line-height: 18px;
    }
    &_close {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 14px;
        height: 14px;
        background-image: url("/img/icons/i_notification-close.svg");
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;

        &:hover {
            transform: scale(1.15);
        }
    }
  }
</style>
