<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import type { Html5QrcodeResult, CameraDevice } from 'html5-qrcode/esm/core'
import Toast from './Toast.vue'

let html5QrCode
const scanning = ref<boolean>(false)
const tableData = ref<string[]>(['2503040001', '2503040002'])
const toastMessage = ref<string>('')

onMounted(() => {
  Html5Qrcode.getCameras()
    .then((devices: CameraDevice[]) => {
      // devices: [{ id: "4cd143c68fdc24c1f7313af32e878434a2bce2870dce7c75b9201ee695b4a3ca", label: "FaceTime高清摄像头（内建） (05ac:8600)"}]
      console.log('使用摄像头权限 devices =', devices)
      if (devices && devices.length) {
        html5QrCode = new Html5Qrcode('reader')
        onStart() // 默认开启摄像
      }
    })
    .catch((error: unknown) => {
      // error: NotAllowedError: Permission denied
      console.error('使用摄像头权限 error =', error)
    })
})

const qrCodeSuccessCallback = (decodedText: string, decodedResult: Html5QrcodeResult) => {
  // decodedText: 6936520852550
  // decodedResult: {"decodedText":"6936520852550","result":{"text":"6936520852550","format":{"format":9,"formatName":"EAN_13"},"debugData":{"decoderName":"BarcodeDetector"}}}
  console.log(`qrCodeSuccessCallback Matched = ${decodedText}`, decodedResult)
  if (tableData.value.includes(decodedText)) {
    toastMessage.value = `已经添加: ${decodedText}`
    return
  }
  tableData.value.push(decodedText)
  toastMessage.value = `添加成功: ${decodedText}`
}

// const qrCodeErrorCallback = (message: string, error: Html5QrcodeError) => {
//   console.error(`qrCodeErrorCallback message = ${message}, error =`, error)
// }

const onStart = async () => {
  if (!html5QrCode) {
    alert('html5QrCode 未初始化')
    return
  }
  await html5QrCode.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: { width: 600, height: 200 } },
    qrCodeSuccessCallback,
    // qrCodeErrorCallback,
  )
  scanning.value = true
}

const onStop = async () => {
  if (!html5QrCode) {
    alert('html5QrCode 未初始化')
    return
  }
  await html5QrCode.stop()
  scanning.value = false
}

const onDelete = (item: string) => {
  if (window.confirm('您确认删除吗?')) {
    tableData.value = tableData.value.filter((i) => i !== item)
    toastMessage.value = '删除成功'
  }
}
</script>

<template>
  <div class="page">
    <p>供应商编码: <input /></p>
    <p>车牌号码: <input /></p>
    <p>车辆类型: <input /></p>
    <p>车辆长度: <input /></p>
    <p>车辆尾板: <input /></p>
    <p>司机姓名: <input /></p>
    <p>司机身份证: <input /></p>
    <p>自带货: <input /></p>
    <p>随行人员: <input /></p>
    <div class="container">
      <button class="start" @click="onStart" v-if="!scanning">扫一扫</button>
      <button class="stop" @click="onStop" v-if="scanning">停止</button>
      <div id="reader"></div>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>送货单号</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData" :key="item">
          <td>{{ index + 1 }}</td>
          <td><input :value="item" /></td>
          <td>
            <button @click="onDelete(item)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Toast v-model:message="toastMessage" />
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
.page {
  padding: 24px;
}
.container {
  position: relative;
  .start {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
    height: 40px;
    width: 80px;
  }
  .stop {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1;
    height: 30px;
    width: 50px;
  }

  #reader {
    width: 100%;
    height: 200px;
    background-color: gray;
    video {
      height: 200px;
    }
  }
}

table {
  width: 100%;
  text-align: center;
  margin-top: 10px;
}
table,
th,
td {
  border: 1px solid #555555;
  border-collapse: collapse;
}
</style>
