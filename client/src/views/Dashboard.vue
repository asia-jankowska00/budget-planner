<template>
  <div id="dashboard">
      <Panel />
      <Tabs />
      <FloatAction />
      <AddSource v-if="isModalOpen && modalName === 'addSource'"/>
      <AddBudget v-if="isModalOpen && modalName === 'addBudget'"/>
      <div id="mask" v-if="isModalOpen"></div>

      <router-view></router-view>
  </div>
</template>

<script>
import Panel from '@/components/Panel';
import Tabs from '@/components/Tabs';
import FloatAction from '@/components/FloatAction';
import AddSource from '@/components/AddSource';
import AddBudget from '@/components/AddBudget';
import { mapGetters } from 'vuex';

const checkRoute = function(context) {
    const url = window.location.href;
    const hasSlash = url[url.length - 1] === '/' ? true : false;
    const dashboardPath = hasSlash ? '/dashboard/' : '/dashboard';

    if (url.length - dashboardPath.length === url.indexOf(dashboardPath)) {
        console.log('%c Dashboard - redirecting to sources', 'color: yellowgreen; background-color: black');
        context.$router.push({ path: 'dashboard/sources' })
    }
}

export default {
    name: 'Dashboard',
    components: {
        Panel,
        Tabs,
        FloatAction,
        AddSource,
        AddBudget
    },
    watch: {
        '$route' () { checkRoute(); }
    },
    beforeCreate: function() {
        console.log('%c Dashboard - beforeCreate - Need to check token from now on', 'color: yellow; background-color: black');
        checkRoute(this);
    },
    computed: {
        ...mapGetters(['isModalOpen', 'modalName']),
    }
}
</script>

<style lang="scss" scoped>
    #dashboard {
        height: 100%;
        position: relative;
        
        > .empty-view {
            height: calc(100% - 108px);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #mainCTA {
            position: absolute;
            bottom: 40px;
            right: 2px;
        }

        #mask {
            position: absolute;
            background: rgba(0,0,0,0.5);
            left: 0;
            top: 60px;
            width: 100%;
            height: calc(100% - 60px);
            pointer-events: none;
            z-index: 1500;
        }
    }
</style>