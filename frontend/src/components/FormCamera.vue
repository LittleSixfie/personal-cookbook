<template>
      <v-sheet width="80%" class="mx-auto">
                            <v-form validate-on="input"  v-model="valid" @submit.prevent>
                                <v-text-field
                                    v-model="title_name"
                                    :rules="rules"
                                    label="Titulo Receta"
                                ></v-text-field>
                                
                                <v-file-input
                                    accept="image/png, image/jpeg, image/bmp"
                                    placeholder="Instructions image"
                                    prepend-icon="mdi-camera"
                                    label="image"
                                    v-model="imageInstructions"
                                ></v-file-input>

                                <div id="instructions" ref="target" @paste="onPaste" style='cursor:pointer'>Click here and use Control-V to paste the instructions image.</div>
                                <br>
                                <v-alert v-if="imageDataURLInstructions" text="..." type="success"></v-alert>
                                <v-divider></v-divider>
                                <br>
                                <v-file-input
                                    accept="image/png, image/jpeg, image/bmp"
                                    placeholder="Only ingridients image accepted"
                                    prepend-icon="mdi-camera"
                                    label="image"
                                    v-model="imageIngridients"
                                ></v-file-input>

                                <div id="ingrediente" ref="target" @paste="onPaste" style='cursor:pointer'>Click here and use Control-V to paste the ingridients image.</div>
                                <br>
                                <v-alert v-if="imageIngridientsURL" text="..." type="success"></v-alert>
                                <v-divider></v-divider>
                                <br>
                                <v-file-input
                                    accept="image/png, image/jpeg, image/bmp"
                                    placeholder="Only image accepted"
                                    prepend-icon="mdi-camera"
                                    label="image"
                                    v-model="image"
                                ></v-file-input>
                                <div ref="target" @paste="onPaste" style='cursor:pointer'>Click here and use Control-V to paste the image.</div>
                                <br>
                                <v-alert v-if="imageDataURL" text="..." type="success"></v-alert>
                                <v-divider></v-divider>
                                <br>
                                <v-text-field
                                    v-model="origin"
                                    :rules="rules"
                                    label="Origen"
                                ></v-text-field> 
                                <v-btn @click="leerImagenes" :loading="loading" type="submit" block class="mt-2" :disabled="!valid">Submit</v-btn>
                            </v-form>
                        </v-sheet>
                        <v-bottom-sheet v-model="sheet">
                            <FormClean :title_nameFather="title_name" :instructionsFather="origin" :imageFather="image" :originFather="origin" :ingridientsListFather="instructions" :idFather="id" />
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
            instructions:[],
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
                try {
                        const worker = await createWorker('spa',1);
                        const textInstructions = await worker.recognize(this.imageDataURLInstructions);
                        const textIngridients = await worker.recognize(this.imageIngridientsURL);
                        for(const line of textIngridients.data.lines){
                            console.log(line)
                        }
                        await worker.terminate()
                    
                } catch (e) {
                    alert(e)
                }
                this.loading = false
                this.sheet = true
            },
            onPaste(event) {
                    console.log(event.srcElement.id)
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
                            console.log(id)
                            this.imageDataURLInstructions = event.target.result;
                            break;
                          case "ingrediente":
                            console.log(id)
                            this.imageIngridientsURL = event.target.result;
                            break;
                          default:
                            this.imageDataURL = event.target.result;
                        }
                    };
                    reader.readAsDataURL(imageFile);
                }

        },
    }
</script>