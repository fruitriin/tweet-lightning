<template>
  <div class="p-2">
    <div v-if="hasUpdate && showUpdateNotice" class="notification is-info p-2">
      <button class="delete" @click="showUpdateNotice = false" />
        <a :href="latest.html_url" target="_blank">{{dateFormate(latest.published_at)}} - v{{latest.tag_name}} リリース</a>
    </div>
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
      <div class="filed post_area" :class="{'mt-3': i !== 0}" v-for="(message, i) in messages" :key="i">
        <textarea class="textarea has-fixed-size mb-2" ref="textarea" tabindex="1" rows="3" v-model="message.text" />
        <button v-if="i > 0" class="delete close_button"  @click.prevent="contract(i)"/>
        <div class="is-flex is-align-items-center is-justify-content-flex-end">
          <p class="mr-3">{{ message.text.length }}</p>
          <plusCircleOutlineIcon class="ui-icon mr-3 has-text-primary" @click.prevent="expand" tabindex="3" />
          <input class="button is-primary" type="submit" tabindex="2" :disabled="!postable" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import plusCircleOutlineIcon from 'vue-material-design-icons/plusCircleOutline.vue';
const Twitter = require("twitter-lite")
import dayjs from 'dayjs'
require("dotenv").config()

export default {
  components: {
    plusCircleOutlineIcon
  },
  data() {
    return {
      messages: [{text: ""}],
      users: [],
      debug: "",
      index: 0,
      clients: [],
      preference: null,
      hasUpdate: null,
      latest: null,
      showUpdateNotice: true,
    }
  },
  computed: {
    // TODO: 140文字制限
    postable() {
      return this.messages.every(m => m.text.length > 0 )
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
    this.updateCheck()
  },
  mounted() {
    this.$refs.textarea[0].focus()
  },
  methods: {
    dateFormate(dateTimeString){
      return dayjs(dateTimeString).format("YYYY年MM月DD日")
    },
    close() {
      this.messages.splice(0, this.messages.length, {text: ""})
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
      this.$renderer.send("postWindow-expand")
    },
    contract(deleteKey){
      this.messages.splice(deleteKey, 1)
      this.$renderer.send("postWindow-contract")
    },
    async submitAll(){
      if(!this.postable) return

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
    async updateCheck(){
       const latest = await fetch("https://api.github.com/repos/fruitriin/tweet-lightning/releases/latest").then(res => res.json())
       this.latest = latest
       this.hasUpdate = latest.tag_name !== process.env.npm_package_version.toString()
    }
  },
}
</script>

<style scoped lang="scss">
.post_area {
  position:relative;

  .close_button {
    position: absolute;
    right: .2rem;
    top: .2rem;
    z-index: 1;
  }

}

</style>