<template>
  <div>
    <img :src="user.profile_image_url_https" />
    <label for="">{{ user.name }}(@{{ user.screen_name }})</label>
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
var client = null
var keys = {
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token,
  access_token_secret: process.env.access_token_secret
}
client = new Twitter(keys)

export default {
  data () {
    return {
      message: '',
      user: null,
      debug: '',
      isDebug: true
    }
  },
  mounted () {
    console.log(this.$electron)
    this.$electron.ipcRenderer.send('perform-action')
    client.get('account/verify_credentials').then(res => {
      this.user = res
    })
  },

  methods: {
    submit () {
      if (this.isDebug) {
        this.debug = this.message
        return
      }
      client
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
