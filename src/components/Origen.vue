<script setup>
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const router = useRouter()
const anterior  = () => router.push("/")
const siguiente = () => router.push("/descubre")
</script>

<template>
  <div class="caja">

    <div class="dos-col">

      <!-- PROBLEMA -->
      <div class="bloque problema">
        <div class="bloque-icon">⚠️</div>
        <h2>{{ t('equip.problema_title') }}</h2>
        <div class="stat">
          <span class="stat-num">1 de cada 4</span>
          <span class="stat-label">{{ t('equip.problema_stat') }}</span>
        </div>
        <p>{{ t('equip.problema_desc') }}</p>
      </div>

      <!-- ORIGEN -->
      <div class="bloque origen">
        <div class="bloque-icon">💡</div>
        <h2>{{ t('equip.origen_title') }}</h2>
        <p>{{ t('equip.origen_desc') }}</p>
        <span class="who">{{ t('equip.origen_who') }}</span>
      </div>

    </div>

    <div class="button-group">
      <button @click="anterior" class="btn-primary">
        <i class="pi pi-arrow-left"></i> {{ t('btn.back') }}
      </button>
      <button @click="siguiente" class="btn-primary">
        {{ t('btn.next_equip') }} <i class="pi pi-arrow-right"></i>
      </button>
    </div>

  </div>
</template>

<style scoped>
.dos-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
}

@media (max-width: 600px) {
  .dos-col { grid-template-columns: 1fr; }
}

.bloque {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 24px;
  border-radius: 20px;
  text-align: center;
}

.bloque.problema {
  background: linear-gradient(135deg, rgba(255,171,145,0.15), rgba(255,204,188,0.2));
  border: 1px solid rgba(255,171,145,0.4);
}

.bloque.origen {
  background: linear-gradient(135deg, rgba(230,230,250,0.2), rgba(158,158,201,0.15));
  border: 1px solid rgba(158,158,201,0.35);
}

.bloque-icon {
  font-size: 2rem;
  line-height: 1;
}

h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

p {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  padding: 10px 18px;
  border: 1px solid rgba(255,171,145,0.3);
  width: 100%;
}

.stat-num {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--accent-2);
  letter-spacing: -1px;
}

.stat-label {
  font-size: 0.78rem;
  color: #6b7280;
}

.who {
  font-size: 0.75rem;
  color: #9ca3af;
  font-style: italic;
  margin-top: auto;
  padding-top: 4px;
}
</style>
