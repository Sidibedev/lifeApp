import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native'
import React from 'react'

const ProfileScreen = () => {
    return (
        <ImageBackground source={require('../assets/profilebg.png')} style={styles.container}>
            <View style={styles.header}>
                {/** Profile Picture */}
                <View style={styles.profilePicture}>
                        <Image source={require('../assets/profil.png')} style={styles.image} />
                </View>
            </View>

            
        </ImageBackground>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'yellow',
    },

    profilePicture: {
        width: 100,
        height:100,
        borderRadius: 100,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },




})

export default ProfileScreen