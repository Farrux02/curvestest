<template>
  <the-header />
  <main class="main">
    <uploaded-file />
  </main>
</template>

<script>
import { TheHeader } from "@/components";
import { UploadedFile } from "@/pages";
export default {
  components: {
    TheHeader,
    UploadedFile,
  },
};
</script>

<style></style>
