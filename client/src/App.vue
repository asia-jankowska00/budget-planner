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
$text-color: #373737;
$primary: #00796b;

html {
  font-size: 18px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
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
    background: rgb(235, 235, 235);
    padding: 2%;
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
