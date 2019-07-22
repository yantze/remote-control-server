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
        <button class="btn btn-light" @click="copyToClipboard">Copy to Clipboard</button>
        <button class="btn btn-light" @click="clipboard = ''; tips = ''">Clear</button>
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

    <div class="pt-3">
      <span>
        Drop files here or
        <label class="btn-link">
          <input type="file" name="files[]" multiple="true" @change="handleInputChange" /> Browse
        </label>
      </span>
      <h5>File list</h5>
      <ul>
        <li v-for="(file, key) in files" :key="key">
          <a :href="locationOrigin + '/files/'+file.id">{{ file.name }}</a>
          Size: {{ file.size }} Bytes
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="js">
import Vue from 'vue'

import { Uppy } from '@uppy/core'
import ProgressBar from '@uppy/progress-bar'
import Tus from '@uppy/tus'
import dragDrop from 'drag-drop'
import copy from 'copy-to-clipboard'

import '@uppy/progress-bar/dist/style.css'

export default Vue.extend({
  data() {
    return {
      tips: '',
      clipboard: '',
      files: [],
      locationOrigin: location.origin,
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
        this.clipboard = data ? data.toString().trim() : ''
      })
    },

    copyToClipboard() {
      copy(this.clipboard);
    },

    handleInputChange(ev) {
      this.uploadFiles(Array.from(ev.target.files))
    },

    uploadFiles(files) {
      console.log('Files start upload.')

      files.forEach(file => {
        try {
          this.uppyOne.addFile({
            source: this.id,
            name: file.name,
            type: file.type,
            data: file,
          })
        } catch (err) {
          console.error('Error:', err)
          // Nothing, restriction errors handled in Core
        }
      })
    },
  },
  created() {
    this.uppyOne = new Uppy({ autoProceed: true })
  },
  mounted() {
    this.uppyOne
      .use(Tus, { endpoint: `${location.origin}/uploads` })
      .use(ProgressBar, {
        target: '#app',
        hideAfterFinish: true,
        fixed: true,
      })

    dragDrop('#app', (files, pos, fileList, directories) => {
      this.uploadFiles(files)

      console.log('Here are the dropped files', files) // Array of File objects
      console.log('Dropped at coordinates', pos.x, pos.y)
      console.log('Here is the raw FileList object if you need it:', fileList)
      console.log('Here is the list of directories:', directories)
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

<style>
#app.drag {
  border: 2px dashed;
  border-color: #79710f;
  background-color: #b7b7b71c;
}

input[type='file'] {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
</style>
