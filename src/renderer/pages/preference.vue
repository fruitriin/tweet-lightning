<template>
  <div>
    <p>Pereference</p>
    <div>
      認証済みアカウント
      <div v-for="(token, key) in tokens" :key="key">
        [{{ key + 1 }}] {{ token.user }}
        <button @click="deleteAccount(key)">-</button>
      </div>
    </div>

    <button @click="addAuth">アカウント認証</button>
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
    this.$renderer.on("getPreferences", (_, preference) => {
      this.preference = preference
      console.log(preference)
    })
  },
  methods: {
    addAuth() {
      this.$renderer.send("authenticate")
    },
    deleteAccount(index) {
      this.$renderer.send("deleteAccount", index)
    },
  },
}
</script>
