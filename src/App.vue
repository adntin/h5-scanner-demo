<script setup lang="ts">
import { onMounted } from 'vue'
// import { Html5Qrcode } from 'html5-qrcode'
import { Html5QrcodeScanner } from 'html5-qrcode'
import type { Html5QrcodeError, Html5QrcodeResult } from 'html5-qrcode/esm/core'

function onScanSuccess(decodedText: string, decodedResult: Html5QrcodeResult) {
  console.log(`Code matched = ${decodedText}`, decodedResult)
}

function onScanFailure(message: string, error: Html5QrcodeError) {
  console.warn(`Code scan message = ${message}, error = ${error}`)
}

onMounted(() => {
  const html5QrcodeScanner = new Html5QrcodeScanner(
    'reader',
    { fps: 10, qrbox: { width: 300, height: 300 } },
    /* verbose= */ false,
  )
  html5QrcodeScanner.render(onScanSuccess, onScanFailure)
})
</script>

<template>
  <div id="reader" width="600px"></div>
</template>

<style scoped></style>
