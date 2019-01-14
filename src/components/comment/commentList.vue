<template>
    <div>
        <v-layout v-for="comment in comments" :key="comment.id" column>
            <v-layout class="comment-item">
                <v-flex shrink @click="$router.push({ name: 'User', params: { id: comment.user_id } })">
                    <v-avatar size="48px" class="mr-2">
                        <img :src="comment.user.email ? gavatar(comment.user.email) : 'undefined'" alt="avatar">
                    </v-avatar>
                </v-flex>
                <v-flex>
                    <v-layout column>
                        <v-layout>
                            <h4 @click="$router.push({ name: 'User', params: { id: comment.user_id } })">{{ comment.user.name }}</h4>
                            <span>&nbsp; . {{ getPostTime(comment.created_at) }} {{ comment.created_at !== comment.updated_at ? '(edited)' : null }}</span>
                        </v-layout>
                        <p>{{ comment.comment }}</p>
                    </v-layout>
                </v-flex>
                <v-flex shrink v-if="comment.user.id == $store.state.auth.user.id">
                    <v-icon flat ripple @click="editComment(comment.post_id, comment.id, comment.comment)">more_vert</v-icon>
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
        </v-layout>
        
        <v-dialog class="dialog" v-model="commentEdit.show" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-toolbar flat>
                <v-icon @click="loading ? null : resetComment()">close</v-icon>
                <v-toolbar-title>
                    Edit Post
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn v-if="commentEdit.text !== commentEdit.editText && commentEdit.editText.length > 0" :loading="loading" @click="updateComment">Edit</v-btn>
            </v-toolbar>
            <v-layout class="post-input">
                <v-textarea
                    label="tulis post anda"
                    rows="3"
                    v-model="commentEdit.editText"
                    auto-grow
                    :disabled="loading">
                </v-textarea>
            </v-layout>
        </v-dialog>
    </div>
</template>

<script>
import md5 from 'md5'
import moment from 'moment'

export default {
    data() {
        return {
            loading: false,
            commentEdit: {
                post_id: '',
                id: '',
                text: '',
                editText: '',
                show: false
            }
        }
    },

    props: {
        comments: {
            type: Array,
            required: true
        }
    },

    methods: {

        getPostTime(date) {
            moment.locale('id')
            return moment.utc(date).local().fromNow(true)
        },

        gavatar(email) {
            return 'https://www.gravatar.com/avatar/' + md5(email) + '?d=mp'
        },
    
        resetComment() {
            this.commentEdit.show = false
            this.commentEdit.editText = this.commentEdit.text
        },

        editComment(postId, commentId, body) {
            this.commentEdit.post_id = postId
            this.commentEdit.id = commentId
            this.commentEdit.text = body
            this.commentEdit.editText = body
            this.commentEdit.show = true
        },

        updateComment() {
            this.loading = true
            this.axios.put(`/posts/${this.commentEdit.post_id}/comments/${this.commentEdit.id}`, {
                comment: this.commentEdit.editText
            }, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.auth.token
                }
            })
            .then(() => {
                this.loading = false
                this.commentEdit.show = false
                this.$emit('update-comment')
                this.$router.push({ name: 'Show', params: { id: this.commentEdit.post_id }})
            })
            .catch(err => {
                this.loading = false
                this.$store.commit('displayError', err.message)
            })
        }
    }
}
</script>

