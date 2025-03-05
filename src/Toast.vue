<script setup lang="ts">
import { ref, watch } from 'vue'

const message = defineModel<string>('message', { default: '' })

const cls = ref<string>('')

watch(message, () => {
  if (message.value) {
    cls.value = 'show'
    setTimeout(() => {
      cls.value = ''
      message.value = ''
    }, 2000)
  }
})
</script>

<template>
  <div id="snackbar" :class="cls">{{ message }}</div>
</template>

<style>
#snackbar {
  visibility: hidden;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 50%;
  font-size: 17px;
  transform: translate(-50%, -50%);
  max-width: 60%;
  line-break: anywhere;
  overflow-wrap: anywhere;
}

#snackbar.show {
  visibility: visible;
  -webkit-animation:
    fadein 0.2s,
    fadeout 0.2s 0.4s;
  animation:
    fadein 0.2s,
    fadeout 0.2s 0.4s;
}

@-webkit-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
