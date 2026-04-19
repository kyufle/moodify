import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PieChart } from 'react-native-gifted-charts';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../user-provider'; 

import questionsData from '../../utils/stress.json'; 
import { getJsonText, getRandomQuestions, processResults } from '../../utils/utils';
import { StaticBottomNavBar } from '../StaticBottomNavBar';

const { width } = Dimensions.get('window');

const Stress = ({ navigation }: any) => {
  const { i18n } = useTranslation();
  const { userValue } = useContext(UserContext);

  const [view, setView] = useState<'LOADING' | 'ROCO' | 'INTRO' | 'QUIZ' | 'CALCULATING'>('LOADING');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [lastResult, setLastResult] = useState<any>(null);
  const [selectedInCurrent, setSelectedInCurrent] = useState<any>(null);

  const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').trim().replace(/\/$/, '') + '/';

  useEffect(() => {
    checkTodayTest();
  }, []);

  const checkTodayTest = async () => {
    if (!userValue?.accessToken) {
      startQuiz(); 
      return;
    }

    try {
      const response = await fetch(`${API_URL}getStatus`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${userValue.accessToken}`,
          'Accept': 'application/json'
        }
      });
      
      const res = await response.json();

      if (res && res.exists) {
        setLastResult(res.data);
        setView('ROCO');
      } else {
        startQuiz();
      }
    } catch (e) {
      console.warn("Error comprobando test previo, saltando al test:", e);
      startQuiz(); 
    }
  };

  const startQuiz = () => {
    const dataArray = questionsData.encuesta_estres_completa;
    setQuizQuestions(getRandomQuestions(dataArray, 10));
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedInCurrent(null);
    setView('QUIZ');
  };

  const handleNext = () => {
    if (!selectedInCurrent) return;
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = selectedInCurrent;
    setUserAnswers(updatedAnswers);

    if (currentIndex < 9) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedInCurrent(updatedAnswers[nextIdx] || null);
    } else {
      saveAndFinish(updatedAnswers);
    }
  };

  const saveAndFinish = async (finalAnswers: any[]) => {
    setView('CALCULATING');
    const results = processResults(finalAnswers);
    
    try {
      const response = await fetch(`${API_URL}store`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userValue.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          total_score: results.total_score,
          breakdown: results.breakdown
        })
      });

      if (response.ok) {
        setLastResult(results);
        setView('ROCO');
      } else {
        throw new Error("Fallo al guardar en DB");
      }
    } catch (e) {
      console.warn("Error de red, mostrando resultado local:", e);
      setLastResult(results);
      setView('ROCO');
    }
  };

  const getMainLevel = (breakdown: any) => {
    if (!breakdown) return { name: "Pendiente", color: "#666" };
    const levels = [
      { name: "Relajado", val: Number(breakdown.relajado) || 0, color: '#acdaad' },
      { name: "Leve", val: Number(breakdown.leve) || 0, color: 'rgb(240, 235, 190)' },
      { name: "Moderado", val: Number(breakdown.moderado) || 0, color: '#dacbac' },
      { name: "Alto", val: Number(breakdown.alto) || 0, color: '#f0bebe' },
    ];
    return levels.sort((a, b) => b.val - a.val)[0];
  };


  if (view === 'LOADING') return <View style={styles.containerCenter}><ActivityIndicator size="large" color="#acdaad" /></View>;

  if (view === 'CALCULATING') return (
    <View style={styles.containerCenter}>
      <ActivityIndicator size="large" color="#acdaad" />
      <Text style={{marginTop: 20}}>Analizando tus respuestas...</Text>
    </View>
  );

  if (view === 'ROCO') {
    const data = lastResult?.data || lastResult;
    const mainLevel = getMainLevel(data?.breakdown);

    return (
      <View style={styles.containerCenter}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Feather name="x" size={28} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Tu Estado de Hoy</Text>
        
        <PieChart
          donut radius={110} innerRadius={85}
          data={[
            { value: Number(data?.breakdown?.relajado) || 0.1, color: '#acdaad' },
            { value: Number(data?.breakdown?.leve) || 0.1, color: 'rgb(240, 235, 190)' },
            { value: Number(data?.breakdown?.moderado) || 0.1, color: '#dacbac' },
            { value: Number(data?.breakdown?.alto) || 0.1, color: '#daacac' },
          ]}
          centerLabelComponent={() => (
            <View style={{alignItems:'center'}}>
              <Text style={{fontSize: 34, fontWeight:'bold'}}>{data?.total_score || 0}</Text>
              <Text style={{fontSize: 12, color: '#666', letterSpacing: 1}}>PUNTOS</Text>
            </View>
          )}
        />

        <View style={styles.levelContainer}>
            <Text style={styles.levelLabel}>Nivel predominante:</Text>
            <Text style={[styles.levelValue, { color: mainLevel.color }]}>
                {mainLevel.name}
            </Text>
        </View>

        <TouchableOpacity style={styles.btnSecondaryOutline} onPress={startQuiz}>
          <Text style={styles.btnSecondaryText}>Repetir análisis</Text>
        </TouchableOpacity>
        <StaticBottomNavBar activeTab="home" />
      </View>
    );
  }

  if (view === 'QUIZ') {
    const currentQuestion = quizQuestions[currentIndex];
    return (
      <View style={styles.quizWrapper}>
        <View style={styles.storyHeader}>
          {quizQuestions.map((_, i) => (
            <View key={i} style={styles.storySegmentWrapper}>
              <View style={[styles.storySegment, i <= currentIndex && styles.storyActive]} />
            </View>
          ))}
        </View>
        <ScrollView contentContainerStyle={styles.quizContent}>
          <Text style={styles.questionText}>{getJsonText(currentQuestion?.pregunta, i18n.language)}</Text>
          <View style={styles.answersList}>
            {currentQuestion?.respuestas.map((resp: any) => (
              <TouchableOpacity 
                key={resp.id} 
                style={[styles.answerCard, selectedInCurrent?.id === resp.id && styles.answerSelected]} 
                onPress={() => setSelectedInCurrent(resp)}
              >
                <Text style={[styles.answerLabel, selectedInCurrent?.id === resp.id && styles.labelSelected]}>
                  {getJsonText(resp.texto, i18n.language)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedInCurrent && (
            <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
              <Text style={styles.btnText}>{currentIndex === 9 ? "Ver mi gráfico" : "Siguiente"}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        <StaticBottomNavBar activeTab="home" />
      </View>
    );
  }

  return <View style={styles.containerCenter}><ActivityIndicator size="large" color="#acdaad" /></View>;
};

const styles = StyleSheet.create({
  containerCenter: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 30 },
  closeBtn: { position: 'absolute', top: 60, right: 25 },
  quizWrapper: { flex: 1, backgroundColor: '#fff' },
  storyHeader: { flexDirection: 'row', paddingTop: 60, paddingHorizontal: 20, marginBottom: 20 },
  storySegmentWrapper: { flex: 1, paddingHorizontal: 2 },
  storySegment: { height: 4, backgroundColor: '#F0F0F0', borderRadius: 2 },
  storyActive: { backgroundColor: '#acdaad' },
  quizContent: { paddingHorizontal: 25, paddingBottom: 40 },
  questionText: { fontSize: 26, fontWeight: 'bold', marginBottom: 40, color: '#1A1A1A', lineHeight: 32 },
  answersList: { gap: 15 },
  answerCard: { backgroundColor: '#F8F9FA', padding: 20, borderRadius: 18, borderWidth: 1, borderColor: '#F0F0F0' },
  answerSelected: { borderColor: '#acdaad', backgroundColor: '#F0F9F1' },
  answerLabel: { fontSize: 17, color: '#444' },
  labelSelected: { color: '#2E7D32', fontWeight: 'bold' },
  levelContainer: { marginTop: 40, alignItems: 'center' },
  levelLabel: { fontSize: 16, color: '#888', marginBottom: 5 },
  levelValue: { fontSize: 36, fontWeight: '900' },
  btnNext: { backgroundColor: '#90b890', paddingVertical: 18, borderRadius: 35, marginTop: 40, alignItems: 'center', elevation: 2 },
  btnPrimary: { backgroundColor: '#acdaad', paddingVertical: 18, paddingHorizontal: 60, borderRadius: 35, marginTop: 20 },
  btnSecondaryOutline: { marginTop: 40, padding: 15 },
  btnSecondaryText: { color: '#90b890', fontWeight: 'bold', fontSize: 15 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  btnCancel: { color: '#AAA', marginTop: 25, fontSize: 15 },
  title: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 40 },
  introTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 15, color: '#1A1A1A' },
  introDesc: { textAlign: 'center', color: '#666', marginBottom: 40, lineHeight: 22, fontSize: 16 },
  emoji: { fontSize: 80, marginBottom: 20 }
});

export default Stress;