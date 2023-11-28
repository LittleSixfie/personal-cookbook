<template>
    <v-app-bar class="pa-3 bg-primary">
        <v-app-bar-title>Application</v-app-bar-title>
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
                    <Form />
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
                        <v-sheet width="80%" class="mx-auto">
                            <v-form validate-on="input"  v-model="valid" @submit.prevent>
                                <v-text-field
                                    v-model="title_name"
                                    :rules="rules"
                                    label="Titulo Receta"
                                ></v-text-field>
                                
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
                                <v-btn @click="addIngredient" :loading="loading" type="submit" block class="mt-2" :disabled="!valid">Submit</v-btn>
                            </v-form>
                        </v-sheet>
                </v-card>
            </v-dialog>
    </v-app-bar>
</template>

<script>
    import Form from './Form.vue'
    import { createWorker } from 'tesseract.js'
    
    export default {
        name: 'Header',
        data: () => ({  
            dialog:false, 
            dialogCamera:false,
            title_name: '',
            origin: '',
            loading: false,
            image:null,
            valid : true,
            rules: [
                value => {
                    if (value) return true
                        return 'You must enter text.'
                }
            ],
        }),
        components: {
            Form
        },
        methods: {
            async addIngredient() {
                
                this.loading = true
                try {
                    for (var i = 0; i < 4; i++) {
                        const worker = await createWorker('spa',i);
                        const text = await worker.recognize(this.image[0]);
                        console.log(`OEM${i}`,"",text.data.text);
                        await worker.terminate()
                    }
                } catch (e) {
                    alert(e.response.data)
                }
                this.loading = false
                
            }

        },
        
    }
</script>