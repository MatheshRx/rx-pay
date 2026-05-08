import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ConfirmScreen() {
  return (
    <View style={styles.container}>
      <Text>ConfirmScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
