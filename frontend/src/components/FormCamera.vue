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
            <v-btn @click="leerImagenes" :loading="loading" type="submit" block class="" :disabled="!valid">Submit
                <template v-slot:loader>
                    <v-progress-linear class="mr-10 " :height="4" color="primary-darken-1" v-model="progress"></v-progress-linear>
                </template>
            </v-btn>
        </v-form>
    </v-sheet>
    <v-bottom-sheet v-model="form">
        <FormClean :title_nameFather="title_name" :instructionsFather="instructions" :imageFather="image" :originFather="origin" :ingridientsListFather="ingridientsList" :idFather="id" />
    </v-bottom-sheet>
</template>
<script>
import FormClean from "./FormClean.vue";
import { createWorker } from 'tesseract.js';
import axios from "axios";

    export default {
        name: 'FormCamera',
        data: () => ({
            id: 1,
            progress:0,
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
            form:false,
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
                var jobid = ""
                this.funcion = function(m){
                    if(m.jobId && jobid == "") {
                        this.progress = (m.progress*100)/2
                        if(this.progress == 50) jobid=m.userJobId
                    } else if(m.jobId && jobid != "") {
                        this.progress = ((m.progress*100)/2)+50
                    }
                }
                const worker = await createWorker('spa',1,{
                    logger: m => this.funcion(m)
                });
                const measurementEnum = (await axios.get(`http://${process.env.VUE_APP_HOST}:3000/ingridients/listEnums/`)).data;
                const textIngridients = await worker.recognize(this.imageIngridientsURL);
                const textInstructions = await worker.recognize(this.imageDataURLInstructions);
                this.progress=100
                textIngridients.data.lines.forEach(element => {
                    var ingridientLine = new Object();
                    var textMeasurement = element.text.match(/\d+(\.\d+)?(\,\d+)?\s*\w+/) ? element.text.match(/\d+(\.\d+)?(\,\d+)?\s*\w+/)[0] : ""
                    ingridientLine.quantity = textMeasurement.match(/\d+/) ? textMeasurement.match(/\d+/)[0] : 0
                    if(textMeasurement.match(/[A-Za-z]+/)) {
                        ingridientLine.measurement= measurementEnum.includes(textMeasurement.match(/[A-Za-z]+/)[0]) ? textMeasurement.match(/[A-Za-z]+/)[0] : ""
                    } else{
                        ingridientLine.measurement= "unidades"
                    }
                    ingridientLine.ingridientName= element.text.replace(ingridientLine.quantity,'').replace(ingridientLine.measurement,"").trim()
                    this.ingridientsList.push(ingridientLine)
                })
                this.id = textIngridients.data.lines.length
                this.instructions = textInstructions.data.text.replace(/\n/g, '')
                await worker.terminate()
                this.loading = false
                this.form = true
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
                            this.imageDataURLInstructions = event.target.result;
                            this.imageInstructions = [this.convertToFile(this.imageDataURLInstructions,"imageInstrucctions.jpg")];
                            break;
                        case "ingridient":
                            this.imageIngridientsURL = event.target.result;
                            this.imageIngridients = [this.convertToFile(this.imageIngridientsURL,"imageIngridients.jpg")];
                            break;
                        default:
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