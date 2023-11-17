<template>
    <div class="text-center">
        <v-btn
        color="primary"
        :disabled="dialog"
        :loading="loading"
        @click="openDialog" 
        >
        Open Dialog

        <v-dialog
            v-model="dialog"
            width="auto"
            transition="dialog-top-transition"
        >
            <v-card>
                <v-toolbar
                    color="primary"
                    :title="recipe.title_name"
                ></v-toolbar>
                <v-card-text>
                    {{recipe.instructions}}
                </v-card-text>
                <v-list lines="three" density="compact">
                    <v-list-item v-for="ingridient in listIngridients" :key="ingridient">
                        <v-row no-gutters>
                            <v-col cols="4" >
                                <v-card-text>
                                    {{ingridient.name}}
                                </v-card-text>
                            </v-col>
                            <v-col cols="4" >
                                <v-card-text>
                                    {{ingridient.cantidad}}
                                </v-card-text>
                            </v-col>
                            <v-col cols="4" >
                                <v-card-text>
                                    {{ingridient.measurement}}
                                </v-card-text>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
                <v-card-actions>
                    <v-btn 
                        color="primary" block @click="dialog = false"
                    >
                        Close Dialog
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        </v-btn>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: 'DialogRecipe',
        props: ['recipe'],
        data () {
            return {
                dialog: false,
                loading: false,
                listIngridients: []
            }
        },
        methods: {
            async openDialog() {
                this.loading = true
                try {
                    var responseIngridientList = await axios.get(`http://localhost:3000/ingridientsList/recipe/${this.recipe.id}`);
                    for(var ingridient of responseIngridientList.data){
                        var responseIngridient = await axios.get(`http://localhost:3000/ingridients/${ingridient.idingrediente}`);
                        ingridient["measurement"] = responseIngridient.data[0].unidades
                        ingridient["name"] = responseIngridient.data[0].nombre
                    }
                    this.listIngridients = responseIngridientList.data
                } catch (e) {
                    console.log("ERROR openDialog", e);
                }
                this.loading = false
                this.dialog = true
            }
        }
    }
</script>