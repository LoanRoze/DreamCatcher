import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions } from "react-native";
import { TextInput, Button } from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

const { width } = Dimensions.get("window");


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
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
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
    color: "#f2f2f2", // Texte clair
  },
  card: {
    backgroundColor: "#1f1f1f", // Fond sombre de la carte
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
    color: "#e0e0e0", // Texte clair
  },
  text: {
    fontSize: 16,
    color: "#ccc", // Gris clair pour le texte
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#f2f2f2", // Texte clair pour le label
    marginRight: 5,
  },
  value: {
    color: "#e0e0e0", // Texte clair pour la valeur
  },
  tag: {
    backgroundColor: "#333", // Fond sombre pour les tags
    color: "#fff", // Texte clair dans les tags
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    fontSize: 12,
  },
  peopleTag: {
    backgroundColor: "#4a90e2", // Bleu clair pour les tags de personnes
    color: "#fff", // Texte blanc dans les tags
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    fontSize: 12,
  },
  footer: {
    fontSize: 12,
    color: "#888", // Gris clair pour le texte du footer
    marginTop: 10,
    textAlign: "right",
  },
  container: {
    width: "80%",
    height: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Fond sombre pour le container
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: "#1a1a1a", // Fond sombre de la zone de scroll
    height: "90%",
    display: "flex",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#bbb", // Gris clair pour le texte vide
    fontStyle: "italic",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#333", // Fond sombre de l'input
    color: "#f0f0f0", // Texte clair dans l'input
    borderRadius: 8,
    paddingLeft: 10, // Ajout d'un peu de padding à gauche pour les inputs
    borderColor: "#444", // Légère bordure sombre
    borderWidth: 1, // Bordure fine
  },
});
