<template>
    <v-card height="200">
        <v-img
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            height="110px"
            cover
        ></v-img>
        <v-card-title> 
            {{recipe.title_name}}
        </v-card-title>
        <v-card-actions>
            <DialogRecipe :recipe="recipe"></DialogRecipe>
        </v-card-actions>
    </v-card>
</template>

<script>
    import DialogRecipe from './DialogRecipe.vue';
    export default {
        name: 'CardRecipe',
        props: ['recipe'],
        components:{
            DialogRecipe
        },
        data(){
            return {

            }
        }
    }
</script>