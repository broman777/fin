<template>
  <div class="page__offers">
    <div class="box">
      <p
        v-if="!conditions['showcase']"
        class="heading"
      >
        Ваши предложения
      </p>
      <p
        v-if="conditions['showcase']"
        class="heading"
      >
        Витрина партнеров
      </p>
      <offers-list
        :conditions="conditions"
      />
      <nuxt-link
        to="/"
        class="back"
      >
        Назад
      </nuxt-link>
    </div>
  </div>
</template>
<script>
import OffersList from '@/components/offersList'
export default {
  name: 'OffersPage',
  middleware: 'authGuard',
  components: {
    OffersList
  },
  data() {
    return {
      conditions: Object
    }
  },
  mounted() {
    this.conditions = this.$route.query
  }
}
</script>
<style lang="scss">
  .page__offers {
    .heading {
      text-align: left;
      span {
        display: block;
        float: right;
        font-size: 13px;
        font-weight: normal;
        color: $geyser;
      }
    }
    .finding {
      display: block;
      width: 50px;
      height: 50px;
    }
    .warn {
      padding: 30px;
      margin-bottom: 23px;
      color: $bali;
      background: #fff4f8;
      &_title {
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: 600;
      }
    }
    table {
      width: 100%;
      margin-bottom: 40px;
      font-size: 14px;
      th {
        padding: 18px 0;
        font-size: 10px;
        font-weight: 600;
        text-align: left;
        text-transform: uppercase;
        border-bottom: 1px solid $mystic;
      }
      td {
        height: 96px;
        color: $space;
        vertical-align: middle;
        border-bottom: 1px solid $mystic;
        &:first-child {
          width: 24%;
        }
        &:last-child {
          width: 31%;
          text-align: right;
        }
      }
      .btn {
        width: 198px;
        padding: 0;
        font-size: 14px;
        font-weight: 600;

        @include btn-trans (43px, 8px, $radical, $radical-h);
      }
      .offer_gift {
        display: inline-block;
        width: 45px;
        height: 45px;
        padding-top: 13px;
        margin-right: 4px;
        vertical-align: top;
        border-radius: 8px;
        background: $zumor;
        cursor: pointer;
        &:before {
          display: block;
          margin: 0 auto;
          content: "";
          opacity: .9;
          transition: .2s ease;

          @include sprite("gift");
        }
        &:hover:before {
          opacity: 1;
        }
      }
    }
    .back {
      color: #ff2777;
      display: block;
      max-width: 300px;
      margin: 20px auto;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
      &:hover {
        text-decoration: underline;
      }
    }
    .btn-more {
      padding: 0 56px;
      font-size: 14px;
      color: #ffffff;

      @include btn(43px, 8px, $radical, $radical-h);
      &:before {
        display: inline-block;
        margin-right: 6px;
        font-size: 1.5em;
        vertical-align: top;
        content: "+";
      }
    }
  }

</style>
