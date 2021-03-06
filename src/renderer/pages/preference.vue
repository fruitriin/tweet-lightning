<template>
  <div class="p-4">
    <h2 class="title is-5">設定画面</h2>
    <div class="container">
      <div class="col">
        <p class="title is-6 mb-0">認証済みアカウント</p>
        <div v-for="(token, index) in tokens" :key="index" class="row">
          <Account
            :token="token"
            :index="index"
            :isWin="isWin"
            @deleteAccount="deleteAccount"
          />
        </div>
        <button class="authenticate" @click="addAuth">アカウント認証</button>
      </div>
      <div class="col">
        <template v-if="preference">
          <div class="mb-2">
            <PostShortcut :preference="preference" :isWin="isWin" />
          </div>
          <DetailConfig :preference="preference" />
        </template>
      </div>
    </div>

    <div class="mb-6">
      <button @click="savePreference">保存</button>
    </div>
    <div>
      <p class="title is-5 mb-0">ショートカットキー一覧</p>
      <ul>
        <li>[投稿フォーム]ESC ウィンドウを閉じる</li>
        <li>[投稿フォーム](Shift/Ctrl)+Enter 投稿</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Account from "@/components/Preference/Account.vue"
import PostShortcut from "@/components/Preference/PostShortcut.vue"
import DetailConfig from "@/components/Preference/DetailConfig.vue"

export default {
  components: {
    Account,
    PostShortcut,
    DetailConfig,
  },
  data() {
    return {
      tokens: null,
      preference: null,
    }
  },
  computed: {
    isWin() {
      return process.platform === "win32"
    },
  },
  created() {
    this.$renderer.send("preferenceWindowReady")
    this.$renderer.on("getTokens", (_, tokens) => {
      this.tokens = tokens
    })
    this.$renderer.on("getPreference", (_, preference) => {
      this.preference = preference
    })
  },
  methods: {
    addAuth() {
      this.$renderer.send("authenticate")
    },
    deleteAccount(index) {
      this.$renderer.send("deleteAccount", index)
    },
    savePreference() {
      this.$renderer.send("changePreference", {
        preference: this.preference,
        accounts: this.tokens,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
}

.col {
  width: 50%;
}

.row {
  display: flex;
  align-items: center;
  width: 100%;

  &:last-of-type {
    margin-bottom: 0.5rem;
  }
}
</style>
