<template>
  <mainLayout />
</template>

<script>
import mainLayout from "./layouts/mainLayout.vue";

export default {
  name: "App",
  components: {
    mainLayout,
  },
};
</script>

<style lang="scss">
:root {
  --main-gray: #c7c7c7;
  --black-color: #191b08;
  --green-color: #e1fe03;
  --beige-color: #ebe6d8;
}
* {
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
}

.main {
  padding-top: 28px;
  background: #f9f9f6;
}
@media (max-width: 440px) {
  .container {
    max-width: 90%;
  }
}
</style>
