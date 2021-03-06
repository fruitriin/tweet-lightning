<template>
  <label class="checkbox">
    <input
      v-model="localValue"
      class="checkbox"
      type="checkbox"
      @change="input"
    />
    <slot />
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      localValue: this.value,
    }
  },
  methods: {
    input() {
      this.$emit("input", this.localValue)
    },
  },
}
</script>
