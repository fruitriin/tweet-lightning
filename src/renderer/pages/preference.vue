<template>
  <div>
    <p>Pereference</p>

    <button @click="addAuth">アカウント認証</button>
  </div>
</template>

<script>
export default {
  mounted() {},
  methods: {
    addAuth() {
      this.$electron.ipcRenderer.send("authenticate")
    },
  },
}
</script>
