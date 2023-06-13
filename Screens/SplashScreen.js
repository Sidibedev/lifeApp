import { View, Text, ImageBackground } from 'react-native'
import React from 'react'

const SplashScreen = () => {
  return (
    <ImageBackground source={require('../assets/SplashScreen.png')} style={{ width: '100%', height: '100%' }}/>
  )
}

export default SplashScreen