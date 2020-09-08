<template>
  <div id="dashboard">
      <Panel />
      <Tabs />
      <FloatAction />
      <router-view></router-view>
  </div>
</template>

<script>
import Panel from '@/components/Panel';
import Tabs from '@/components/Tabs';
import FloatAction from '@/components/FloatAction';

const checkRoute = function() {
    const url = window.location.href;
    const hasSlash = url[url.length - 1] === '/' ? true : false;
    const dashboardPath = hasSlash ? '/dashboard/' : '/dashboard';

    if (url.length - dashboardPath.length === url.indexOf(dashboardPath)) {
        console.log('%c Dashboard - redirecting to sources', 'color: yellowgreen; background-color: black');
        window.location.href += hasSlash ? 'sources' : '/sources';
    }
}

export default {
    name: 'Dashboard',
    components: {
        Panel,
        Tabs,
        FloatAction
    },
    watch: {
        '$route' () { checkRoute(); }
    },
    beforeCreate: function() {
        console.log('%c Dashboard - beforeCreate - Need to check token from now on', 'color: yellow; background-color: black');
        checkRoute();
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
    }
</style>