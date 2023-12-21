<template>
    <v-sheet width="100%" class="mx-auto pb-3 px-3" >
        <br>
        <v-form validate-on="input"  v-model="valid" @submit.prevent>
            <v-text-field
                clearable 
                v-model="title_name"
                :rules="rules"
                label="Titulo Receta"
                variant="solo-filled"
            ></v-text-field>
            <v-textarea
                clearable 
                v-model="instructions"
                :rules="rules"
                label="Instruciones"
                variant="solo-filled"
            ></v-textarea>
            <v-row no-gutters>
                <v-col>
                    <v-file-input
                        :rules="rules"
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="Only image accepted"
                        prepend-icon="mdi-camera"
                        label="image"
                        v-model="image"
                        variant="solo-filled"
                    ></v-file-input>
                </v-col>
                <v-col >
                    
                    <v-container color="primary" ref="target" @paste="onPaste" style='cursor:pointer'>Click here and use Control-V to paste the image.</v-container>
                </v-col>
            </v-row>
            <v-text-field
                v-model="origin"
                :rules="rules"
                label="Origen"
                variant="solo-filled"
                clearable
            ></v-text-field>
            <v-card class="pa-3" color="primary">
                <v-row>
                    <v-card-title>Ingridient List</v-card-title>
                    <v-btn class="mt-1" @click="addRow">Add row</v-btn>
                </v-row>
                
                <v-sheet v-for="item in ingridientsList" :key="item.id" color="primary-darken-1" class="pa-2 mt-2 rounded-lg">
                    <v-text-field
                        v-model="item.ingridientName"
                        :rules="rules"
                        label="Ingredient"
                        variant="solo-filled"
                        clearable
                    ></v-text-field>
                    
                    <v-row no-gutters>
                        <v-col class="pr-1">
                            <v-text-field
                                clearable
                                v-model="item.quantity"
                                :rules="justNumbers"
                                label="Quantity"
                                variant="solo-filled"
                            ></v-text-field>
                        </v-col>
                        <v-col class="pl-1">
                            <v-combobox
                                v-model="item.measurement"
                                label="Measurement"
                                :items="measurementEnum"
                                :rules="rules"
                                variant="solo-filled"
                            ></v-combobox>
                        </v-col>
                    </v-row>
                    <v-btn v-if="id > 1" @click="removeRow(item.ingridientName)">Remove row</v-btn>
                </v-sheet>
            </v-card>
            <v-btn @click="addRecipe" :loading="loading" type="submit" block class="mt-2" :disabled="!valid" >Submit</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
import axios from "axios";
    export default {
        name: 'FormClean',
        props: ['token','title_nameFather', 'instructionsFather', 'imageFather', 'originFather', 'ingridientsListFather', 'idFather'],
        data: () => ({
            valid : true,
            loading: false,
            title_name: "",
            instructions: "",
            image:null,
            origin:"",
            ingridientsList:[],
            measurementEnum:[],
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
                    const responseRecipe = await axios.post(`http://${process.env.VUE_APP_HOST}:3000/recipes/add`, {title_name: this.title_name, origin: this.origin, instructions: this.instructions}, { headers: { Authorization: `Bearer ${this.token}` } });
                    console.log("RECETA ID PORFA",responseRecipe.data.rows[0].id)

                    const formData = new FormData();
                    formData.append('image', this.image[0]);
                    const responseImage = await axios.post(`http://${process.env.VUE_APP_HOST}:3000/image/add/${responseRecipe.data.rows[0].id}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${this.token}`
                            },
                        });
                    console.log("IMAGEN",responseImage)
                    await this.ingridientsList.forEach(async element => {
                        try{
                            const responseIngredient = await axios.post(`http://${process.env.VUE_APP_HOST}:3000/ingridients/add`, {nombre: element.ingridientName, unidades: element.measurement},  { headers: { Authorization: `Bearer ${this.token}` } });
                            console.log("INGREDIENTE SUELTO", responseIngredient.data)
                            const responseListIngredients = await axios.post(`http://${process.env.VUE_APP_HOST}:3000/ingridientsList/add`, {idRecipe: responseRecipe.data.rows[0].id, idIngridient: responseIngredient.data.rows[0].id, quantity: element.quantity}, { headers: { Authorization: `Bearer ${this.token}` } });
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
                    measurement: "",
                    quantity: 0
                });
                console.log(this.ingridientsList)
            },
            removeRow(itemName) {
                this.ingridientsList = this.ingridientsList.filter(item => item.ingridientName !== itemName);
                console.log(this.ingridientsList)
                this.id -= 1;
            
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
                    this.imageDataURL = event.target.result;

                    const base64Data = this.imageDataURL.split(',')[1];
                    const binaryData = atob(base64Data);
                    // Create a Uint8Array from the binary data
                    const arrayBuffer = new ArrayBuffer(binaryData.length);
                    const uint8Array = new Uint8Array(arrayBuffer);
                    for (let i = 0; i < binaryData.length; i++) {
                        uint8Array[i] = binaryData.charCodeAt(i);
                    }
                    // Create a Blob from the Uint8Array
                    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
                    // Create a File from the Blob
                    this.image = [new File([blob], 'pastedFile.jpg', { type: 'image/jpeg' })];
                    
                };
                reader.readAsDataURL(imageFile);
                
            }
        },
        async beforeMount() {
            this.title_name= this.title_nameFather
            this.instructions= this.instructionsFather
            this.image= this.imageFather
            this.origin=this.originFather
            this.ingridientsList=this.ingridientsListFather
            this.id=this.idFather
            this.measurementEnum = (await axios.get(`http://${process.env.VUE_APP_HOST}:3000/ingridients/listEnums/`, { headers: { Authorization: `Bearer ${this.token}` } })).data;
            
        },
    }
</script>