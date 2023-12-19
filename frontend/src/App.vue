<template>
    <v-app v-if="!dialog">
      <Login @mensaje-al-padre="recibirMensajeDelHijo" />
    </v-app>
    <v-app v-if="dialog" id="inspire">
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
</script>

<script>
  import Footer from './components/Footer.vue'
  import Header from './components/Header.vue'
  import Body from './components/Body.vue'
  import Login from './components/Login.vue'
  

  export default {
    name: 'App',
    data: () => ({  
      dialog:"",
    }),
    components: {
      Footer,
      Header,
      Body,
      Login
    },
    methods:{
      recibirMensajeDelHijo(mensaje) {
        this.dialog=mensaje
      }
    }
    
  }
</script>
