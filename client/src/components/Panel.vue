<template>
  <div id="panel" class="primary-bg">
    <Icon name="menu" />
    <Icon name="notifications" />
  </div>
</template>

<script>
import Icon from '@/components/Icon';

export default {
  name: 'Panel',
  components: {
    Icon
  }
}
</script>

<style lang="scss" scoped>
#panel {
  height: 60px;
  width: 100%;
  padding: 0 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  i {
    font-size: 2rem;
    color: white;
  }
}
</style>