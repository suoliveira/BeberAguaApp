import { StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Notifications from "expo-notifications"

const SETTINGS_PATH = "beberagua:notificationSettings";

export async function setupNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
        alert("Precisamos da permissão para enviar notificações!");
        return false;
    }
    return true;
}

export async function updateNotifications() {
    const settings = await AsyncStorage.getItem(SETTINGS_PATH);
    
    const defaltSettings = {
        enabled: true,
        interval: 1 * 60 * 60, // 1 hora
    };
    
    const { enabled, interval } = settings
    ? JSON.parse(settings)
    : defaltSettings;
    
    console.log("Intervalo  em Horas e Segundos:", interval, interval * 60 * 60);
    
    // Cancela todas as notificações agendadas
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Recria notificações com base nas configurações salvas
    if (enabled) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Hora de beber água! 💧",
                body: "Mantenha-se hidratado! Que tal um copo de água agora?",
            },
            trigger: {
                seconds: interval * 60 * 60, // Convertendo horas para segundos
                repeats: true,
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            },
        });
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    card: {
      borderRadius: 15,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 15,
      marginBottom: 10,
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
    },
    shareButton: {
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginTop: 20,
      alignItems: "center",
    },
    shareButtonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
});
  