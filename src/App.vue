<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LangSelector from './components/LangSelector.vue'

const router = useRouter()
const route  = useRoute()
const { t }  = useI18n()

const slides = [
  { path: '/',                key: 'nav.inici' },
  { path: '/origen',           key: 'nav.origen' },
  { path: '/descubre',        key: 'nav.moodify' },
  { path: '/funcionalidades', key: 'nav.funcionalitats' },
  { path: '/bloom',           key: 'nav.bloom' },
  { path: '/tecnologia',      key: 'nav.tecnologia' },
  { path: '/demo',            key: 'nav.demo' },
]
</script>

<template>
  <div id="center">
    <LangSelector />
    <router-view />

    <nav class="dot-nav">
      <button
        v-for="slide in slides"
        :key="slide.path"
        :class="['dot', { active: route.path === slide.path }]"
        :title="t(slide.key)"
        @click="router.push(slide.path)"
      />
    </nav>
  </div>
</template>

<style scoped>
.dot-nav {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 171, 145, 0.3);
  border-radius: 999px;
  padding: 8px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;

  @media (max-width: 480px) {
    gap: 7px;
    padding: 7px 12px;
    bottom: 14px;
  }
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #d1d5db;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.dot:hover {
  background: var(--accent);
  transform: scale(1.3);
}

.dot.active {
  background: var(--accent-2);
  width: 28px;
  border-radius: 999px;
}
</style>
