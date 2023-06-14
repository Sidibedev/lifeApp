import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';



const BigBox = ({ icon, title, colorIcon, measure, disabled, onBoxPress }) => {
    const [percentage, setPercentage] = useState(0);
    const isMountedRef = React.useRef(null);

    React.useEffect(() => {
      isMountedRef.current = true;
      return () => isMountedRef.current = false;
    }, []);
    
    const resetPercentage = async () => {
        const now = new Date();
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        const timeToNextDay = nextDay - now;
        setTimeout(async () => {
          // Réinitialisez le pourcentage ici
          setPercentage(0);
          await AsyncStorage.setItem(`${title}_percentage`, String(0));
          // Ensuite, vérifiez chaque jour
          setInterval(async () => {
            // Réinitialisez le pourcentage ici
            setPercentage(0);
            await AsyncStorage.setItem(`${title}_percentage`, String(0));
          }, 24 * 60 * 60 * 1000); // Chaque 24 heures
        }, timeToNextDay); // Temps jusqu'à minuit
      };
    
    React.useEffect(() => {
      resetPercentage();
    })

    



    const increasePercentage = async () => {
        let updatedPercentage;
      
        if (title === 'Eau' && percentage < 100) {
          updatedPercentage = Math.floor(percentage + 10);
        } else if (title === 'sommeil' && percentage < 100) {
          updatedPercentage = Math.floor(percentage + 100 / 8);
        } else if (title === 'Sport' && percentage < 100) {
          updatedPercentage = percentage + 30;
        }
      
        if (updatedPercentage !== undefined) {
          setPercentage(updatedPercentage);
          await AsyncStorage.setItem(`${title}_percentage`, String(updatedPercentage));
        }
      };
      
      const decreasePercentage = async () => {
        let updatedPercentage;
      
        if (title === 'Eau' && percentage < 100 && percentage > 0) {
          updatedPercentage = Math.floor(percentage - 10);
        } else if (title === 'sommeil' && percentage < 100 && percentage > 8) {
          if (percentage - 100 / 8 < 0) {
            updatedPercentage = 0;
          } else {
            updatedPercentage = Math.floor(percentage - 100 / 8);
          }
        } else if (title === 'Sport' && percentage < 100 && percentage > 0) {
          updatedPercentage = percentage - 30;
        }
      
        if (updatedPercentage !== undefined) {
          setPercentage(updatedPercentage);
          await AsyncStorage.setItem(`${title}_percentage`, String(updatedPercentage));
        }
      };
      
      
      React.useEffect(() => {
        resetPercentage();
        const fetchPercentage = async () => {
          const storedPercentage = await AsyncStorage.getItem(`${title}_percentage`);
          if (storedPercentage) {
            setPercentage(Number(storedPercentage));
          }
          console.log(storedPercentage)
        };
      
        fetchPercentage();
      }, []);
      

    if (disabled) {
        return (
            
                <ImageBackground ssource={require('../assets/locked.png')} style={[styles.container, { backgroundColor: '#24252B' }]}>
                <TouchableOpacity onPress={onBoxPress} >
                <View style={styles.row1}>
                        <View style={styles.minilogo}>
                            <Icon name={icon} size={30} color={colorIcon} />
                        </View>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.row2bis}>
                        <AnimatedCircularProgress
                            size={110}
                            width={10}
                            fill={percentage} // pourcentage de remplissage
                            tintColor={colorIcon} // couleur de la barre de progression
                            onAnimationComplete={() => console.log('onAnimationComplete')}
                            backgroundColor="#3d5875">
                            {
                                (fill) => (
                                    <Text style={styles.percentageTitle}>
                                        {percentage}%
                                        <Text style={styles.percentageSubtitle}>
                                            {'\n'}{measure}
                                        </Text>
                                    </Text>
                                )}
                        </AnimatedCircularProgress>
                    </View>
                    <View style={styles.row3}>
                        <TouchableOpacity style={styles.button} onPress={increasePercentage}>
                            <Text style={styles.title}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={decreasePercentage}>
                            <Text style={styles.title}>-</Text>
                        </TouchableOpacity>
                    </View>
                    </TouchableOpacity>
                </ImageBackground>
        );
    }

    return (
        <View style={[styles.container1,
        {
            backgroundColor: 'white',
        }]}>
            <View style={styles.row1}>
                <View style={styles.minilogo}>
                    <Icon name={icon} size={30} color={colorIcon} />
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.row2}>
                <AnimatedCircularProgress
                    size={110}
                    width={10}
                    fill={percentage} // pourcentage de remplissage
                    tintColor={colorIcon} // couleur de la barre de progression
                    backgroundColor="#bcbcbc">
                    {
                        (fill) => (
                            <Text style={styles.percentageTitle}>
                                {percentage}%
                                <Text style={styles.percentageSubtitle}>
                                    {'\n'}{measure}
                                </Text>
                            </Text>
                        )}
                </AnimatedCircularProgress>
            </View>
            <View style={styles.row3}>
                <TouchableOpacity style={styles.button} onPress={increasePercentage}>
                    <Text style={styles.title}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={decreasePercentage}>
                    <Text style={styles.title}>-</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginTop: 0,
        borderRadius: 20,
        width: '50%',
        height: 250,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        opacity: 0.2,
    },

    container1: {
        flexDirection: 'column',
        marginTop: 30,
        borderRadius: 20,
        width: '48%',
        height: 250,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,

        // add shadow and elevation
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,

        // Pour Android
        elevation: 2,
    },

    row1: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },

    row2: {
        flex: 1,
        width: '100%',
        top: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    row2bis: {
        flex: 1,
        width: '100%',
        top: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    row3: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        top: 25,
        marginBottom: 15,
    },


    minilogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 10,
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#060606',
    },

    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 10,
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
        alignItems: 'center',
    },

    percentageTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: "bold",
        color: '#060606',
    },
    percentageSubtitle: {
        textAlign: 'center',
        fontSize: 9,
        color: '#060606',
    },



})

export default BigBox