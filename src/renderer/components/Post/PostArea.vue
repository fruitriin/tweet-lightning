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
    <div class="is-flex is-align-items-center is-justify-content-space-between">
      <div class="is-flex is-align-items-center">
        <p class="ml-3" style="width: 3em">{{ localMessage.text.length }}</p>
        <FooterSelector
          :preference="preference"
          @change="changeFooter"
          @changePreference="$emit('changePreference', { preference })"
        />
      </div>
      <div class="is-flex is-align-items-center">
        <plusCircleOutlineIcon
          class="ui-icon mr-3 has-text-primary"
          tabindex="3"
          @click.prevent="expand"
        />
        <input
          v-if="isLast"
          class="button is-primary"
          type="submit"
          tabindex="2"
          :disabled="!postable"
        />
      </div>
    </div>
  </div>
</template>

<script>
import plusCircleOutlineIcon from "vue-material-design-icons/PlusCircleOutline.vue"
import FooterSelector from "@/components/Post/FooterSelector.vue"

export default {
  components: {
    plusCircleOutlineIcon,
    FooterSelector,
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
      default: null,
    },
    isLast: {
      type: Boolean,
      default: true,
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
    async changeFooter({ newValue, oldValue }) {
      this.localMessage.text = this.localMessage.text.replace(
        ` ${oldValue}`,
        ""
      )
      this.localMessage.text = `${this.localMessage.text} ${newValue}`

      const tmpPreference = this.preference
      tmpPreference.currentFooter = newValue
      this.$emit("changePreference", { preference: tmpPreference })

      this.$refs.textarea.focus()
      await this.$nextTick()
      this.$refs.textarea.setSelectionRange(0, 0)
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
