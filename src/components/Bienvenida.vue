<script setup>
import "primeicons/primeicons.css";
import { useRouter } from 'vue-router';

const mensaje = " MOODIFY";
const router = useRouter();

const irADescubre = () => {
  router.push('/descubre');
};
</script>

<template>
  <div class="caja">
    <h2>{{ mensaje }}</h2>
    <p>
      Bienvenido a la presentación de la nueva app con la que podrás controlar y
      mejorar tus hábitos.
    </p>

    <button @click="irADescubre" class="shadow__btn">
      Descubre más <i class="pi pi-arrow-right"></i>
    </button>
  </div>
</template>

<style scoped>
.caja {
  border: 2px solid var(--accent-border);
  padding: 40px;
  border-radius: 24px;
  max-width: 550px;
  width: 90%;
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-align: center;
  box-shadow: var(--shadow);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  margin-top: 20px;
}

.caja:hover {
  transform: translateY(-8px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

h2 {
  color: #111827;
  font-size: 3.5rem;
  margin-bottom: 24px;
  letter-spacing: -2px;
  font-weight: 700;
}

p {
  color: #374151;
  font-size: 1.2rem;
  line-height: 1.6;
  font-weight: 500;
}

.shadow__btn {
  margin-top: 60px;
  margin-bottom: 20px;
  padding: 10px 20px;
  border: none;
  font-size: 17px;
  color: #fff;
  border-radius: 7px;
  letter-spacing: 4px;
  font-weight: 700;
  text-transform: uppercase;
  transition: 0.5s;
  transition-property: box-shadow;
}

.shadow__btn {
  background: rgb(250, 131, 230);
  box-shadow: 0 0 25px rgb(250, 131, 230);
}

.shadow__btn:hover {
  box-shadow:
    0 0 5px rgb(250, 131, 230),
    0 0 25px rgb(250, 131, 230),
    0 0 50px rgb(250, 131, 230),
    0 0 100px rgb(250, 131, 230);
}
</style>
