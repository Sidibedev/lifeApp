import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform,ActivityIndicator } from 'react-native';
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WelcomeScreen = (props) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false); // État pour contrôler l'affichage de l'écran de chargement


  // Note à Abou : 
  //Fonction pour se connecter avec Google et si success alors on se connecte à Google Fit et on récupère les données.
  //Ces données sont ensuite stockées dans AsyncStorage et on est redirigé vers HomeScreen avec les données de l'utilisateur en props

  //On utilise les props signIn et connectToGoogleFit de App.js
  const handleSignIn = async () => {
    setIsLoading(true);
    await props.signIn();
    await props.connectToGoogleFit();
    setIsLoading(false);
    await props.storeData();
  };

  const renderLoadingScreen = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return null;
  };




  return (
    <ImageBackground source={require('../assets/Background.png')} style={styles.container}>
      <ImageBackground source={require('../assets/Login.png')} style={styles.header} />
      <View style={styles.form}>
        <Text style={styles.title}>Prenez en main votre santé</Text>
        <Text style={styles.subtitle}>LifeS, c’est votre compagnon de vie</Text>

        <View style={styles.input}>

          <TouchableOpacity
            title="Login"
            onPress={()=>handleSignIn()}
            style={styles.button2}>
            <Icon name="logo-google" size={20} color="black" />
            <Text style={styles.buttonText2}> Se connecter avec Google</Text></TouchableOpacity>
        </View>
        <Text style={styles.footer}>© 2023 - Lifes Bêta</Text>
      </View>


      {renderLoadingScreen()}

    </ImageBackground>
  )
}

const styles = StyleSheet.create({

  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Couleur de fond semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  form: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: 'black',
    top: -30,
    fontSize: 34,
    fontWeight: 600,
    textAlign: 'left',
    width: '80%',
  },

  subtitle: {
    color: 'black',
    top: -30,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 24,
    width: '80%',
    textAlign: 'left',
  },

  button1: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: 'white',
    width: 310,
    padding: 19,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  button2: {
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#bcbcbc',
    width: 310,
    padding: 19,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },

  buttonText1: {
    color: 'black',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 20,
  },
  buttonText2: {
    color: 'black',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 20,
  },

  footer: {
    color: 'black',
    fontWeight: 400,
    fontSize: 12,

    //Fixed bottom
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    marginBottom: 39,


  }




});

export default WelcomeScreen