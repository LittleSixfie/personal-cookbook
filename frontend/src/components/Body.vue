<template>
    <h1>Body</h1>
    <v-main>
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
        <v-btn @click="burron">boton</v-btn>
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
              //TODO: REVISAR EL COMPORTAMIENTO DE ESTOQ UE NO ME CONVENcE DEL TODO
              
              const newRecipes=this.recipes
              for(const chip of this.chipFilter) {
                const response = await axios.get(`http://localhost:3000/ingridientsList/ingridient/${this.ingridients[chip].id}`)
                console.log("response", response.data)
                for(const idReceta in response.data){
                  this.recipes = newRecipes.filter(element3 => idReceta.idreceta == element3.id)
                  //newRecipes.push(temp)
                }
              }
              this.recipes 
              console.log(newRecipes)
            } catch (e) {
              alert(e)
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
              const responseAllRecipes = await axios.get(`http://localhost:3000/recipes`)
              this.recipes = responseAllRecipes.data
              const responseAllIngridients = await axios.get(`http://localhost:3000/ingridients`)
              this.ingridients = responseAllIngridients.data
            } catch (e) {
              alert(e.response)
              this.errors.push(e)
            }
          },
        
    }
</script>

