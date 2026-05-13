<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const langs = ['ca', 'es', 'en']

const setLang = (l) => {
  locale.value = l
  localStorage.setItem('lang', l)
}
</script>

<template>
  <div class="lang-selector">
    <button
      v-for="l in langs"
      :key="l"
      :class="['lang-btn', { active: locale === l }]"
      @click="setLang(l)"
    >
      {{ l.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.lang-selector {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 171, 145, 0.3);
  border-radius: 999px;
  padding: 5px 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 200;
}

.lang-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  padding: 3px 7px;
  border-radius: 999px;
  transition: all 0.2s ease;
  letter-spacing: 0.5px;
}

.lang-btn:hover {
  color: var(--accent-2);
}

.lang-btn.active {
  background: var(--accent-2);
  color: white;
}
</style>
