<template>
  <div>
    <div v-if="user">
      <img :src="user.profile_image_url_https" />
      <label for>@{{ user.screen_name }}</label>
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
      user: null,
      debug: "",
      client: null,
      preference: null,
    }
  },
  created() {
    this.$renderer.send("postWindow-ready")
    this.$renderer.on("show", () => {
      this.$refs.textarea.focus()
    })
    this.$renderer.on("getPreference", (_, preference) => {
      this.preference = preference
    })
    this.$renderer.on("getTokens", (_, tokens) => {
      this.client = new Twitter({
        consumer_key: process.env.consumer_key,
        consumer_secret: process.env.consumer_secret,
        access_token_key: tokens[0].token,
        access_token_secret: tokens[0].tokenSecret,
      })
      this.client.get("account/verify_credentials").then((res) => {
        this.user = res
      })
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
      this.client
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
