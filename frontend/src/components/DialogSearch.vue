//todo: Se puede fraccionar en varios componenetes seguramente
<template>
    <v-card>
        <v-toolbar
            dark
            color="primary"
            class="pa-2"
        >
        <v-text-field
            label="Search by recipe name"
            variant="outlined"
            append-inner-icon="mdi-magnify"
            hide-details
            clearable
            v-model="search"
            @input="handleInput"
            fixed
            class="ma-1"
            ></v-text-field> 
        </v-toolbar>
        <v-row class="ma-1"> 
            <v-card-title v-if="this.filteredRecipes.length==0">Nothing Found!</v-card-title>
            <v-col
            v-for="recipe in filteredRecipes"
            :key="recipe"
            cols="6"
            sm="4"
            md="3"
            lg="2"
            >
            <CardRecipe :token="token" :recipe="recipe"  ></CardRecipe>
        </v-col>
    </v-row>
    </v-card>
        

</template>

<script>
    import CardRecipe from "./CardRecipe.vue";
    export default {
    name: 'DialogSearch',
    props: ['recipes', 'token', 'recipes', 'ingridients'],
    data() {
        return {
            listIngridients: [],
            filteredRecipes: [],
            search: '',
        };
    },
    methods: {
        handleInput() {
            this.filteredRecipes = this.recipes.filter(recipe => recipe.title_name.toLowerCase().includes(this.search.toLowerCase()));
            if (this.search == "") this.filteredRecipes = [];
        }
    },
    components: { CardRecipe }
}
</script>