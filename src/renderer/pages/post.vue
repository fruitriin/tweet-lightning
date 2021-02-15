<template>
  <div>
    <div v-if="users.length > 0">
      <img :src="users[index].profile_image_url_https" />
      <label for>@{{ users[index].screen_name }}</label>
    </div>
    <form
      @submit.prevent="submit"
      @keyup.ctrl.enter="ctrlSubmit"
      @keyup.shift.enter="shiftSubmit"
      @keyup.esc="close"
    >
      <textarea ref="textarea" v-model="message" />
      <input type="submit" />
    </form>
    <pre>{{ debug }}</pre>
    <p>{{ message.length }}</p>
  </div>
</template>

<script>
const Twitter = require("twitter-lite")
require("dotenv").config()

export default {
  data() {
    return {
      message: "",
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
      this.$refs.textarea.focus()
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
    this.$refs.textarea.focus()
  },
  methods: {
    close() {
      this.message = ""
      this.$renderer.send("postWindow-close")
    },
    shiftSubmit() {
      if (this.preference.postShortcut !== "shift") return
      this.submit()
    },
    ctrlSubmit() {
      if (this.preference.postShortcut !== "ctrl") return
      this.submit()
    },
    submit() {
      this.clients[this.index]
        .post("statuses/update", { status: this.message })
        .then((tweet) => {
          this.message = ""
          this.$renderer.send("postWindow-posted")
        })
        .catch((err) => {
          window.alert(JSON.stringify(err))
        })
    },
  },
}
</script>
