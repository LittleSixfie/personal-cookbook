<template>
    <v-app id="inspire">
      <Header />
      
      <v-main>
        <!--  -->
        <Body /> 
      </v-main>
      
    </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()
console.log(theme.current)

</script>

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
