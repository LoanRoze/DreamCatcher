import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { TextInput, Button } from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function DreamList() {
  const [dreams, setDreams] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredDreams, setFilteredDreams] = useState([]);

  const findHashtagIdByLabel = async (hashtag: any) => {
    try {
      const existingDreams = await AsyncStorage.getItem("dreamFormDataArray");
      let dreamsData = existingDreams ? JSON.parse(existingDreams) : [];

      for (let dream of dreamsData) {
        for (let hashtagKey in dream.hashtags) {
          const hashtagStored = dream.hashtags[hashtagKey];
          console.log(hashtag, hashtagStored.label);
          if (hashtagStored.label === hashtag) {
            return hashtagStored.id;
          }
        }
      }

      const newId = `hashtag-${Math.random().toString(36).substr(2, 9)}`;
      return newId;
    } catch (error) {
      console.error("Erreur lors de la gestion des hashtags:", error);
      return null;
    }
  };

  const deleteDream = ({ dream }) => {
    try {
      const updatedDreams = dreams.filter((item) => item.id !== dream.id);
      AsyncStorage.setItem("dreamFormDataArray", JSON.stringify(updatedDreams));
      setDreams(updatedDreams);
    } catch (error) {
      console.error("Erreur lors de la suppression du rêve:", error);
    }
  };

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

  useEffect(() => {
    const fetchFilteredDreams = async () => {
      if (!searchText) {
        setFilteredDreams(dreams);
        return;
      }
      const search_hashtag_id = await findHashtagIdByLabel(searchText);

      const results = dreams.filter((dream) => {
        if (search_hashtag_id) {
          const dream_hashtags = dream.hashtags.map((hashtag) => {
            return hashtag.id;
          });
          if (searchText === "" || dream_hashtags.includes(search_hashtag_id)) {
            return dream;
          }
        }
      });

      setFilteredDreams(results);
      return;
    };
    fetchFilteredDreams();
  }, [searchText, dreams]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await AsyncStorage.getItem("dreamFormDataArray");
          const dreamFormDataArray = data ? JSON.parse(data) : [];
          setDreams(dreamFormDataArray);
        } catch (error) {
          console.error("Erreur lors de la récupération des données:", error);
        }
      };

      fetchData();

      return () => {
        console.log("This route is now unfocused.");
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <TextInput
        label="Rechercher un rêve avec un hashtag"
        value={searchText}
        onChangeText={setSearchText}
        mode="outlined"
      />

      <Text style={styles.title}>Liste des Rêves :</Text>

      {filteredDreams.length === 0 ? (
        <Text style={styles.emptyText}>Aucun rêve trouvé pour ce filtre.</Text>
      ) : (
        <ScrollView style={[styles.scrollContainer]}>
          {filteredDreams.map((dream, index) => (
            <View style={styles.card}>
              <Text style={styles.title}>{dream.dreamText} 🌙</Text>
              <Text style={styles.text}>{dream.dreamType}</Text>

              {dream.dreamLocation && (
                <View style={styles.row}>
                  <Text style={styles.label}>Lieu :</Text>
                  <Text style={styles.value}>{dream.dreamLocation}</Text>
                </View>
              )}

              {dream.emotionalState && (
                <View style={styles.row}>
                  <Text style={styles.label}>État émotionnel :</Text>
                  <Text style={styles.value}>{dream.emotionalState}</Text>
                </View>
              )}

              <FlatList
                data={dream.hashtags}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.tag}>#{item.label}</Text>
                )}
              />

              <FlatList
                data={dream.peopleList}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.peopleTag}>👤{item.label}</Text>
                )}
              />

              <Text style={styles.footer}>
                🕒 {dream.hour} | 📅 {dream.date}
              </Text>
              <Button
                mode="contained"
                onPress={() => deleteDream({ dream })}
                icon="delete"
                style={styles.buttonDelete}
              ></Button>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dreamText: {
    fontSize: 16,
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    margin: 10,
    width: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#444",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
    marginRight: 5,
  },
  value: {
    color: "#222",
  },
  tag: {
    backgroundColor: "#ddd",
    color: "#333",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    fontSize: 12,
  },
  peopleTag: {
    backgroundColor: "#87CEFA",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    fontSize: 12,
  },
  footer: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
    textAlign: "right",
  },
  container: {
    width: "80%",
    height: "40%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    height: "70%",
    display: "flex",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
});
