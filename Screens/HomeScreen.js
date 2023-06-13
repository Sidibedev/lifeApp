import { TextInput, View, Alert, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, TouchableHighlight, Button, StatusBar } from 'react-native';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";

//Import Components
import ArticleBox from '../Components/ArticleBox'
import Box from '../Components/Box'
import HeaderSection from '../Components/HeaderSection'
import Notification from '../Components/Notification'
import { ScrollView } from 'react-native-gesture-handler';

const HomeScreen = (props) => {
  const navigation = useNavigation();

  //Log Checker

  //Modal Handler
  const [modalVisible, setModalVisible] = useState(false);
  const [newBoxValue, setNewBoxValue] = useState("");
  const handleManualData = () => { //C'est un exemple
    if (selectedBox.title === 'Rythme Cardiaque') {
      setHeartRate(newBoxValue); // Mettre à jour le rythme cardiaque
    }
    setSelectedBox({ ...selectedBox, number: newBoxValue });
    setLastUpdated(new Date().toLocaleString());
  };

  //Box Handler
  const [selectedBox, setSelectedBox] = useState(null);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);




  //UserData from App.js (props)
  const [firstName, setFirstName] = React.useState(props.userInfo.user.givenName);
  const [userPicture, setUserPicture] = React.useState(props.userInfo.user.photo);
  //AccessoryData
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); // Formattez la date en français

  //signOut de App.js
  const signOut = props.signOut;

  //refreshData() de App.js
  const refreshData = props.refreshData;


  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/** Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Hello {firstName} !</Text>
            <Text style={styles.subtitle}>{formattedDate}</Text>
          </View>
          <TouchableOpacity style={styles.profil} onPress={() => navigation.navigate('Profile')}>
            <Image source={{ uri: userPicture }} style={styles.notification} />
          </TouchableOpacity>
        </View>
      </View>

      {/** Body */}
      <ScrollView style={styles.scrollView}>

        {/**  Modal constantes manual editing */}
        <Modal
          isVisible={modalVisible}
          onSwipeComplete={() => setModalVisible(false)}
          swipeDirection="down"
          style={styles.modal}
        >
          <View style={styles.modalView}>
            <View style={styles.row}>
              <Text style={styles.modalText6}>{selectedBox ? selectedBox.title : ''}</Text>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalSmallText}>Votre rythme de {selectedBox ? selectedBox.title : ''} est en baisse par rapport à votre dernière prise.</Text>
              <View style={styles.row}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalSmallText}>Données manuelles</Text>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.modalText}>{selectedBox ? selectedBox.number : ''}</Text>
                <Text style={styles.modalText1}>{selectedBox ? selectedBox.measure : ''}</Text>
              </View>
              <View style={styles.rowButton}>
                <TextInput
                  style={styles.input}
                  onChangeText={setNewBoxValue}
                  value={newBoxValue}
                  placeholder="Valeure manuelle"
                />
                <TouchableOpacity style={styles.modalBox3} onPress={handleManualData}><Text>Mettre à jour</Text></TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity style={styles.modalBox4}>
                  <Text style={styles.modalSmallText}>Données temps réelles</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.notif}>
                <Notification title={'Connect ta montre'} content={'Vous avez besoin d\'une montre LifeS pour avoir les données en temps réels.'} color={'#24252B'} icon={'information-circle-sharp'} />
              </View>
            </View>

          </View>
        </Modal>

        {/**  Modal subscription */}
        <Modal
          isVisible={subscriptionModalVisible}
          onSwipeComplete={() => setSubscriptionModalVisible(false)}
          swipeDirection="down"
          style={styles.modal}
        >
          <View style={styles.modalView}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.modalBox5}>
                <Text style={styles.modalSmallText}>PRO 🔒</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText3}>🎉</Text>
            <Text style={styles.modalText1}>TA MONTRE EST PRÊTE ! Notre liste VIP t'attends 😎
            </Text>

            <Text style={styles.modalText2}>Souscrivez des maintenant pour recevoir votre montre dans les meilleurs délais.</Text>
            <TextInput
              style={styles.inputemail}
              placeholder="Entrez votre email"
            // Ajoutez votre logique pour gérer la souscription ici
            />
            <TouchableOpacity style={styles.modalButton} onPress={() => setSubscriptionModalVisible(false)}>
              <Text style={styles.modalButtonText}>Souscrire</Text>
            </TouchableOpacity>

            <Notification title={'Release'} content={'Nos prochaines releases vous réservent pleins de surprises🔥.'} color={'#9D9D9D'} icon={"aperture"} />

          </View>

        </Modal>

        {/**  Modal Articles */}


        {/** Constantes */}
        <View style={styles.Constantes}>
          <Notification title={'Penser à activer les notifications'} content={'Permettez nous de vous rappeler de prendre vos médicaments ou de faire votre séance de sport à temps. C’est pour votre bien ! '} color={'#008FAA'} icon={"information-circle-sharp"} />
          <HeaderSection title={'Aujourd\'hui'} haveicon='true' />

          <View style={styles.boxContainer}>
            <Box/>
          </View>

        </View>

      </ScrollView>

      {/** Deconnection */}

      <Button title="Se déconnecter" onPress={() => signOut()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Constantes: {
    paddingTop: 30,
  },

  //Header
  headerContainer: {
    flex: 0.2,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: '1%',
    justifyContent: 'flex-start',
  },

  header: {
    height: '100%',

    flexDirection: 'row',
    paddingTop: 50,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',

  },
  headerContent: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    top: 5,
    fontSize: 15,
    color: 'black',
  },
  notification: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#24252B',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 5,
  },

  //Constantes
  scrollView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 30,
    paddingTop: 10,
    marginBottom: 20,
  },

  boxContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 3,
    //En mettre max 3 par ligne
    flexWrap: 'wrap',
  },

  boxContainerPc: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 0,
    //En mettre max 3 par ligne
    flexWrap: 'wrap',
  },

  //Action
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#24252B',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginVertical: 10,
    marginTop: 40,
    paddingVertical: 9,
    width: '100%',
    borderRadius: 14
  },

  actionMontre: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#24252B',
    opacity: 0.4,
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginVertical: 10,
    paddingVertical: 19,
    top: -15,
    width: '100%',
    borderRadius: 14
  },

  actionText: {
    fontSize: 15,
    color: 'black',
    marginRight: 5,
  },

  // Watch
  watchContainer: {
    flex: 1,
    width: 370,
    height: 370,
    backgroundColor: '#1B1B1B',
    borderRadius: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginTop: 50,
  },

  watch: {
    width: 300,
    height: 300,
    //backgroundColor radial blue
    borderRadius: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 400,
    height: 370,
    bottom: 50,
  },

  //Modal
  modalView: {
    backgroundColor: "#3C3C43",
    borderRadius: 20,
    padding: 50,
    flex: 1,
    width: '100%',
    top: '10%',
    height: '100%',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  modalText: {
    marginBottom: 15,
    textAlign: "left",
    color: 'black',
    fontSize: 65,
    width: '100%',
    fontWeight: 'bold',
  },

  modalText3: {
    marginBottom: 10,
    textAlign: "left",
    color: 'black',
    fontSize: 100,
    width: '100%',
    fontWeight: 'bold',
  },
  modalText2: {
    marginBottom: 10,
    textAlign: "left",
    color: 'black',
    paddingLeft: 10,
    fontSize: 15,
    width: '100%',
  },

  modalText1: {
    marginBottom: 20,
    color: 'black',
    textAlign: "left",
    fontSize: 25,
    fontWeight: 'bold',
  },

  modalText6: {
    marginLeft: -40,
    marginBottom: 20,
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },

  input: {
    borderRadius: 14,
    padding: 10,
    paddingLeft: 40,
    width: '100%',
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },

  rowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingLeft: 40,
    backgroundColor: '#24252B',
    width: '80%',
  },


  modalButton: {
    backgroundColor: '#24252B',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  modalButtonText: {
    color: 'black',
    fontSize: 15,
  },

  modalBox: {
    top: 20,
    backgroundColor: 'orange',
    paddingHorizontal: 18,
    borderRadius: 14,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalBox3: {
    top: 10,
    backgroundcolor: 'black',
    paddingHorizontal: 18,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalBox4: {
    top: 50,
    backgroundColor: 'orange',
    paddingHorizontal: 18,
    borderRadius: 14,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalBox5: {
    top: 1,
    backgroundColor: 'orange',
    paddingHorizontal: 18,
    borderRadius: 14,
    padding: 10,
    marginBottom: 20,
    left: -30,
  },

  modalSmallText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 5,
  },

  icon: {
    width: 20,
    height: 20,
  },


  notif: {
    top: 40,
  },

  inputemail: {
    borderRadius: 14,
    backgroundColor: '#24252B',
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 40,
    width: '100%',
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },





});


export default HomeScreen