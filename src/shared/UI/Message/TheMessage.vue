<template>
  <div :class="['message', classList]">
    <p>{{ text }}</p>
    <button @click="closeMessage">
      <img src="@/assets/close-icon.svg" alt="close-icon" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
      default: "Message",
    },
    classList: {
      type: String,
      required: true,
      default: null,
    },
  },
  emits: ["closeMessage"],
  setup(_, { emit }) {
    const closeMessage = () => emit("closeMessage");

    return {
      closeMessage,
    };
  },
};
</script>

<style lang="scss">
.message {
  position: fixed;
  padding: 20px;
  border-radius: 12px;
  background: var(--black-color);
  bottom: -100px;
  right: 100px;
  animation: showMessage 0.3s forwards;
  display: flex;
  align-items: center;
  column-gap: 10px;
  button {
    border: none;
    background: transparent;
    width: 24px;
    height: 24px;
  }
  p {
    color: var(--white, #fff);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 137.5% */
  }
}

.message-close {
  animation: hideMessage 0.3s forwards;
}

@keyframes showMessage {
  from {
    bottom: -100px;
  }
  to {
    bottom: 33px;
  }
}
@keyframes hideMessage {
  from {
    bottom: 33px;
  }
  to {
    bottom: -100px;
  }
}
</style>
