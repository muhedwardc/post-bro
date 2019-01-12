<template>
    <div>
        <v-layout v-for="comment in comments" :key="comment.id" column>
            <v-layout class="comment-item" @click="$router.replace({ name: 'User', params: { id: comment.user_id } })">
                <v-flex shrink>
                    <v-avatar size="48px" class="mr-2">
                        <img :src="gavatar(comment.user.email)" alt="avatar">
                    </v-avatar>
                </v-flex>
                <v-flex>
                    <v-layout column>
                        <h4>{{ comment.user.name }}</h4>
                        <p>{{ comment.comment }}</p>
                    </v-layout>
                </v-flex>
                <!-- <v-flex shrink v-if="comment.user.id == $store.state.auth.user.id">
                    <v-icon flat ripple @click="editComment(comment.id, comment.body)">more_vert</v-icon>
                </v-flex> -->
            </v-layout>
            <v-divider></v-divider>
        </v-layout>
    </div>
</template>

<script>
import md5 from 'md5'
export default {
    props: {
        comments: {
            type: Array,
            required: true
        }
    },

    methods: {
        gavatar(email) {
            return 'https://www.gravatar.com/avatar/' + md5(email) + '?d=mp'
        }
    }
}
</script>

