<template>
  <div class="filed post_area">
    <textarea
      ref="textarea"
      v-model="localMessage.text"
      class="textarea has-fixed-size mb-2"
      tabindex="1"
      rows="3"
      @submit.prevent="submitAll"
      @keydown.ctrl.enter="ctrlSubmit"
      @keydown.shift.enter="shiftSubmit"
      @keydown.meta.enter="metaSubmit"
    />
    <button
      v-if="index > 0"
      class="delete close_button"
      @click.prevent="contract(index)"
    />
    <div class="is-flex is-align-items-center is-justify-content-flex-end">
      <p class="mr-3">{{ localMessage.length }}</p>
      <plusCircleOutlineIcon
        class="ui-icon mr-3 has-text-primary"
        tabindex="3"
        @click.prevent="expand"
      />
      <input
        class="button is-primary"
        type="submit"
        tabindex="2"
        :disabled="!postable"
      />
    </div>
  </div>
</template>

<script>
import plusCircleOutlineIcon from "vue-material-design-icons/PlusCircleOutline.vue"
export default {
  components: {
    plusCircleOutlineIcon,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    postable: {
      type: Boolean,
      default: true,
    },
    index: {
      type: Number,
      required: true,
    },
    preference: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localMessage: this.message,
    }
  },
  watch: {
    message() {
      this.localMessage = this.message
    },
  },
  methods: {
    expand() {
      this.$emit("expand")
    },
    contract(i) {
      this.$emit("contract", i)
    },

    shiftSubmit(event) {
      if (this.preference.postShortcut !== "shift") return
      this.submitAll()
      // Shift+Enterで改行しない
      event.returnValue = false
    },
    ctrlSubmit() {
      if (this.preference.postShortcut !== "ctrl") return
      this.submitAll()
    },
    metaSubmit() {
      if (this.preference.postShortcut !== "meta") return
      this.submitAll()
    },
    submitAll() {
      if (!this.postable) return

      this.$emit("submit")
    },
  },
}
</script>

<style scoped lang="scss">
.post_area {
  position: relative;

  .close_button {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    z-index: 1;
  }
}
</style>
