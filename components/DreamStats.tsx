import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#1E90FF",
  },
};

const DreamStats = () => {
  const [dreams, setDreams] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("dreamFormDataArray");
    if (stored) {
      setDreams(JSON.parse(stored));
    }
  }, []);

  // Construction des séries pour le graphique
  const sleepQuality = dreams.map((dream) => dream.sleepQuality || 0);
  const emotionalIntensity = dreams.map(
    (dream) => dream.emotionalIntensity || 0
  );
  const dreamClarity = dreams.map((dream) => dream.dreamClarity || 0);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
          Statistiques des Rêves 📊
        </Text>

        {dreams.length > 0 ? (
          <LineChart
            data={{
              labels: dreams.map((dream) => {
                const date = new Date(dream.date);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }), 
              datasets: [
                {
                  data: sleepQuality,
                  color: () => "#007AFF",
                  strokeWidth: 2,
                  legend: ["Qualité du sommeil"],
                },
                {
                  data: emotionalIntensity,
                  color: () => "#FF6347",
                  strokeWidth: 2,
                  legend: ["Intensité émotionnelle"],
                },
                {
                  data: dreamClarity,
                  color: () => "#32CD32",
                  strokeWidth: 2,
                  legend: ["Clarté du rêve"],
                },
              ],
              legend: [
                "Qualité du sommeil",
                "Intensité émotionnelle",
                "Clarté du rêve",
              ],
            }}
            width={screenWidth - 32}
            height={300}
            chartConfig={chartConfig}
            bezier
            style={{
              borderRadius: 16,
            }}
          />
        ) : (
          <Text>Aucun rêve enregistré pour le moment.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default DreamStats;
