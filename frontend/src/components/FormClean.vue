<template>
    <v-sheet width="80%" class="mx-auto">
        <v-form validate-on="input"  v-model="valid" @submit.prevent>
            <v-text-field
                v-model="title_name"
                :rules="rules"
                label="Titulo Receta"
            ></v-text-field>
            <v-textarea
                v-model="instructions"
                :rules="rules"
                label="Instruciones"
            ></v-textarea>
            <v-file-input
                :rules="rules"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Only image accepted"
                prepend-icon="mdi-camera"
                label="image"
                v-model="image"
            ></v-file-input>
            <v-text-field
                v-model="origin"
                :rules="rules"
                label="Origen"
            ></v-text-field>
            <v-btn @click="addRow">Add row</v-btn>
            <v-btn v-if="id != 1" @click="removeRow">Remove row</v-btn>
            <div v-for="item in ingridientsList" :key="item.id">
                <v-text-field
                    v-model="item.ingridientName"
                    :rules="rules"
                    label="Ingredient"
                ></v-text-field>
                <v-text-field
                    v-model="item.quantity"
                    :rules="justNumbers"
                    label="Quantity"
                ></v-text-field>
                <v-combobox
                    v-model="item.measurement"
                    label="Measurement"
                    :items="['unidades', 'gramos', 'mililitros']"
                    :rules="rules"
                ></v-combobox>
            </div>
            <v-btn @click="addRecipe" :loading="loading" type="submit" block class="mt-2" :disabled="!valid">Submit</v-btn>
        </v-form>
    </v-sheet>
    <v-snackbar
        v-model="snackbar"
        :timeout="3000"
    >
        The recipe has been upload, close all please.
        <template v-slot:actions>
            <v-btn
                color="blue"
                variant="text"
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import axios from "axios";
    export default {
        name: 'FormClean',
        props: ['title_nameFather', 'instructionsFather', 'imageFather', 'originFather', 'ingridientsListFather', 'idFather'],
        data: () => ({
            valid : true,
            loading: false,
            title_name: "",
            instructions: "",
            image:null,
            origin:"",
            
            ingridientsList:[],
            id:1,
            snackbar : false,
            rules: [
                value => {
                    if (value) return true
                        return 'You must enter text.'
                },
            ],
            justNumbers: [v => !!v || 'This field is required',
                v => /^\d+$/.test(v)||'This field only accept numbers']
        }),
        methods: {
            async addRecipe() {
                this.loading = true
                try {
                    const responseRecipe = await axios.post(`http://${process.env.VUE_APP_HOST}:3000/recipes/add`, {title_name: this.title_name, origin: this.origin, instructions: this.instructions});
                    console.log("RECETA ID PORFA",responseRecipe.data.rows[0].id)

                    const formData = new FormData();
                    formData.append('image', this.image[0]);
                    const responseImage = await axios.post(`http://${process.env.VUE_APP_HOST}:3000/image/add/${responseRecipe.data.rows[0].id}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                    console.log("IMAGEN",responseImage)
                    await this.ingridientsList.forEach(async element => {
                        try{
                            const responseIngredient = await axios.post(`http://${process.env.VUE_APP_HOST}:3000/ingridients/add`, {nombre: element.ingridientName, unidades: element.measurement});
                            console.log("INGREDIENTE SUELTO", responseIngredient.data)
                            const responseListIngredients = await axios.post(`http://${process.env.VUE_APP_HOST}:3000/ingridientsList/add`, {idRecipe: responseRecipe.data.rows[0].id, idIngridient: responseIngredient.data.rows[0].id, quantity: element.quantity});
                            console.log("INGREDIENTE LISTA", responseListIngredients.data)
                        } catch(e) {
                            alert(e)
                        }
                    })
                } catch (e) {
                    alert(e.response.data)
                }
                this.snackbar = true
                this.loading = false
            },
            addRow() {
                this.id += 1;
                this.ingridientsList.push({
                    ingridientName: "",
                    measurement: ""
                });
            },
            removeRow() {
                this.id -= 1;
                this.ingridientsList.pop();
            }
        },
        beforeMount() {
            this.title_name= this.title_nameFather
            this.instructions= this.instructionsFather
            this.image= this.imageFather
            this.origin=this.originFather
            this.ingridientsList=this.ingridientsListFather
            this.id=this.idFather
            console.log("beforeMount", this.title_name, this.image, this.origin,this.ingridientsList )
            
        },
    }
</script>