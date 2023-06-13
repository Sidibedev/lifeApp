import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'



const BigBox = ({  title, image,onBoxPress}) => {
    return (
        <TouchableOpacity onPress={onBoxPress} style={{ borderRadius: 20, overflow: 'hidden', backgroundColor:'red',marginBottom: 20,marginTop: 5 }}>
            <ImageBackground source={image} style={styles.container}>
                <View style={styles.row1}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.row2}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.titleButton}>Lire plus</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderRadius: 100,
        width: 370,
        height: 400,
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
        alignItems: 'center',
    },

    row2: {
        flex: 1,
        width: '100%',
        top: 5,
        flexDirection: 'row',
        marginBottom: 25,
        marginLeft: 30,
        justifyContent: 'start',
        alignItems: "flex-end",
    },

    title: {
        fontweight: 400,
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