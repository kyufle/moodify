import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PieChart } from 'react-native-gifted-charts';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../user-provider'; 

import questionsData from '../../utils/stress.json'; 
import { getJsonText, getRandomQuestions, processResults } from '../../utils/utils';
import { StaticBottomNavBar } from '../StaticBottomNavBar';
import { ThemedText } from '../themed-text';

const { width } = Dimensions.get('window');

const Stress = ({ navigation }: any) => {
  const {t, i18n } = useTranslation();
  const { userValue } = useContext(UserContext);
  const { unreadCount } = useContext(UserContext);
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

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setSelectedInCurrent(userAnswers[prevIdx] || null);
    } else {
      navigation.goBack();
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
      { name: t('dashboard.relaxed'), val: Number(breakdown.relajado) || 0, color: '#a2cea2' },
      { name: t('dashboard.mild'), val: Number(breakdown.leve) || 0, color: 'rgb(226, 222, 182)' },
      { name: t('dashboard.moderate'), val: Number(breakdown.moderado) || 0, color: '#ccbea1' },
      { name: t('dashboard.high'), val: Number(breakdown.alto) || 0, color: '#dfadad' },
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
      <ScrollView contentContainerStyle={[styles.containerCenter, { paddingVertical: 60 }]}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Feather name="x" size={28} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.title}>{t('survey.actualStress')}</Text>
        
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
              {/* Aquí mostramos la puntuación sobre 40 */}
              <Text style={{fontSize: 28, fontWeight:'bold'}}>{data?.total_score || 0}/40</Text>
              <Text style={{fontSize: 10, color: '#666', letterSpacing: 1, fontWeight: '600'}}>{t('dashboard.totalPoints')}</Text>
            </View>
          )}
        />

        {/* Leyenda Explicativa */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#acdaad' }]} />
            <Text style={styles.legendText}>0-10: {t('dashboard.relaxed')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: 'rgb(240, 235, 190)' }]} />
            <Text style={styles.legendText}>11-20: {t('dashboard.mild')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#dacbac' }]} />
            <Text style={styles.legendText}>21-30:  {t('dashboard.moderate')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#daacac' }]} />
            <Text style={styles.legendText}>31-40: {t('dashboard.high')}</Text>
          </View>
        </View>

        <View style={styles.levelContainer}>
            <Text style={styles.levelLabel}>{t('dashboard.actualState')}</Text>
            <Text style={[styles.levelValue, { color: mainLevel.color }]}>
                {mainLevel.name}
            </Text>
        </View>

        <TouchableOpacity 
          style={[styles.btnSecondaryOutline, { backgroundColor: mainLevel.color }]}
          onPress={startQuiz}
        >
          <Text style={styles.btnSecondaryText}>{t('dashboard.repeatTest')}</Text>
        </TouchableOpacity>
        <StaticBottomNavBar 
            activeTab="home" 
            hasNotifications={unreadCount > 0} 
          />
      </ScrollView>
    );
  }

  if (view === 'QUIZ') {
    const currentQuestion = quizQuestions[currentIndex];
    return (
      <View style={styles.quizWrapper}>
        <ThemedText style={styles.titleView}>{t('survey.stressChart')}</ThemedText>
        <View style={styles.quizHeaderRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Feather name="chevron-left" size={30} color="#333" />
          </TouchableOpacity>
          <View style={styles.storyHeader}>
            {quizQuestions.map((_, i) => (
              <View key={i} style={styles.storySegmentWrapper}>
                <View style={[styles.storySegment, i <= currentIndex && styles.storyActive]} />
              </View>
            ))}
          </View>
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
              <Text style={styles.btnText}>{currentIndex === 9 ? t('survey.seeMyChart') : t('survey.following')}</Text>
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
  titleView: {paddingLeft: 40, paddingTop: 40, fontWeight: 800, fontSize: 20, color:'#acdaad' },
  containerCenter: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 30 },
  closeBtn: { position: 'absolute', top: 60, left: 25 },
  quizWrapper: { flex: 1, backgroundColor: '#fff' },
  quizHeaderRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 20, paddingHorizontal: 15 },
  backBtn: { marginRight: 10 },
  storyHeader: { flexDirection: 'row', flex: 1 },
  storySegmentWrapper: { flex: 1, paddingHorizontal: 1 },
  storySegment: { height: 4, backgroundColor: '#F0F0F0', borderRadius: 2 },
  storyActive: { backgroundColor: '#acdaad' },
  quizContent: { paddingHorizontal: 25, paddingBottom: 40, paddingTop: 20 },
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
  btnSecondaryOutline: { 
    marginTop: 40, 
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  btnSecondaryText: { 
    color: '#FFFFFF',
    fontWeight: 'bold', 
    fontSize: 16 
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  btnCancel: { color: '#AAA', marginTop: 25, fontSize: 15 },
  title: { fontSize: 22, fontWeight: '500', color: '#333', marginBottom: 40 },
  introTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 15, color: '#1A1A1A' },
  introDesc: { textAlign: 'center', color: '#666', marginBottom: 40, lineHeight: 22, fontSize: 16 },
  emoji: { fontSize: 80, marginBottom: 20 },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent:'center',
    marginTop: 25,
    paddingHorizontal: 20,
    gap: 10
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    marginBottom: 5
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  legendText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500'
  }
});

export default Stress;