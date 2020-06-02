<template>
  <div class="offers-list">
    <s-modal
      class="modal modal__tnx"
      :is-visible="popups.tnx"
      @closeModal="togglePopup('tnx')"
    >
      <div class="logo" />
      <p class="heading">{{ $t('frontend.modal_tnx-title') }}</p>
      <p>{{ $t('frontend.modal_tnx-text') }}</p>
      <s-button
        theme="red"
        type="button"
        gap-y="19px"
        @click="togglePopup('tnx')"
      >
        Ok
      </s-button>
    </s-modal>

    <s-modal
      class="modal modal__gift"
      :is-visible="popups.gift"
      @closeModal="togglePopup('gift')"
    >
      <div class="gift_logo">
        <img src="~assets/img/tmp/offer2.png" alt="AlexCredit">
      </div>
      <p class="heading">Акции и бонусы</p>
      <p>Многие думают, что Lorem Ipsum - взятый с потолка псевдо-латинский набор слов, но это не совсем так. Его корни уходят в один фрагмент классической  латыни 45 года н.э., то есть более двух тысячелетий назад.</p>
      <s-button
        theme="red"
        type="button"
        gap-y="19px"
        @click="togglePopup('gift')"
      >
        {{ $t('frontend.modal_about-go') }}
      </s-button>
    </s-modal>

    <s-modal
      :is-visible="popups.about"
      class="modal modal__about"
      @closeModal="togglePopup('about')"
    >
      <div class="about_img">
        <img :src="aboutModal.image.link">
      </div>
      <div class="modal__content">
        <div class="about_logo">
          <img :src="aboutModal.logo.link" :alt="aboutModal.title">
        </div>
        <p class="heading">{{ $t('frontend.modal_about-title') }} {{ aboutModal.title }}</p>
        <ul class="about_char">
          <li>
            <p class="char_name">{{ $t('frontend.modal_credit-sum') }}</p>
            <p>{{ aboutModal.credit_sum }}</p>
          </li>
          <li>
            <p class="char_name">{{ $t('frontend.modal_credit-term') }}</p>
            <p>{{ aboutModal.credit_term }}</p>
          </li>
        </ul>
        <p>{{ aboutModal.description }}</p>
        <s-button
          theme="red"
          type="button"
          gap-y="19px"
          :to="aboutModal.site_url"
          :external="true"
        >
          {{ $t('frontend.modal_about-go') }}
        </s-button>
      </div>
    </s-modal>

    <p v-if="loanRequestHasResults || loanRequestLoader" class="heading">
      {{ $t('frontend.proposals') }}
    </p>
    <p v-else class="heading">
      {{ $t('frontend.showcase') }}
    </p>

    <s-ntf
      v-if="loanRequestHasResults"
      class="ntf-success"
    >
      <p class="ntf-title">{{ $t('frontend.showcase_title_success') }}</p>
      <p>{{ $t('frontend.showcase_success') }}</p>
    </s-ntf>
    <s-ntf
      v-if="loanRequestNoResults"
      class="ntf-warn"
    >
      <p class="ntf-title">{{ $t('frontend.profile_warning-title') }}</p>
      <p>{{ $t('frontend.showcase_unfortunatley') }}</p>
    </s-ntf>

    <div
      v-if="loanRequestLoader"
      class="offers-search"
    >
      <i class="offers-search_icon">
        <span />
      </i>
      <p class="offers-search_title">
        {{ $t('frontend.searching_offers') }}
      </p>
    </div>
    <div
      v-if="offers.length"
      class="table"
    >
      <div class="tr">
        <div class="th">{{ $t('frontend.partner') }}</div>
        <div class="th">{{ $t('frontend.modal_credit-sum') }}</div>
        <div class="th">{{ $t('frontend.modal_credit-term') }}</div>
        <div class="th" />
      </div>
      <div
        v-for="(item, i) in offers"
        :key="item.date_created"
        class="tr"
      >
        <div
          class="td"
          @click="togglePopup(i)"
        >
          <img :src="item.logo.link" :alt="item.title" class="partner-logo">
        </div>
        <div class="td"><span class="m-label">{{ $t('frontend.sum') }}</span> {{ item.credit_sum }}</div>
        <div class="td"><span class="m-label">{{ $t('frontend.term') }}</span> {{ item.credit_term }}</div>
        <div class="td">
          <s-button
            theme="red"
            :to="item.site_url"
            :external="true"
          >
            {{ $t('frontend.modal_details') }}
          </s-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OffersList',
  data: () => ({
    offers: [],
    loanRequestLoader: false,
    isLoanRequestApplied: undefined,
    loanRequestNoResults: false,
    loanRequestHasResults: false,
    userPhone: null,
    userInn: null,
    popups: {
      tnx: false,
      gift: false,
      about: false
    },
    aboutModal: {
      title: null,
      description: null,
      image: { link: null },
      logo: { link: null }
    }
  }),
  computed: {
    ...mapGetters({
      getOffers: 'offer/getOffers',
      getShowcases: 'offer/getShowcases',
      getProfileData: 'formConstructor/getProfileData',
      getCalculatorData: 'offer/getCalculatorData'
    })
  },
  async created() {
    this.userPhone = this.$cookies.get('userPhone')
    this.userInn = this.$cookies.get('userInn')
    //  if don't have loan request
    //  display showcases
    if (!this.$cookies.get('isLoanRequestApplied')) {
      await this.fetchShowcases()
      this.offers = this.getShowcases
    } else {
      //  else empty offers and fetch partner offers
      //  and display offersLoader
      this.loanRequestLoader = true
      this.offers = []
      await this.fetchOffers()
      //  after fetch check if response has offers
      if (this.getOffers.length) {
        this.offers = this.getOffers
        this.$cookies.remove('isLoanRequestApplied', { maxAge: 0 })
        this.loanRequestHasResults = true
        this.loanRequestLoader = false
      } else {
        //  if doesn't have offers, try fetch every 20 seconds
        this.isLoanRequestApplied = setInterval(async () => {
          //  check isLoanRequestApplied cookie is not expired
          if (this.$cookies.get('isLoanRequestApplied')) {
            await this.fetchOffers()
            this.offers = this.getOffers
            //  if response has offers exit from Interval
            if (this.offers.length) {
              this.$cookies.remove('isLoanRequestApplied', { maxAge: 0 })
              this.loanRequestHasResults = true
              this.loanRequestLoader = false
              clearInterval(this.isLoanRequestApplied)
            }
          } else {
            //  if isLoanRequestApplied cookie is expired
            //  fetch showcases and show loanRequestNoResults message
            await this.fetchShowcases()
            this.offers = this.getShowcases
            this.loanRequestLoader = false
            this.loanRequestNoResults = true
            clearInterval(this.isLoanRequestApplied)
          }
        }, 20000)
      }
    }
  },
  destroyed() {
    clearInterval(this.isLoanRequestApplied)
  },
  methods: {
    ...mapActions({
      fetchShowcases: 'offer/fetchShowcases',
      fetchOffers: 'offer/fetchOffers',
      loanRequest: 'offer/loanRequest'
    }),
    togglePopup(id) {
      if (!isNaN(id)) {
        this.aboutModal = this.offers[id]
        this.popups.about = !this.popups.about
      } else {
        this.popups[id] = !this.popups[id]
      }
    }
  }
}
</script>
<style lang="scss">
  .modal__gift {
    .modal__body {
      max-width: 320px;
      line-height: 1.3em;
    }
    .gift_logo {
      img {
        display: block;
        max-width: 100%;
        max-height: 96px;
        margin-bottom: 24px;
      }
    }
    .s-button {
      margin-top: 32px;
    }
  }
  .modal__tnx {
    .modal__body {
      width: 100%;
      max-width: 470px;
      line-height: 1.5em;
      font-size: 14px;
    }
    .logo {
      margin-bottom: 32px;
    }
    .heading {
      line-height: 1.2em;
      padding-bottom: 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid $geyser;
    }
    .s-button {
      margin: 24px 0 0!important;
      max-width: 180px;
    }
  }
  .modal__about {
    line-height: 1.7;
    .modal__body {
      max-width: 960px;
      width: 100%;
      position: relative;
    }
    .modal__content {
      width: 50%;
      margin-left: 50%;
      padding-left: 30px;
      .s-button {
        max-width: 50%;
      }
    }
    .about_img {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 50%;
      overflow: hidden;
      img {
        display: block;
        height: 100%;
      }
    }
    .about_char {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      li {
        color: $geyser;
        max-width: 45%;
      }
      .char_name {
        font-weight: 600;
        color: #000;
        font-size: 1.3em;
        margin-bottom: 12px;
      }
    }
    .gift_logo,
    .about_logo {
      img {
        display: block;
        max-width: 100%;
        max-height: 96px;
        margin-bottom: 24px;
      }
    }
    .s-button {
      margin-top: 32px;
    }
  }
  .offers-list {
    .heading {
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
    @keyframes search {
      from, to {transform: translate(0, -4px);}
      12.5% {transform: translate(2px, -2px);}
      25% {transform: translate(4px, 0);}
      37.5% {transform: translate(2px, 2px);}
      50% {transform: translate(0, 4px);}
      62.5% {transform: translate(-2px, 2px);}
      75% {transform: translate(-4px, 0);}
      87.5% {transform: translate(-2px, -2px);}
    }
    .offers-search {
      display: flex;
      flex-direction: column;
      height: 167px;
      padding: 35px 0;
      margin-bottom: 24px;
      background-image: url("~assets/img/offers-search-bg.jpg");
      background-size: cover;
      align-items: center;
      justify-content: center;
      &_icon {
        position: relative;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 12px 12px;
        z-index: 2;
        &:after {
          content:"";
          display: block;
          position: absolute;
          border: 1px solid #fff;
          border-radius: 50%;
          left: -33px;
          top: -33px;
          bottom: -33px;
          right: -33px;
        }
        &:before {
          content:"";
          display: block;
          position: absolute;
          border: 1px solid #fff;
          border-radius: 50%;
          left: -14px;
          top: -14px;
          bottom: -14px;
          right: -14px;
        }
        span {
          animation: search  1s infinite;
          display: block;
          @include sprite('search-rose');
        }
      }
      &_title {
        line-height: 24px;
        position: relative;
        z-index: 4;
        text-align: center;
      }
    }
    .table {
      display: table;
      width: 100%;
      margin-bottom: 40px;
      font-size: 14px;
      text-align: left;
      .th {
        display: table-cell;
        padding: 18px 0;
        font-size: 10px;
        font-weight: 600;
        text-align: left;
        text-transform: uppercase;
        border-bottom: 1px solid $mystic;
      }
      .tr {
        width: 100%;
        display: table-row;
      }
      .td {
        display: table-cell;
        height: 96px;
        color: $space;
        vertical-align: middle;
        border-bottom: 1px solid $mystic;
        img {
          cursor: pointer;
        }
        .partner-logo {
          max-width: 150px;
          max-height: 40px;
        }
        .m-label {
          display: none;
        }
        &:first-child {
          width: 24%;
          padding-right: 24px;
        }
        &:last-child {
          width: 31%;
          text-align: right;
        }
        img {
          display: block;
          max-width: 100%;
        }
      }
      .s-button {
        display: inline-block;
        width: 198px!important;
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
    .more {
      max-width: 100%;
    }
  }
  @media screen and (max-width: $mobMax) {
    .page__offers {
      margin: 0;
      padding: 28px 0;
      padding-bottom: 12px!important;
      .s-button {
        width: 100%!important;
      }
    }
    .modal {
      &__about {
        .modal__body {
          padding: 20px;
        }
        .about_img {
          display: none;
        }
        .modal__content {
          width: 100%;
          margin-left: 0;
          padding-left: 0;
          .heading {
            display: none;
          }
          .about_char {
            flex-direction: column;
            margin-bottom: 0;
            li {
              max-width: 100%;
              margin-bottom: 12px;
            }
            .char_name {
              margin-bottom: 0;
            }
          }
          .s-button {
            max-width: 100%;
          }
        }
      }
    }
    .offers-list {
      .offers-search {
        padding: 40px 25px 10px;
      }
      .table {
        font-size: 13px;
        margin-bottom: 0;
        .th {
          display: none;
        }
        .tr {
          display: flex;
          flex-flow: wrap;
          border: 1px solid $white-lilac;
          margin-bottom: 10px;
          padding: 10px;
          box-shadow: 0 0 20px 0 rgba($white-lilac, 1);
          &:first-child {display: none;}
        }
        .s-button {
          display: flex;
          order: -1;
          width: 100% !important;
        }
        .td {
          padding: 10px;
          width: 100%!important;
          display: flex;
          justify-content: space-between;
          height: auto;
          border-bottom: none;
          .m-label {
            display: block;
            margin: 4px 16px 0 0;
            text-transform: uppercase;
            color: $bali;
            font-size: 0.8em;
          }
          &:first-child {
            padding-bottom: 20px;
          }
          &:last-child {
            .btn {
              width: 100%;
              order: -1;
            }
            .offer_gift {
              min-width: 45px;
              margin: 0 0 0 10px;
            }
          }
        }
      }
      .more a{
        display: flex;
        transition: initial;
        align-items: center;
        border: 0;
        &:before {
          content:'';
          margin-right: 8px;
          @include sprite("back-arrow");
        }
        &:hover {
          @include sprite("back-arrow_hover");
        }
      }
    }
  }
</style>
