<template>
    <v-main>      
      <v-row justify="center">
        <v-col cols="11">
          <v-sheet class="ma-0 pa-0" elevation="5" rounded="xl" fluid>
              <v-row class="ma-0 pa-0" align="center" justify="center"  >
                <v-col cols="12" sm="9" md="10" lg="11">
                  
                    <v-chip-group
                      class=""
                      multiple
                      v-model="chipFilter"
                    >
                      <v-chip
                        v-for="n in ingridients"
                        :key="n"
                        filter
                      > {{n.nombre}}</v-chip>
                    </v-chip-group>
                
                </v-col>
                <v-col cols="12" sm="3" md="2" lg="1" class=" bg-primary rounded-xl fill-height" >
                    <v-container>
                      <v-btn class="ml-1" @click="filter" icon >
                        <v-icon>mdi-filter-check</v-icon>
                      </v-btn>
                      <v-btn class="ma-1" icon @click="reset">
                        <v-icon>mdi-reload</v-icon>
                      </v-btn>
                    </v-container>
                </v-col>
              </v-row>
            </v-sheet>
        </v-col>
      </v-row>
        <v-row class="ma-10">
          <v-col
            v-for="recipe in recipes"
            :key="recipe"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
          <CardRecipe :token="token" :recipe="recipe" :callReset="reset" ></CardRecipe>
          </v-col>
        </v-row>
    </v-main>
</template>

<script>
  import axios from "axios";
  import CardRecipe from "./CardRecipe.vue";
  export default {
    name: "Body",
    props: ['token'],
    data() {
      return {
        recipes: [],
        ingridients: [],
        chipFilter: [],
        errors: [],
      };
    },
    components: {
      CardRecipe
    },
    methods: {
      async filter() {
        try {
          //TODO: Multivalue aplicar
          const ingridientQuery = [];
          for (const chip of this.chipFilter) {
            ingridientQuery.push(this.ingridients[chip].idingrediente)
          }
          const responseFilter = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/recipes/filter/${ingridientQuery.join("_")}`, { headers: { Authorization: `Bearer ${this.token}` } })
          this.recipes = responseFilter.data
        } catch (e) {
          alert(e);
        }
      },
      async reset() {
        try {
          const responseAllRecipes = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/recipes`, { headers: { Authorization: `Bearer ${this.token}` } })
          this.recipes = responseAllRecipes.data;
          this.chipFilter = [];
        } catch (e) {
          alert(e.response);
          this.errors.push(e);
        }
      }
    },
    async beforeMount() {
      try {
        const responseAllRecipes = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/recipes`, { headers: { Authorization: `Bearer ${this.token}` } })
        this.recipes = responseAllRecipes.data;
        const responseAllIngridients = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/ingridientsList/mostUsed`, { headers: { Authorization: `Bearer ${this.token}` } });
        this.ingridients = responseAllIngridients.data;
      } catch (e) {
        alert(e.response);
        this.errors.push(e);
      }
    }
  }
</script>
