<template>
  <label>
    <input
      v-model="localValue"
      type="radio"
      :value="setValue"
      @change="input"
    />
    <slot />
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    setValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localValue: this.value,
    }
  },
  watch: {
    value() {
      this.localValue = this.value
    },
  },
  methods: {
    input() {
      this.$emit("input", this.localValue)
    },
  },
}
</script>
