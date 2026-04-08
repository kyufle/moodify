<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const volver = () => {
  router.push("/funcionalidades");
};
</script>

<template>
  <div class="caja-descubre">
    <img
      src="/home/super/.gemini/antigravity/brain/f17f18b2-492f-4a11-976a-51213d9f3ba5/descubre_page_image_1775669686447.png"
      alt="Descubrimiento"
      class="imagen-premium"
    />
    <h1>Descubre tu potencial</h1>
    <p>
      Aquí es donde comienza tu viaje. Con Moodify, podrás registrar cada paso
      hacia tus metas y entender mejor tus patrones de comportamiento.
    </p>
    <button @click="volver" class="btn-volver">
      <i class="pi pi-arrow-left"></i>Sigue descubriendo cosas
    </button>
  </div>
</template>

<style scoped>
.caja-descubre {
  border: 2px solid var(--accent-border);
  padding: 40px;
  border-radius: 24px;
  max-width: 650px;
  width: 50%;
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-align: center;
  box-shadow: var(--shadow);
  margin-top: 40px;
  margin-bottom: 40px;
}

.imagen-premium {
  width: 50%;
  height: auto;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #111827;
  font-size: 2.5rem;
  margin-bottom: 16px;
}

p {
  color: #374151;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

.btn-volver {
  padding: 12px 24px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.btn-volver:hover {
  transform: scale(1.05);
}
</style>
