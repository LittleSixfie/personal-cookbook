<template>
  <v-app>
     <Transition name="login">
    <v-app v-if="!token" transition="fade-transition">
      <Header :token="token"/>
      <v-main>
        <Login @emit-token="getToken" />
      </v-main>
    </v-app>
     </Transition>
    <Transition  name="page">
    <v-app v-if="token" id="inspire" transition="fade-transition">
      <Header :token="token" :congito="congito"/>
      <v-main>
        <!--  -->
        <Body :token="token"/> 
      </v-main>
    </v-app>
    </Transition>

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

<style>
  .page-enter-active {
    transition: opacity 3s ease;
  }

  .page-enter-from {
    opacity: 0;
  }
  
  .login-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .login-leave-to {
    opacity: 0.2;
  }
</style>