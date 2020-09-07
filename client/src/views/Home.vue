<template>
  <div id="home">
    <h3>Welcome to <br><em>Budget planner</em></h3>
    
    <div class="description">
      <p>All you need to do to keep track of your money is to <strong>define your sources</strong> and <strong>group them together</strong>.</p>
    </div>
    
    <div class="actions">
      <router-link to="/register">
        <Button label="Register" :icon="{name: 'favorite', direction: 'right'}"/>
      </router-link>

      <router-link to="/login">
        <Button label="Login" :icon="{name: 'login', direction: 'right'}"/>
      </router-link>
    </div>
    
  </div>
</template>

<script>
import Button from '@/components/Button.vue';

export default {
  name: 'Home',
  components: {
    Button
  }
}
</script>

<style lang="scss" scoped>
  * {
    text-align: center;
  }
  
  #home {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    padding: 5%;

    h3 {
      margin: 0;
    
      em {
        color: #2979ff;
      }
    }

    .description {
      margin: 10vh 0 15vh;
    }

    .steps li{
      text-align: left;
    }
  }
</style>