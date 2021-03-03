<template>
  <div class="p-4">
    <h2 class="title is-5">設定画面</h2>
    <div class="container">
      <div class="col">
        <p class="title is-6 mb-0">認証済みアカウント</p>
        <div v-for="(token, key) in tokens" :key="key" class="row">
          <div class="field is-flex">
            <div style="width: 160px">[{{ key + 1 }}] {{ token.user }}</div>
            <div>
              <button class="delete" @click="deleteAccount(key)" />
              <template v-if="isWin">
                <label class="checkbox">
                  <input
                    v-model="token.shortcut.Shift"
                    class="checkbox"
                    type="checkbox"
                  />
                  Shift
                </label>
                <label class="checkbox">
                  <input
                    v-model="token.shortcut.Ctrl"
                    class="checkbox"
                    type="checkbox"
                  />
                  Ctrl
                </label>

                <label class="checkbox">
                  <input
                    v-model="token.shortcut.Alt"
                    class="checkbox"
                    type="checkbox"
                  />
                  Alt
                </label>
              </template>
              <template v-else>
                <label class="checkbox">
                  <input
                    v-model="token.shortcut.Super"
                    type="checkbox"
                    class="checkbox"
                  />
                  ⌘
                </label>
                <label class="checkbox">
                  <input
                    v-model="token.shortcut.Shift"
                    class="checkbox"
                    type="checkbox"
                  />
                  ⇧
                </label>
                <label class="checkbox">
                  <input
                    v-model="token.shortcut.Alt"
                    class="checkbox"
                    type="checkbox"
                  />
                  ⌥
                </label>
                <label class="checkbox">
                  <input
                    v-model="token.shortcut.Ctrl"
                    class="checkbox"
                    type="checkbox"
                  />
                  ⌃
                </label>
              </template>

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
          </div>
        </div>
        <button class="authenticate" @click="addAuth">アカウント認証</button>
      </div>
      <div class="col">
        <template v-if="preference">
          <div class="mb-2">
            <p class="title is-6 mb-0">投稿ショートカット</p>
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
              <li v-if="!isWin">
                <label>
                  <input
                    v-model="preference.postShortcut"
                    type="radio"
                    value="meta"
                  />
                  Cmd + Enter
                </label>
              </li>
            </ul>
          </div>
          <div>
            <p class="title is-6 mb-0">詳細設定</p>
            <ul>
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
export default {
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
.shortcut_key {
  width: 1.5rem;
}
</style>
