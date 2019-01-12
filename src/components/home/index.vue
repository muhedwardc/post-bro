<template>
  <div>
    <v-toolbar flat fixed color="white">
      <v-toolbar-title>
        <v-layout align-center>
          <v-avatar @click.stop="drawer = !drawer" size="36px">
            <img src="../../assets/circle.png" alt="avatar">
          </v-avatar>
          <span class="ml-3">{{ title }}</span>
        </v-layout>
      </v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" fixed temporary>
      <side-nav></side-nav>
    </v-navigation-drawer>
    <v-layout class="content" column>
      <post-list v-if="!loadPost" :posts="posts"></post-list>
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
    <app-snackbar></app-snackbar>
    <app-loading></app-loading>
  </div>
</template>

<script>

import sideNav from "../nav"
import postList from "../post/postList"
import appSnackbar from "../snackbar"
import appLoading from "../loading"

export default {
  components: {
    sideNav,
    postList,
    appSnackbar,
    appLoading
  },
  data() {
    return {
      user: {},
      post: "",
      posts: [],
      page: 0,
      perPage: 15,
      compose: false,
      loading: false,
      loadPost: false,
      drawer: false,
      items: [
        { title: "Profile", icon: "dashboard" },
        { title: "Logout", icon: "question_answer" }
      ]
    };
  },

  methods: {
    createPost() {
      this.loading = true;
      this.axios
        .post('/posts', {
          post: this.post
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.auth.token
          }
        })
        .then(() => {
          this.loading = false;
          this.compose = false;
          this.$router.replace({ name: 'Home' })
          this.fetchData();
        })
        .catch(err => {
          this.$store.commit('getContent', false)
        })
    },

    fetchData() {
      this.$store.commit('getContent', true)
      this.user = this.$store.state.auth.user;
      this.page += 1
      this.axios
        .get("/posts?with=user&&with_count=comments?per_page=" + this.perPage + '&page=' + this.page, {
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.auth.token
          }
        })
        .then(r => r.data)
        .then(posts => {
          const temp = this.posts.concat(posts.data)
          this.posts = temp
          this.$store.commit('getContent', false)
        })
        .catch(err => {
          this.page -= 1
          this.$store.commit('getContent', false)
          this.$store.state.snackbar.message = err.message
          this.$store.state.snackbar.show = true
        });
    }
  },

  computed: {
    title() {
      return this.$router.currentRoute.name;
    }
  },

  created() {
    this.fetchData()
  },

  mounted() {
    window.onscroll = () => {
      let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

      if (bottomOfWindow) {
        if (this.posts.length%this.page == 0){
          this.fetchData()
        } 
      }
    };
  }
};
</script>

<style>
.user-menu {
  border-radius: 4px;
  box-shadow: none;
  background-color: white;
}

.menu {
  padding: 16px;
}

.post-input {
  padding: 16px;
}

.v-dialog {
  background-color: white;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
}

.v-list--dense .v-list__tile {
  font-size: 16px;
  font-weight: 400 !important;
  height: auto !important;
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>


