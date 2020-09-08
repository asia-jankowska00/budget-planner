<template>
  <div id="dashboard">
      <Panel />
      <Tabs />
      <router-view></router-view>
  </div>
</template>

<script>
import Panel from '@/components/Panel';
import Tabs from '@/components/Tabs';

export default {
    name: 'Dashboard',
    components: {
        Panel,
        Tabs
    },
    beforeCreate: function() {
        console.log('%c Dashboard - beforeCreate - Need to check token from now on', 'color: yellow; background-color: black');
    }
}
</script>

<style lang="scss" scoped>
    #dashboard {
        height: 100%;
        
        > .empty-view {
            height: calc(100% - 108px);
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>