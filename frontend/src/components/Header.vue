<template>
    <v-app-bar class="pa-3 bg-primary">
        <v-app-bar-title>RecipeBook</v-app-bar-title>
        
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
    export default {
        name: 'Header',
        isDark:false,
        props: ['token'],
        data: () => ({  
            dialog:false, 
            dialogCamera:false,
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
        
    }
</script>