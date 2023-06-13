import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const HeaderSection = ({title,subtitle,icon,text,haveicon,onpress}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.constantesContainer}>
        <View style={styles.headerConstantes}>
          <View style={styles.headerContentConstantes}>
            <Text style={styles.titleSection}>{title}</Text>
            <Text style={styles.subtitleSection}>{subtitle}</Text>
          </View>

          <View style={styles.refreshIcon}>
          {haveicon==='true' ? 
            <Icon name={icon} size={30} color="white" style={styles.icon}/> 
            : <TouchableOpacity onPress={onpress} ><Text style={styles.subtitleSectionRight}>{text}</Text></TouchableOpacity>
          }
          </View>
        </View>
      
      </View>
  )
}

const styles = StyleSheet.create({
//ComponentHeaderSection
constantesContainer: {
    flex: 1,
    paddingHorizontal : 5,
    paddingVertical : 5,

    paddingLeft: 5,
  },

  headerConstantes :
  {
    width : '100%',
    flexDirection : 'row',
  },

  headerContentConstantes :{
    flex : 2,
  },

  titleSection : {
    fontSize : 20,
    fontWeight : 600,
    color: 'black',
  },

  subtitleSection :{
    fontSize : 11,
    fontWeight : 600,
    color: 'black',
  },

  refreshIcon : {
    flex : 0.4,
  },

  subtitleSectionRight :{
    fontSize : 11,
    fontWeight : 600,
    paddingTop : 10,
    color: 'black',},

  icon : {
    paddingLeft : 20,
    paddingTop : 3,
  },

});

export default HeaderSection