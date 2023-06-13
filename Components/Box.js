import { View, Text, StyleSheet } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';



const Box = () => {

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: 'red' }]}>
            <View style={styles.row1}>
            </View>
            <View style={styles.row2}>
                
            </View>
            <View style={styles.row3}>
                
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginTop: 30,
        borderRadius: 20,
        width: 175,
        height: 170,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    row1: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'start',
    },

    row2: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'start',
    },

    row3: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'start',

        marginBottom: 15,
    },

    minilogo: {
        top: 5,
        width: 65,
        height: 60,
        borderRadius: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },

    number: {
        marginTop: 15,
        height: 50,
        marginLeft: 8,
        fontWeight: 'bold',
        fontSize: 50,
        paddingBottom: 5,
        color: 'white',
    },

    title: {
        top: 25,
        fontSize: 14,
        marginLeft: 8,
        paddingRight: 11,
        color: 'white',
    },

    measure: {
        marginTop: 30,
        height: 50,
        marginLeft: 8,
        fontSize: 19,
        paddingRight: 11,
        color: 'white',
    },


})

export default Box