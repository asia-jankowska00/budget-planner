<template>
  <div id="sources" class="content-wrapper" v-if="sources.length > 0">
    <Select 
      id="mainSource" 
      label="Your sources"
      :options="sources" 
      v-model="selectedSource" 
      displayKey="name" 
      valueKey="id"
    />
  </div>
  <div v-else class="empty-view">Looks like you don't have any sources.</div>
</template>

<script>
import Select from '@/components/Select';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Source',
  components: {
    Select
  },
  methods: {
    ...mapActions(['updateSelectedSource']),
  },
  computed: {
    ...mapGetters(['sources']),
    selectedSource: {
      get () {
        return this.$store.state.sources.selectedSource.id
      },
      set (value) {
        this.$store.commit('updateSelectedSource', this.sources.find(s => s.id.toString() === value))
      }
    }
  }
}
</script>

<style lang="scss">
  .content-wrapper {
    height: calc(100% - 116px);
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 8px;
    padding: 0 5%;

    #mainSource {
      label {
        left: 0;
      }
    }
  }
</style>