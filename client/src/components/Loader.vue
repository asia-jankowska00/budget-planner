<template>
  <div class="loading" :class="{ small: isSmall }">
    <p>{{text}}</p>
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    text: {
      type: String,
      required: true
    },
    isSmall: Boolean
  }
}
</script>

<style lang="scss">
.loading {
    height: 100%;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5vw;

    &.small {
      height: 100px;
      position: relative;
      padding: 0;
      margin: 32px 0;
    }

    > p {
      margin-bottom: 4px;
    }

    .progress {
      background: #e5efff;

      .indeterminate {
        background: #2979ff;
      }
    }
  }
</style>