import { View, Text, StyleSheet } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';



const Box = ({ icon, measure, number, title, color,onPress }) => {

    const [finalColor, setFinalColor] = useState(color)

    const handleColor = () => {
        
        if (number === 0 )
            setFinalColor('lightgrey')
        else
            setFinalColor(color)
    }

    useEffect(() => {
        handleColor()
    }, [number])

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: finalColor }]}>
            <View style={styles.row1}>
                <View style={styles.minilogo}>
                    <Icon name={icon} size={30} color={finalColor} />
                </View>
            </View>
            <View style={styles.row2}>
                <Text style={styles.number}>{number}</Text>
                <Text style={styles.measure}>{measure}</Text>
            </View>
            <View style={styles.row3}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingLeft: 10,
        borderRadius: 20,
        width: '100%',
        height: 170,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        marginBottom: 15,
    },
    row1: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
    },

    row2: {
        flex: 1.2,
        width: '100%',
        alignItems:'flex-start',
        alignContent:'flex-start',
        flexDirection: 'row',
    },

    row3: {
        flex: 0.4,
        width: '100%',
        flexDirection: 'row',

        marginBottom: 15,
    },

    minilogo: {
        top: '5%',
        width: '40%',
        height: '90%',
        borderRadius: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },

    number: {
        height: '100%',
        marginLeft: 8,
        fontWeight: 'bold',
        fontSize: 53,
        color: 'white',
    },

    title: {
        fontSize: 14,
        marginLeft: 8,
        paddingRight: 11,
        color: 'white',
    },

    measure: {
        marginTop: 30,
        height: 50,
        marginLeft: 8,
        fontSize: 15,
        paddingRight: 11,
        color: 'white',
    },


})

export default Box