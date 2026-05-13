<script setup>
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const router = useRouter()

const volver = () => router.push("/")
</script>

<template>
  <div class="caja">
    <div class="icon-wrapper">
      <i class="pi pi-heart-fill hero-icon"></i>
    </div>

    <h1>{{ t('demo.title') }}</h1>

    <p class="subtitle">{{ t('demo.subtitle') }}</p>

    <button @click="volver" class="btn-primary">
      <i class="pi pi-home"></i>
      {{ t('btn.home') }}
    </button>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  max-width: 560px;
  background: white;
  border-radius: 28px;
  padding: 48px 36px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04);
  animation: fadeIn 0.45s ease;
}

.icon-wrapper {
  width: 90px;
  height: 90px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: #fff7ed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-icon { font-size: 2.5rem; color: #f59e0b; }

h1 {
  font-size: 2.3rem;
  color: #111827;
  font-weight: 700;
  margin-bottom: 18px;
}

.subtitle {
  color: #4b5563;
  font-size: 1.08rem;
  line-height: 1.7;
  margin-bottom: 36px;
}

.message-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-weight: 500;
  margin-bottom: 32px;
}

.message-icon { color: #10b981; font-size: 1.2rem; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .card { padding: 36px 24px; }
  h1 { font-size: 1.9rem; }
  .subtitle { font-size: 1rem; }
}
</style>
