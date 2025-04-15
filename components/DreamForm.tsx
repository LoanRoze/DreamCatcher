import React, { useState } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { View, Text } from "./Themed";
import { TextInput, Button, Checkbox, List } from "react-native-paper";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import RNDateTimePicker from "react-datetime-picker";
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
  const [hour, setHour] = useState("");
  const [hourDateType, setHourDateType] = useState("");
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

  const onChangeHour = (newHour: any) => {
    if (newHour) {
      const newHourHours = newHour.getHours();
      const newHourMinutes = newHour.getMinutes();
      const formattedTime = `${newHourHours
        .toString()
        .padStart(2, "0")}:${newHourMinutes.toString().padStart(2, "0")}`;
      const selectedHour = formattedTime || hour;
      setHour(selectedHour);
      setHourDateType(newHour);
    }
  };

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

  const handleDreamSubmission = async () => {
    try {
      const existingData = await AsyncStorage.getItem("dreamFormDataArray");
      const formDataArray = existingData ? JSON.parse(existingData) : [];

      let formattedHashtags;
      formattedHashtags = await Promise.all(
        hashtags.map(async (label) => ({
          id: await findHashtagIdByLabel(label),
          label: label,
        }))
      );

      let formattedPeopleList;
      formattedPeopleList = await Promise.all(
        hashtags.map(async (label) => ({
          id: await findHashtagIdByLabel(label),
          label: label,
        }))
      );

      formDataArray.push({
        id: Math.random().toString(36).substr(2, 9), // Générer un ID unique
        dreamText: dreamText,
        date: date,
        hashtags: formattedHashtags,
        hour: hour,
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
      console.log(formDataArray);

      // Sauvegarder le tableau mis à jour dans AsyncStorage
      await AsyncStorage.setItem(
        "dreamFormDataArray",
        JSON.stringify(formDataArray)
      );

      // Réinitialiser les champs du formulaire
      setDreamText("");
      setDate("");
      setHashtags([]);
      setInputCountHashtags(0);
      setHour("");
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

        <TextInput
          label="Rêve"
          value={dreamText}
          onChangeText={(text) => setDreamText(text)}
          mode="outlined"
          multiline
          numberOfLines={6}
          style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
        />

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

        <View style={styles.datetimePickerContainer}>
          <RNDateTimePicker
            value={hourDateType}
            onChange={onChangeHour}
            disableClock={true}
            format="HH:mm"
            clearIcon={null}
            calendarIcon={null}
          />
        </View>

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
          <Button
            mode="contained"
            onPress={() => {
              setInputCountHashtags(inputCountHashtags + 1);
              setHashtags([...hashtags, ""]); 
            }}
            style={styles.addButton}
          >
            + Ajouter un hashtag
          </Button>
          {[...Array(inputCountHashtags)].map((_, index) => (
            <TextInput
              key={index}
              label={`Hashtag ${index + 1}`}
              value={hashtags[index]}
              onChangeText={(text) => updateHashtag(index, text)}
              mode="outlined"
              style={[
                styles.input,
                { width: width * 0.8, alignSelf: "center" },
              ]}
            />
          ))}

          <TextInput
            label="Etat Emotional"
            value={emotionalState}
            onChangeText={(text) => setEmotionalState(text)}
            mode="outlined"
            style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
          />

          <Button
            mode="contained"
            onPress={() => {
              setInputCountPeople(inputCountPeople + 1);
              setPeopleList([...peopleList, ""]); 
            }}
            style={styles.addButton}
          >
            + Ajouter une personne
          </Button>
          {[...Array(inputCountPeople)].map((_, index) => (
            <TextInput
              key={index}
              label={`Personne ${index + 1}`}
              value={peopleList[index]}
              onChangeText={(text) => updatePeople(index, text)}
              mode="outlined"
              style={[
                styles.input,
                { width: width * 0.8, alignSelf: "center" },
              ]}
            />
          ))}

          <TextInput
            label="Lieu du Rêve"
            value={dreamLocation}
            onChangeText={(text) => setDreamLocation(text)}
            mode="outlined"
            style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
          />

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

          <TextInput
            label="Signification du rêve"
            value={dreamSignification}
            onChangeText={(text) => setDreamSignification(text)}
            mode="outlined"
            style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
          />

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
        disabled={
          !dreamText.trim() || !date.trim() || !hour.trim() || !dreamType.trim()
        }
      >
        Soumettre
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 16,
    backgroundColor: "#f5f5f5",
    width: "90%",
    height: "80%",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
    paddingLeft: 0,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "gray",
    height: 350,
    width: 200,
    alignSelf: "center",
  },
  datetimePickerContainer: {
    alignSelf: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  slider: {
    width: 200,
    height: 40,
    alignSelf: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    alignSelf: "center",
  },
  hashtagButton: {
    alignSelf: "center",
    marginBottom: 8,
  },
  spacing: {
    height: 16, 
    backgroundColor: "#f5f5f5",
  },
  accordion: {
    backgroundColor: "#e0e0e0 !important", 
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  addButton: {
    marginTop: 16,
    paddingLeft: 0,
    alignSelf: "center",
    marginBottom: 8,
  },
});
