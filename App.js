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
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        console.log('User LOG >>>', user !== null ? 'connected' : 'not connected');
        console.log('User LOG >>>', storedUser ) ;
      }
      else {
        console.log('User LOG >>>', user !== null ? 'connected' : 'not connected');
      }
      setInitializing(false);
    };

    checkUser();
  }, []);




  //Console.log pour vérifier si l'utilisateur est connecté ou non et affiche connected ou not connected
  console.log('User >>>', user !== null ? 'connected' : 'not connected');



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
              {(props) => <WelcomeScreen {...props} signIn={signIn} />}

            </Stack.Screen>
          )}
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>

  );
};

export default App;