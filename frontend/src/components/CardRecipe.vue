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
            <v-btn
                class="ms-2"
                @click=""
                color="orange-lighten-2"
                variant="text"
            >
                Receta completa
            </v-btn>
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
        }
    }
</script>