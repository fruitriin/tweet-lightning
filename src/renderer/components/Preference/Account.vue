<template>
  <div class="field is-flex">
    <div style="width: 160px">[{{ index + 1 }}] {{ token.user }}</div>
    <div>
      <button class="delete" @click="deleteAccount(index)" />
      <template v-if="isWin">
        <CheckboxInput v-model="localToken.shortcut.Shift" modelKey="">
          Shift
        </CheckboxInput>
        <CheckboxInput v-model="localToken.shortcut.Ctrl" modelKey="">
          Ctrl
        </CheckboxInput>
        <CheckboxInput v-model="localToken.shortcut.Alt" modelKey="Alt">
          Alt
        </CheckboxInput>
      </template>
      <template v-else>
        <CheckboxInput v-model="localToken.shortcut.Super">⌘</CheckboxInput>
        <CheckboxInput v-model="localToken.shortcut.Shift">⇧</CheckboxInput>
        <CheckboxInput v-model="localToken.shortcut.Alt">⌥</CheckboxInput>
        <CheckboxInput v-model="localToken.shortcut.Ctrl">⌃</CheckboxInput>
      </template>
      +
      <input
        v-model="localToken.shortcut.key"
        class="shortcut_key"
        type="text"
        maxlength="1"
        style="ime-mode: disabled"
        @keypress="localToken.shortcut.key = ''"
        @input="localToken.shortcut.key = $event.target.value.toUpperCase()"
      />
    </div>
  </div>
</template>

<script>
import CheckboxInput from "@/components/Common/CheckboxInput.vue"
export default {
  components: {
    CheckboxInput,
  },
  props: {
    token: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    isWin: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      localToken: this.token,
    }
  },
  methods: {
    deleteAccount(index) {
      this.$emit("deleteAccount", index)
    },
  },
}
</script>

<style lang="scss" scoped>
.shortcut_key {
  width: 1.5rem;
}
</style>
