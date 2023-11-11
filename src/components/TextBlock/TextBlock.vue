<template>
  <div class="text-block">
    <header class="text-block-header">
      <div class="text-block-header__left">
        <h2 class="text-block-header__left__heading">{{ heading }}</h2>
      </div>
      <div class="text-block-header__right" v-if="download || copy">
        <button
          class="text-block-header__right__btn text-block-header__right__btn-download"
          v-if="download"
          @click="downloadText"
        >
          <img src="@/assets/download-icon.svg" alt="download icon" />
        </button>
        <button
          class="text-block-header__right__btn text-block-header__right__btn-copy"
          v-if="copy"
          @click="copyText"
        >
          <img src="@/assets/copy-icon.svg" alt="copy icon" />
        </button>
      </div>
    </header>
    <main
      :class="[
        bodyClass,
        {
          'text-block__scripts-wrapper--short': !moreInfo && showFooter,
        },
        {
          'text-block__scripts-wrapper--full': moreInfo && showFooter,
        },
      ]"
    >
      <slot name="body" />
    </main>
    <footer v-if="showFooter" class="text-block-footer">
      <button @click="moreInfo = !moreInfo" class="text-block-footer__btn">
        {{ moreInfo ? "Свернуть" : "Развернуть" }}
      </button>
    </footer>
  </div>
</template>
<script>
import { ref } from "vue";
import "./style/text-block.css";

export default {
  props: {
    copy: {
      type: Boolean,
      default: false,
      required: false,
    },
    download: {
      type: Boolean,
      default: false,
      required: false,
    },
    showFooter: {
      type: Boolean,
      default: false,
      required: false,
    },
    heading: {
      type: String,
      default: "Заголовок",
      required: true,
    },
    bodyClass: {
      type: String,
      default: null,
      required: false,
    },
  },
  emits: ["copyText", "downloadText"],
  setup(_, { emit }) {
    const moreInfo = ref(false);

    const copyText = () => {
      emit("copyText");
    };
    const downloadText = () => {
      emit("downloadText");
    };

    return {
      moreInfo,
      copyText,
      downloadText
    };
  },
};
</script>

<style></style>
