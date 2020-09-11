<template>
  <div id="panel" class="primary-bg">
    <Icon v-if="!isSideNavOpen" name="menu" @click.native="toggleSideNav(true)"/>
    <Icon v-else name="close" @click.native="toggleSideNav(false)"/>
    <Icon name="notifications" />

    <ul id="slide-out" class="sidenav">
      <li class="user"><span class="circle">AB</span><span class="username">afbogdan</span></li>
      <li><a class="waves-effect" href="#!">Profile</a></li>
      <li><div class="divider"></div></li>
      <li><a class="waves-effect" href="#!">Logout</a></li>
    </ul>
  </div>
</template>

<script>
import Icon from '@/components/Icon';
import M from 'materialize-css';

export default {
  name: 'Panel',
  components: {
    Icon
  },
  data() {
    return {
      isSideNavOpen: false
    }
  },
  mounted() {
    const elems = document.querySelector('.sidenav');
    const self = this;
    M.Sidenav.init(elems, {onCloseStart: function() {self.isSideNavOpen = false}});
  },
  methods: {
    toggleSideNav(isOpening) {
      let elem = document.querySelector('.sidenav');
      let sideNav = M.Sidenav.getInstance(elem);

      if (isOpening) {
        sideNav.open();
        this.isSideNavOpen = true;
      } else {
        sideNav.close();
        this.isSideNavOpen = false;
      }
    }
  }

}
</script>

<style lang="scss">
#panel {
  height: 60px;
  width: 100%;
  padding: 0 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .sidenav {
    position: absolute;
    top: 60px;
    height: calc(100% - 60px);

    .user {
      padding: 0 32px;
      margin: 5vh 0;

      .circle {
        overflow: hidden;
        padding: 6px 8px;
        background: cyan;
        font-size: 1.2rem;
      }

      .username {
        margin-left: 8px;
      }
    }
  }

  .sidenav-trigger {
    padding-top: 8px;
  }

  i {
    font-size: 2rem;
    color: white;
    cursor: pointer;
  }
}
</style>