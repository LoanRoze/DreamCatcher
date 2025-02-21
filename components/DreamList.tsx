import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function DreamList() {
    const [dreams, setDreams] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredDreams, setFilteredDreams] = useState([]);

    const findHashtagIdByLabel = async (hashtag) => {
        const existingDreams = await AsyncStorage.getItem('dreamFormDataArray');
        let dreamsData = existingDreams ? JSON.parse(existingDreams) : [];
    
        // Parcours tous les rêves pour trouver un hashtag existant
        for (let dream of dreamsData) {
          for (let hashtagKey in dream.hashtags) {
            const hashtagStored = dream.hashtags[hashtagKey]; // Récupère l'objet du hashtag stocké
            console.log(hashtag, hashtagStored.label)
            if (hashtagStored.label === hashtag) {
              // Si le hashtag est trouvé, renvoie son ID
              return hashtagStored.id;
            }
          }
        }
        return null
    }

    // Ce useEffect est exécuté à l'instanciation du composant pour charger la liste initiale
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await AsyncStorage.getItem('dreamFormDataArray');
                const dreamFormDataArray = data ? JSON.parse(data) : [];
                setDreams(dreamFormDataArray);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchData();
    }, []);

    useEffect( () => {
        const fetchFilteredDreams = async () => {
            if (!searchText) {
                setFilteredDreams(dreams)
                return
            }
            const search_hashtag_id = await findHashtagIdByLabel(searchText)

            const results = dreams.filter((dream) => {
                if (search_hashtag_id) {
                    const dream_hashtags = dream.hashtags.map((hashtag) => {
                        return hashtag.id
                    })
                    if (searchText === "" || dream_hashtags.includes(search_hashtag_id)) {
                        return dream
                    }
                }
            });

            setFilteredDreams(results);
            return
        }
        fetchFilteredDreams()
    }, [searchText, dreams]);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const data = await AsyncStorage.getItem('dreamFormDataArray');
                    const dreamFormDataArray = data ? JSON.parse(data) : [];
                    setDreams(dreamFormDataArray);
                } catch (error) {
                    console.error('Erreur lors de la récupération des données:', error);
                }
            };

            fetchData();

            return () => {
                console.log('This route is now unfocused.');
            }
        }
            , [])
    );
    return (
        <View>
            <TextInput
                label="Rechercher un rêve avec un hashtag"
                value={searchText}
                onChangeText={setSearchText}
                mode="outlined"
            />

            <Text style={styles.title}>Liste des Rêves :</Text>
            
            {filteredDreams.map((dream, index) => (
        
                <Text key={index} style={styles.dreamText}>
                    {dream.dreamText} - {dream.isLucidDream ? 'Lucide' : 'Non Lucide'} - {dream.todayDate}
                    <br />
                    Hashtags:
                    <br />
                    1. {dream.hashtags[0].id} - {dream.hashtags[0].label}
                    <br />
                    2. {dream.hashtags[1].id} - {dream.hashtags[1].label}
                    <br />
                    3. {dream.hashtags[2].id} - {dream.hashtags[2].label}
                </Text>
            ))}
        </View>
    );
}


const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dreamText: {
        fontSize: 16,
        marginBottom: 4,
    },
});
