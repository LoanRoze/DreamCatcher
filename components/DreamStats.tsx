import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, useWindowDimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#1E90FF",
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
    <View style={{ padding: 16, flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
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
  container: {
    width: "80%",
    height: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    height: "90%",
    display: "flex",
    overflowX: "scroll"
  },
});


export default DreamStats;