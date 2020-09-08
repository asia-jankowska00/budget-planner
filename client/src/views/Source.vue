<template>
  <div v-if="sources.length > 0">You have {{sources.length}} sources. </div>
  <div v-else class="empty-view">Looks like you don't have any sources.</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Source',
  computed: mapState({
    sources: state => state.sources
  }),
}
</script>

<style scoped>
    
</style>