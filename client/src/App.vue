<template>
  <div id="root">
    <router-view></router-view>
  </div>
</template>

<script>
import "materialize-css/dist/css/materialize.min.css";
import 'materialize-css/dist/js/materialize.min';

export default {
  name: "App",
};
</script>

<style lang="scss">
$background: #4f4f4f;
$appbackground: #FCFDFE;
$text-color: #455a65;
$text-light: #90A4AE;
$primary: #2979ff;
$lightPrimary: #e5efff;

html {
  font-size: 18px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;

  button, input, optgroup, select, textarea {
    font-family: inherit;
  }
}

.primary {
  color: $primary
}

.light-primary {
  color: $text-light
}

.primary-bg {
  background-color: $primary;
}

.light-primary-bg {
  background-color: $lightPrimary;
}

.title {
  color: $text-light;
}

.section-title {
  color: #37474F;
  font-weight: 600;
  margin: 16px 0 8px;
}

h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 2.2rem;
}

h3 {
  font-size: 2rem;
}

h4 {
  font-size: 1.8rem;
}

h5 {
  font-size: 1.6rem;
}

h6 {
  font-size: 1.4rem;
}

a.link {
  color: $primary;
  text-decoration: underline;
}

strong {
  color: $primary;
  font-weight: 800;
}

em {
  font-weight: 600;
  font-style: normal;
}


body {
  height: 100vh;
  width: 100vw;
  background: $background;
  color: $text-color;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;

  #root {
    width: 450px;
    height: 90vh;
    background: $appbackground;
    overflow: hidden;
    position: relative;
  }

  .sidenav-overlay {
    position: absolute;
    width: 450px;
    height: calc(90vh - 60px);
    left: calc(50% - 225px);
    top: calc(5vh + 60px);
  }

  #toast-container {
    width: 400px;
    left: calc(50% - 200px);
    top: unset;
    bottom: 8vh;

    .toast {
      background: #cb4848;
      width: inherit;
    }
  }
}

@media (max-width: 450px) {
  body #root {
    width: 100%;
    height: 100%;
  }
}

// #nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
