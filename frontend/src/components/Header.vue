<template>
    <v-app-bar class="pa-3 bg-primary overflow-visible">
        <v-app-bar-title >RecipeBook</v-app-bar-title>
        
        <template v-if="token" v-slot:append >
        <v-btn
            variant="elevated"
            icon
            dark
            class="mr-2"
            @click="close" 
        >
            <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>
        <v-btn
            variant="elevated"
            dark
            class="mr-2"
            icon
            @click="dialogSearch = true"
        >
            <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-dialog
            v-model="dialogSearch"
            width="75%"
            transition="dialog-bottom-transition"
        >
            <DialogSearch :token="token"  :recipes="recipes"  :ingridients="ingridients"></DialogSearch>
        </v-dialog>
        <v-dialog
            v-model="dialog"
            fullscreen
            :scrim="false"
            transition="dialog-bottom-transition"
        >
            <template v-slot:activator="{ props }">
                <v-btn
                variant="elevated"
                icon
                dark
                v-bind="props"
                class="mr-2"
                >
                <v-icon>mdi-plus</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-toolbar
                    dark
                    color="primary"
                >
                <v-btn
                    icon
                    dark
                    @click="dialog = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Add Recipe</v-toolbar-title>
                <v-spacer></v-spacer>
                </v-toolbar>
                <Form :token="token"/>
            </v-card>
            </v-dialog>

            <v-dialog
                v-model="dialogCamera"
                fullscreen
                :scrim="false"
                transition="dialog-bottom-transition"
            >
                <template v-slot:activator="{ props }">
                    <v-btn
                        variant="elevated"
                        icon
                        dark
                        v-bind="props"
                        class="mr-2"
                    >
                        <v-icon>mdi-camera</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-toolbar dark color="primary" >
                        <v-btn
                            icon
                            dark
                            @click="dialogCamera = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Add Recipe with Image</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <FormCamera :token="token"/>
                </v-card>
            </v-dialog>
            <v-switch @change="toggleTheme" label="Theme" inset class="mt-5"></v-switch>
        </template>
        
    </v-app-bar>
</template>

<script setup>
    import { useTheme } from 'vuetify'
    const theme = useTheme()
    function toggleTheme () {
        theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
</script>

<script>
    import Form from './Form.vue'
    import FormCamera from './FormCamera.vue'
    import {CognitoUserPool,CognitoUser,} from 'amazon-cognito-identity-js';
    import axios from 'axios';
    import DialogSearch from './DialogSearch.vue'

    export default {
        name: 'Header',
        isDark:false,
        props: ['token', 'congito', 'recipes', 'ingridients'],
        data: () => ({  
            dialog:false, 
            dialogCamera:false,
            dialogSearch:false,
            filteredRecipes:[],
            search:'',
            rules: [
                value => {
                    if (value) return true
                        return 'You must enter text.'
                }
            ],
        }),
        components: {
            Form,
            FormCamera,
        },
        beforeDestroy() {
            window.removeEventListener('beforeunload', this.close);
        },  
        methods:{
            async close(){
                var cong = this.congito
                var token = this.token
                await cong.globalSignOut({
                    onSuccess: async function (result) {
                        console.log('Global sign-out successful', result);
                        try {
                            await axios.get(`http://${process.env.VUE_APP_HOST}:3000/recipes`, { headers: { Authorization: `Bearer ${token}`, kill : "true" } })
                        } catch (err){
                            
                        }
                        window.location.reload();
                    },
                    onFailure: function (err) {
                        console.log('Global sign-out failed', err);
                    },
                });
                
            },
            handleInput(){
                this.filteredRecipes = this.recipes.filter(recipe => 
                    recipe.title_name.toLowerCase().includes(this.search.toLowerCase())
                )
                if(this.search=="") this.filteredRecipes= []
            }
        }
    }
</script>