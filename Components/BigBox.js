import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';



const BigBox = ({ icon, title, colorIcon, measure, disabled, onBoxPress }) => {
    const [percentage, setPercentage] = useState(0);

    const increasePercentage = () => {
        if (title === 'Eau' && percentage < 100) {
            setPercentage(Math.floor(percentage + 10));
        } else if (title === 'sommeil' && percentage < 100) {
            setPercentage(Math.floor(percentage + 100 / 8));
        } else if (title === 'Sport' && percentage < 100) {
            setPercentage(percentage + 30);
        }
    };

    const decreasePercentage = () => {
        if (title === 'Eau' && percentage < 100 && percentage > 0) {
            setPercentage(Math.floor(percentage - 10));
        } else if (title === 'sommeil' && percentage < 100 & percentage > 8) {
            if (percentage - 100 / 8 < 0) {
                setPercentage(0);
            } else
                setPercentage(Math.floor(percentage - 100 / 8));
        } else if (title === 'Sport' && percentage < 100 && percentage > 0) {
            setPercentage(percentage - 30);
        }
    };


    if (disabled) {
        return (
            <TouchableOpacity onPress={onBoxPress}>
                <ImageBackground source={require('../assets/locked.png')} style={[styles.container, { backgroundColor: '#24252B' }]}>
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
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.container1, { backgroundColor: '#24252B' }]}>
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
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginTop: 0,
        borderRadius: 20,
        width: 175,
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
        width: 175,
        height: 250,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },

    row1: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
        backgroundColor: '#363841',
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
    },

    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 10,
        backgroundColor: '#363841',
        justifyContent: 'center',
        alignItems: 'center',
    },

    percentageTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
    percentageSubtitle: {
        textAlign: 'center',
        fontSize: 9,
        color: 'white',
    },



})

export default BigBox