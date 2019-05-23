<template>
  <div class="container">
    <label>{{ tips }}</label>

    <div class="row">
      <div class="col">
        <div class="form-group">
          <textarea name="clipboard" class="form-control" rows="2" v-model="clipboard"></textarea>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col d-flex">
        <button class="btn btn-light" @click="sendClipboard">Send</button>
        <button class="btn btn-light" @click="reciveClipboard">Recive</button>
        <button class="btn btn-light" @click="clipboard = ''">Clear</button>
      </div>
    </div>

    <!-- Button trigger modal -->
    <!-- <button
      type="button"
      class="btn btn-link"
      data-toggle="modal"
      data-target="#exampleModal"
    >Launch demo modal</button>-->

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="btn close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <!-- Target DOM node #1 -->
      <div class="UppyDragDrop-One"></div>
    </div>

    <div>
      <h5>File list</h5>
      <ul>
        <li v-for="(file, key) in files" :key="key">
          <a :href="'http://localhost:3399/files/'+file.id">{{ file.name }}</a>
          Size: {{ file.size }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="js">
import Vue from 'vue'

import { Uppy } from '@uppy/core'
import DragDrop from '@uppy/drag-drop'
import ProgressBar from '@uppy/progress-bar'
import Tus from '@uppy/tus'

import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import '@uppy/progress-bar/dist/style.css'

export default Vue.extend({
  data() {
    return {
      tips: '',
      clipboard: '',
      files: [],
    }
  },
  sockets: {
    ['UPLOAD_FILE_COMPLETED']({ id, name, size }) {
      this.files.push({ id, name, size })
    },
  },
  methods: {
    sendClipboard() {
      this.$socket.emit(
        'WS_CLIPBOARD_PUSH',
        {
          data: this.clipboard,
        },
        () => {
          this.tips = 'Success'
        },
      )
    },
    reciveClipboard() {
      this.$socket.emit('WS_CLIPBOARD_PULL', data => {
        this.clipboard = data
      })
    },
  },
  mounted() {
    const uppyOne = new Uppy({ autoProceed: true })
    uppyOne
      .use(DragDrop, { target: '.UppyDragDrop-One' })
      .use(Tus, { endpoint: `${location.origin}/uploads` })
      .use(ProgressBar, {
        target: '#app',
        hideAfterFinish: true,
        fixed: true,
      })

    /*
    uppyOne.on('complete', result => {
      if (result.successful.length > 0) {
        const items = result.successful.map(item => {
          const fileId = item.uploadURL.slice(item.uploadURL.lastIndexOf('/') + 1)
          return {
            url: `${location.origin}/files/${fileId}`,
          }
        })
        console.log('items:', items)
      } else {
        console.log('failed files:', result.failed)
      }
    })
    */
  },
})
</script>
