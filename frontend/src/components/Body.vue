<template>
    <h1>Body</h1>
    <v-card title="Card title" subtitle="Subtitle" text="..." variant="tonal">
        <v-card-actions>
            <v-btn  @click="burron" prepend-icon="$vuetify" elevation="12">
                Cargar
            </v-btn>
        </v-card-actions> 
    </v-card>
    
    <div>
    <ul v-if="posts && posts.length">
      <li v-for="post of posts">
        <p><strong>{{post.id}}</strong></p>
        <p>{{post.title_name}}</p>
        <p>{{post.nombre}}</p>
      </li>
    </ul>

    <ul v-if="errors && errors.length">
      <li v-for="error of errors">
        {{error.message}}
      </li>
    </ul>
  </div>
    
    <v-list lines="one">
        <v-list-item
            v-for="post in posts"
            :key="post"
            :title="'Item ' + post.id"
            :subtitle='post.title_name + post.nombre'
        ></v-list-item>
    </v-list>
</template>

<script>
    import axios from "axios";
    import { ref } from 'vue'
    const count = ref("")
    export default {
        name: 'Body',
        methods: {
          async burron() {
            try {
              const response = await axios.get(`http://localhost:3000/ingridients`)
              this.posts = response.data
            } catch (e) {
              this.errors.push(e)
            }
          }
        },
        data() {
            return {
              posts: [],
              errors: []
            }
          },
        
          // Fetches posts when the component is created.
          async created() {
            try {
              const response = await axios.get(`http://192.168.1.146:3000/recipes`)
              this.posts = response.data
              
            } catch (e) {
              alert(e)
              this.errors.push(e)
            }
          },
        
    }
</script>

