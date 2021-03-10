<template>
  <div class="select" style="width: 10em">
    <div v-show="showAddFooter" class="box p-2 add_hashtag_dialog">
      <input
        ref="newFooter"
        v-model="newFooter"
        type="text"
        style="width: 70%"
        @keyup.enter="addFooter"
      />
      <button @click="addFooter">+</button>
    </div>
    <select v-if="preference" v-model="currentFooter">
      <option />
      <option
        v-for="(footerOption, i) in preference.footers"
        :key="i"
        :value="footerOption"
      >
        {{ footerOption }}
      </option>
      <option value="add">（追加...）</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    preference: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      currentFooter: this.preference?.currentFooter,
      newFooter: "#",
      showAddFooter: false,
    }
  },
  watch: {
    currentFooter(newValue, oldValue) {
      this.changeFooter(newValue, oldValue)
    },
  },
  methods: {
    async addFooter() {
      const tmpPreference = this.preference
      this.footer = this.newFooter
      tmpPreference.footers.push(this.newFooter)
      this.$emit("changePreference", { preference: tmpPreference })
      this.newFooter = "#"
      this.showAddFooter = false
    },
    async changeFooter(newValue, oldValue) {
      if (newValue === "add") {
        this.showAddFooter = true
        await this.$nextTick()
        this.$refs.newFooter.focus()
        return
      }
      this.$emit("change", { newValue, oldValue })
    },
  },
}
</script>

<style scoped lang="scss">
.add_hashtag_dialog {
  position: absolute;
  bottom: -1.5em;
  background-color: white;
  left: 0px;
  z-index: 5;
}
</style>
