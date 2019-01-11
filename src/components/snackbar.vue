<template>
    <v-snackbar
      v-model="$store.state.snackbar.show"
      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
    >
      {{ $store.state.snackbar.message }}
      <v-btn
        color="pink"
        flat
        @click="$store.state.snackbar.show = false"
      >
        Close
      </v-btn>
    </v-snackbar>
</template>

<script>
export default {
    data() {
        return {
            y: 'top',
            x: null,
            mode: '',
            timeout: 5000,
        }
    }
}
</script>

