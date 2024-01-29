<template>
    <v-main>      
      <v-row justify="center">
        <v-col cols="11" justify="center">
          <v-sheet class="pa-" elevation="5" rounded="xl" fluid color="primary">
              
                
                    <v-combobox
                      class="px-4 pt-5"
                      clearable
                      variant="solo-filled"
                      chips
                      multiple
                      label="Filter by ingridient"
                      :items="ingridients.map(element => element.nombre)"
                      v-model="chipFilter"
                      :loading="loadingCombox"
                    ></v-combobox>
                
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
        loadingCombox: false,
      };
    },
    components: {
      CardRecipe
    },
    methods: {
      
      async reset() {
        try {
          const responseAllRecipes = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/recipes`, { headers: { Authorization: `Bearer ${this.token}` } })
          this.recipes = responseAllRecipes.data;
        } catch (e) {
          alert(e.response);
          this.errors.push(e);
        }
      }
    },
    watch: {
      async chipFilter(newValue, oldValue) {
        this.loadingCombox=true
        if(this.chipFilter.length == 0){
          this.loadingCombox=false
          this.reset()
          return
        }  
        try {
          const ingridientQuery = [];
          for (const chip of this.chipFilter) {
            ingridientQuery.push( this.ingridients.find(element => element.nombre == chip ).id)
          }
          const responseFilter = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/recipes/filter/${ingridientQuery.join("_")}`, { headers: { Authorization: `Bearer ${this.token}` } })
          this.recipes = responseFilter.data
        } catch (e) {
          alert(e);
        }
        this.loadingCombox=false
      }
    },
    async beforeMount() {
      try {
        const responseAllRecipes = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/recipes`, { headers: { Authorization: `Bearer ${this.token}` } })
        this.recipes = responseAllRecipes.data;
        const responseMostUsedIngredients = await axios.get(`http://${process.env.VUE_APP_HOST}:3000/ingridients/`, { headers: { Authorization: `Bearer ${this.token}` } });
        this.ingridients = responseMostUsedIngredients.data;

      } catch (e) {
        alert(e.response);
        this.errors.push(e);
      }
    }
  }
</script>
