<template>
  <div>
    <p>Pereference</p>
    <div class="container">
      <div class="col">
        認証済みアカウント
        <div v-for="(token, key) in tokens" :key="key" class="row">
          [{{ key + 1 }}] {{ token.user }}
          <button @click="deleteAccount(key)">-</button>

          <input v-model="token.shortcut.Shift" type="checkbox" />
          <label>Shift</label>

          <input v-model="token.shortcut.Ctrl" type="checkbox" />
          <label>Ctrl</label>

          <input v-model="token.shortcut.Alt" type="checkbox" />
          <label>Alt</label>
          +
          <input
            v-model="token.shortcut.key"
            class="shortcut_key"
            type="text"
            maxlength="1"
            style="ime-mode: disabled"
            @keypress="token.shortcut.key = ''"
            @input="token.shortcut.key = $event.target.value.toUpperCase()"
          />
        </div>
        <button class="authenticate" @click="addAuth">アカウント認証</button>
      </div>
      <div class="col">
        <ul v-if="preference">
          <li>
            投稿ショートカット
            <ul>
              <li>
                <label>
                  <input
                    v-model="preference.postShortcut"
                    type="radio"
                    value="shift"
                  />
                  Shift + Enter
                </label>
              </li>
              <li>
                <label>
                  <input
                    v-model="preference.postShortcut"
                    type="radio"
                    value="ctrl"
                  />
                  Ctrl + Enter
                </label>
              </li>
            </ul>
          </li>
          <li>
            <label>
              <input
                v-model="preference.alwaysOnTop"
                type="checkbox"
                :value="true"
              />
              投稿画面を常に最前面に表示
            </label>
          </li>
          <li>
            <label>
              <input
                v-model="preference.hideAfterPost"
                type="checkbox"
                :value="true"
              />
              投稿したらウィンドウを消す
            </label>
          </li>
        </ul>
      </div>
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
    margin-bottom: 2em;
  }
}
.shortcut_key {
  width: 1em;
}
</style>
