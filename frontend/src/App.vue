<template>
  <v-app id="inspire">
    <v-app-bar class="pa-3 bg-primary">
      <v-app-bar-title>Application</v-app-bar-title>

        <v-dialog
          v-model="dialog"
          fullscreen
          :scrim="false"
          transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              variant="elevated"
              icon
              dark
              v-bind="props"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-toolbar
              dark
              color="primary"
            >
              <v-btn
                icon
                dark
                @click="dialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Add Recipe</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <Form />
          </v-card>
      </v-dialog>
    </v-app-bar>

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
  data: () => ({  dialog:false}),
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
