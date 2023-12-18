<template>
    <v-app v-if="true">
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
          <v-text-field
            v-model="user"
            label="Email address"
            placeholder="johndoe@gmail.com"
            type="email"
            :rules="[rules.required]"
            :readonly="loading"
            clearable
          ></v-text-field>

          <v-text-field
            v-model="password"
            :readonly="loading"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Normal with hint text"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
            clearable
          ></v-text-field>
          <v-btn
            :disabled="!form"
            :loading="loading"
            block
            color="success"
            size="large"
            type="submit"
            variant="elevated"
            
          >
            submit
          </v-btn>

        </v-form>
        <authenticator>
          <template v-slot="{ user, signOut }">
            <h1>Hello {{ user.username }}!</h1>
            <button @click="signOut">Sign Out</button>
          </template>
        </authenticator>

    </v-app>
    <v-app v-if="false" id="inspire">
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
  import { signIn } from 'aws-amplify/auth';  
  import {Amplify } from 'aws-amplify';
  import { Authenticator } from "@aws-amplify/ui-vue";
  import "@aws-amplify/ui-vue/styles.css";

  Amplify.configure({
    Auth: {
      Cognito: {
        region: "eu-central-1",
        userPoolId: "eu-central-1_oi48gpngh",
        userPoolWebClientId: "5ln2ofjtto6roloog2fbm3gmqa",
      }
    }
  });
  const currentConfig = Amplify.getConfig();
  console.log(currentConfig)
  export default {
    name: 'App',
    data: () => ({  
      dialog:false,
      show1: false,
      password: '',
      loading: false,
      user:"",
      form: false,
      rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 10 || 'Min 10 characters',
          emailMatch: () => (`The email and password you entered don't match`),
        },
    }),
    components: {
      Footer,
      Header,
      Body,
    },
    methods: {
      async onSubmit () {       
        this.loading = true
        try {
          const { isSignedIn, nextStep } = await signIn({ 
            username:"RecipeAdminCookbook", 
            password:"EstoEsSoloUnaPrueba@1" 
          });
          console.log(isSignedIn,nextStep)
        } catch (error) {
          console.log('error signing in', error);
        }
        setTimeout(() => (this.loading = false), 2000)
      },
    }
  }
</script>
