<template>
  <section class="page page__dashboard">
    <section class="offers">
      <div class="content">
        <offers-list />
      </div>
    </section>

    <section v-if="!isLoanRequestApplied" class="calculator">
      <div class="content">
        <p class="heading">{{ $t('frontend.calculator-heading') }}</p>
        <s-calculator v-if="isProfileLoaded" />
      </div>
    </section>

    <section
      v-if="getProfileCard.length"
      class="personal-data"
    >
      <div class="content">
        <p class="heading">{{ $t('frontend.personal-data') }}</p>
        <p class="hint">
          {{ $t('frontend.keep-update-profile') }}
        </p>
        <div class="personal-data_wrap">
          <ul class="personal-data_list">
            <li
              v-for="(item, i) in getProfileCard"
              :key="`item-${i}`"
            >
              <span>{{ item.title }}</span> {{ item.value }}
            </li>
          </ul>
          <s-button
            theme="transparent"
            width="240px"
            to="/profile"
            gap-y="20px"
          >
            {{ $t('frontend.change-data') }}
          </s-button>
        </div>
      </div>
    </section>
  </section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

import SCalculator from '~/components/shared/SCalculator'
import OffersList from '~/components/offersList'
export default {
  name: 'DashboardPage',
  middleware: 'authGuard',
  components: {
    SCalculator,
    OffersList
  },
  data: () => ({
    offersLoader: false,
    isLoanRequestApplied: null,
    isProfileLoaded: false
  }),
  computed: {
    ...mapGetters({
      getProfileData: 'formConstructor/getProfileData',
      getProfileCard: 'formConstructor/getProfileCard'
    })
  },
  async mounted() {
    this.isLoanRequestApplied = this.$cookies.get('isLoanRequestApplied')
    await this.fetchProfile()
    await this.fetchProfileCard()
    this.isProfileLoaded = true
    this.userPhone = this.getProfileData.mobile_phone
    this.userInn = this.getProfileData.inn
  },
  methods: {
    ...mapActions({
      fetchProfile: 'formConstructor/fetchProfile',
      fetchProfileCard: 'formConstructor/fetchProfileCard'
    })
  }
}
</script>
<style lang="scss">
.page__dashboard {
  section {
    padding: 0 160px;
    margin-bottom: 10px;
    background-color: #ffffff;
    .heading {
      margin-bottom: 34px;
    }
  }
  .content {
    padding: 67px 0;
  }
  .calculator {
    .heading {
      margin-bottom: 50px;
    }
  }
  .personal-data {
    .heading {
      margin-bottom: 50px;
    }
    .hint {
      max-width: 480px;
      margin-bottom: 30px;
      line-height: 2;
    }
    &_wrap {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 0 20px 0 rgba($white-lilac, 1);
      border: 1px solid $white-lilac;
      padding: 16px 30px 16px 16px;
    }
    &_list {
      position: relative;
      width: 75%;
      display: flex;
      flex-wrap: wrap;
      &:before,
      &:after {
        content:'';
        display: block;
        background-color: $selago;
        position: absolute;
        top: 46px;
        left: 16px;
        right: 16px;
        height: 1px;
      }
      &:after {
        top: 92px;
      }
      li {
        font-size: 13px;
        line-height: 16px;
        padding: 14px;
      }
      span {
        font-size: 11px;
        line-height: 18px;
        color: $bali;
        text-transform: uppercase;
        display: inline-block;
        vertical-align: top;
        font-weight: 600;
        margin-right: 4px;
      }
    }
    .s-button {
      margin: 0 0 0 30px!important;
    }
  }
}
@media screen and (max-width: 980px) {
  .page__dashboard {
    margin-bottom: 0;
    padding: 18px 0 30px;
    background-color: #fff;
    section {
      padding: 0 20px;
      margin-bottom: 24px;
      .heading {
        font-size: 20px;
        margin-bottom: 16px;
      }
    }
    .content {
      padding: 0;
    }
    .calculator {
      .heading {
        margin-bottom: 16px;
      }
    }
    .personal-data {
      background-color: transparent;
      margin-bottom: 0;
      .heading {
        margin-bottom: 16px;
      }
      .hint {
        margin-bottom: 18px;
      }
      &_wrap {
        box-shadow: none;
        border: 0;
        padding: 0;
        flex-direction: column;
        .s-button {
          width: 100%!important;
          margin-left: 0!important;
        }
      }
      &_list {
        background-color: #fff;
        width: 100%;
        border: 1px solid $white-lilac;
        box-shadow: 0 0 20px 0 rgba($white-lilac, 1);
        padding: 10px 20px 20px;
        margin-bottom: 24px;
        &:before,
        &:after {
          display: none;
        }
        li {
          width: 100%;
          padding: 14px 0;
          border-bottom: 1px solid $selago;
          span {
            display: block;
            width: 100%;
          }
        }
      }
    }
  }
}

</style>
