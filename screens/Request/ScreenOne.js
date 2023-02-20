import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Animatable from 'react-native-animatable'
import { COLORS, FONTS, SIZES } from '../../constants';

const ScreenOne = ({ onTabPress, requestInFo, setRequestInFo }) => {

  const renderHeader = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding * 0.5,
          paddingVertical: SIZES.padding
        }}
      >
        <Text style={{ ...FONTS.h3 }}>Please enter your personal information</Text>
      </View>
    );
  };

  const renderInputFields = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding * .5
        }}
      >
        <View style={{ marginTop: SIZES.radius }}>
          <Text style={{ ...FONTS.body4 }}>First Name</Text>
          <TextInput
            placeholder="Enter First Name"
            keyboardType='default'
            style={styles.textInput}
            autoCapitalize='none'
            placeholderTextColor={COLORS.gray50}
            onChangeText={(value) => {
              setRequestInFo({
                ...requestInFo,
                firstName: value
              })
            }}
            value={requestInFo.firstName}
          />
        </View>

        <View style={{ marginTop: SIZES.radius }}>
          <Text style={{ ...FONTS.body4 }}>Last Name</Text>
          <TextInput
            placeholder="Enter Last Name"
            style={styles.textInput}
            autoCapitalize='none'
            placeholderTextColor={COLORS.gray50}
            onChangeText={(value) => {
              setRequestInFo({
                ...requestInFo,
                lastName: value
              })
            }}
            value={requestInFo.lastName}
          />
        </View>
        <View style={{ marginTop: SIZES.radius }}>
          <Text style={{ ...FONTS.body4 }}>Phone Number</Text>
          <TextInput
            placeholder="Enter Phone Number"
            keyboardType='phone-pad'
            style={styles.textInput}
            autoCapitalize='none'
            placeholderTextColor={COLORS.gray50}
            onChangeText={(value) => {
              setRequestInFo({
                ...requestInFo,
                phoneNumber: value
              })
            }}
            value={requestInFo.phoneNumber}
          />
        </View>

        <View style={{ marginTop: SIZES.radius }}>
          <Text style={{ ...FONTS.body4 }}>Email Address</Text>
          <TextInput
            placeholder="Enter Email Address"
            keyboardType='email-address'
            style={styles.textInput}
            autoCapitalize='none'
            placeholderTextColor={COLORS.gray50}
            onChangeText={(value) => {
              setRequestInFo({
                ...requestInFo,
                email: value
              })
            }}
            value={requestInFo.email}
          />
        </View>
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <TouchableOpacity
        style={{
          height: 45,
          backgroundColor: COLORS.sceondary,
          marginHorizontal: SIZES.padding * .5,
          marginTop: SIZES.padding,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5
        }}
        onPress={() => onTabPress(1)}
      >
        <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Next</Text>
      </TouchableOpacity>
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
        {/* Header */}
        {renderHeader()}

        {/* Field Input Section */}
        {renderInputFields()}

        {/* Next Button */}
        {renderNextButton()}
      </ScrollView>
    </Animatable.View>

  );
};

export default ScreenOne

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