//todo: Se puede fraccionar en varios componenetes seguramente
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
                        color="primary"  @click="dialog = false"
                    >
                        Close Dialog
                    </v-btn>
                    <v-btn 
                        color="primary"  @click="dialogRemove = true"
                    >
                        Remove recipe
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="dialogRemove"
            width="auto"
            persistent
        >
            <v-card :loading="loadingRemove">
            <v-card-title>
                Are you sure?
            </v-card-title>
            <v-card-subtitle>
                This recipe will be lost forever
            </v-card-subtitle>
            <v-card-actions>
                <v-btn color="primary" @click="removeRecipe">Yes</v-btn>
                <v-btn color="primary" @click="dialogRemove = false">No</v-btn>
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
        props: ['recipe', 'callCallReset'],
        data () {
            return {
                dialog: false,
                dialogRemove: false,
                loading: false,
                loadingRemove: false,
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
                    console.log(this.listIngridients)
                } catch (e) {
                    console.log("ERROR openDialog", e);
                }
                this.loading = false
                this.dialog = true
            },
            async removeRecipe() {
                this.loadingRemove = true
                try {
                    //We check if we have to erase some ingridientes.
                    for(var ingridient of this.listIngridients){
                        var responseIngridient = await axios.get(`http://localhost:3000/ingridientsList/ingridient/${ingridient.idingrediente}`);
                        await axios.delete(`http://localhost:3000/ingridientsList/${ingridient.id}`)
                        if(responseIngridient.data.length <= 1) {
                            await axios.delete(`http://localhost:3000/ingridients/${ingridient.idingrediente}`)
                        }
                    }
                    await axios.delete(`http://localhost:3000/recipes/${this.listIngridients[0].idreceta}`)
                    this.callCallReset();
                } catch (e) {
                    console.log("ERROR removeDialog", e);
                }
                this.loadingRemove = false
                this.dialogRemove = false
                this.dialog= false
            }
        }
    }
</script>