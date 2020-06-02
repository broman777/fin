<template>
  <footer>
    <div class="box">
      <nav v-if="!isSimple" class="footer-nav">
        <nuxt-link
          v-for="item in $store.state.menu.footer"
          v-show="item.link"
          :key="item.id"
          :to="item.link"
        >
          {{ item.title }}
        </nuxt-link>
      </nav>
      <div class="footer-bottom">
        <p class="copyright">
          {{ $t('frontend.footer_copyright') }}
        </p>
        <div class="lang-list">
          <span
            v-for="lang in langList"
            :key="lang.code"
            :class="{active: $store.state.locale == lang.code }"
            class="lang-list__item"
            @click="onLanguageChangeClick(lang.code)"
          >
            {{ lang.title }}
          </span>
        </div>
        <div v-if="!isSimple" class="social" v-html="$viewBlock('social')" />
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
  props: {
    'isSimple': Boolean
  },
  computed: {
    langList() {
      return this.$store.state.languagesList
    }
  },
  methods: {
    onLanguageChangeClick(code) {
      this.$i18n.setLocale(code)
      this.$store.dispatch('changeLanguage', code)
    }
  }
}
</script>

<style lang="scss">
  .footer {
    &-nav {
      height: 42px;
      a {
        margin-right: 36px;
        text-decoration: none;
        color: #000;
        &:hover {
          color: $radical;
        }
      }
    }
    &-bottom {
      display: flex;
      height: 73px;
      border-top: 1px solid #ffffff;
      align-items: center;
      justify-content: space-between;
      .lang-list {
        &__item {
          display: inline-block;
          vertical-align: top;
          margin: 0 2px;
          color: $radical;
          cursor: pointer;
          text-decoration: underline;
          &:hover {
            color: $radical-h;
          }
          &.active {
            font-weight: 600;
            text-decoration: none;
          }
        }
      }
      .social {
          li {
            display: inline-block;
            vertical-align: top;
            margin-left: 4px;
            &:first-child {
              margin-left: 0;
            }
            a {
              display: flex;
              width: 35px;
              height: 35px;
              border-radius: 50px;
              justify-content: center;
              align-items: center;
              background-color: $geyser;
              transition: 0.2s ease;
              &:hover {
                background-color: $bali;
              }
              &:before {
                display: block;
                content:'';
              }
            }
            .vk:before {
              @include sprite('soc-vk');
            }
            .yt:before {
              @include sprite('soc-yt');
            }
            .fb:before {
              @include sprite('soc-fb');
            }
            .in:before {
              @include sprite('soc-in');
            }
            .li:before {
              @include sprite('soc-li');
            }
            .tw:before {
              @include sprite('soc-tw');
            }
          }
      }
    }
  }

  .copyright {
    color: #cad3df;
  }
  @media screen and (max-width: $mobMax) {
    footer {
      font-size: 10px;
    }
    .footer-nav {
      display: none;
    }
    .footer-bottom  {
      border-top: 0;
      height: auto;
      flex-direction: column;
      .copyright {
        padding: 30px 0 18px;
      }
      .social {
        padding: 18px 0 20px;
        display: flex;
        justify-content: center;
        width: 100%;
        li {
          margin: 0 7px!important;
        }
      }
    }
  }
</style>
