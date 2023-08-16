import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import { auth, db } from '../firebase'
import { getDocs, collection } from 'firebase/firestore'

const HomeScreen = () => {
  const [prList, setPrList] = useState('')

  const prCollectionRef = collection(db, 'personal_records')

  useEffect(() => {
    const getPR = async () => {
      // READ DATA
      // SET PrList
      try {
        const data = await getDocs(prCollectionRef)
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }))
        setPrList(filteredData)
      } catch (error) {
        console.log(error)
      }
    }

    getPR()
  }, [])

  const navigation = useNavigation()

  const handleSignOut = async () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <View>
      <Text>{auth.currentUser?.email}</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={[styles.button, styles.buttonOther]}
      >
        <Text style={styles.buttonOtherText}>Sign out</Text>
      </TouchableOpacity>

      <View>
        {prList.map((pr) => (
          <Text>Squat: {pr.squat}</Text>
        ))}
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})
