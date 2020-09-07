<template>
  <div id="login">
    <h5><em>Login</em></h5>

    <form @submit.prevent="submit" class="row" autocomplete="off">
      <TextInput id="username" label="Username" type="text" v-model="username"/>
      <TextInput id="password" label="Password" type="password" v-model="password"/>

      <div class="actions">
        <Button label="Login" size="large" type="submit"/>
        <router-link to="/register" class="link">Don't have an account?</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import TextInput from '@/components/TextInput'
import Button from '@/components/Button'

export default {
  name: 'Login',
  components: {
    TextInput,
    Button
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    submit: function(){
      alert('submitted');
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  padding: 5%;
}

h5 {
  text-align: center;
  margin-top: 10vh;
  color: #2979ff;
}

form {
  margin-top: 5vh;

  .actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;

    .btn {
      width: max-content;
    }

    .link {
      margin-top: 10vh;
    }
  }
}
</style>