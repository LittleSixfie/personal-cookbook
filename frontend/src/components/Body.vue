<template>
    <h1>Body</h1>
    <v-main>
      
      <v-row justify="center">
        <v-col
          cols="11"
          
        >
          <v-sheet
            elevation="10"
            rounded="xl"
          >
            <v-sheet
              class="pa-3 bg-primary text-right"
              rounded="t-xl"
            >
              <v-btn @click="burron" icon >
                <v-icon>mdi-filter-check</v-icon>
              </v-btn>

              <v-btn
                class="ms-2"
                icon
                @click="reset"
              >
                <v-icon>mdi-reload</v-icon>
              </v-btn>
            </v-sheet>

            <div class="pa-4">
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
            </div>
          </v-sheet>
        </v-col>
      </v-row>
      
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
import { toHandlers } from "vue";
    import { ref } from 'vue'
    
    export default {
        name: 'Body',
        methods: {
          async burron() {
            try {
              //TODO: Multivalue aplicar
              const newRecipes=[]
              for(const chip of this.chipFilter) {
                const response = await axios.get(`http://localhost:3000/ingridientsList/ingridient/${this.ingridients[chip].id}`)
                console.log("response", response)
                for(const idReceta of response.data){
                  console.log(idReceta)
                  newRecipes.push(this.recipes.find(element => element.id == idReceta.idreceta))
                }
                console.log("vuelta nuevas recetas", newRecipes)
              }
              this.recipes = newRecipes
            } catch (e) {
              alert(e)
            }
          },
          async reset(){
            try {
              const responseAllRecipes = await axios.get(`http://localhost:3000/recipes`)
              this.recipes = responseAllRecipes.data
              this.chipFilter = []
            } catch (e) {
              alert(e.response)
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

