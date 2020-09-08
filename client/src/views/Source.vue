<template>
  <div v-if="sources.length > 0">You have {{sources.length}} sources. </div>
  <div v-else class="empty-view">Looks like you don't have any sources.</div>
</template>

<script>
import M from "materialize-css";
import { mapState } from 'vuex';

export default {
  name: 'Source',
  computed: mapState({
    sources: state => state.sources
  }),
  mounted() {
    const tabs = M.Tabs.init(document.querySelector('ul.tabs'));
    tabs.updateTabIndicator();
    document.querySelector('.router-link-active').blur();
  }
}
</script>

<style scoped>
    
</style>