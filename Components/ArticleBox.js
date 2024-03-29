import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'



const BigBox = ({  title, image,onBoxPress}) => {
    return (
        <View style={{ borderRadius: 20, overflow: 'hidden',marginBottom: 20,marginTop: 5, width: '100%'  }}>
            <ImageBackground source={image} style={styles.container}>
                <View style={styles.row1}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.row2}>
                    <TouchableOpacity onPress={onBoxPress} style={styles.button}>
                        <Text style={styles.titleButton}>Lire plus</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderRadius: 100,
        width: "100%",
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    row1: {
        flex: 1.5,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },

    row2: {
        flex: 1,
        width: '100%',
        top: 5,
        flexDirection: 'row',
        marginBottom: 25,
        marginLeft: 30,
        alignItems: "flex-end",
    },

    title: {
        fontSize: 40,
        fontWeight: 'bold',
        opacity: 1,
        paddingHorizontal: 5,
        marginLeft: 10,
        color: '#FFFFFF',
    },

    button: {
        backgroundColor: '#24252B',
        borderRadius: 10,
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    titleButton: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 500,
    },




})

export default BigBox