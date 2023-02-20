import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import Checkbox from 'expo-checkbox';
import * as Animatable from 'react-native-animatable'
import { FONTS, SIZES, COLORS, icons } from '../../constants';

const ScreenTwo = ({ onTabPress, requestInFo, setRequestInFo }) => {

  const [isCustomizedTrip, setCustomizedTrip] = useState(false)
  const [isPublicTrip, setPublicTrip] = useState(false)

  const renderSectionOne = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding * .5
        }}
      >
        {/* Header */}
        <View>
          <Text style={{ ...FONTS.h3 }}>Who & How many are You Travelling?</Text>
        </View>

        {/* Input FIelds */}
        <View style={{ marginTop: SIZES.radius }}>
          <Text>How many adults? *</Text>
          <TextInput
            placeholder="1"
            keyboardType='numeric'
            style={styles.textInput}
            autoCapitalize='none'
            placeholderTextColor={COLORS.gray50}
            onChangeText={(value) => {
              setRequestInFo({
                ...requestInFo,
                noOfAdults: value
              })
            }}
            value={requestInFo.noOfAdults}
          />
        </View>
        <View style={{ marginTop: SIZES.radius }}>
          <Text>How many children? *</Text>
          <TextInput
            placeholder="1"
            keyboardType='numeric'
            style={styles.textInput}
            autoCapitalize='none'
            placeholderTextColor={COLORS.gray50}
            onChangeText={(value) => {
              setRequestInFo({
                ...requestInFo,
                noOfChildrens: value
              })
            }}
            value={requestInFo.noOfChildren}
          />
        </View>
        <View style={{ marginTop: SIZES.radius }}>
          <Text style={{ ...FONTS.body4 }}>How many infants? *</Text>
          <TextInput
            placeholder="1"
            keyboardType='numeric'
            style={styles.textInput}
            autoCapitalize='none'
            placeholderTextColor={COLORS.gray50}
            onChangeText={(value) => {
              setRequestInFo({
                ...requestInFo,
                noOfInfants: value
              })
            }}
            value={requestInFo.noOfInfants}
          />
        </View>
      </View>
    );
  };

  const renderSectionTwo = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding * .5,
          marginTop: SIZES.padding
        }}
      >
        {/* Header */}
        <View style={{ marginTop: SIZES.radius }} >
          <Text style={{ ...FONTS.h3 }}>Are There any couples travelling?</Text>
        </View>

        {/* Input FIelds */}
        <View style={{ marginTop: SIZES.radius }}>
          <Text style={{ ...FONTS.body4 }}>How many couples</Text>
          <TextInput
            placeholder="1"
            keyboardType='numeric'
            style={styles.textInput}
            autoCapitalize='none'
            placeholderTextColor={COLORS.gray50}
            onChangeText={(value) => {
              setRequestInFo({
                ...requestInFo,
                noOfCouples: value
              })
            }}
            value={requestInFo.noOfCouples}
          />
        </View>
      </View>
    );
  };



  const renderButtons = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: SIZES.padding * .5,
          paddingVertical: SIZES.padding
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            height: 45,
            backgroundColor: COLORS.sceondary,
            marginRight: SIZES.padding * .5,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => onTabPress(0)}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            height: 45,
            backgroundColor: COLORS.primary,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => onTabPress(2)}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Animatable.View style={styles.container}
      animation='fadeInUpBig'
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: SIZES.radius,
        }}
      >
        {/* How Many People Travelling   */}
        {renderSectionOne()}

        {/* Are Couple Travelling */}
        {renderSectionTwo()}

        {/* Buttons */}
        {renderButtons()}
      </ScrollView>
    </Animatable.View>
  )
}

export default ScreenTwo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: SIZES.padding
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.gray70,
    paddingHorizontal: SIZES.radius,
    marginTop: SIZES.base,
    borderRadius: SIZES.base,
    color: '#05375a',
    ...FONTS.body4
  },
})