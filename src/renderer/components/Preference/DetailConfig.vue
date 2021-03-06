<template>
  <div>
    <p class="title is-6 mb-0">詳細設定</p>
    <ul>
      <li>
        <CheckboxInput v-model="localPreference.alwaysOnTop">
          投稿画面を常に最前面に表示
        </CheckboxInput>
      </li>
      <li>
        <CheckboxInput v-model="localPreference.hideAfterPost">
          投稿したらウィンドウを消す
        </CheckboxInput>
      </li>
    </ul>
  </div>
</template>

<script>
import CheckboxInput from "@/components/Common/CheckboxInput.vue"

export default {
  components: {
    CheckboxInput,
  },
  props: {
    preference: {
      type: Object,
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
