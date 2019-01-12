<template>
    <div>
        <v-toolbar flat fixed>
            <v-icon @click="$router.replace({ name: 'Home' })">keyboard_backspace</v-icon>
            <v-toolbar-title>
                Profile
            </v-toolbar-title>
        </v-toolbar>
        <v-layout align-center class="user-info content profile-header">
            <v-avatar size="72px" class="mr-3">
                <img src="../../assets/circle.png" alt="avatar">
            </v-avatar>
            <v-layout column>
                <h3 class="mb-2">{{ user.name }}</h3>
                <v-btn @click="$router.replace({ name: 'Edit User', params: { id: user.id }})">Edit profile</v-btn>
            </v-layout>
        </v-layout>
        <v-divider class="mt-2"></v-divider>
        <v-layout pa-2 align-center justify-center>
            <v-icon medium>list_alt</v-icon>&nbsp;{{ posts.length }} post{{ posts.length > 0 ? 's' : null }}
        </v-layout>
        <v-divider class="mb-2"></v-divider>
        <app-loading v-if="$store.state.loadContent"></app-loading>
        <v-layout v-if="!$store.state.loadContent" column>
            <v-layout column v-for="post in posts" :key="post.id">
                <v-layout @click="$router.replace({ name: 'Show', params: { id: post.id } })" class="post-content post">
                    <v-flex shrink>
                        <v-avatar size="48px">
                            <img src="../../assets/circle.png" alt="avatar">
                        </v-avatar>
                    </v-flex>
                    <v-flex>
                        <v-layout>
                            <h4>{{ user.name }}</h4>
                            <span class="font-italic" color="grey">&nbsp;. 4h</span>
                        </v-layout>
                        <p class="article mb-0">{{ post.body }}</p> 
                    </v-flex>
                </v-layout>
            </v-layout>
        </v-layout>
        <v-dialog
            class="dialog"
            v-model="compose"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            >
            <v-toolbar flat>
                <v-icon @click="loading ? null : compose = false">close</v-icon>
                <v-toolbar-title>Compose Post</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn v-if="post" :loading="loading" @click="createPost">post</v-btn>
            </v-toolbar>
            <v-layout class="post-input">
                <v-textarea label="tulis post anda" rows="3" v-model="post" auto-grow></v-textarea>
            </v-layout>
        </v-dialog>
        <v-btn
            color="blue"
            dark
            medium
            fixed
            bottom
            right
            fab
            v-show="!compose"
            @click="compose = true"
        >
            <v-icon>add</v-icon>
        </v-btn>
    </div>
</template>

<script>
import appLoading from '../loading'
import axios from 'axios'

export default {
    components: {
        appLoading
    },
    data() {
        return {
            user: {},
            posts: [],
            compose: false,
            post: '',
            loading: false
        }
    },

    methods: {
        createPost() {
            console.log(this.post)
        }
    },

    mounted() {
        this.$store.state.loadContent = true
        const userId = this.$router.currentRoute.params.id
        axios.get('https://jsonplaceholder.typicode.com/users/' + userId)
            .then(r => r.data)
            .then(user => this.user = user)

        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(r => r.data)
            .then(posts => {
                const userPosts = posts.filter(post => post.userId == userId)
                this.posts = userPosts
                this.$store.state.loadContent = false
            })
    }
}
</script>


<style>
.profile-header {
    padding: 16px;
}

.profile-header .v-btn {
    margin: 0;
}
</style>

