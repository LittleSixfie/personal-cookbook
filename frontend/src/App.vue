<template>
  <v-app>
    <v-app v-if="!token">
      <Header :token="token"/>
      <v-main>
        <Login @emit-token="getToken" />
      </v-main>
    </v-app>
    <v-app v-if="token" id="inspire">
      <Header :token="token" :congito="congito"/>
      <v-main>
        <!--  -->
        <Body :token="token"/> 
      </v-main>
    </v-app>
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
      congito:null
    }),
    components: {
      Footer,
      Header,
      Body,
      Login
    },
    methods:{
      getToken(tokenChild, congitoUser) {
        this.congito= congitoUser
        this.token=tokenChild
      }
    }
  }
</script>
