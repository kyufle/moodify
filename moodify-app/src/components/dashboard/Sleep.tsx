import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform, TextInput, Alert } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { DashboardBackground } from './DashboardBackground';
import { StaticBottomNavBar } from '../StaticBottomNavBar';
import { ThemedText } from '../themed-text';
import { UserContext } from '../user-provider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SVG_SIZE = SCREEN_WIDTH * 0.65;
const STROKE_WIDTH = 25;
const PADDING_SVG = 10;
const RADIUS = (SVG_SIZE - STROKE_WIDTH - PADDING_SVG * 2) / 2;
const CENTER = SVG_SIZE / 2;
const HANDLER_RADIUS = 24;

export const Sleep = ({ onBack }: { onBack: () => void }) => {
  const { userValue } = useContext(UserContext);

  const [startAngle, setStartAngle] = useState(0);
  const [endAngle, setEndAngle] = useState((6 / 24) * (2 * Math.PI));
  const [startTimeText, setStartTimeText] = useState("00:00");
  const [endTimeText, setEndTimeText] = useState("06:00");

  const isInitialLoad = useRef(true);
  const svgRef = useRef<View>(null);
  const [svgLayout, setSvgLayout] = useState({ x: 0, y: 0 });

  if (!userValue?.user) return null;

  useEffect(() => {
    async function putHours() {
      try {
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL+'fillInHours', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + userValue.accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          if (data && data.start_time && data.end_time) {
            const start = data.start_time.split(' ')[1].substring(0, 5);
            const end = data.end_time.split(' ')[1].substring(0, 5);

            setStartTimeText(start);
            setEndTimeText(end);
            validateAndSetFullTime(start, true);
            validateAndSetFullTime(end, false);
          }
        }
      } catch (e) {
        console.log("Error cargando horas iniciales:", e);
      } finally {
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 500);
      }
    }
    putHours();
  }, []);

  useEffect(() => {
    if (!isInitialLoad.current) {
      setStartTimeText(angleToTime(startAngle));
    }
  }, [startAngle]);

  useEffect(() => {
    if (!isInitialLoad.current) {
      setEndTimeText(angleToTime(endAngle));
    }
  }, [endAngle]);

  const onLayout = () => {
    svgRef.current?.measureInWindow((x, y) => {
      setSvgLayout({ x, y });
    });
  };

  const handleTimeChange = (text: string, setter: (val: string) => void) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    setter(formatted);
  };

  const isTimeValid = (timeStr: string) => {
    const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return regex.test(timeStr);
  };

  const handleSave = async () => {
    if (!isTimeValid(startTimeText) || !isTimeValid(endTimeText)) {
      Alert.alert("Formato incorrecto", "Asegúrate de que las horas sean válidas.");
      return;
    }

    try {
      const now = new Date();
      
      const toLocalMySQL = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };

      let startDate = new Date();
      let endDate = new Date();
      const [hStart, mStart] = startTimeText.split(':').map(Number);
      const [hEnd, mEnd] = endTimeText.split(':').map(Number);

      startDate.setHours(hStart, mStart, 0, 0);
      endDate.setHours(hEnd, mEnd, 0, 0);

      if (startDate > endDate) {
        startDate.setDate(endDate.getDate() - 1);
      }

      const register = {
        date: now.toISOString().split('T')[0],
        start_time: toLocalMySQL(startDate), 
        end_time: toLocalMySQL(endDate),
        total_minutes: totalDiffMinutes,
      };

      const response = await fetch(process.env.EXPO_PUBLIC_API_URL+'saveSleepLog', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + userValue.accessToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(register),
      });

      if (response.ok) {
        Alert.alert("Éxito", "Registro de sueño sincronizado.");
      } else {
        throw new Error("Error al guardar");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el registro.");
    }
  };

  const validateAndSetFullTime = (inputValue: string, isStart: boolean) => {
    let [hours, minutes] = inputValue.split(':');
    hours = (hours || "00").padStart(2, '0');
    minutes = (minutes || "00").padEnd(2, '0');
    const hNum = parseInt(hours, 10);
    const mNum = parseInt(minutes, 10);

    if (hNum > 23 || mNum > 59) return;

    const totalHours = hNum + (mNum / 60);
    const newAngle = (totalHours / 24) * (2 * Math.PI);
    if (isStart) setStartAngle(newAngle);
    else setEndAngle(newAngle);
  };

  const angleToTime = (angle: number) => {
    const totalMinutes = Math.round((angle / (2 * Math.PI)) * 24 * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const handleGesture = (event: any, isStart: boolean) => {
    const { absoluteX, absoluteY } = event.nativeEvent;
    const relativeX = absoluteX - svgLayout.x - CENTER;
    const relativeY = absoluteY - svgLayout.y - CENTER;
    let angle = Math.atan2(relativeY, relativeX) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;
    const roundedMinutes = Math.round(((angle / (2 * Math.PI)) * 24 * 60) / 5) * 5;
    const roundedAngle = (roundedMinutes / (24 * 60)) * (2 * Math.PI);
    if (isStart) setStartAngle(roundedAngle);
    else setEndAngle(roundedAngle);
  };

  const getPos = (angle: number) => ({
    x: CENTER + RADIUS * Math.cos(angle - Math.PI / 2),
    y: CENTER + RADIUS * Math.sin(angle - Math.PI / 2),
  });

  const startPos = getPos(startAngle);
  const endPos = getPos(endAngle);
  let diff = endAngle - startAngle;
  if (diff < 0) diff += 2 * Math.PI;
  const totalDiffMinutes = Math.round((diff / (2 * Math.PI)) * 24 * 60);
  const hDiff = Math.floor(totalDiffMinutes / 60);
  const mDiff = totalDiffMinutes % 60;
  const statusColor = (totalDiffMinutes / 60) < 8 ? '#934b5d' : '#87a98f';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.outerContainer}>
        <DashboardBackground>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Feather name="chevron-left" size={32} color="black" />
              </TouchableOpacity>
              <ThemedText style={styles.headerTitle}>Registro de Sueño</ThemedText>
              <View style={{ width: 32 }} />
            </View>

            <View style={{justifyContent: 'space-around', alignItems: 'center' }}>
              <View style={styles.timeInfoRow}>
                <View style={styles.timeBox}>
                  <Feather name="moon" size={30} color="#6e75a4" />
                  <ThemedText style={styles.timeLabel}>DESDE</ThemedText>
                  <TextInput
                    style={styles.timeInput}
                    value={startTimeText}
                    onChangeText={(text) => handleTimeChange(text, setStartTimeText)}
                    onBlur={() => validateAndSetFullTime(startTimeText, true)}
                    keyboardType="number-pad"
                    maxLength={5}
                    selectTextOnFocus
                  />
                </View>
                <View style={styles.timeBox}>
                  <Feather name="sun" size={30} color="#6e75a4" />
                  <ThemedText style={styles.timeLabel}>HASTA</ThemedText>
                  <TextInput
                    style={styles.timeInput}
                    value={endTimeText}
                    onChangeText={(text) => handleTimeChange(text, setEndTimeText)}
                    onBlur={() => validateAndSetFullTime(endTimeText, false)}
                    keyboardType="number-pad"
                    maxLength={5}
                    selectTextOnFocus
                  />
                </View>
              </View>

              <View ref={svgRef} onLayout={onLayout} style={styles.svgContainer}>
                <View style={{ width: 400, height: 300, alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
                    <Circle cx={CENTER} cy={CENTER} r={RADIUS} stroke="#6e75a450" strokeWidth={STROKE_WIDTH} fill="none" />
                    <Path
                      d={`M ${startPos.x} ${startPos.y} A ${RADIUS} ${RADIUS} 0 ${diff > Math.PI ? 1 : 0} 1 ${endPos.x} ${endPos.y}`}
                      stroke="#6e75a4" strokeWidth={40} fill="none" strokeLinecap="round"
                    />
                    <G transform={`translate(${startPos.x}, ${startPos.y})`}>
                      <Circle cx={0} cy={0} r={HANDLER_RADIUS} fill="white" />
                    </G>
                    <G transform={`translate(${endPos.x}, ${endPos.y})`}>
                      <Circle cx={0} cy={0} r={HANDLER_RADIUS} fill="white" />
                    </G>
                  </Svg>
                  <PanGestureHandler onGestureEvent={(e) => handleGesture(e, true)}>
                    <View style={[styles.gestureOverlay, { left: startPos.x - HANDLER_RADIUS + (400 - SVG_SIZE) / 2, top: startPos.y - HANDLER_RADIUS + (300 - SVG_SIZE) / 2 }]} />
                  </PanGestureHandler>
                  <PanGestureHandler onGestureEvent={(e) => handleGesture(e, false)}>
                    <View style={[styles.gestureOverlay, { left: endPos.x - HANDLER_RADIUS + (400 - SVG_SIZE) / 2, top: endPos.y - HANDLER_RADIUS + (300 - SVG_SIZE) / 2 }]} />
                  </PanGestureHandler>
                </View>
              </View>

              <View style={styles.summaryContainer}>
                <ThemedText style={styles.summaryLabel}>Has dormido un total de:</ThemedText>
                <ThemedText style={[styles.summaryValue, { color: statusColor }]}>
                  {hDiff}h {mDiff.toString().padStart(2, '0')}min
                </ThemedText>
                <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleSave}>
                  <ThemedText style={styles.saveButtonText}>Guardar registro</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </DashboardBackground>
        <StaticBottomNavBar activeTab="home" />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: '#000' },
  mainContent: { flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  headerTitle: { color: 'black', fontSize: 20, fontWeight: 'bold' },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3.84, elevation: 3 },
  timeInfoRow: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginTop: 15 },
  timeBox: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 18, width: '40%' },
  timeLabel: { color: '#888', fontSize: 15, fontWeight: 'bold' },
  timeInput: { color: '#777777', fontSize: 22, fontWeight: '800', textAlign: 'center', borderWidth: 1, borderColor: 'rgb(219, 219, 219)', borderRadius: 10, maxWidth: 80 },
  svgContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  gestureOverlay: { position: 'absolute', width: HANDLER_RADIUS * 2, height: HANDLER_RADIUS * 2, backgroundColor: 'transparent' },
  summaryContainer: { alignItems: 'center', width: '100%', paddingHorizontal: 25 },
  summaryLabel: { color: '#888', fontSize: 20, marginBottom: 20 },
  summaryValue: { color: 'white', fontSize: 36, fontWeight: 'bold', marginBottom: 15 },
  saveButton: { backgroundColor: '#6e75a4', width: '60%', padding: 16, borderRadius: 18, alignItems: 'center' },
  saveButtonText: { color: 'white', fontSize: 20 },
});