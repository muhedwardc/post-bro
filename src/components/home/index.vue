<template>
  <v-layout column>
    <v-toolbar flat fixed color="white">
      <v-toolbar-title>
        <v-layout align-center>
          <v-avatar @click.stop="drawer = !drawer" size="32px">
            <img :src="gravatar($store.state.auth.user.email)" alt="avatar">
          </v-avatar>
          <span class="ml-3">{{ title }}</span>
        </v-layout>
      </v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" fixed temporary>
      <side-nav></side-nav>
    </v-navigation-drawer>
    <v-layout class="content" column>
      <app-loading v-if="posts.length == 0" class="pt-3"></app-loading>
      <post-list :posts="posts"></post-list>
      <p class="text-xs-center mt-2" v-if="endStory">no more stories to show :(</p>
    </v-layout>
    <app-loading v-if="posts.length > 0"></app-loading>
    <v-btn color="blue" dark medium fixed bottom right fab @click="createPost()">
      <v-icon>add</v-icon>
    </v-btn>
    <app-composer :composer="composer" @close-composer="composer.show = false" @success="newStory()"></app-composer>
  </v-layout>
</template>

<script>

import sideNav from "../nav"
import postList from "../post/postList"

export default {
  components: {
    sideNav,
    postList
  },

  data() {
    return {
      user: {},
      posts: [],
      page: 0,
      endStory: false,
      perPage: 15,
      lastPage: 1,
      drawer: false,
      loadPost: false,
      items: [
        { title: "Profile", icon: "dashboard" },
        { title: "Logout", icon: "question_answer" }
      ],
      composer: {
        show: false,
        type: '',
        action: ''
      }
    };
  },

  methods: {
    newStory() {
      this.posts = []
      this.page =  0
      this.lastPage = 1
      this.fetchData()
    },

    loadOnScroll() {
      let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

      if (bottomOfWindow) {
        if (this.page <= this.lastPage){
          this.fetchData()
        } else {
          this.$store.commit('getContent', false)
          this.endStory = true
        }
      }
    },

    gravatar(email) {
      return this.$store.getters.gravatar(email)
    },

    async getGiphy() {
      let tag = this.post.split(' ')
      tag.shift()
      tag = tag.join(' ')
      
      try {
        let url = await this.axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.VUE_APP_GIPHY_KEY}&tag=${tag}`)
        this.giphyURL = url.data.data.image_url
      } catch (err) {
        this.$store.commit('displayMessage', err.message)
      }
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
          this.loadPost = false
          const temp = this.posts.concat(posts.data)
          this.posts = temp
          this.lastPage = posts.meta.last_page
          this.$store.commit('getContent', false)
        })
        .catch(err => {
          this.page -= 1
          this.$store.commit('getContent', false)
          this.$store.commit('displayMessage', err.message)
        });
    },

    createPost() {
      this.composer = {
        show: true,
        action: 'compose',
        type: 'story'
      }
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
    window.addEventListener('scroll', this.loadOnScroll)

    OneSignal.push(() => {
      OneSignal.on('subscriptionChange', (isSubscribed) => {
        if (isSubscribed) {
          OneSignal.sendTags({
            email: this.$store.state.auth.user.email
          })
          .then(r => r)
          .catch(err => this.$store.commit('displayMessage', err.message))
        }
      });
      OneSignal.getNotificationPermission().then((permission) => {
        if (permission === 'granted') {
          OneSignal.registerForPushNotifications();
        }
        else {
          OneSignal.showHttpPrompt({force: true})
        }
      });
    })
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.loadOnScroll)
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

.giphy-textarea textarea {
  color: rgb(169, 169, 255) !important;
}
</style>
