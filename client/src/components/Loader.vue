<template>
  <div class="loading">
    <p>Loading data</p>
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader'
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