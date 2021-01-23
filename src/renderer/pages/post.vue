<template>
  <div>
    <div v-if="user">
      <img :src="user.profile_image_url_https" />
      <label for>{{ user.name }}(@{{ user.screen_name }})</label>
    </div>
    <form
      @submit.prevent="submit"
      @keyup.ctrl.enter="submit"
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
    }
  },
  created() {
    this.$renderer.send("postWindow-ready")
    this.$renderer.on("show", () => {
      this.$refs.textarea.focus()
    })
    this.$renderer.on("getTokens", (event, tokens) => {
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
