<template>
  <div class="content container uploaded-file">
    <div class="backward-btn-wrapper">
      <button class="backward-btn">
        <a href="#">
          <img src="@/assets/backward-icon.svg" alt="backward icon" />
          <p>На главную</p>
        </a>
      </button>
    </div>
    <p v-if="!fileInfo">Загрузка...</p>
    <div class="uploaded-file-wrapper" v-else>
      <div class="uploaded-file-left">
        <text-block :heading="fileInfo?.fileName">
          <template #body>
            <div class="uploaded-file__file-info">
              <p>
                {{
                  DateTime.fromISO(fileInfo?.uploadAt).toFormat("dd.mm.yyyy")
                }}
              </p>
              <p>{{ sizeChange(fileInfo?.fileSize) }}</p>
              <p>{{ timeChange(fileInfo?.duration) }}</p>
              <p>{{ fileInfo?.type }}</p>
            </div>
          </template>
        </text-block>
        <text-block
          :heading="'О чём файл?'"
          :copy="true"
          @copyText="copyText(fileInfo?.summary)"
        >
          <template #body>
            <div class="uploaded-file__summary">
              <p>{{ fileInfo?.summary }}</p>
            </div>
          </template>
        </text-block>
        <text-block
          :heading="'Краткое содержание текста'"
          :copy="true"
          :download="true"
          :showFooter="true"
          :bodyClass="['uploaded-file__scripts-wrapper']"
          @copyText="copyText(fileInfo?.summaryScript)"
          @downloadText="downloadText(fileInfo?.summaryScript)"
        >
          <template #body>
            <div
              class="uploaded-file__script"
              v-for="text in fileInfo?.summaryScript"
              :key="text"
            >
              <p class="uploaded-file__script__time">
                {{ timeChange(text?.start) }}
              </p>
              <p
                class="uploaded-file__script__text"
                @mouseenter="highlightText($event, text?.text)"
              >
                {{ text?.text }}
              </p>
            </div>
          </template>
        </text-block>
        <text-block
          :heading="'Полная расшифровка текста'"
          :copy="true"
          :download="true"
          :showFooter="true"
          :bodyClass="['uploaded-file__scripts-wrapper']"
          @copyText="copyText(fileInfo?.script)"
          @downloadText="downloadText(fileInfo?.script)"
        >
          <template #body>
            <div
              class="uploaded-file__script"
              v-for="(text, i) in fileInfo?.script"
              :key="text"
            >
              <p
                class="uploaded-file__script__speaker"
                v-if="fileInfo?.script[i - 1]?.speaker !== text?.speaker"
              >
                Спикер {{ text?.speaker }}
              </p>
              <div>
                <p class="uploaded-file__script__time">
                  {{ timeChange(text?.start) }}
                </p>
                <p
                  class="uploaded-file__script__text"
                  @mouseenter="highlightText($event, text?.text)"
                  ref="highlightTag"
                  :currentText="
                    videoCurrentTime >= text?.start &&
                    videoCurrentTime < fileInfo?.script[i + 1]?.start
                  "
                >
                  {{ text?.text }}
                </p>
              </div>
            </div>
          </template>
        </text-block>
      </div>
      <div class="uploaded-file-right">
        <video
          controls
          class="uploaded-file-right__video"
          :src="baseUrl + fileInfo?.fileSrc"
          ref="video"
          @timeupdate="getVideoCurrentTime"
          @play="videoPlaying = true"
          @pause="videoPlaying = false"
        ></video>
      </div>
    </div>
    <TheMessage
      v-if="showMessage"
      :classList="!showMessage && 'message-close'"
      :text="'Текст успешно скопирован'"
      @closeMessage="showMessage = false"
    />
  </div>
</template>

<script>
import { TextBlock } from "@/components";
import getFileInfo from "./api/get-file-info.api";
import { onBeforeMount, ref, watch } from "vue";
import { DateTime } from "luxon";
import { sizeChange, timeChange } from "@/shared/helpers";
import { TheMessage } from "@/shared/UI";
import "./style/uploaded-file.css";

export default {
  components: {
    TextBlock,
    TheMessage,
  },
  setup() {
    const fileInfo = ref(null);
    const loading = ref(false);

    const saveFileInfo = async () => {
      const response = await getFileInfo();
      fileInfo.value = response.data;
    };

    onBeforeMount(async () => {
      await saveFileInfo()
        .then(() => (loading.value = true))
        .finally(() => (loading.value = false));
    });

    watch(loading, (val) => console.log(val));

    const baseUrl = process.env.VUE_APP_BASE_URL;

    const showMessage = ref(false);

    const copyText = (text) => {
      if (Array.isArray(text)) {
        const textArr = text.map((text) => text?.text);
        navigator.clipboard
          .writeText(textArr.join(" "))
          .then(() => (showMessage.value = true));
      } else {
        navigator.clipboard.writeText(text).then(() => console.log("copied"));
      }
    };

    const downloadText = (text) => {
      let textToDownload;
      if (Array.isArray(text)) {
        const textArr = text.map((text) => text?.text);
        textToDownload = textArr.join(" ");
      } else {
        textToDownload = text;
      }

      const downloadLink = document.createElement("a");
      downloadLink.href =
        "data:text/plain;charset=utf-8," + encodeURIComponent(textToDownload);
      downloadLink.download = "file.txt";
      downloadLink.click();
    };

    const video = ref(null);
    const highlightTag = ref(null);
    const videoCurrentTime = ref(0);

    const videoPlaying = ref(false);

    const highlightText = (e, text) => {
      const textForHighlight = text.split(/([,.])/g);
      const highlightedText = textForHighlight
        .map((text) => `<span class="highlightable">${text}</span>`)
        .join("");
      e.target.innerHTML = highlightedText;
      const highlightableWords = document.querySelectorAll(".highlightable");

      highlightableWords.forEach((word) => {
        word.addEventListener("mouseover", function () {
          word.classList.add("highlight");
        });

        word.addEventListener("mouseout", function () {
          word.classList.remove("highlight");
        });
      });
    };

    const getVideoCurrentTime = () => {
      videoCurrentTime.value = video.value.currentTime;
    };
    watch(videoPlaying, (val) => {
      if (val === true) {
        watch(videoCurrentTime, () => {
          let tag = document.querySelector('[currenttext="true"]');
          if (tag) {
            const textForHighlight = tag.innerText.split(/([,.])/g);
            const highlightedText = textForHighlight
              .map((text) => `<span class="highlightable">${text}</span>`)
              .join("");
            tag.innerHTML = highlightedText;
            const highlightableWords =
              document.querySelectorAll(".highlightable");
            let i = 0;
            setInterval(() => {
              highlightableWords[i].classList.add("highlight-green");
              highlightableWords[i - 1] &&
                highlightableWords[i - 1].classList.remove("highlight-green");
              i += 1;
            }, 1000);
          }
        });
      }
    });

    return {
      fileInfo,
      DateTime,
      sizeChange,
      timeChange,
      baseUrl,
      copyText,
      downloadText,
      highlightText,
      video,
      getVideoCurrentTime,
      videoPlaying,
      highlightTag,
      videoCurrentTime,
      showMessage,
      loading,
    };
  },
};
</script>

<style>
.highlight {
  background-color: var(--beige-color);
  padding: 2px 6px;
  border-radius: 72px;
  transition: all 0.1s;
}
.highlight-green {
  background-color: var(--green-color);
  padding: 2px 6px;
  border-radius: 72px;
  transition: all 0.1s;
}
</style>
