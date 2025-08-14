import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import Card from "../components/Card";
import { useNavigation } from "@react-navigation/native";

export default function HomeFamiliar() {
  const navigation = useNavigation();
  const [toggleMedicamentos, setToggleMedicamentos] = React.useState(true);
  const [toggleCuidadores, setToggleCuidadores] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>
        Bem-vindo! {"\n"}
        <Text style={styles.bold}>Familiar Douglas</Text>
      </Text>

      {/* Parentes */}
      <Card>
        <Text style={styles.sectionTitle}>Parentes</Text>
        <TouchableOpacity
          style={styles.itemRow}
          onPress={() => navigation.navigate("ParenteDetalhe")}
        >
          <Text style={styles.itemText}>Sr. Carlos</Text>
          <Switch value={toggleMedicamentos} onValueChange={setToggleMedicamentos} />
        </TouchableOpacity>

        <Text style={styles.subTitle}>Estado</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusColumn}>
            <Text style={styles.statusTitle}>Medicamentos</Text>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>Donepezila</Text>
              <Text style={styles.time}>12:00</Text>
            </View>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>Atenolol</Text>
              <Text style={styles.time}>18:00</Text>
            </View>
          </View>

          <View style={styles.statusColumn}>
            <Text style={styles.statusTitle}>Compromissos</Text>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>Médico</Text>
              <Text style={styles.time}>17:50</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Cuidadores */}
      <Card>
        <Text style={styles.sectionTitle}>Cuidadores</Text>
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>Renato</Text>
          <Switch value={toggleCuidadores} onValueChange={setToggleCuidadores} />
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>Roberto</Text>
          <Switch value={!toggleCuidadores} onValueChange={() => setToggleCuidadores(!toggleCuidadores)} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 16 },
  welcome: { fontSize: 18, marginBottom: 16 },
  bold: { fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#444" },
  subTitle: { fontSize: 14, fontWeight: "bold", marginTop: 8, color: "#666" },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  itemText: { fontSize: 15 },
  statusRow: { flexDirection: "row", justifyContent: "space-between" },
  statusColumn: { flex: 1 },
  statusTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 4 },
  badgeRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  badge: {
    backgroundColor: "#d1f7d6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    marginRight: 6,
  },
  time: { fontSize: 12, color: "#444" },
});
