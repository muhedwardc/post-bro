<template>
    <v-layout class="container" align-center justify-center column>
        <v-form>
            <v-layout column>
                <v-flex>
                    <v-text-field
                        v-model="name"
                        :rules="nameRules"
                        label="Name"
                        required
                        :disabled="loading"
                    ></v-text-field>
                </v-flex>
                <v-flex>
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="Email"
                        required
                        :disabled="loading"
                    ></v-text-field>
                </v-flex>
                <v-flex>
                    <v-text-field
                        type="password"
                        v-model="password"
                        :rules="passwordRules"
                        label="Password"
                        required
                        :disabled="loading"
                    ></v-text-field>
                </v-flex>
                <v-flex>
                    <v-text-field
                        type="password"
                        v-model="passwordConfirm"
                        :rules="passwordConfirmRules"
                        label="Password Confirmation"
                        required
                        :disabled="loading"
                    ></v-text-field>
                </v-flex>
                <v-btn @click="register" :loading="loading">Register</v-btn>
                <router-link v-if="!loading" class="text-xs-center blue--text mt-2" :to="{ name: 'Login' }">Login</router-link>
            </v-layout>
        </v-form>
        <app-snackbar></app-snackbar>
    </v-layout>
</template>

<script>
import AppSnackbar from '../snackbar'

export default {
    components: {
        AppSnackbar
    },
    
    data() {
        return {
            email: '',
            password: '',
            name: '',
            passwordConfirm: '',
            nameRules: [
                v => !!v || 'E-mail is required'
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid'
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => v.length >= 6 || 'Password must be more than 6 characters'
            ],
            passwordConfirmRules: [
                v => !!v || 'Password is required',
                v => v == this.password || 'Password doesn\'t match'
            ],
            loading: false
        }
    },

    methods: {
        async register() {
            const v = this.validate()
            if (v) {
                this.$router.replace({ name: 'Home' })
            } else {
                this.$store.state.snackbar.message =  'Invalid Input'
                this.$store.state.snackbar.show = true
            }
        },

        validate() {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            let name = this.name.length > 0
            let email = re.test(String(this.email).toLowerCase())
            let password = this.password.length > 0
            let confirmPassword = this.password == this.passwordConfirm

            return name && email && password && confirmPassword
        }
    }
}
</script>

<style scoped>
    .container {
        padding: 32px;
    }

    form.v-form {
        width: 100%;
    }

    .v-btn {
        margin: 8px 0;
    }
</style>


