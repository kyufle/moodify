<script setup>
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const router = useRouter()

const volver = () => router.push("/")
</script>

<template>
  <div class="caja">

    <div class="live-badge">
      <span class="live-dot"></span>
      {{ t('demo.badge') }}
    </div>

    <div class="phone-icon">📱</div>

    <h1>{{ t('demo.title') }}</h1>
    <p class="subtitle">{{ t('demo.subtitle') }}</p>

    <button @click="volver" class="btn-primary">
      <i class="pi pi-home"></i> {{ t('demo.home') }}
    </button>

  </div>
</template>

<style scoped>
.caja {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

h1 {
  margin: 0;
  font-size: 2.2rem;
}

.subtitle {
  margin: 0;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 999px;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #dc2626;
  border-radius: 50%;
  animation: pulse 1.2s infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.8); }
}

.phone-icon {
  font-size: 4rem;
  line-height: 1;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}

h1 {
  color: #111827;
  font-weight: 700;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
}

</style>
