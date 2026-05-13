<script setup>
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const router = useRouter()
const siguiente = () => router.push("/funcionalidades")
const anterior  = () => router.push("/origen")
</script>

<template>
  <div class="caja">

    <p class="section-label">{{ t('descubre.etim_label') }}</p>

    <div class="etimologia">
      <div class="etim-block mood">
        <span class="etim-word">Mood</span>
        <span class="etim-def">{{ t('descubre.mood_def') }}</span>
      </div>
      <span class="etim-op">+</span>
      <div class="etim-block modify">
        <span class="etim-word">Modify</span>
        <span class="etim-def">{{ t('descubre.modify_def') }}</span>
      </div>
      <span class="etim-op">=</span>
      <div class="etim-block result">
        <span class="etim-word">MOODIFY</span>
        <span class="etim-def">{{ t('descubre.result_def') }}</span>
      </div>
    </div>

    <p class="section-label">{{ t('descubre.pilars_label') }}</p>

    <div class="pilars-grid">
      <div class="pilar">
        <span class="pilar-emoji">🧠</span>
        <strong>{{ t('descubre.p1') }}</strong>
        <span>{{ t('descubre.p1_desc') }}</span>
      </div>
      <div class="pilar">
        <span class="pilar-emoji">🔁</span>
        <strong>{{ t('descubre.p2') }}</strong>
        <span>{{ t('descubre.p2_desc') }}</span>
      </div>
      <div class="pilar">
        <span class="pilar-emoji">📈</span>
        <strong>{{ t('descubre.p3') }}</strong>
        <span>{{ t('descubre.p3_desc') }}</span>
      </div>
    </div>

    <div class="button-group">
      <button @click="anterior" class="btn-primary">
        <i class="pi pi-arrow-left"></i> {{ t('btn.back') }}
      </button>
      <button @click="siguiente" class="btn-primary">
        {{ t('btn.next_func') }} <i class="pi pi-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>

.section-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--accent-2);
  opacity: 0.7;
  margin: 0;
}

.etimologia {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.etim-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border-radius: 14px;
  min-width: 90px;
}

.etim-block.mood   { background: linear-gradient(135deg, #d6eaf8, #aed6f1); border: 1px solid #93c5fd; }
.etim-block.modify { background: linear-gradient(135deg, #ede9fe, #ddd6fe); border: 1px solid #a78bfa; }
.etim-block.result { background: linear-gradient(135deg, #ffab91, #ffccbc); border: 1px solid var(--accent-border); }

.etim-word {
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5px;
}

.etim-def {
  font-size: 0.72rem;
  color: #6b7280;
}

.etim-op {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d1d5db;
}

.pilars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 8px;
}

@media (max-width: 520px) {
  .pilars-grid { grid-template-columns: 1fr; }
  .etimologia  { gap: 6px; }
}

.pilar {
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(255,171,145,0.25);
  padding: 18px 12px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: transform 0.3s ease;
}

.pilar:hover { transform: translateY(-5px); }

.pilar-emoji { font-size: 1.9rem; line-height: 1; }
.pilar strong { font-size: 1rem; color: #111827; }
.pilar span   { font-size: 0.78rem; color: #6b7280; text-align: center; line-height: 1.4; }
</style>
