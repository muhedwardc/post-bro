<template>
    <div>
        <v-toolbar flat fixed>
            <v-icon @click="$router.go(-1)">keyboard_backspace</v-icon>
            <v-toolbar-title>
                Post
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="post.user_id == $store.state.auth.user.id" @click="editPost">edit</v-btn>
        </v-toolbar>
        <app-loading class="content" v-if="!notLoading"></app-loading>
        <v-layout v-if="notLoading" class="post-content content" column>
            <v-layout align-center class="post" @click="$router.push({ name: 'User', params: { id: post.user_id } })">
                <v-avatar size="48px" class="mr-2">
                    <img :src="post.user.email ? gavatar(post.user.email) : 'undefined'" alt="avatar">
                </v-avatar>
                <v-layout column>
                    <h3>{{ post.user.name }}</h3>
                    <span>tanggal</span>
                </v-layout>
            </v-layout>
            <p class="p-show mt-3">{{ post.post }}</p>
            <v-divider class="mt-2"></v-divider>
                <v-layout pa-2 align-center justify-center>
                    <v-icon medium>chat_bubble_outline</v-icon>&nbsp;{{ comments.length }} comment{{ comments.length > 0 ? 's' : null }}
                </v-layout>
            <v-divider class="mb-2"></v-divider>
            <v-layout column>
                <comment-list :comments="comments" v-on:update-comment="fetchComment"></comment-list>
            </v-layout>
        </v-layout>
        <v-dialog class="dialog" v-model="createComment" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-toolbar flat>
                <v-icon @click="loading ? null : createComment = false">close</v-icon>
                <v-toolbar-title>
                    Create Comment
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn v-if="comment" :loading="loading" @click="addComment">create</v-btn>
            </v-toolbar>
            <v-layout class="post-input">
                <v-textarea
                    label="tulis post anda"
                    rows="3"
                    v-model="comment"
                    auto-grow
                    :disabled="loading">
                </v-textarea>
            </v-layout>
        </v-dialog>
        <v-dialog v-if="post.user_id == $store.state.auth.user.id" class="dialog" v-model="editDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-toolbar flat>
                <v-icon @click="loading ? null : resetPost()">close</v-icon>
                <v-toolbar-title>
                    Edit Post
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn v-if="edit !== post.post" :loading="loading" @click="updatePost">Edit</v-btn>
            </v-toolbar>
            <v-layout class="post-input">
                <v-textarea
                    label="tulis post anda"
                    rows="3"
                    v-model="edit"
                    auto-grow
                    :disabled="loading">
                </v-textarea>
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
            v-show="!createComment"
            @click="createComment = true"
            >
            <v-icon>chat_bubble_outline</v-icon>
        </v-btn>
    </div>
</template>

<script>
import appLoading from '../loading'
import commentList from '../comment/commentList'
import md5 from 'md5'


export default {
    components: {
        appLoading,
        commentList
    },

    data() {
        return {
            createComment: false,
            load: {
                post: true,
                comments: true
            },
            editDialog: false,
            post: {},
            postId: '',
            comments: [],
            comment: '',
            edit: '',
            loading: false
        }
    },

    methods: {
        gavatar(email) {
            return 'https://www.gravatar.com/avatar/' + md5(email) + '?d=mp'
        },
        
        editPost() {
            this.editDialog = true
            this.edit = this.post.post
        },

        resetPost() {
            this.editDialog = false
            this.edit = this.post.post
        },

        async updatePost() {
            this.loading = true
            this.axios.put('/posts/' + this.postId, {
                post: this.edit
            }, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.auth.token
                }
            })
            .then(() => {
                this.edit = ''
                this.loading = false
                this.editDialog = false
                this.fetchPost()
                    .catch(err => this.$store.commit('displayError', err.message))
                this.$router.push({ name: 'Show', params: { id: this.postId }})
            })
            .catch(err => this.$store.commit('displayError', err.message))
        },

        async addComment() {
            this.loading = true
            this.axios.post('/posts/' + this.postId + '/comments', {
                comment: this.comment
            }, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.auth.token
                }
            })
            .then(() => {
                this.comment = ''
                this.loading = false
                this.createComment = false
                this.fetchComment()
                    .catch(err => this.$store.commit('displayError', err.message))
                this.$router.push({ name: 'Show', params: { id: this.postId }})
            })
            .catch(err => this.$store.commit('displayError', err.message))
        },

        async fetchPost() {
            this.load.post = true
            this.axios.get('/posts/' + this.postId + '?with=user', {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.auth.token
                }
            })
            .then(r => r.data)
            .then(post => post.data)
            .then(post => {
                this.post = post
                this.axios.get('/users/' + post.user_id, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.auth.token
                    }
                })
                    .then(r => r.data.data)
                    .then(user => {
                        this.post.user = user
                        this.load.post = false
                    })
                    .catch(err => {
                        this.load.post = false
                        this.$store.commit('displayError', err.message)
                    })
            })
            .catch(err => {
                this.load.post = false
                this.$store.commit('displayError', err.message)
            })
        },

        async fetchComment() {
            this.load.comment = true
            this.axios.get('/posts/' + this.postId + '/comments?with=user', {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.auth.token
                }
            })
            .then(r => r.data)
            .then(comments => {
                this.comments = comments.data
                this.load.comments = false
            })
            .catch(err => {
                this.load.comments = false
                this.$store.commit('displayError', err.message)
            })
        },
    },

    created() {
        this.postId = this.$router.currentRoute.params.id
        this.fetchPost()
        this.fetchComment()
    },

    computed: {
        notLoading() {
            let notLoad = !this.load.post && !this.load.comments
            this.$store.state.loadContent = !notLoad
            return !this.$store.state.loadContent
        }
    }
}
</script>

<style>
.p-show {
    font-size: 16px;
}

.comment-item {
    padding: 16px 0;
}
</style>


