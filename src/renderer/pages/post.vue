<template>
  <div>
    <div v-if="users.length > 0">
      <img :src="users[index].profile_image_url_https" />
      <label for>@{{ users[index].screen_name }}</label>
    </div>
    <form
      @submit.prevent="submitAll"
      @keyup.ctrl.enter="ctrlSubmit"
      @keyup.shift.enter="shiftSubmit"
      @keyup.esc="close"
    >
      <div v-for="(message, i) in messages" :key="i">
        <textarea ref="textarea" v-model="message.text" />
        <input type="submit" />
        <p>{{ message.text.length }}</p>
        <button @click.prevent="expand">↓</button>
      </div>
    </form>
  </div>
</template>

<script>
const Twitter = require("twitter-lite")
require("dotenv").config()

export default {
  data() {
    return {
      messages: [{text: ""}],
      users: [],
      debug: "",
      index: 0,
      clients: [],
      preference: null,
    }
  },
  created() {
    this.$renderer.send("postWindow-ready")
    this.$renderer.on("show", (_, index) => {
      this.index = index
      this.$refs.textarea[0].focus()
    })
    this.$renderer.on("getPreference", (_, preference) => {
      this.preference = preference
    })
    this.$renderer.on("getTokens", async (_, tokens) => {
      this.clients = tokens.map((t) => {
        return new Twitter({
          consumer_key: process.env.consumer_key,
          consumer_secret: process.env.consumer_secret,
          access_token_key: t.token,
          access_token_secret: t.tokenSecret,
        })
      })
      this.users = await Promise.all(
        this.clients.map((client) => {
          return client.get("account/verify_credentials")
        })
      )
    })
  },
  mounted() {
    this.$refs.textarea[0].focus()
  },
  methods: {
    close() {
      this.message = ""
      this.$renderer.send("postWindow-close")
    },
    shiftSubmit() {
      if (this.preference.postShortcut !== "shift") return
      this.submitAll()
    },
    ctrlSubmit() {
      if (this.preference.postShortcut !== "ctrl") return
      this.submitAll()
    },
    expand(){
      this.messages.push({text: ""})
    },
    async submitAll(){
      const tmpMessages =  [...this.messages]
      let res = {}
      for(const message of tmpMessages){
        res = await this.submit({ status: message.text, in_reply_to_status_id: res.id_str} )
      }
      // FIXME: 途中で失敗したときにメッセージが全滅する
      this.messages.splice(0, this.messages.length, {text: ""})
      this.$renderer.send("postWindow-posted")
    },
    async submit({ status, in_reply_to_status_id}) {
      const params = {status, auto_populate_reply_metadata : true}
      if(in_reply_to_status_id) params.in_reply_to_status_id = in_reply_to_status_id
      return await this.clients[this.index]
        .post("statuses/update", params)
        .catch((err) => {
          window.alert(JSON.stringify(err))
        })
    },
  },
}
</script>
