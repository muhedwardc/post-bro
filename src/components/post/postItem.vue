<template>
    <v-layout
        class="post-content"
      >
        <v-flex shrink>
          <v-avatar class="mb" size="41px">
            <img :src="gravatar(post.user.email)" alt="avatar">
          </v-avatar>
        </v-flex>
        <v-flex>
          <v-layout column class="pl-1 pr-1">
            <v-layout wrap 
                style="cursor: pointer;"
                @click="$router.push({ name: 'Show', params: { id: post.id } })">
              <h4>{{ post.user.name }}</h4>
              <span color="grey">&nbsp;. {{ getPostTime(post.created_at) }} {{ post.created_at !== post.updated_at ? '(edited)' : null }}</span>
            </v-layout>
            <div @click="$router.push({ name: 'Show', params: { id: post.id } })" class="item-content mt-0 mb-0" style="word-break: break-word;" v-html="$store.getters.markedText(text)"></div>
            <!-- <div v-if="isGiphy" class="giphy-container ma-0">
                <img :src="giphyURL" style="width: 100%; border-radius: 4px; display: block;">
            </div> -->
            <v-layout class="mt-2" v-if="commentsCount" align-center>
                <v-layout class="story-attribute" justify-space-between align-center>
					<v-layout align-center @click="$router.push({ name: 'Show', params: { id: post.id } })"  style="flex-grow: unset;" class="caption">
						{{ emotionsCount }} Likes&nbsp;&nbsp;
						{{ post.comments_count }} Comments
					</v-layout>
                    <img @click="emotionClick" :src="require('@/assets/emotions/' + showedEmotion + '.png')" class="mr-2"/>
                    <v-layout v-if="showEmotionsPicker" class="emotions-picker" align-center>
                        <img v-for="index in 5" @click="setEmotion(index)" :src="require('@/assets/emotions/' + index + '.png')"/>	
                        <v-icon @click="setEmotion(0)">close</v-icon>
                    </v-layout>
                </v-layout>
            </v-layout>
          </v-layout>
        </v-flex>
        <div class="backdrop" @click="showEmotionsPicker = false" v-if="showEmotionsPicker"></div>
    </v-layout>
</template>

<script>
export default {
    props: {
        post: {
            type: Object,
            required: true
        },
        commentsCount: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            giphyURL: '',
			text: '',
            showEmotionsPicker: false,
			emotions: [
                { type: 5, userId: '123' },
                { type: 1, userId: '124' },
                { type: 2, userId: '125' },
                { type: 3, userId: '126' }
            ],
            emotionsCount: 4,
			userEmotion: {
                type: null,
                id: null
            }
        }
    },

    computed: {
        isGiphy() {
            return this.post.post.match(/^\/giphy\shttps:\/\/.+\.gif\s+.+/);
        },

		showedEmotion() {
			return this.userEmotion.type ? this.userEmotion.type : 0
        }
    },

    methods: {
        gravatar(email) {
            return this.$store.getters.gravatar(email)
        },

        getPostTime(date) {
            return this.$store.getters.getTime(date)
		},

        emotionClick() {
            this.showEmotionsPicker = !this.showEmotionsPicker
        },
        
        setEmotion(type) {
            if (type === 0 && this.userEmotion.type) this.emotionsCount -= 1 
            else if (type !== 0 && !this.userEmotion.type) this.emotionsCount += 1
            this.showEmotionsPicker = false
            this.userEmotion.type = type
        }
    },

    created() {
        // if (this.isGiphy) {
        //     let temp = this.post.post.split(' ')
        //     temp.splice(0, 2)
        //     this.text = '<span class="grey--text">' + this.post.post.split(' ')[0] + '</span> ' + temp.join(' ')
        //     this.giphyURL = this.post.post.split(' ')[1]
        // } else {
            this.text = this.post.post
        // }
    }
}
</script>

<style scoped>
    .giphy {
        margin-top: 4px;
        background-color: #eee;
        border-radius: 8px;
        overflow: hidden;
    }

    .giphy img {
        width: 100%;
        display: block;
    }

    .post-content {
        padding: 12px 5px 12px 5px;
    }
    
    .post-content > div {
        margin: 0 5px;
    }

    .giphy-container {
        min-height: 160px;
    }

    .story-attribute {
		position: relative;
    }

	.story-attribute img {
		height: 20px;
		width: 20px;
	}

	.story-attribute > * {
		cursor: pointer;
	}

    .emotions-picker {
        background-color: white;
        position: absolute;
        bottom: 26px;
        right: 0px;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, .2);
        border-radius: 2px;
        z-index: 4;
    }

    .emotions-picker > img,
    .emotions-picker > * {
        width: 24px;
        height: 24px;
        box-sizing: content-box;
        padding: 8px 10px;
    }

    .backdrop {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        background-color: transparent;
    }
</style>


