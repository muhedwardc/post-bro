<template>
    <div>
        <v-toolbar flat fixed>
            <v-icon @click="$router.replace({ name: 'Home' })">keyboard_backspace</v-icon>
            <v-toolbar-title>
                Post
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-btn v-if="post.id == $store.state.auth.user.id" @click="editPost">edit</v-btn> -->
        </v-toolbar>
        <app-loading class="content" v-if="!notLoading"></app-loading>
        <v-layout v-if="notLoading" class="post-content content" column>
            <v-layout align-center class="post" @click="$router.replace({ name: 'User', params: { id: post.id } })">
                <v-avatar size="48px" class="mr-2">
                    <img src="../../assets/circle.png" alt="avatar">
                </v-avatar>
                <v-layout column>
                    <h3>Nama User</h3>
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
                <comment-list :comments="comments"></comment-list>
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
                    auto-grow>
                </v-textarea>
            </v-layout>
        </v-dialog>
        <v-dialog v-if="post.userId == $store.state.auth.user.id" class="dialog" v-model="editDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-toolbar flat>
                <v-icon @click="loading ? null : resetPost()">close</v-icon>
                <v-toolbar-title>
                    Edit Post
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn v-if="edit !== post.post" :loading="loading">Edit</v-btn>
            </v-toolbar>
            <v-layout class="post-input">
                <v-textarea
                    label="tulis post anda"
                    rows="3"
                    v-model="edit"
                    auto-grow>
                </v-textarea>
            </v-layout>
        </v-dialog>
        <v-dialog class="dialog" v-model="commentEdit.show" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-toolbar flat>
                <v-icon @click="loading ? null : resetComment()">close</v-icon>
                <v-toolbar-title>
                    Edit Post
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn v-if="commentEdit.text !== commentEdit.editText" :loading="loading" @click="updateComment">Edit</v-btn>
            </v-toolbar>
            <v-layout class="post-input">
                <v-textarea
                    label="tulis post anda"
                    rows="3"
                    v-model="commentEdit.editText"
                    auto-grow>
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
import axios from 'axios'

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
            loading: false,
            commentEdit: {
                id: '',
                text: '',
                editText: '',
                show: false
            }
        }
    },

    methods: {
        editPost() {
            this.editDialog = true
            this.edit = this.post.body
        },

        resetPost() {
            this.editDialog = false
            this.edit = this.post.body
        },

        editComment(id, text) {
            this.commentEdit.show = true
            this.commentEdit.id = id
            this.commentEdit.text = text
            this.commentEdit.editText = text
        },

        updateComment() {
            console.log(commentEdit)
            this.commentEdit.show = false
        },

        resetComment() {
            this.commentEdit.show = false
            this.commentEdit.editText = this.commentEdit.text
        },

        async addComment() {
            this.loading = true
            axios.post('http://api.post.test/posts/' + this.postId + '/comments', {
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
                this.$router.replace({ name: 'Show', params: { id: this.postId }})
            })
            .catch(err => this.$store.commit('displayError', err.message))
        },

        async fetchPost() {
            this.load.post = true
            axios.get('http://api.post.test/posts/' + this.postId + '?with=user', {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.auth.token
                }
            })
            .then(r => r.data)
            .then(post => {
                this.post = post.data
                this.load.post = false
            })
            .catch(err => this.$store.commit('displayError', err.message))
        },

        async fetchComment() {
            this.load.comment = true
            axios.get('http://api.post.test/posts/' + this.postId + '/comments?with=user', {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.auth.token
                }
            })
            .then(r => r.data)
            .then(comments => {
                this.comments = comments.data
                this.load.comments = false
            })
            .catch(err => this.$store.commit('displayError', err.message))
        }
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


