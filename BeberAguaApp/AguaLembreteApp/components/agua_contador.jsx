import React, {useState, useCallback, useEffect} from "react";
import { StyleSheet, View, Text, Button} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../utils/ThemeContext";
import { useFocusEffect } from "expo-router";
import ConfettiCannon from "react-native-confetti-cannon"

const HISTORICO_AGUA = "waterHistory";
const SETTINGS_PATH = "beberagua:notificationSettings";

export default function AguaContador({ copos, setCopos }) {
  const { theme } = useTheme();
  const[meta, setMeta] = useState(0);
  const[metaAchieved, setAchieved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const renderConfetti = () => {
    return <ConfettiCannon count={200} origin={{ x: 0, y: 0 }} fadeOut={true} />;
  };

    const adicionar = async () => {
      const dtAtual = new Date().toLocaleDateString("pt-BR");
      setCopos(copos + 1);
      try {
        const historico = await AsyncStorage.getItem(HISTORICO_AGUA);
        const lista = historico ? JSON.parse(historico) : [];
        const coposHoje = lista.find(entry => entry.date === dtAtual);
        if (coposHoje) {
          coposHoje.count += 1;
        } else {
          lista.push({ date: dtAtual, count: 1 });
        }
        await AsyncStorage.setItem(HISTORICO_AGUA, JSON.stringify(lista));
      } catch (e) {
        console.error("Erro ao salvar histórico:", e);
      }
    }

   useEffect(() => {
    if(copos >= meta && metaAchieved === false){
      setAchieved(true);
      setShowConfetti(true);
    }
    if(copos < meta && metaAchieved === true){
      setAchieved(false);
      setShowConfetti(false)
    }
   }, [copos, metaAchieved, meta]);

    const getMeta = async () =>{
      const quantidade = await AsyncStorage.getItem(SETTINGS_PATH);
      const {meta} = JSON.parse(quantidade)
      setMeta(meta)
    }

      useFocusEffect(
        useCallback(() => {
          getMeta()
        }, [])
      );

    return (
      <View style={[styles.counterCard, { backgroundColor: theme.cardBackground }]}>
          {showConfetti && renderConfetti()}
        <View style={styles.cardContent}>
          <Text style={[styles.counterText, { color: theme.primaryDark }]}>
            Copos Hoje
          </Text>
          <Button title="Bebi um copo!" onPress={adicionar} color={theme.primary} />
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.counter}>{copos}/{meta} 💧</Text>
        </View>
   
      </View>
    );
}

const styles = StyleSheet.create({
    counterCard: {
      flexDirection: "row",
      padding: 20,
      alignItems: "center",
      justifyContent: "space-between",
    },
    cardContent: {
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
    },
    counter: {
      fontSize: 46,
      fontWeight: "bold",
    },
    counterText: {
      fontSize: 24,
      fontWeight: "600",
    },
});