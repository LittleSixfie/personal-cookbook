<template>
    <v-main>      
      <v-row justify="center">
        <v-col cols="11">
          <v-sheet elevation="10" rounded="xl" >
            <v-sheet class="pa-3 bg-primary text-right" rounded="t-xl">
              <v-btn @click="filter" icon >
                <v-icon>mdi-filter-check</v-icon>
              </v-btn>
              <v-btn class="ms-2" icon @click="reset">
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
        <v-row class="ma-10">
          <v-col
            v-for="recipe in recipes"
            :key="recipe"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
          <CardRecipe :recipe="recipe" :callReset="reset" ></CardRecipe>
          </v-col>
        </v-row>
    </v-main>
</template>

<script>
  import axios from "axios";
  import CardRecipe from "./CardRecipe.vue";
  export default {
    name: "Body",
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
          const newRecipes = [];
          for (const chip of this.chipFilter) {
            const response = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/ingridientsList/ingridient/${this.ingridients[chip].id}`);
            for (const idReceta of response.data) {
              newRecipes.push(this.recipes.find(element => element.id == idReceta.idreceta));
            }
          }
          this.recipes = newRecipes;
        } catch (e) {
          alert(e);
        }
      },
      async reset() {
        try {
          const responseAllRecipes = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/recipes`);
          this.recipes = responseAllRecipes.data;
          this.chipFilter = [];
        } catch (e) {
          alert(e.response);
          this.errors.push(e);
        }
      }
    },
    async created() {
      try {
        const responseAllRecipes = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/recipes`);
        this.recipes = responseAllRecipes.data;
        const responseAllIngridients = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/ingridients`);
        this.ingridients = responseAllIngridients.data;
      } catch (e) {
        alert(e.response);
        this.errors.push(e);
      }
    }
  }
</script>
