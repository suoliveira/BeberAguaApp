import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, Button } from "react-native";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AguaContador from "../components/agua_contador";
import { setupNotifications, updateNotifications } from "../utils/notifications";
import { useTheme } from "../utils/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";

const HISTORICO_AGUA = "waterHistory"; // Mesma chave usada no componente AguaContador

export default function HomeScreen() {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [copos, setCopos] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      await setupNotifications();
      await carregar();
      await updateNotifications();
    };
    initialize();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const recarregarAoVoltar = async () => {
        await carregar();
      };
      recarregarAoVoltar();
    }, [])
  );

  const carregar = async () => {
    try {
      const historico_salvo = await AsyncStorage.getItem(HISTORICO_AGUA);
      const historico_parsed = historico_salvo ? JSON.parse(historico_salvo) : [];
      const dtAtual = new Date().toLocaleDateString("pt-BR");
      const coposHoje = historico_parsed.find(entry => entry.date === dtAtual);
      setCopos(coposHoje ? coposHoje.count : 0);
    } catch (e) {
      console.error("Erro ao carregar contagem do dia:", e);
    }
  };

  const resetarCopos = async () => {
    try {
      const historico_salvo = await AsyncStorage.getItem(HISTORICO_AGUA);
      const historico_parsed = historico_salvo ? JSON.parse(historico_salvo) : [];
      const dtAtual = new Date().toLocaleDateString("pt-BR");
      const historico_atualizado = historico_parsed.map(entry => entry.date === dtAtual ? { ...entry, count: 0 } : entry);
      
      await AsyncStorage.setItem(HISTORICO_AGUA, JSON.stringify(historico_atualizado));
      setCopos(0);
    } catch (e) {
      console.error("Erro ao resetar contagem do dia:", e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primaryDark }]}>
        Lembrete de Água
      <View> 
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}> Para começar defina uma meta em: Configurações -> Digite sua meta diária. Você também pode definir um tempo para receber uma notificação o lembrando de beber água.</Text>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}> 
          <MaterialIcons name="help" size={35} color="#6495ED"></MaterialIcons>
        </TouchableOpacity>
      </View>
      </Text>
      <AguaContador copos={copos} setCopos={setCopos} />
      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetarCopos}>
        <Text style={styles.textStyle}>Resetar contagem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  button:{
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: "#FF5252",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: "#FF5252",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
});