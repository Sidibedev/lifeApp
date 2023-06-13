import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import GoogleFit, { Scopes } from 'react-native-google-fit';


export default function App() {
  const [authorized, setAuthorized] = useState(false);
  var [dailySteps, setdailySteps] = useState(0);
  var [heartRate, setHeartRate] = useState(0);
  var [calories, setCalories] = useState(0);
  var [hydration, setHydration] = useState(0);
  var [sleep, setSleep] = useState(0);
  var [weight, setWeight] = useState(0);
  var [bloodPressure, setBloodPressure] = useState({});
  var [loading, setLoading] = useState(true);


  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      androidClientId: '157792879449-0cadl2alnlmedi9hv1kl7ouarg2q2ass.apps.googleusercontent.com',
      iosClientId: '157792879449-5jhsoemo334pe2e35mt4lpcmpe5pg0ke.apps.googleusercontent.com',
    });
  }, []);

  // Configure Google Fit
  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_ACTIVITY_WRITE,
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_BODY_WRITE,
      Scopes.FITNESS_BLOOD_PRESSURE_READ,
      Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
      Scopes.FITNESS_BLOOD_GLUCOSE_READ,
      Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
      Scopes.FITNESS_NUTRITION_WRITE,
      Scopes.FITNESS_SLEEP_READ,
    ],
  };


  // Check if the user is already authorized
  GoogleFit.checkIsAuthorized()
    .then((authorized) => {
      if (authorized) {
        console.log('AUTH_SUCCESS');
        fetchDailySteps();
        setAuthorized(true);
      } else {
        // Authorize the user if not already authorized
        GoogleFit.authorize(options)
          .then((authResult) => {
            if (authResult.success) {
              setAuthorized(true);
              console.log('AUTH_SUCCESS');
              fetchDailySteps();
            } else {
              console.log('AUTH_DENIED ' + authResult.message);

            }
          })
          .catch((error) => {
            console.log('AUTH_ERROR', error);
          });
      }
    })
    .catch((error) => {
      console.log('AUTH_ERROR', error);
      setLoading(false);
    });


  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In réussi:', userInfo); // Récupérer les données du rythme cardiaque après une connexion réussie
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Connexion Google annulée');
      } else {
        console.log('Erreur de connexion Google:', error);
      }
    }
  };

  //Fetch step data
  const fetchDailySteps = async () => {
    const options = {
      startDate: "2021-01-01T00:00:17.971Z", // required ISO8601Timestamp
      endDate: new Date().toISOString() // required ISO8601Timestamp
    };

    //Verifier si l'utilisateur est autorisé
    if (authorized === false) {
      console.log("Not authorized");

      return;
    }
    else {
      const res = await GoogleFit.getDailyStepCountSamples(options);
      const data = res.reverse();
      if (res.length === 0) {
        console.log("No steps found for this period");
      } else {
        data.forEach((item) => {
          console.log("DONNE DES PAS :", item.steps);
        });
      }

    };
  };




    useEffect(() => {
      fetchDailySteps();
    }, []);


    return (
      <View style={styles.container}>
        <Text>Ouvrez App.js pour commencer à travailler sur votre application !</Text>
        <Button title="Se connecter avec Google" onPress={signInWithGoogle} />
        <StatusBar style="auto" />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
