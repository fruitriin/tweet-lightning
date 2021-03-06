<template>
  <div class="p-2">
    <div v-if="hasUpdate && showUpdateNotice" class="notification is-info p-2">
      <button class="delete" @click="showUpdateNotice = false" />
      <a :href="latest.html_url" target="_blank">
        {{ dateFormate(latest.published_at) }} - v{{ latest.tag_name }}リリース
      </a>
    </div>
    <div v-if="users.length > 0">
      <img :src="users[currentAccountIndex].profile_image_url_https" />
      <label>@{{ users[currentAccountIndex].screen_name }}</label>
    </div>
    <form @keyup.esc="close">
      <PostArea
        v-for="(message, i) in messages"
        ref="postarea"
        :key="i"
        :index="i"
        :message="message"
        :postable="postable"
        :preference="preference"
        :class="{ 'mt-3': i !== 0 }"
        @expand="expand"
        @contract="contract"
        @submit="submitAll"
      />
    </form>
  </div>
</template>

<script>
import PostArea from "@/components/PostArea"
import dayjs from "dayjs"
const Twitter = require("twitter-lite")
require("dotenv").config()

export default {
  components: {
    PostArea,
  },
  data() {
    return {
      messages: [{ text: "" }],
      users: [],
      debug: "",
      currentAccountIndex: 0,
      clients: [],
      preference: null,
      hasUpdate: null,
      latest: null,
      showUpdateNotice: true, // 通知を消したい時用
    }
  },
  computed: {
    // TODO: 140文字制限
    postable() {
      return this.messages.every((m) => m.text.length > 0)
    },
  },
  created() {
    this.$renderer.send("postWindow-ready")
    this.$renderer.on("show", (_, currentAccountIndex) => {
      this.currentAccountIndex = currentAccountIndex
      this.focusTextArea()
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
    this.updateCheck()
  },
  mounted() {
    this.focusTextArea()
  },
  methods: {
    focusTextArea() {
      // FIXME
      this.$refs.postarea[0].$refs.textarea.focus()
    },
    dateFormate(dateTimeString) {
      return dayjs(dateTimeString).format("YYYY年MM月DD日")
    },
    close() {
      this.messages.splice(0, this.messages.length, { text: "" })
      this.$renderer.send("postWindow-close")
    },

    expand() {
      this.messages.push({ text: "" })
      this.$renderer.send("postWindow-expand")
    },
    contract(deleteKey) {
      this.messages.splice(deleteKey, 1)
      this.$renderer.send("postWindow-contract")
    },
    async submitAll() {
      const tmpMessages = [...this.messages]
      let res = {}
      for (const message of tmpMessages) {
        res = await this.submit({
          status: message.text,
          in_reply_to_status_id: res.id_str,
        })
      }
      // FIXME: 途中で失敗したときにメッセージが全滅する
      this.messages.splice(0, this.messages.length, { text: "" })
      this.$renderer.send("postWindow-posted")
    },
    async submit({ status, in_reply_to_status_id }) {
      const params = { status, auto_populate_reply_metadata: true }
      if (in_reply_to_status_id)
        params.in_reply_to_status_id = in_reply_to_status_id
      return await this.clients[this.currentAccountIndex]
        .post("statuses/update", params)
        .catch((err) => {
          window.alert(JSON.stringify(err))
        })
    },
    async updateCheck() {
      const latest = await fetch(
        "https://api.github.com/repos/fruitriin/tweet-lightning/releases/latest"
      ).then((res) => res.json())
      this.latest = latest
      this.hasUpdate =
        latest.tag_name !== process.env.npm_package_version.toString()
    },
  },
}
</script>
