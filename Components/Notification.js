import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';


const Notification = ({ title, content, color, icon}) => {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.leftIcon}>
        <Icon name={icon} size={30} color="white" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{content}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.8,
  },
  leftIcon: {
    width: 30,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
  },

  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 20,
  },
  title: {
    fontSize: 20,
    paddingBottom: 5,
    fontWeight: 'bold',
    color: 'white',
  },

  subtitle: {
    fontSize: 12,
    paddingRight: 11,
    color: 'white',
  },


})

export default Notification