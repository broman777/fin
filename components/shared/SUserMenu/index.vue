<template>
  <div class="top-dropdown">
    <span
      class="mob-logout"
      @click="logout"
    />
    <span class="toggle_usermenu" :class="{opened: isMenuOpened}" @click="toggleMenu">{{ $t('frontend.profile') }}</span>
    <div class="usermenu-wrap">
      <ul class="usermenu">
        <li>
          <nuxt-link :to="localePath('index')">
            Дашборд
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="localePath('profile')">
            {{ $t('frontend.profile_title') }}
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="localePath('password-change')">
            {{ $t('frontend.login_pwd_change-btn') }}
          </nuxt-link>
        </li>
        <li>
          <span
            class="logout"
            @click="logout"
          >
            {{ $t('frontend.logout') }}
          </span>
        </li>
      </ul>
      <ul class="phones-list mob">
        <li>Колл-центр</li>
        <li>+38 (067) 640 07 23</li>
        <li>+38 (050) 341 79 02</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'SUserMenu',
  data() {
    return {
      isMenuOpened: false
    }
  },
  watch: {
    $route() {
      this.isMenuOpened = false
    }
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    toggleMenu() {
      this.isMenuOpened = !this.isMenuOpened
    }
  }
}
</script>
<style lang="scss">
  .top-dropdown {
    position: relative;
    padding: 0 30px;
    &:hover {
      .usermenu-wrap .usermenu {
        max-height: 300px;
        border-color: $white-lilac;
      }
      .toggle_usermenu:after {
        transform: rotate(180deg);
      }
    }
  }
  .mob-logout {
    display: none;
  }
  .toggle_usermenu {
    display: block;
    padding: 0 16px;
    font-size: 12px;
    color: #ffffff;
    @include btn (33px, 6px, $radical, $radical-h);
    &:after {
      display: inline-block;
      margin: 0 0 2px 7px;
      vertical-align: middle;
      content: "";
      transition: .1s linear;
      @include sprite("toggle");
    }
    &.opened {
      & + .usermenu-wrap .usermenu {
        max-height: 300px;
        border-color: $white-lilac;
      }
      &:after {
        transform: rotate(180deg);
      }
    }
  }
  .usermenu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 20;
    display: block;
    max-height: 0;
    margin-top: 21px;
    overflow: hidden;
    border: 1px solid transparent;
    border-radius: 8px;
    background-color: #fff;
    transition: .3s ease-in;
    li {
      padding: 0 30px;
      &:first-child {
        padding-top: 20px;
      }
      &:last-child {
        padding-bottom: 8px;
      }
      .logout {
        margin-top: 18px;
        line-height: 50px;
        padding-top: 8px;
        border-top: 1px solid $white-lilac;
      }
    }
    a, span {
      display: block;
      width: 130px;
      font-size: 12px;
      font-weight: 600;
      line-height: 30px;
      color: $space;
      cursor: pointer;
      transition: .2s ease;
      &:hover {
        color: $radical;
      }
    }
  }
  @media screen and (max-width: $mobMax) {
    header {
      div.box {
        height: 60px;
      }
    }
    .logo {
      transform: scale(0.76);
      -webkit-transform-origin: 0 50%;
      -moz-transform-origin: 0 50%;
      -o-transform-origin: 0 50%;
      -ms-transform-origin: 0 50%;
      transform-origin: 0 50%;
    }
    .toggle_usermenu,
    .toggle_usermenu:before,
    .toggle_usermenu:after {
      right: 0;
      padding: 0;
      margin: 0;
      position: absolute;
      width: 30px;
      height: 4px;
      transition: transform .15s ease;
      background: #2e363e!important;
      border: none;
      border-radius: 0;
      font-size: 0;
      text-indent: -9999px;
    }
    .mob-logout {
      display: block;
      @include sprite("logout");
      margin-right: 24px;
    }
    .toggle_usermenu {
      display: block;
      top: 28px;
      right: 20px;
      z-index: 200;
      transition-timing-function: cubic-bezier(.55,.055,.675,.19);
      transition-duration: .22s;
      &:before,
      &:after {
        display: block;
        content: "";
      }
      &:before {
        top: -9px;
        transition: top .1s ease-in .25s,opacity .1s ease-in;
      }
      &:after {
        top: 9px;
        transition: top .1s ease-in .25s,transform .22s cubic-bezier(.55,.055,.675,.19);
      }
      &.opened {
        transition-delay: .12s;
        transition-timing-function: cubic-bezier(.215,.61,.355,1);
        transform: rotate(225deg);
        &:before {
          top: 0;
          transition: top .1s ease-out,opacity .1s ease-out .12s;
          opacity: 0;
        }
        &:after {
          top: 0;
          transition: top .1s ease-out,transform .22s cubic-bezier(.215,.61,.355,1) .12s;
          transform: rotate(-90deg)!important;
        }
      }
      &.opened + .usermenu-wrap {
        max-height: $mobMax;
      }
    }
    .top-dropdown {
      position: static;
    }
    .usermenu-wrap {
      display: block;
      position: absolute;
      overflow: hidden;
      max-height: 0;
      top: 61px;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 120;
      background-color: #fff;
      transition: 0.3s ease-in;
      .usermenu {
        margin: 0;
        top: 0;
        position: relative;
        border: 0;
        max-height: none!important;
        .logout {
          display: none;
        }
        li {
          padding: 0;
          &:first-child {
            padding-top: 16px;
          }
        }
        a, span {
          font-size: 14px;
          line-height: 36px;
          padding: 0 20px;
          width: auto;
          &.nuxt-link-exact-active {
            color: $radical;
          }
        }
      }
    }
    .header_right .usermenu-wrap .phones-list {
      background-color: $lilac;
      position: absolute;
      bottom: 61px;
      left: 0;
      right: 0;
      margin-right: 0!important;
      padding: 14px 20px 30px;
      li {
        display: block;
        margin-top: 17px;
        &:first-child {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }
        &:before {display: none;}
      }
    }
  }
</style>
