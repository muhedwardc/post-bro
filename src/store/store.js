import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        auth: {
            token: '',
            user: {
                id: 1,
                name: 'Muhammad Edward',
                email: 'muhedwardc@gmail.com'
            }
        },
        drawer: false,
        snackbar: {
            show: false,
            message: ''
        },
        loadContent: false,
        loadPostContent: false
    },

    mutations: {
        displayError(state, error) {
            state.snackbar = {
                show: true,
                message: error
            }
        },

        getContent(state, payload) {
            state.loadContent = payload
        }
    },

    actions: {
    }
})