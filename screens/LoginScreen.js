import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, googleProvider } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('Home')
      }
    })

    return unsubscribe
  }, [])

  const handleLogin = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredentials.user
      console.log('Logged in with:', user.email)
    } catch (error) {
      console.error('Error during login:', error)
      alert('Error during login. Check your email and password.')
    }
  }

  const handleSignUp = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredentials.user
      console.log('Registered with:', user.email)
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('That email address is already in use!')
      } else {
        // Handle other errors
        console.error('Error during sign up:', error)
        alert(
          'Error during sign up. Make sure that your password is at least 6 characters long.'
        )
      }
    }
  }

  const handleGoogleLogin = async () => {
    // TODO: https://youtu.be/XB_gNDoOhjY?t=972
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Error during Google login:', error)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleGoogleLogin}
          style={[styles.button, styles.buttonOther]}
        >
          <Text style={styles.buttonOtherText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '70%'
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  buttonContainer: {
    width: '50%',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 40
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  buttonOutline: {
    backgroundColor: '#fff',
    borderColor: '#0782F9',
    borderWidth: 2
  },
  buttonOther: {
    backgroundImage:
      'url(https://img.icons8.com/color/48/000000/google-logo.png)',
    backgroundColor: '#fff',
    borderColor: '#CBCBCB',
    borderWidth: 2
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16
  },
  buttonOtherText: {
    color: '#505050',
    fontWeight: '700',
    fontSize: 16
  }
})
