import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const chartConfig = {
  backgroundColor: "#121212",
  backgroundGradientFrom: "#1c1c1e",
  backgroundGradientTo: "#1c1c1e",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(100, 210, 255, ${opacity})`, // lignes du graphique
  labelColor: (opacity = 1) => `rgba(220, 220, 220, ${opacity})`, // labels axes
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#64d2ff",
  },
  propsForBackgroundLines: {
    stroke: "#333",
  },
};



const DreamStats = () => {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("dreamFormDataArray");
        const dreamFormDataArray = data ? JSON.parse(data) : [];
        setDreams(dreamFormDataArray);
        console.log(dreamFormDataArray);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  const [dreams, setDreams] = useState([]);
  const { width: screenWidth } = useWindowDimensions();



  const sleepQuality = dreams.map(d => d.sleepQuality || 0);
  const emotionalIntensity = dreams.map(d => d.emotionalIntensity || 0);
  const dreamClarity = dreams.map(d => d.dreamClarity || 0);

  const labels = dreams.map(d => {
    const date = new Date(d.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  // 60px par valeur minimum
  const chartWidth = Math.max(screenWidth, dreams.length * 15);

  return (
    <View style={ styles.view }>
      <Text style={ styles.title }>
        Statistiques des Rêves 📊
      </Text>

      {dreams.length > 0 ? (

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={[styles.scrollContainer]} // utile en Web pour forcer la scrollbar
          contentContainerStyle={{ minWidth: chartWidth }}
        >
          <View style={[styles.container, {minWidth: chartWidth, alignItems: "center"} ]}>
            <LineChart
              data={{
                labels,
                datasets: [
                  {
                    data: sleepQuality,
                    color: () => "#007AFF",
                    strokeWidth: 2,
                  },
                  {
                    data: emotionalIntensity,
                    color: () => "#FF6347",
                    strokeWidth: 2,
                  },
                  {
                    data: dreamClarity,
                    color: () => "#32CD32",
                    strokeWidth: 2,
                  },
                ],
                legend: [
                  "Qualité du sommeil",
                  "Intensité émotionnelle",
                  "Clarté du rêve",
                ],
              }}
              width={chartWidth}
              height={300}
              chartConfig={chartConfig}
              bezier
              fromZero
              style={{
                borderRadius: 16,
                marginRight: 16,
              }}
            />
          </View>
        </ScrollView>
      ) : (
        <Text>Aucun rêve enregistré pour le moment.</Text>
      )
      }
    </View >
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  container: {
    width: "90%",
    height: "85%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: "#121212",
    height: "90%",
    display: "flex",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 20,
    textAlign: "center",
  },
});


export default DreamStats;