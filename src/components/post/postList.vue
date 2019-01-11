<template>
  <div>
    <v-layout v-for="post in posts" :key="post.id" column class="post">
      <v-layout
        class="post-content"
        @click="$router.replace({ name: 'Show', params: { id: post.id } })"
      >
        <v-flex shrink>
          <v-avatar class="mb-3" size="48px">
            <img src="../../assets/circle.png" alt="avatar">
          </v-avatar>
        </v-flex>
        <v-flex>
          <v-layout column>
            <v-layout>
              <h4>{{ post.user.name }}</h4>
              <span class="font-italic" color="grey">&nbsp;. 4h</span>
            </v-layout>
            <p class="article mb-0">{{ post.post }}</p>
            <v-layout align-center class="mt-2">
              <v-flex xs12>
                <v-layout align-center>
                  <v-icon class="mr-2">chat_bubble_outline</v-icon>{{ post.comments_count }}
                </v-layout>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
  </div>
</template>

<script>
export default {
    props: {
        posts: {
            type: Array
        }
    }
}
</script>
