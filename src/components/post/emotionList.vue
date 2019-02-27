<template>
    <div class="emotion-list">
        <v-toolbar flat fixed color="#fff">
            <v-icon @click="$emit('close-list')">close</v-icon>
            <v-toolbar-title>
                Emotions
            </v-toolbar-title>
        </v-toolbar>
        <v-layout class="list" column>
            <v-layout class="emotion-item" align-center v-for="e in emotions" :key="e.userId">
                <div>
                    <v-avatar size="32px">
                        <img :src="$store.getters.gravatar(e.email)">
                    </v-avatar>
                    <img :src="require('@/assets/emotions/' + e.type + '.png')"/>
                </div>
                <b class="ml-2">{{ e.name }}</b>
            </v-layout>
        </v-layout>
    </div>
</template>

<script>
export default {
    props: {
        emotions: {
            type: Array,
            required: true
        }
    }
}
</script>

<style>
    .list {
        padding-top: 49px;
    }

    .emotion-item > div {
        position: relative;
        padding: 8px;
    }

    .emotion-item > div > img {
        position: absolute;
        bottom: 4px;
        right: 4px;
        width: 20px;
        height: 20px;
    }
</style>


