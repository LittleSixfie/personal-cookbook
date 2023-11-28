<template>
  <v-app id="inspire">
    <Header />

    <v-main>
      <!--  -->
      <Body /> 
    </v-main>
  </v-app>
</template>

<script>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import Body from './components/Body.vue'

export default {
  name: 'App',
  data: () => ({  dialog:false}),
  components: {
    Footer,
    Header,
    Body,
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