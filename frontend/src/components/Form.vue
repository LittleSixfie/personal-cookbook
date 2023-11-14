<template>
    <h1>Add Recipe</h1>
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
                    label="Ingredient"
                ></v-text-field>
                <v-combobox
                    v-model="item.measurement"
                    label="Measurement"
                    :items="['unidades', 'gramos', 'mililitros']"
                    :rules="rules"
                ></v-combobox>
            </div>
            <v-btn @click="addIngredient" :loading="loading" type="submit" block class="mt-2" :disabled="!valid">Submit</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
    import axios from "axios";
    export default {
        name: 'Form',
        data: () => ({
            id: 1,
            title_name: '',
            instructions: '',
            origin: '',
            loading: false,
            posts: [],
            ingridientsList: [{ ingridientName: "", measurement: "", quantity: 0 }],
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
        methods: {
            async addIngredient() {
            
                console.log(this.ingridientsList[0],this.valid)
            
            if(this.nombre != "" && this.unidades != ""){
                this.loading = true
                try {
                    const response = await axios.post(`http://192.168.1.146:3000/recipes/add`, {title_name: this.title_name, origin: this.origin, instructions: this.instructions});
                    this.posts = response.data
                } catch (e) {
                    alert(e)
                }
                this.loading = false
            } else {
                alert("empty puto")
            }
            },
            addRow() {
                console.log("added");
                this.id += 1;
                this.ingridientsList.push({
                    ingridientName: "",
                    measurement: ""
                });
            },
            removeRow() {
                console.log("removed");
                this.id -= 1;
                this.ingridientsList.pop();
            }
        },
    }
</script>