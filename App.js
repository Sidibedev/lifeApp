import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserProvider } from './Context/UserContext'; // Importez UserProvider
import HomeScreen from './Screens/HomeScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import SplashScreen from './Screens/SplashScreen';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import googleFit from 'react-native-google-fit';


const Stack = createStackNavigator();

const App = () => {

  const [userFinded, setUserFinded] = useState(false);
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [isInitializing, setInitializing] = useState(true); // Nouveau état pour le suivi de l'initialisation

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


  useEffect(() => {
    getUser();
    storeUser(user);
  }, []);

  const getUser = async () => {
    setInitializing(true);
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        setUser(JSON.parse(value));

        //timer avant de mettre à jour le state
        setTimeout(() => {
          console.log('User RETRIEVED >>>');

          setInitializing(false);
        }, 5000);
        setUserFinded(true);
      } else {
        console.log('User NOT RETRIEVED YET >>>');
        setUserFinded(false);
      }
    } catch (error) {
      setInitializing(false);
      console.log('Erreur de récupération:', error);
      setUserFinded(false);
    }
  };

  const storeUser = async (user) => {
    try {
      if (user !== null) {
        await AsyncStorage.setItem('user', JSON.stringify(user));

        //Print what is stored
        const value = await AsyncStorage.getItem('user');
        setInitializing(false);
      }
      else {
        console.log('User NOT STORED YET >>>');
        setInitializing(false);
      }
    } catch (error) {
      console.log('Erreur de stockage:', error);
    }
  };

console.log('userFinded', userFinded);



  return (
    <UserProvider value={{ user, setUser }}>

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          {isInitializing ? (
            <Stack.Screen name="Splash">
              {(props) => <SplashScreen {...props} />}
            </Stack.Screen>
          ) : null}

          {user ? (
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} signOut={signOut} userInfo={user} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Welcome">
              {(props) => <WelcomeScreen {...props} signIn={signIn} storeUser={storeUser} />}

            </Stack.Screen>
          )}
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>

  );
};

export default App;