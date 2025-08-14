import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, Switch } from "react-native";
import Card from "../components/Card";

export default function ParenteDetalhe() {
  const [temAlergia, setTemAlergia] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      {/* Foto */}
      <View style={{ alignItems: "center", marginVertical: 16 }}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
          style={{ width: 80, height: 80 }}
        />
      </View>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Sr. Carlos</Text>
      </View>

      <Card>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>Carlos Alberto Silva</Text>

        <Text style={styles.label}>Idade:</Text>
        <Text style={styles.value}>68</Text>

        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.value}>Rua Antonio Pereira Galindo</Text>

        <Text style={styles.label}>Condições médicas:</Text>
        <Text style={styles.value}>Alzheimer Estágio 1</Text>

        <Text style={styles.label}>Alergias:</Text>
        <Switch value={temAlergia} onValueChange={setTemAlergia} />
        <Text style={styles.value}>Amendoim</Text>

        <Text style={styles.label}>Observações:</Text>
        <Text style={styles.value}>Não deixar sair de casa</Text>
        <Text style={styles.value}>Geralmente esquece das pessoas ao seu redor</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 16 },
  header: {
    backgroundColor: "#ffe45c",
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 12,
  },
  headerText: { fontSize: 18, fontWeight: "bold" },
  label: { fontWeight: "bold", marginTop: 8, color: "#444" },
  value: { marginBottom: 4, color: "#333" },
});
