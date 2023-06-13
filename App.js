import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import GoogleFit, { Scopes } from 'react-native-google-fit';

import { UserProvider } from './Context/UserContext'; // Importez UserProvider
import HomeScreen from './Screens/HomeScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
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
  const dates = {
    startDate: "2021-01-01T00:00:17.971Z", // required ISO8601Timestamp
    endDate: new Date().toISOString() // required ISO8601Timestamp
  };

  //Ces méthodes sont à mettre dans Utils !!!!
  // Methode pour SignIn qui sera appelée dans le composant WelcomeScreen
  const signIn = () => {
    GoogleSignin.configure({
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
    });
    GoogleSignin.signIn()
      .then((userInfo) => {
        setUser(userInfo);
        // On se connecte à Google Fit
        GoogleFit.authorize(options)
          .then(async (res) => {
            console.log('Connexion Google Fit réussie:', res);
            setAuthorized(true);
            // On recupere les donnees de pas de l'utilisateur
            GoogleFit.getDailyStepCountSamples(dates)
              .then((res) => {
                const data = res.reverse();
                const steps = data.map((item) => item.steps);
                console.log('Steps >>>', steps);
              }
              )
          })
          .catch((err) => {
            console.log('Connexion Google Fit échouée:', err);
          }
          )
      })
      .catch((error) => {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('Connexion Google annulée');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('Connexion Google en cours');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('Play Services non disponibles ou obsolètes');
        } else {
          console.log('Erreur de connexion Google:', error);
        }
      });
  };

  // Methode pour SignOut qui sera appelée dans le composant HomeScreen
  const signOut = () => {
    GoogleSignin.configure({
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
    });
    GoogleSignin.signOut()
      .then(() => {
        setUser(null);
        console.log('Déconnexion Google réussie');
      })
      .catch((error) => {
        console.log('Erreur de déconnexion Google:', error);
      });
  };

  //Fonction pour rafrairchir les donnees Google Fit
  const refreshData = () => {
    GoogleFit.getDailyStepCountSamples(dates)
      .then((res) => {
        const data = res.reverse();
        const steps = data.map((item) => item.steps);
        console.log('Steps >>>', steps);
      })
      .catch((err) => {
        console.log('Erreur de rafraichissement des données Google Fit:', err);
      });
  };




  //Console.log pour vérifier si l'utilisateur est connecté ou non et affiche connected ou not connected
  console.log('User >>>', user !== null ? 'connected' : 'not connected');
  //Console.log pour vérifier si l'utilisateur est autorisé ou non et affiche authorized ou not authorized pour Google Fit
  console.log('Google Fit >>>', authorized ? 'authorized' : 'not authorized');


  return (
    <UserProvider value={{ user, setUser }}>

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false
          }}
        >
          {user ? (
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} refreshData={refreshData} signOut={signOut} userInfo={user}/>}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Welcome">
              {(props) => <WelcomeScreen {...props}  signIn={signIn} />}

            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>

  );
};

export default App;