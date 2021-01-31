<template>
  <div>
    <p>Pereference</p>
    <div class="container">
      <div class="col">
        認証済みアカウント
        <div v-for="(token, key) in tokens" :key="key">
          [{{ key + 1 }}] {{ token.user }}
          <button @click="deleteAccount(key)">-</button>
          <label>
            <input v-model="token.shortcut.Shift" type="checkbox" />
            Shift
          </label>
          <label>
            <input v-model="token.shortcut.Ctrl" type="checkbox" />
            Ctrl
          </label>
          <label>
            <input v-model="token.shortcut.Alt" type="checkbox" />
            Alt
          </label>
          +<input
            v-model="token.shortcut.key"
            type="text"
            maxlength="1"
            @input="token.shortcut.key = $event.target.value.toUpperCase()"
          />
        </div>
      </div>

      <button @click="addAuth">アカウント認証</button>
    </div>
    <div class="col">
      <ul v-if="preference">
        <li>
          投稿ショートカット
          <label>
            <input
              v-model="preference.postShortcut"
              type="radio"
              value="shift"
            />
            Shift + Enter
          </label>
          <label
            ><input
              v-model="preference.postShortcut"
              type="radio"
              value="ctrl"
            />Ctrl + Enter</label
          >
        </li>
        <li>
          <label
            ><input
              v-model="preference.alwaysOnTop"
              type="checkbox"
              :value="true"
            />投稿画面を常に最前面に表示</label
          >
        </li>
        <li>
          <label
            ><input
              v-model="preference.hideAfterPost"
              type="checkbox"
              :value="true"
            />投稿したらウィンドウを消す</label
          >
        </li>
        <li>
          <label><input type="checkbox" disabled />投稿したら通知を表示</label>
        </li>
        <li>
          <select id="" name="" disabled>
            <option value="">位置を保存</option>
            <option value="">思案中</option>
</select
          >表示位置
        </li>
      </ul>
    </div>
    <div>
      <button @click="savePreference">保存</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tokens: null,
      preference: null,
    }
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
