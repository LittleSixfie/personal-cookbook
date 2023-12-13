<template>
    <v-sheet width="90%" class="mx-auto">
        <br>
        <v-form validate-on="input"  v-model="valid" @submit.prevent>
            <v-text-field
                v-model="title_name"
                :rules="rules"
                label="Titulo Receta"
                variant="solo-filled"
            ></v-text-field>   
            <v-divider thickness="2"></v-divider>
            <br>
            <v-row no-gutters>
                <v-col>
                    <v-file-input
                        :rules="rules"
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="Only ingridients image accepted"
                        prepend-icon="mdi-camera"
                        label="Ingridients Image"
                        v-model="imageIngridients"
                        variant="solo-filled"
                    ></v-file-input>
                </v-col>
                <v-col >
                    <v-container id="ingridient" color="primary" ref="target" @paste="onPaste" style='cursor:pointer'>Click here and paste(Ctrl-V) the ingridient image.</v-container>
                </v-col>
            </v-row>
            <v-divider thickness="2"></v-divider>
            <br>
            <v-row no-gutters>
                <v-col>
                    <v-file-input
                        :rules="rules"
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="Only instrucctions image accepted"
                        prepend-icon="mdi-camera"
                        label="Instructions Image"
                        v-model="imageInstructions"
                        variant="solo-filled"
                    ></v-file-input>
                </v-col>
                <v-col >
                    <v-container id="instructions" color="primary" ref="target" @paste="onPaste" style='cursor:pointer'>Click here and paste(Ctrl-V) the instructions image.</v-container>
                </v-col>
            </v-row>
            <v-divider thickness="2"></v-divider>
            <br>
            <v-row no-gutters>
                <v-col>
                    <v-file-input
                        :rules="rules"
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="Only image accepted"
                        prepend-icon="mdi-camera"
                        label="Image of Recipe"
                        v-model="image"
                        variant="solo-filled"
                    ></v-file-input>
                </v-col>
                <v-col >
                    <v-container color="primary" ref="target" @paste="onPaste" style='cursor:pointer'>Click here and paste(Ctrl-V) the recipe image.</v-container>
                </v-col>
            </v-row>
            <v-divider thickness="2"></v-divider>
            <br>
            <v-text-field
                v-model="origin"
                :rules="rules"
                label="Origen"
                variant="solo-filled"
            ></v-text-field> 
            <v-btn @click="leerImagenes" :loading="loading" type="submit" block class="mt-2" :disabled="!valid">Submit</v-btn>
        </v-form>
    </v-sheet>
    <v-bottom-sheet v-model="sheet">
        <FormClean :title_nameFather="title_name" :instructionsFather="instructions" :imageFather="image" :originFather="origin" :ingridientsListFather="ingridientsList" :idFather="id" />
    </v-bottom-sheet>
</template>
<script>
import FormClean from "./FormClean.vue";
import { createWorker } from 'tesseract.js';
    export default {
        name: 'FormCamera',
        data: () => ({
            id: 1,
            title_name: '',
            origin: '',
            ingridientsList:[],
            instructions:"",
            loading: false,
            image:null,
            imageDataURL: null,
            imageInstructions:null,
            imageDataURLInstructions:null,
            imageIngridientsURL:null,
            imageIngridients:null,
            sheet:false,
            valid : true,
            rules: [
                value => {
                    if (value) return true
                        return 'You must enter text.'
                },
            ],
            justNumbers: [v => !!v || 'This field is required',
                v => /^\d+$/.test(v)||'This field only accept numbers']
        }),
        components: {
            FormClean
        },
        methods: {
            async leerImagenes() {
                this.loading = true
                        /*
                            TODO: Practicamente mockeado lo del unIdades arreglar. Necesita meter mano desde bbdd.
                        */ 
                        const worker = await createWorker('spa',1);
                        const textInstructions = await worker.recognize(this.imageDataURLInstructions);
                        const textIngridients = await worker.recognize(this.imageIngridientsURL);
                        textIngridients.data.lines.forEach(element => {
                            var ingredientListTest = new Object();
                            var textMeasurement = element.text.match(/\d+(\.\d+)?(\,\d+)?\s*\w+/) ? element.text.match(/\d+(\.\d+)?(\,\d+)?\s*\w+/)[0] : ""
                            console.log(textMeasurement, textMeasurement.match(/[A-Za-z]+/))
                            ingredientListTest.quantity = textMeasurement.match(/\d+/) ? textMeasurement.match(/\d+/)[0] : 0
                            ingredientListTest.ingridientName= element.text.replace(ingredientListTest.quantity, '').replace(textMeasurement.match(/[A-Za-z]+/),"").trim()
                            ingredientListTest.measurement= "unidades"
                            this.ingridientsList.push(ingredientListTest)
                        })
                        this.id = textIngridients.data.lines.length
                        this.instructions = textInstructions.data.text.replace(/\n/g, '')
                        console.log(this.ingridientsList)
                        await worker.terminate()
                
                this.loading = false
                this.sheet = true
            },
            onPaste(event) {
                const clipboardData = event.clipboardData || window.clipboardData;
                const items = clipboardData.items;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        const imageFile = items[i].getAsFile();
                        this.processImage(imageFile, event.srcElement.id);
                    }
                }
            },
            processImage(imageFile, id) {
                const reader = new FileReader();
                reader.onload = event => {
                    switch (id) {
                        case "instructions":
                            console.log("instructions")
                            this.imageDataURLInstructions = event.target.result;
                            this.imageInstructions = [this.convertToFile(this.imageDataURLInstructions,"imageInstrucctions.jpg")];
                            break;
                        case "ingridient":
                            console.log("ingirident")
                            this.imageIngridientsURL = event.target.result;
                            this.imageIngridients = [this.convertToFile(this.imageIngridientsURL,"imageIngridients.jpg")];
                            break;
                        default:
                            console.log("default",id)
                            this.imageDataURL = event.target.result;
                            this.image = [this.convertToFile(this.imageDataURL,"imageRecipe.jpg")];
                            
                    }
                };
                reader.readAsDataURL(imageFile);    
            },
            convertToFile(imageData, name) {
                const base64Data = imageData.split(',')[1];
                const binaryData = atob(base64Data);
                // Create a Uint8Array from the binary data
                const arrayBuffer = new ArrayBuffer(binaryData.length);
                const uint8Array = new Uint8Array(arrayBuffer);
                for (let i = 0; i < binaryData.length; i++) {
                    uint8Array[i] = binaryData.charCodeAt(i);
                }
                // Create a Blob from the Uint8Array
                const blob = new Blob([uint8Array], { type: 'image/jpeg' });
                return new File([blob], name, { type: 'image/jpeg' })
            }
        },
    }
</script>