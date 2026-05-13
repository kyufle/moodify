<script setup>
import { useRouter } from "vue-router"
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const router = useRouter()

const siguiente = () => router.push("/tecnologia")
const anterior  = () => router.push("/funcionalidades")

const messages = computed(() => [
  { from: "user",  text: t('bloom.m1u') },
  { from: "bloom", text: t('bloom.m1b') },
  { from: "user",  text: t('bloom.m2u') },
  { from: "bloom", text: t('bloom.m2b') },
])

const visibleCount = ref(0)
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    if (visibleCount.value < messages.value.length) {
      visibleCount.value++
    } else {
      visibleCount.value = 0
    }
  }, 2500)
})

onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="caja-bloom">
    <div class="bloom-header">
      <div class="bloom-avatar">🌸</div>
      <div class="bloom-info">
        <strong>Bloom</strong>
        <span>{{ t('bloom.role') }}</span>
      </div>
      <div class="bloom-status">
        <span class="dot"></span> {{ t('bloom.online') }}
      </div>
    </div>

    <div class="chat-window">
      <TransitionGroup name="msg">
        <div
          v-for="(msg, i) in messages.slice(0, visibleCount)"
          :key="i"
          :class="['bubble-row', msg.from]"
        >
          <div v-if="msg.from === 'bloom'" class="mini-avatar">🌸</div>
          <div :class="['bubble', msg.from]">{{ msg.text }}</div>
        </div>
      </TransitionGroup>

      <div v-if="visibleCount > 0 && visibleCount < messages.length" class="typing">
        <span></span><span></span><span></span>
      </div>
    </div>

    <p class="tagline">
      {{ t('bloom.tagline') }}
    </p>

    <div class="button-group">
      <button @click="anterior" class="btn-primary">
        <i class="pi pi-arrow-left"></i> {{ t('btn.back') }}
      </button>
      <button @click="siguiente" class="btn-primary">
        {{ t('btn.next_tech') }} <i class="pi pi-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.caja-bloom {
  border: 2px solid var(--accent-border);
  padding: 36px 40px;
  border-radius: 24px;
  max-width: 620px;
  width: 90%;
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-align: center;
  box-shadow: var(--shadow);
  margin-top: 40px;
  margin-bottom: 40px;
}

.bloom-header {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(255,171,145,0.25), rgba(230,230,250,0.3));
  border-radius: 16px;
  padding: 14px 18px;
  margin-bottom: 20px;
  text-align: left;
}

.bloom-avatar { font-size: 2.2rem; line-height: 1; }

.bloom-info { display: flex; flex-direction: column; flex: 1; }
.bloom-info strong { font-size: 1.1rem; color: #111827; }
.bloom-info span   { font-size: 0.8rem; color: #6b7280; }

.bloom-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #16a34a;
  font-weight: 600;
}

.dot {
  width: 8px;
  height: 8px;
  background: #16a34a;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.chat-window {
  background: rgba(255,255,255,0.5);
  border-radius: 16px;
  padding: 16px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  margin-bottom: 16px;
  border: 1px solid rgba(255,171,145,0.2);
}

.bubble-row { display: flex; align-items: flex-end; gap: 8px; }
.bubble-row.user { flex-direction: row-reverse; }

.mini-avatar { font-size: 1.3rem; flex-shrink: 0; }

.bubble {
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 0.92rem;
  line-height: 1.5;
  color: #1f2937;
}

.bubble.bloom {
  background: linear-gradient(135deg, rgba(255,171,145,0.3), rgba(230,230,250,0.4));
  border-bottom-left-radius: 4px;
  border: 1px solid rgba(255,171,145,0.3);
}

.bubble.user {
  background: linear-gradient(135deg, #9e9ec9, #b8b8e0);
  color: white;
  border-bottom-right-radius: 4px;
}

.typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 14px;
  background: linear-gradient(135deg, rgba(255,171,145,0.2), rgba(230,230,250,0.3));
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  width: fit-content;
  border: 1px solid rgba(255,171,145,0.2);
}

.typing span {
  width: 7px;
  height: 7px;
  background: #9e9ec9;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}

.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30%           { transform: translateY(-6px); }
}

.msg-enter-active { transition: all 0.4s ease; }
.msg-enter-from   { opacity: 0; transform: translateY(10px); }

.tagline {
  font-size: 0.78rem;
  color: #4b5563;
  margin-bottom: 4px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 6px 12px;
  display: inline-block;
}
</style>
