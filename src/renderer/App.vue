<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "TweetLightning",
}
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css";

html {
  overflow: auto;
  min-width: auto;
}
.ui-icon {
  line-height: 1;
}
</style>
