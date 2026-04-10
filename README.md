# MOODIFY

> ~ On les teves emocions cobren forma ~

**Autores:**

- Valeria Santana Megía (AWS2)
- Ruth Romero Carretero (AWS2)

**Curs:** AWS2 – Desenvolupament d'Aplicacions Web

---

## 1. L'origen del nom: MOODIFY

El nom neix de la fusió de dos conceptes clau:

- **Mood (Estat d'ànim)**: L'eix central de l'aplicació, que és el registre i la gestió de les emocions i els sentiments diaris.
- **Modify (Modificar / Transformar)**: L'acció directa que voleu que l'usuari faci sobre la seva vida.

**La filosofia darrere el nom**
Tal com indiqueu en el text del projecte, el nom és "literal" perquè l'objectiu és que l'usuari modifiqui tres pilars fonamentals:

1. Els seus hàbits.
2. La seva mentalitat.
3. El seu progrés personal.

## 2. Descripció

**MOODIFY** és una aplicació web interactiva centrada en el benestar emocional i la creació d’hàbits saludables. La plataforma permet als usuaris registrar les seves emocions i pensaments diaris, analitzar la seva evolució mitjançant gràfics dinàmics i establir objectius personals.

A més, incorpora un assistent d’intel·ligència artificial capaç d’oferir suport emocional, recomanacions personalitzades i propostes de millora segons l’estat emocional detectat. L’aplicació també inclou un fòrum comunitari, sistema d’amistats i funcionalitats de gamificació per augmentar la motivació i la constància.

## 3. Motivació

Vivim en una societat amb un ritme accelerat on moltes persones no disposen d’un espai segur per expressar els seus sentiments. MOODIFY neix amb l’objectiu de proporcionar un entorn digital segur, privat i motivador on els usuaris puguin:

- Reflexionar sobre les seves emocions.
- Desenvolupar consciència emocional.
- Millorar els seus hàbits.
- Sentir-se part d’una comunitat.

També té una possible sortida professional dins del sector del benestar digital i aplicacions enfocades a la salut mental.

## 4. Funcionalitats Principals

- **Sistema d’usuaris**: Registre i login, perfil personal, racha de felicitat visible per amics, sistema d’amistats.
- **Diari emocional**: Apartat per escriure emocions i pensaments, selector d’emocions diàries, historial emocional.
- **Gràfics d’evolució**: Gràfic setmanal, mensual, estadístiques de millora, percentatge de compliment d’hàbits.
- **Sistema d’hàbits**: Crear hàbits personalitzats, seguiment diari, recompenses visuals, missatges motivacionals automàtics.
- **Fòrum comunitari**: Publicacions, comentaris, moderació per part de les administradores, notícies del staff.
- **Chat IA integrat**: Assistent emocional, respostes motivacionals, suggeriments d’hàbits, reflexions positives.
- **Sistema de notificacions**: Recordatori diari, resum emocional mensual (cron), avisos de millora o recaigudes.

## 5. Tecnologies Utilitzades (Actualitzades segons el codi)

A diferència del plantejament inicial, el desenvolupament actual del **Frontend s'ha realitzat amb Vue.js 3 i Vite**, utilitzant CSS Vanilla per a dissenys moderns (Glassmorphism):

- **Frontend:** Vue.js 3 (Composition API), Vite, Vue Router para navegació SPA (Single Page Application).
- **Estils i UI:** CSS Vanilla (Glassmorphism, gradients, animacions interactives) i PrimeIcons per a la iconografia.
- **Servidor Web:** Apache (amb mòdul `mod_rewrite` per reescritura de rutes i suport SPA).
- **Backend previst:** PHP (API REST).
- **Base de dades prevista:** MySQL.
- **IA:** Integració mitjançant API externa.
- **Altres:** Cron Jobs per a tasques automatitzades.

## 6. Descripció de la investigació

Durant el projecte s'han d'investigar assumptes clau:

- **Integració d’IA en aplicacions web**: Entendre el funcionament d’una IA aplicada a mantenir converses fluides, usar APIs i entrenar-la.
- **Gestió de dades emocionals**: Protocols rigorosos, seguretat i encriptació per a dades extremadament sensibles.
- **Visualització de dades**: Ús de llibreries de gràfics per a representar dades de manera interactiva.
- **Gamificació**: Integrar maneres d'incentivar a l'usuari amb recompensas.
- **Arquitectura de Software**: Structurar el projecte Vue + PHP perquè sigui mantenible, escalable i eficient.

## 7. Material necessari (Hardware / Software)

**Hardware:**

- Ordinadors personals per al desenvolupament.
- Servidor web (Apache instal·lat actualment).
- Dispositius mòbils per proves i escaneig de QR.

**Software:**

- IDE de desenvolupament: Visual Studio Code.
- Frontend: Vue.js, Node.js + NPM, Vite.
- Backend i Base de dades: PHP, MySQL (via XAMPP/LAMP).
- Utilitats i disseny: PrimeIcons, APIs de IA.

## 8. Possibles dificultats

- **Complexitat tècnica:** S'haurà de garantir la integració de la IA, el desenvolupament de gràfics dinàmics i una sincronització fluida backend/frontend.
- **Seguretat i dades:** Protocol·litzar estrictament la privacitat i la integritat de la informació dels usuaris.
- **Gestió i escalabilitat:** Moderació efectiva del fòrum i disseny de l'arquitectura de programari i de la base de dades.
