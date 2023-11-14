<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <!-- <Form></Form> -->
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <!--  -->
      <!-- <Body /> -->
      <Form />
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  const drawer = ref(null)
</script>

<script>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import Body from './components/Body.vue'
import Form from './components/Form.vue'

/*
<v-app>
    <Header />
    <Body />
    <Form />
    <Footer />
  </v-app>
*/

export default {
  name: 'App',
  data: () => ({ drawer: null }),
  components: {
    Footer,
    Header,
    Body,
    Form
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
