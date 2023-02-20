import { TextInput, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { FONTS, SIZES, COLORS } from '../../constants';

const ScreenThree = ({ onTabPress, requestInFo, setRequestInFo, handleRequest }) => {

  const renderSectionOne = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding * 0.5
        }}
      >
        {/* Header */}
        <View style={{ marginTop: SIZES.radius }} >
          <Text style={{ ...FONTS.h3 }}>Where and When would you like to travel?</Text>
        </View>

        {/* Input Fields */}
        <View>
          <View style={{ marginTop: SIZES.radius }}>
            <Text style={{ ...FONTS.body4 }}>Departure City *</Text>
            <TextInput
              placeholder="Enter your city name"
              style={styles.textInput}
              autoCapitalize='none'
              placeholderTextColor={COLORS.gray50}
              onChangeText={(value) => {
                setRequestInFo({
                  ...requestInFo,
                  departureCity: value
                })
              }}
              value={requestInFo.departureCity}
            />
          </View>

          <View style={{ marginTop: SIZES.radius }} >
            <Text style={{ ...FONTS.body4 }}>Destination City *</Text>
            <TextInput
              placeholder="Enter your final destination"
              style={styles.textInput}
              autoCapitalize='none'
              placeholderTextColor={COLORS.gray50}
              onChangeText={(value) => {
                setRequestInFo({
                  ...requestInFo,
                  destinationCity: value
                })
              }}
              value={requestInFo.destinationCity}
            />
          </View>

          <View style={{ marginTop: SIZES.radius }}>
            <Text style={{ ...FONTS.body4 }}>Departure Date *</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              style={styles.textInput}
              autoCapitalize='none'
              placeholderTextColor={COLORS.gray50}
              onChangeText={(value) => {
                setRequestInFo({
                  ...requestInFo,
                  departureDate: value
                })
              }}
              value={requestInFo.departureDate}
            />
          </View>

          <View style={{ marginTop: SIZES.radius }}>
            <Text style={{ ...FONTS.body4 }}>Tour Duration *</Text>
            <TextInput
              placeholder="How many days"
              keyboardType='numeric'
              style={styles.textInput}
              autoCapitalize='none'
              placeholderTextColor={COLORS.gray50}
              onChangeText={(value) => {
                setRequestInFo({
                  ...requestInFo,
                  tourDuration: value
                })
              }}
              value={requestInFo.tourDuration}
            />
          </View>

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
          onPress={() => onTabPress(1)}
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
          onPress={() => handleRequest()}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Plan My Trip</Text>
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
        {/* Where & When Travel */}
        {renderSectionOne()}

        {/* Buttons  */}
        {renderButtons()}

      </ScrollView>
    </Animatable.View>
  );
};

export default ScreenThree

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