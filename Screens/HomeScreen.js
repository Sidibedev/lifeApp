import { TextInput, View, Alert, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, TouchableHighlight, Button, StatusBar, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';

import { db } from '../FirebaseConfig';
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

//Import Components
import BigBox from '../Components/BigBox';
import ArticleBox from '../Components/ArticleBox'
import Box from '../Components/Box'
import HeaderSection from '../Components/HeaderSection'
import Notification from '../Components/Notification'
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const HomeScreen = (props) => {
  const navigation = useNavigation();
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [Weight, setWeight] = useState(0);

  const [open, setOpen] = useState(false);
  const [isInitializing, setInitializing] = useState(true); // Nouveau état pour le suivi de l'initialisation

  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Java', value: 'java' },
    { label: 'JavaScript', value: 'js' }
  ]);

  const [number, setNumber] = useState('')

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


  //Log Checker
  // Fonction pour récupérer les données de pas quotidiens
  const getStepCountData = async () => {
    // Autoriser l'accès à Google Fit
    await GoogleFit.authorize(options);

    // Définir les dates de début et de fin
    const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Définir l'heure à minuit (début de la journée)
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // Définir l'heure à 23:59:59.999 (fin de la journée)

    // Récupérer les données de pas quotidiens
    GoogleFit.getDailyStepCountSamples({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })
      .then(async (res) => {
        if (res[1] && res[1].steps[0] && res[1].steps[0].value) {
          // Vérifier l'existence de res[1], res[1].steps[0] et res[1].steps[0].value
          setSteps(res[1].steps[0].value);
        }
      })
  };

  // Fonction pour recuperer les calories brûlées quotidiennes
  const getCalorieData = async () => {
    // Autoriser l'accès à Google Fit
    await GoogleFit.authorize(options);

    // Définir les dates de début et de fin
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Récupérer les données des 7 derniers jours
    const endDate = new Date();

    // Récupérer les données de calories brûlées quotidiennes
    GoogleFit.getDailyCalorieSamples({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })
      .then(async (res) => {
        setCalories(res[0].calorie);
      })
  };

  const [erreur, setErreur] = useState("");

  const modifyNumber = async (number) => {
    const numberRegex = /^\+?\d{9,}$/;

    if (number !== undefined && number !== null && number !== "") {
      if (number.match(numberRegex)) {
        try {
          const userRef = doc(db, 'users', props.userInfo.user.email);
          await updateDoc(userRef, {
            phoneNumber: number
          });

          console.log(`Le numéro de téléphone de l'utilisateur '${props.userInfo.user.email}' a été mis à jour dans Firestore.`);
          Toast.show({
            type: 'success',
            text1: 'Numéro de téléphone a été enregistré avec succès.',
          });
          setNumber("");
          setSubscriptionModalVisible(false);
        } catch (error) {
          setErreur("Une erreur est survenue lors de la mise à jour du numéro de téléphone de l'utilisateur :");
          console.error("Une erreur est survenue lors de la mise à jour du numéro de téléphone de l'utilisateur :", error);
          Toast.show({
            type: 'error',
            text1: 'Erreur',
            text2: 'Une erreur est survenue lors de l\'enregistrement de votre numéro de téléphone. Veuillez réessayer.'
          });
        }
      } else {
        setErreur("Le numéro de téléphone doit contenir au moins 9 chiffres.");
        Toast.show({
          type: 'error',
          text1: 'Le numéro de téléphone doit contenir au moins 9 chiffres.',
        });
      }
    } else {
      setErreur("Le numéro de téléphone ne peut pas être vide.")
      Toast.show({
        type: 'error',
        text1: 'Le numéro de téléphone ne peut pas être vide.',
      });
    }
  };

 
  const renderLoadingScreen = () => {
    if (isInitializing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return null;
  };



    

  useEffect(() => {
    const interval = setInterval(() => {
      getStepCountData();
      getCalorieData();

    }, 10000);
    return () => clearInterval(interval);
  }, []);



  //Modal Handler
  const [modalVisible, setModalVisible] = useState(false);
  const [newBoxValue, setNewBoxValue] = useState("");
  const [article, setArticle] = useState({ title: 'Article Title', content: 'Article Content', authors: 'Article Authors', publicationDate: 'Article Publication Date', picture: 'Article Picture' });
  const [articleModalVisible, setArticleModalVisible] = useState(false);
  const handleManualData = () => { //C'est un exemple
    if (selectedBox.title === 'Rythme Cardiaque') {
      setHeartRate(newBoxValue); // Mettre à jour le rythme cardiaque
    }
    setSelectedBox({ ...selectedBox, number: newBoxValue });
    setLastUpdated(new Date().toLocaleString());
  };
  const handleSubscriptionModal = () => {
    setSubscriptionModalVisible(true);
  };
  const handleArticleModal = (articleTitle, articleContent, articleAuthors, articlePublicationDate, articlePicture) => {
    setArticle({ title: articleTitle, content: articleContent, authors: articleAuthors, publicationDate: articlePublicationDate, picture: articlePicture });
    setArticleModalVisible(true);
  };


  //Box Handler
  const [selectedBox, setSelectedBox] = useState(null);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
  const handleBoxPress = (boxData) => {
    setSelectedBox(boxData);
    setModalVisible(true);
  };

  //SignOut Handler with App.js props
  const handleSignOut = () => {
    signOut();
  };



  //UserData from App.js (props)
  const [firstName, setFirstName] = React.useState(props.userInfo.user.givenName);
  const [lastName, setLastName] = React.useState(props.userInfo.user.familyName);
  const [userEmail, setUserEmail] = React.useState(props.userInfo.user.email);
  const [userPicture, setUserPicture] = React.useState(props.userInfo.user.photo);
  //AccessoryData
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); // Formattez la date en français

  const signOut = props.signOut;



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
          <TouchableOpacity onPress={() => setOpen(!open)} style={styles.profil}>
            {userPicture !== null
              ?<Image source={{ uri: userPicture }} style={styles.notification} />
              : <Image source={require('../assets/logo.png')} style={styles.notification} />

            }
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
            <Text style={styles.modalText1}>Ta montre est prête ! Notre liste VIP t'attends 😎
            </Text>

            <Text style={styles.modalText2}>Souscrivez des maintenant pour recevoir votre montre dans les meilleurs délais.</Text>
            <Text style={{ color: 'red', marginTop: 2,}}>{erreur}</Text>
            <TextInput
              style={styles.inputemail}
              placeholder="Votre numéro de téléphone"
              onChangeText={(text) => setNumber(text)}
              value={number}
            // Ajoutez votre logique pour gérer la souscription ici
            />
            <TouchableOpacity style={styles.modalButton} onPress={() => modifyNumber(number)}>
              <Text style={styles.modalButtonText}>Souscrire</Text>
            </TouchableOpacity>

            <Notification title={'Release'} content={'Nos prochaines releases vous réservent pleins de surprises🔥.'} color={'#9D9D9D'} icon={"aperture"} />
            <Toast />
          </View>

        </Modal>

        {/**  Modal Articles */}
        <Modal
          isVisible={articleModalVisible}
          onSwipeComplete={() => setArticleModalVisible(false)}
          swipeDirection="down"
          style={styles.modal}
        >
          <ScrollView style={styles.modalScrollable}>
            <View style={{ borderTopRightRadius: 20, borderTopLeftRadius: 20, overflow: 'hidden', marginBottom: 20, width: '100%' }}>

            </View>
            <View style={styles.rowArticle}>
              <Text style={styles.modalText4}>{article.title}</Text>

            </View>
            <View style={styles.columnArticle}>
              <Text style={styles.modalText5}>Auteurs : {article.authors}</Text>
              <Text style={styles.modalText5}>Publication : {article.publicationDate}</Text>
            </View>
            <View style={styles.rowArticle}>

              <Text style={styles.modalText2}>{article.content}</Text>
            </View>


          </ScrollView>

        </Modal>

        {/**  Modal Profil */}
        <Modal
          isVisible={open}
          onSwipeComplete={() => setOpen(false)}
          swipeDirection="down"
          style={styles.modalProfile}
        >
          <View style={styles.modalViewProfil}>
            <View style={styles.rowprofilLogo}>
              <Image source={require('../assets/logo.png')} style={styles.logo} />
            </View>

            <View style={styles.column}>
              <View style={styles.rowprofil}>
                <View style={styles.rowprofilPicture}>
                {userPicture !== null
                  ?<Image source={{ uri: userPicture }} style={styles.notification} />
                  : <Image source={require('../assets/logo.png')} style={styles.notification} />
    
                }
                </View>
                <View style={styles.rowprofilText}>
                  <Text style={styles.modalText7}>{firstName} {lastName}</Text>
                  <Text style={styles.modalText7}>{userEmail}</Text>
                </View>
              </View>

              <View style={styles.column}>
                <TouchableOpacity onPress={() => handleSignOut()} style={styles.profilButton}>
                  <Text >Déconnexion</Text>
                </TouchableOpacity>

              </View>
            </View>



          </View>

        </Modal>


        {/** Constantes */}
        <View style={styles.Constantes}>

          <Notification title={'Version Bêta'} content={'Vous utiliser la version bêta de LifeS. Next realese 13/06/23 😎 '} color={'#0a0a0a'} icon={"information-circle-sharp"} />
          <View style={{ height: 10 }} />
          <HeaderSection title={'Aujourd\'hui'} haveicon='true' />

          <View style={styles.boxContainer}>
            <Box
              color={'orange'}
              icon={'walk'}
              measure={'Pas'}
              title={'Marche'}
              number={steps} // Utilisez l'état heartRate pour afficher la valeur
            />

            <Box
              color={'#0D991B'}
              icon={'barbell'}
              measure={'KG'}
              title={'Poids'}
              number={0} // Utilisez l'état heartRate pour afficher la valeur
            />

            <Box
              color={'red'}
              icon={'flame'}
              measure={'KCal'}
              title={'Calories brûlées /sem'}
              number={calories} // Utilisez l'état heartRate pour afficher la valeur
            />

            <TouchableOpacity onPress={handleSubscriptionModal} style={styles.action}>
              <Text style={styles.actionText1}>Afficher toutes les constantes</Text>
              <Icon name="chevron-forward-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>

        </View>

        {/** Point Clé */}
        <View style={styles.pointCle}>
          <HeaderSection title={'Points clés'} haveicon='false' icon={'refresh'} />

          <View style={styles.boxContainerPc}>
            <BigBox icon={'water'} title={'Eau'} percentage={0} colorIcon={"#75E4F9"} measure={'Verre'} />
            <BigBox icon={'bed'} title={'sommeil'} percentage={0} colorIcon={"orange"} measure={'Heures'} />
            <BigBox icon={'bicycle-outline'} title={'Sport'} percentage={0} colorIcon={"green"} measure={'Minutes'} />
            <BigBox icon={'medical'} title={'Medocs'} percentage={0} colorIcon={"pink"} measure={'prise VO'} disabled={true} onBoxPress={handleSubscriptionModal} />

          </View>
        </View>

        {/** Connect Watch */}
        <View style={styles.watchContainer}>
          <ImageBackground source={require('../assets/watch.png')} style={styles.watch} />
          <TouchableOpacity onPress={handleSubscriptionModal} style={styles.actionMontre}>
            <Text style={styles.actionText}>Jumeler ma montre</Text>
          </TouchableOpacity>
        </View>

        {/** Articles */}
        <View style={styles.article}>
          <HeaderSection title={'Articles'} haveicon='false' text={'Voir tout'} icon={'refresh'} />
          <View style={styles.boxContainer}>
            <ArticleBox image={require('../assets/article1.jpg')} title={'10 aliments pour contrôler son hypertension'} onBoxPress={() => handleArticleModal('10 aliments pour contrôler son hypertension',
              `Introduction:
L'hypertension artérielle est un problème de santé courant qui peut augmenter le risque de maladies cardiaques et d'accidents vasculaires cérébraux. Heureusement, certaines habitudes alimentaires peuvent aider à maintenir une tension artérielle saine. Cet article présente 10 aliments recommandés pour contrôler l'hypertension.
L'ail:
              L'ail est connu pour ses propriétés bénéfiques pour la santé cardiovasculaire. Il contient des composés actifs qui favorisent la dilatation des vaisseaux sanguins, réduisant ainsi la pression artérielle.

Les légumes-feuilles verts:
              Les épinards, le chou frisé, la laitue et autres légumes-feuilles verts sont riches en nitrates, qui aident à abaisser la pression artérielle en favorisant la relaxation des vaisseaux sanguins.

Les baies:
              Les baies, comme les myrtilles et les fraises, sont riches en antioxydants et en flavonoïdes. Ces composés contribuent à réduire l'inflammation et à protéger les vaisseaux sanguins, aidant ainsi à maintenir une pression artérielle saine.

Les graines de lin:
              Les graines de lin sont riches en acides gras oméga-3 et en fibres solubles. Ces nutriments peuvent aider à réduire la pression artérielle en améliorant la fonction vasculaire et en réduisant l'inflammation.

Les légumineuses:
              Les lentilles, les pois chiches et les haricots sont des sources de protéines végétales riches en fibres et en minéraux tels que le potassium et le magnésium. Ces nutriments favorisent une pression artérielle équilibrée.

Les produits laitiers faibles en matières grasses:
              Les produits laitiers faibles en matières grasses, tels que le lait écrémé et le yaourt grec, sont riches en calcium et en potassium, qui jouent un rôle clé dans la régulation de la pression artérielle.

Les avocats:
              Les avocats sont riches en graisses saines, en fibres et en potassium. Ils aident à maintenir une tension artérielle normale en réduisant les niveaux de cholestérol et en contrôlant l'inflammation.

Les noix:
              Les noix, comme les amandes et les noix de cajou, sont riches en acides gras oméga-3, en fibres et en minéraux tels que le potassium et le magnésium. Elles sont bénéfiques pour la santé cardiaque et peuvent aider à maintenir une pression artérielle saine.

Les tomates:
              Les tomates sont riches en lycopène, un antioxydant puissant. Le lycopène contribue à la relaxation des vaisseaux sanguins, ce qui peut aider à maintenir une tension artérielle normale.

Le chocolat noir:
              Le chocolat noir contient des flavonoïdes qui favorisent la santé cardiovasculaire en améliorant la fonction vasculaire et en réduisant la pression artérielle.

Conclusion:
              L'adoption d'une alimentation équilibrée comprenant ces 10 aliments peut contribuer à la prévention et au contrôle de l'hypertension artérielle. Cependant, il est important de consulter un professionnel de la santé avant d'apporter des changements significatifs à votre régime alimentaire pour prendre en compte vos besoins individuels.`,
              'Dr. Marie Dubois',
              '2022', '../assets/article1.jpg')} />
            <ArticleBox image={require('../assets/article2.jpg')} title={'Le stress, un facteur favorisant le diabète.'} onBoxPress={() => handleArticleModal('Le stress, un facteur favorisant le diabète.', 'Au cours de la dernière décennie, une abondance de preuves a émergé démontrant un lien étroit entre le métabolisme et l\'immunité. Il est maintenant clair que l\'obésité est associée à un état d\'inflammation chronique de faible niveau. Dans cet article, nous discutons des fondements moléculaires et cellulaires de l\'inflammation induite par l\'obésité et des voies de signalisation à l\'intersection du métabolisme et de l\'inflammation qui contribuent au diabète. Nous considérons également les mécanismes par lesquels la réponse inflammatoire peut être initiée et discutons des raisons de la réponse inflammatoire dans l\'obésité. Nous proposons à la réflexion quelques hypothèses concernant des questions importantes non résolues dans le domaine et suggérons un modèle pour l\'intégration des voies inflammatoires et métaboliques dans la maladie métabolique.', 'Kathryn E. Wellen, Gökhan S. Hotamisligil', '2015', '../assets/article2.jpg')} />

          </View>
        </View>


      </ScrollView>
      <Toast/>
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

  modalProfile: {

    justifyContent: 'flex-end',
    //Make it look like a card little
  },


  dropdownContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    marginBottom: 20,
  },

  article:
    { width: '100%' },
  //Header
  headerContainer: {
    flex: 0.2,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: '1%',
    justifyContent: 'flex-start',
  },

  modalScrollable: {
    margin: 0,
    width: '100%',
    paddingTop: '1%',
    marginBottom: 20,
    paddingBottom: 20,
    backgroundColor: "#eeeeee",
    borderRadius: 20,
  },

  imageModal: {
    width: '100%',
    height: 300,
    resizeMode: "cover",
    justifyContent: "center",
    borderRadius: 20,
  },

  header: {
    height: '100%',

    flexDirection: 'row',
    paddingTop: '2%',
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

  modalText4: {
    fontSize: 35,
    fontWeight: 900,
    color: 'black',
    marginBottom: 20,
  },

  modalText5: {
    fontSize: 15,
    fontWeight: 600,
    color: 'black',
    //mettre en gras
    marginBottom: 20,
  },


  //Constantes
  scrollView: {
    flex: 1,

    width: '100%',
    paddingHorizontal: 20,
    paddingTop: '1%',
    marginBottom: 10,
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
    width: '100%',
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
    borderWidth: 1,
    borderColor: '#d7d7d7',
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
    backgroundColor: '#090909',
    justifyContent: 'center',
    paddingHorizontal: 9,
    paddingVertical: 14,
    width: '80%',
    borderRadius: 14
  },

  actionText: {
    fontSize: 15,
    color: 'white',
    marginRight: 5,
  },

  actionText1: {
    fontSize: 15,
    color: 'black',
    marginRight: 5,
  },

  // Watch
  watchContainer: {
    flex: 1,
    borderRadius: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },

  watch: {
    width: '100%',
    height: 400,
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
    margin: 0,
    backgroundColor: "#eeeeee",
    borderRadius: 20,
    paddingRight: 30,
    paddingLeft: 30,
    paddingTop: 20,
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

  modalViewProfil: {
    margin: 0,
    backgroundColor: "#f3f6f4",
    borderRadius: 20,
    paddingRight: 30,
    paddingLeft: 30,
    paddingTop: 20,
    width: '100%',
    height: '40%',
    justifyContent: 'center',

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
    fontSize: 60,
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
    marginBottom: 5,
    color: 'black',
    textAlign: "left",
    fontSize: 20,
    fontWeight: 'bold',
  },


  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },

  rowArticle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 18,
    marginBottom: 20,
  },

  columnArticle: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '80%',
    paddingHorizontal: 18,
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
    backgroundColor: '#090909',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  modalButtonText: {
    color: 'white',
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
  },

  modalBox3: {
    top: 10,
    backgroundcolor: 'black',
    paddingHorizontal: 18,
    padding: 10,
    elevation: 2,
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
    backgroundColor: '#f3f6f4',
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

  rowprofil: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: '#cfe2f3',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 18,
    marginBottom: 20,
  },

  rowprofilPicture: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '10%',
    paddingHorizontal: 18,
    marginBottom: 20,
    marginTop: 20,
  },

  rowprofilText: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 18,
    marginBottom: 20,
    marginTop: 20,
  },

  column: {
    flexDirection: 'column',
  },

  modalText7: {
    marginLeft: '30%',
    color: 'black',
    fontSize: 15,
    width: '100%',
  },

  modalText6: {
    textAlign: "center",
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    width: '100%',
  },

  profilButton: {
    borderRadius: 15,
    padding: 15,

    borderWidth: 1,
    borderColor: '#d7d7d7',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  logo: {
    width: 70,
    height: 70,
    borderColor: '#f3f6f4',
  },

  rowprofilLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 18,
    marginBottom: 20,
  }


});


export default HomeScreen