import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { View, Text } from "./Themed";
import { TextInput, Button, List } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");
const todayDate = new Date();
const month = todayDate.getMonth() + 1;
const year = todayDate.getFullYear();
const day = todayDate.getDate();
const formattedDate = `${year}-${month}-${day}`;

export default function DreamForm() {
  const [dreamText, setDreamText] = useState("");
  const [date, setDate] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [inputCountHashtags, setInputCountHashtags] = useState(0);
  const [hour, setHour] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dreamType, setDreamType] = useState("");
  const [emotionalState, setEmotionalState] = useState("");
  const [peopleList, setPeopleList] = useState<string[]>([]);
  const [inputCountPeople, setInputCountPeople] = useState(0);
  const [dreamLocation, setDreamLocation] = useState("");
  const [emotionalIntensity, setEmotionalIntensity] = useState(5);
  const [dreamClarity, setDreamClarity] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [dreamSignification, setDreamSignification] = useState("");
  const [dreamMood, setDreamMood] = useState("");
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (key: any) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      setHour(selectedDate);
    }
    setShowPicker(false);
  };

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

  // On pourrait ici mettre une fonction comme findhashtagidbylabel mais pour les personnes
  // si on veut gérer un jour la recherche par personne dans un rêve mais on se contente
  // pour l'instant le stocker les personnes avec les hashtags

  const updateHashtag = (index: number, value: string) => {
    const newHashtags = [...hashtags];
    newHashtags[index] = value;
    setHashtags(newHashtags);
  };
  const updatePeople = (index: number, value: string) => {
    const newPeople = [...peopleList];
    newPeople[index] = value;
    setPeopleList(newPeople);
  };

  const removeHashtag = (indexToRemove) => {
    const newHashtags = hashtags.filter((_, i) => i !== indexToRemove);
    setHashtags(newHashtags);
    setInputCountHashtags(newHashtags.length);
  };

  const removePerson = (indexToRemove) => {
    const newPeopleList = peopleList.filter((_, i) => i !== indexToRemove);
    setPeopleList(newPeopleList);
    setInputCountPeople(newPeopleList.length);
  };

  const handleDreamSubmission = async () => {
    try {
      const existingData = await AsyncStorage.getItem("dreamFormDataArray");
      const formDataArray = existingData ? JSON.parse(existingData) : [];

      const filteredHashtags = hashtags.filter((label) => label.trim() !== "");
      const formattedHashtags = await Promise.all(
        filteredHashtags.map(async (label) => ({
          id: await findHashtagIdByLabel(label),
          label: label,
        }))
      );

      const filteredPeopleList = peopleList.filter(
        (label) => label.trim() !== ""
      );
      const formattedPeopleList = await Promise.all(
        filteredPeopleList.map(async (label) => ({
          id: await findHashtagIdByLabel(label),
          label: label,
        }))
      );

      formDataArray.push({
        id: Math.random().toString(36).substr(2, 9), // Générer un ID unique
        dreamText: dreamText,
        date: date,
        hashtags: formattedHashtags,
        hour: hour.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        dreamType: dreamType,
        emotionalState: emotionalState,
        peopleList: formattedPeopleList,
        dreamLocation: dreamLocation,
        emotionalIntensity: emotionalIntensity,
        dreamClarity: dreamClarity,
        sleepQuality: sleepQuality,
        dreamSignification: dreamSignification,
        dreamMood: dreamMood,
      });

      await AsyncStorage.setItem(
        "dreamFormDataArray",
        JSON.stringify(formDataArray)
      );

      setDreamText("");
      setDate("");
      setHashtags([]);
      setInputCountHashtags(0);
      setHour(new Date());
      setDreamType("");
      setEmotionalState("");
      setPeopleList([]);
      setInputCountPeople(0);
      setDreamLocation("");
      setEmotionalIntensity(5);
      setDreamClarity(5);
      setSleepQuality(5);
      setDreamSignification("");
      setDreamMood("");
      setExpanded({});
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/*Champs Obligatoires*/}

        {/*Reve*/}
        <TextInput
          label="Rêve"
          value={dreamText}
          onChangeText={(text) => setDreamText(text)}
          mode="outlined"
          multiline
          numberOfLines={6}
          style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
        />

        {/*Date*/}
        <Calendar
          style={styles.calendar}
          current={formattedDate}
          onDayPress={(day) => {
            setDate(day.dateString);
          }}
          markedDates={{
            [date]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: "orange",
            },
          }}
        />

        <View style={styles.spacing} />

        {/*Heure*/}
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: "#000", borderRadius: 5 }}
          onPress={() => setShowPicker(true)}
        >
          <Text>
            Sélectionner l'heure :{" "}
            {hour
              ? hour.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
          </Text>
        </TouchableOpacity>
        {showPicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={hour}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
          />
        )}

        {/*Type*/}
        <TextInput
          label="Type du rêve"
          value={dreamType}
          onChangeText={(text) => setDreamType(text)}
          mode="outlined"
          style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
        />

        {/*Champs Optionnels*/}
        <List.Accordion
          style={styles.accordion}
          title="Autres détails"
          expanded={expanded.details}
          onPress={() => toggleExpand("details")}
          left={(props) => (
            <List.Icon
              {...props}
              icon={expanded.details ? "chevron-up" : "chevron-down"}
            />
          )}
        >
          {/*Hashtags*/}
          <Button
            mode="contained"
            onPress={() => {
              setInputCountHashtags(inputCountHashtags + 1);
              setHashtags([...hashtags, ""]);
            }}
            textColor="#fff"
            style={styles.addButton}
          >
            + Ajouter un hashtag
          </Button>
          {[...Array(inputCountHashtags)].map((_, index) => (
            <View key={index} style={styles.inputListContainer}>
              <TextInput
                label={`Hashtag ${index + 1}`}
                value={hashtags[index]}
                onChangeText={(text) => updateHashtag(index, text)}
                mode="outlined"
                style={styles.inputList}
                theme={{
                  colors: {
                    primary: "#9e9e9e",
                    text: "#f5f5f5",
                    placeholder: "#888",
                  },
                }}
              />
              <Button
                mode="text"
                onPress={() => removeHashtag(index)}
                compact
                textColor="red"
              >
                ❌
              </Button>
            </View>
          ))}

          {/*Personnes*/}
          <Button
            mode="contained"
            onPress={() => {
              setInputCountPeople(inputCountPeople + 1);
              setPeopleList([...peopleList, ""]);
            }}
            textColor="#fff"
            style={styles.addButton}
          >
            + Ajouter une personne
          </Button>
          {[...Array(inputCountPeople)].map((_, index) => (
            <View key={index} style={styles.inputListContainer}>
              <TextInput
                label={`Personne ${index + 1}`}
                value={peopleList[index]}
                onChangeText={(text) => updatePeople(index, text)}
                mode="outlined"
                style={styles.inputList}
                theme={{
                  colors: {
                    primary: "#9e9e9e",
                    text: "#f5f5f5",
                    placeholder: "#888",
                  },
                }}
              />
              <Button
                mode="text"
                onPress={() => removePerson(index)}
                compact
                textColor="red"
              >
                ❌
              </Button>
            </View>
          ))}

          {/*Etat emotionnel*/}
          <TextInput
            label="Etat Emotionnel"
            value={emotionalState}
            onChangeText={(text) => setEmotionalState(text)}
            mode="outlined"
            style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
          />

          {/*Lieu*/}
          <TextInput
            label="Lieu du Rêve"
            value={dreamLocation}
            onChangeText={(text) => setDreamLocation(text)}
            mode="outlined"
            style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
          />

          {/*Intensité émotionnelle*/}
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Intensité émotionelle du rêve :
          </Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={10}
            value={emotionalIntensity}
            minimumTrackTintColor="#A9A9A9" // Gris foncé
            maximumTrackTintColor="#D3D3D3" // Gris clair
            onValueChange={(number) => setEmotionalIntensity(number)}
          />

          {/*Clareté*/}
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Clareté du rêve :
          </Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={10}
            value={dreamClarity}
            minimumTrackTintColor="#A9A9A9" // Gris foncé
            maximumTrackTintColor="#D3D3D3" // Gris clair
            onValueChange={(number) => setDreamClarity(number)}
          />

          {/*Qualité*/}
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Qualité du sommeil :
          </Text>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={10}
            value={sleepQuality}
            minimumTrackTintColor="#A9A9A9" // Gris foncé
            maximumTrackTintColor="#D3D3D3" // Gris clair
            onValueChange={(number) => setSleepQuality(number)}
          />

          {/*Signification*/}
          <TextInput
            label="Signification du rêve"
            value={dreamSignification}
            onChangeText={(text) => setDreamSignification(text)}
            mode="outlined"
            style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
          />

          {/*Tonalité*/}
          <TextInput
            label="Tonalité du rêve"
            value={dreamMood}
            onChangeText={(text) => setDreamMood(text)}
            mode="outlined"
            style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
          />
        </List.Accordion>
      </ScrollView>

      <Button
        mode="contained"
        onPress={handleDreamSubmission}
        style={styles.button}
        textColor="#fff"
        disabled={
          !dreamText.trim() || !date.trim() || !hour || !dreamType.trim()
        }
      >
        Soumettre
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0d0d0d",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#1a1a1a",
    color: "#f0f0f0",
    borderRadius: 8,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#2e2e2e",
    height: 350,
    width: 320,
    alignSelf: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
  },
  datetimePickerContainer: {
    alignSelf: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    alignSelf: "center",
    color: "#f0f0f0",
  },
  slider: {
    width: 250,
    height: 40,
    alignSelf: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#333333",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  hashtagButton: {
    alignSelf: "center",
    marginBottom: 8,
  },
  spacing: {
    height: 16,
    backgroundColor: "#0d0d0d",
  },
  accordion: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    marginVertical: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#2c2c2c",
  },
  addButton: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: "#2b2b2b",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inputListContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#0d0d0d",
  },
  inputList: {
    width: width * 0.7,
    marginRight: 8,
    backgroundColor: "#1e1e1e",
  },
});
