<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import type { Html5QrcodeResult, CameraDevice } from 'html5-qrcode/esm/core'
import Toast from './Toast.vue'

let html5QrCode
const scanning = ref<boolean>(false)
const tableData = ref<string[]>(['2503040001', '2503040002'])
const toastMessage = ref<string>('')

const onInputFileChange = async (e) => {
  if (e.target.files.length == 0) {
    return
  }
  if (!html5QrCode) {
    alert('html5QrCode 未初始化')
    return
  }
  const state = html5QrCode.getState()
  if (state !== Html5QrcodeScannerState.NOT_STARTED) {
    await onStop()
  }
  const imageFile = e.target.files[0]
  html5QrCode
    .scanFile(imageFile, true)
    .then((decodedText: string) => {
      if (tableData.value.includes(decodedText)) {
        toastMessage.value = `已经添加: ${decodedText}`
        return
      }
      tableData.value.push(decodedText)
      toastMessage.value = `成功添加: ${decodedText}`
    })
    .catch((error: unknown) => {
      console.warn('识别失败', error)
      toastMessage.value = `识别失败`
    })
}

onMounted(() => {
  Html5Qrcode.getCameras()
    .then((devices: CameraDevice[]) => {
      // devices: [{ id: "4cd143c68fdc24c1f7313af32e878434a2bce2870dce7c75b9201ee695b4a3ca", label: "FaceTime高清摄像头（内建） (05ac:8600)"}]
      console.log('使用摄像头权限 devices =', devices)
      if (devices && devices.length) {
        html5QrCode = new Html5Qrcode('reader')
      } else {
        alert('您没有摄像头, 请使用图片识别或手工输入')
      }
    })
    .catch((error: unknown) => {
      // error: NotAllowedError: Permission denied
      console.error('使用摄像头权限 error =', error)
      alert('您没有摄像头, 请使用图片识别或手工输入')
    })

  const input = document.getElementById('qr-input-file')
  input.addEventListener('change', onInputFileChange)
})

onUnmounted(() => {
  const input = document.getElementById('qr-input-file')
  input.removeEventListener('change', onInputFileChange)
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
  toastMessage.value = `成功添加: ${decodedText}`
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
    { aspectRatio: 2 / 1, fps: 10 },
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

const onDelete = (index: number, item: string) => {
  if (window.confirm(`您确认删除"${item}"吗?`)) {
    // tableData.value = tableData.value.filter((i) => i !== item) // 不能用`filter`因为可能存在多个空字符串
    tableData.value.splice(index, 1)
    toastMessage.value = '删除成功'
  }
}

const onAdd = () => {
  tableData.value.push('')
}

const onSave = () => {
  const len = tableData.value.length
  if (len === 0) {
    alert('有上SRM系统, 送货单号必填')
    return
  }
  if (window.confirm(`您确认${len}个送货单号吗?\r\n${tableData.value.join(', ')}`)) {
    toastMessage.value = '保存成功'
  }
}
</script>

<template>
  <div class="page">
    <div class="header">
      <p>供应商编码: <input /></p>
      <p>车牌号码: <input /></p>
      <p>车辆类型: <input /></p>
      <p>车辆长度: <input /></p>
      <p>车辆尾板: <input /></p>
      <p>司机姓名: <input /></p>
      <p>司机身份证: <input /></p>
      <p>自带货: <input /></p>
      <p>随行人员: <input /></p>
    </div>
    <div id="reader" class="reader"></div>
    <div class="toolbar">
      <button class="start" @click="onStart" v-if="!scanning">扫一扫</button>
      <button class="stop" @click="onStop" v-if="scanning">停止扫描</button>
      <label for="qr-input-file" class="input-file">照片识别</label>
      <input type="file" id="qr-input-file" accept="image/*" capture />
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
          <td><input v-model="tableData[index]" placeholder="请输入" /></td>
          <td><button @click="onDelete(index, item)">删除</button></td>
        </tr>
        <tr>
          <td colspan="3" @click="onAdd">+添加</td>
        </tr>
      </tbody>
    </table>
    <div class="actions">
      <button @click="onSave">保存</button>
    </div>
  </div>
  <Toast v-model:message="toastMessage" />
</template>

<style scoped lang="scss">
.page {
  height: 100%;
  padding: 0 24px;
  .header {
    padding-top: 12px;
  }
  table {
    width: 100%;
    text-align: center;
  }
  table,
  th,
  td {
    border: 1px solid #555555;
    border-collapse: collapse;
  }
  .actions {
    text-align: center;
    padding: 16px;
  }
}
.reader {
  width: 100%;
  aspect-ratio: 2 / 1;
  object-fit: cover;
  background-color: gray;
  overflow: hidden;
  border-radius: 6px;
}
.toolbar {
  margin: 8px 0 16px;
  button {
    padding: 6px 12px;
    margin-right: 8px;
    border: 1px solid #ccc;
    background-color: #fff;
  }
  input[type='file'] {
    display: none;
  }
  .input-file {
    border: 1px solid #ccc;
    background-color: #fff;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
  }
}
</style>
