<template>
    <v-card class="h-auto">
        <v-img
            :src="this.cardImage"
            height="160px"
            cover
        ></v-img>
        <v-card-title> 
            {{recipe.title_name}}
        </v-card-title>
        <v-card-actions>
            <DialogRecipe :recipe="recipe" :callCallReset="callReset" :image="cardImage"></DialogRecipe>
        </v-card-actions>
    </v-card>
</template>

<script>
    import DialogRecipe from './DialogRecipe.vue';
    export default {
        name: 'CardRecipe',
        props: ['recipe', 'callReset'],
        components:{
            DialogRecipe
        },
        beforeMount() {            
            this.cardImage = `http://${process.env.VUE_APP_HOST}:3000/image/${this.recipe.id}`
        }
    }
</script>