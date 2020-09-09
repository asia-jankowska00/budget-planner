<template>
  <div id="sources" v-if="sources.length > 0">
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
import M from "materialize-css";
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
  },
  mounted() {
    const tabs = M.Tabs.init(document.querySelector('ul.tabs'));
    tabs.updateTabIndicator();
    document.querySelector('.router-link-active').blur();
  }
}
</script>

<style lang="scss">
  #sources {
    height: calc(100% - 108px);
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