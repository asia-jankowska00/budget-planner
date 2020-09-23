<template>
  <div id="sourceEdit" class="content-wrapper">
    <h6 class="">Edit source - <em>{{selectedSource.name}}</em></h6>


  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SourceEdit',
  computed: {
    ...mapGetters(['user', 'selectedSource']),
  }
}
</script>

<style>
.title {
  text-align: center;
}
</style>