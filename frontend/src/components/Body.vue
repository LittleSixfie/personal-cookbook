<template>
    <h1>Body</h1>
    <v-main>
      <v-btn @click="burron">boton</v-btn>
      <v-text-field>{{chipFilter.length}}</v-text-field>
      <v-container>
        <v-chip-group
        cols="12"
        multiple
        v-model="chipFilter"
        >
         <v-chip
           v-for="n in ingridients"
           :key="n"
           filter
         > {{n.nombre}}</v-chip>
        </v-chip-group>
      </v-container>
      
      <v-container>
        <v-row>
          <v-col
            v-for="n in recipes"
            :key="n"
            cols="4"
          >
            <v-card height="200"
             :title="n.title_name"
            >
            <v-card-text class="d-inline-block text-overflow-ellipses" >{{n.instructions}} </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!--
       <v-list lines="one">
        <v-list-item
            v-for="post in posts"
            :key="post"
            :title="'Item ' + post.id"
            :subtitle='post.title_name + post.nombre'
        ></v-list-item>
        
      </v-list>
      -->
    </v-main>
</template>

<script>
    import axios from "axios";
    import { ref } from 'vue'
    
    export default {
        name: 'Body',
        methods: {
          async burron() {
            try {
              console.log(this.chipFilter)
              
              //const response = await axios.get(`http://3.76.37.239:3000/ingridients`)
              //this.posts = response.data
            } catch (e) {
              this.errors.push(e)
            }
          }
        },
        data() {
            return {
              recipes: [],
              ingridients: [],
              chipFilter: [],
              errors: [],
              counter: 0,
            }
          },
        
          // Fetches posts when the component is created.
          async created() {
            try {
              const responseAllRecipes = await axios.get(`http://3.76.37.239:3000/recipes`)
              this.recipes = responseAllRecipes.data
              const responseAllIngridients = await axios.get(`http://3.76.37.239:3000/ingridients`)
              this.ingridients = responseAllIngridients.data
            } catch (e) {
              alert(e.response)
              this.errors.push(e)
            }
          },
        
    }
</script>

