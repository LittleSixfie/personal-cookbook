<template>
    <v-app v-if="!token">
      <Login @emit-token="getToken" />
    </v-app>
    <v-app v-if="token" id="inspire">
      <Header :token="token"/>
      <v-main>
        <!--  -->
        <Body :token="token"/> 
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
      token:"",
    }),
    components: {
      Footer,
      Header,
      Body,
      Login
    },
    methods:{
      getToken(tokenChild) {
        this.token=tokenChild
      }
    }
  }
</script>
