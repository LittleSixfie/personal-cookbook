<template>
    <h1>Body</h1>
    <v-card title="Card title" subtitle="Subtitle" text="..." variant="tonal">
        <v-card-actions>
            <v-btn  @click="created()" prepend-icon="$vuetify" elevation="12">
                Cargar
            </v-btn>
        </v-card-actions> 
    </v-card>
    
    <div>
    <ul v-if="posts && posts.length">
      <li v-for="post of posts">
        <p><strong>{{post.title}}</strong></p>
        <p>{{post.body}}</p>
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
            v-for="n in 3"
            :key="n"
            :title="'Item ' + n"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
        ></v-list-item>
    </v-list>
</template>

<script>
    import axios from "axios";
    import { ref } from 'vue'

    const count = ref("")
    
    async function created() {
            try {
              const response = await axios.get(`http://jsonplaceholder.typicode.com/posts`)
              this.posts = response.data
            } catch (e) {
              this.errors.push(e)
            }
          }
            
    export default {
        name: 'Body',
        data() {
            return {
              posts: [],
              errors: []
            }
          },
        
          // Fetches posts when the component is created.
          async created() {
            try {
              const response = await axios.get(`http://jsonplaceholder.typicode.com/posts`)
              this.posts = response.data
            } catch (e) {
              this.errors.push(e)
            }
          }
    }
</script>

