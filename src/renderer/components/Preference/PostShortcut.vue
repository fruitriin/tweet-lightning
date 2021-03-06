<template>
  <div>
    <p class="title is-6 mb-0">投稿ショートカット</p>
    <ul>
      <li>
        <RadioInput v-model="localPreference.postShortcut" setValue="shift">
          Shift + Enter
        </RadioInput>
      </li>
      <li>
        <RadioInput v-model="localPreference.postShortcut" setValue="ctrl">
          Ctrl + Enter
        </RadioInput>
      </li>
      <li v-if="!isWin">
        <RadioInput v-model="localPreference.postShortcut" setValue="meta">
          Cmd + Enter
        </RadioInput>
      </li>
    </ul>
  </div>
</template>

<script>
import RadioInput from "@/components/Common/RadioInput.vue"
export default {
  components: {
    RadioInput,
  },
  props: {
    preference: {
      type: Object,
      required: true,
    },
    isWin: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      localPreference: this.preference,
    }
  },
}
</script>
