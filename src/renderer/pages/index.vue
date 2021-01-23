<template>
  <div>
    <div v-if="user">
      <img :src="user.profile_image_url_https" />
      <label for="">{{ user.name }}(@{{ user.screen_name }})</label>
    </div>
    <form @submit.prevent="submit" @keyup.ctrl.enter="submit">
      <textarea v-model="message"></textarea>
      <input type="submit" />
    </form>
    <label for="debugToggle">
      <input id="debugToggle" type="checkbox" v-model="isDebug" /> Debug
      mode（投稿しない）
    </label>
    <pre>{{ debug }}</pre>
    <p>{{ message.length }}</p>
  </div>
</template>

<script>
const Twitter = require('twitter-lite')
require('dotenv').config()

export default {
  data () {
    return {
      message: '',
      user: null,
      debug: '',
      isDebug: true,
      client: null
    }
  },
  mounted () {
    this.$electron.ipcRenderer.send('ready')
    this.$electron.ipcRenderer.on('tokens', (event, tokens) => {
      console.log(tokens)
      this.client = new Twitter({
        consumer_key: process.env.consumer_key,
        consumer_secret: process.env.consumer_secret,
        access_token_key: tokens[0].token,
        access_token_secret: tokens[0].tokenSecret
      })
      // this.$electron.ipcRenderer.send('perform-action')
      this.client.get('account/verify_credentials').then(res => {
        this.user = res
      })
    })
  },

  methods: {
    submit () {
      if (this.isDebug) {
        this.debug = this.message
        return
      }
      this.client
        .post('statuses/update', { status: this.message })
        .then(tweet => {
          this.message = ''
        })
        .catch(err => {
          window.alert(JSON.stringify(err))
        })
    }
  }
}
</script>
