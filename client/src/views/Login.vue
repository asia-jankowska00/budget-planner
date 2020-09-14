<template>
  <div id="login">
    <h5><em>Login</em></h5>

    <form @submit.prevent="submit" class="row" autocomplete="off">
      <TextInput
        id="username"
        label="Username"
        type="text"
        v-model="username"
      />
      <TextInput
        id="password"
        label="Password"
        type="password"
        v-model="password"
      />

      <div class="actions">
        <Button
          label="Login"
          size="large"
          type="submit"
          :isDisabled="!canSubmit"
        />
        <router-link to="/register" class="link"
          >Don't have an account?</router-link
        >
      </div>
    </form>
  </div>
</template>

<script>
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import M from "materialize-css";

export default {
  name: "Login",
  components: {
    TextInput,
    Button,
  },
  computed: {
    canSubmit: function() {
      return this.username.length > 1 && this.password.length > 1;
    },
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    submit: function() {
      if (this.canSubmit) {
        this.$store
          .dispatch("login", {
            username: this.username,
            password: this.password,
          })
          .then(() => {
            this.$router.push({ path: "dashboard/sources" });
          })
          .catch((err) => {
            M.toast({
              html: err.response.data.message
                ? err.response.data.message
                : "Something went wrong",
            });
          });
      }
    },
  },
  created() {
    this.$store.dispatch("getCurrencies").catch((err) => {
      M.toast({
        html: err.response.data.message
          ? err.response.data.message
          : "Something went wrong",
      });
    });
  },
};
</script>

<style lang="scss" scoped>
#login {
  padding: 5%;
}

h5 {
  text-align: center;
  margin: 10vh 0 5vh 0;
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
