import { Modal, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { COLORS, SIZES, icons, FONTS } from '../constants';

const BookingSeatModal = ({ containerStyle, seats, setSeats, modalVisible, setModalVisible, handleBooking }) => {
    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: COLORS.transparentBlack4,
                    ...containerStyle
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            width: 320,
                            height: 230,
                            borderRadius: SIZES.radius,
                            paddingHorizontal: SIZES.padding * .9,
                            backgroundColor: COLORS.white
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                marginTop: 20,
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={{ ...FONTS.body3 }}>If you book more than two seats you got 20% discount</Text>
                            
                            {/* Seat Field */}
                            <View style={{ marginTop: SIZES.radius }}>
                                <Text style={{ ...FONTS.h4 }}>How many seats ?</Text>
                                <TextInput
                                    placeholder="Enter No Of Seats"
                                    keyboardType="numeric"
                                    style={styles.textInput}
                                    autoCapitalize='none'
                                    placeholderTextColor={COLORS.gray50}
                                    onChangeText={(value) => {
                                        setSeats(value)
                                    }}
                                    value={seats}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                height: 60,
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                width: '100%',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{
                                    height: 40,
                                    marginRight: SIZES.base,
                                    paddingHorizontal: SIZES.radius,
                                    borderRadius: SIZES.base,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: COLORS.primary
                                }}
                                onPress={setModalVisible}
                            >
                                <Text style={{ ...FONTS.h3, color: COLORS.gray70 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    height: 40,
                                    paddingHorizontal: SIZES.radius,
                                    borderRadius: SIZES.base,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: COLORS.primary
                                }}
                                onPress={() => { 
                                    handleBooking()
                                    setModalVisible(!modalVisible)
                                }}
                            >
                                <Text style={{ ...FONTS.h3, color: COLORS.white }}>Book</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default BookingSeatModal

const styles = StyleSheet.create({
    textInput: {
      height: 40,
      borderBottomWidth: 1,
      borderColor: COLORS.gray70,
      paddingHorizontal: SIZES.radius,
      marginTop: SIZES.base,
      borderRadius: SIZES.base,
      color: '#05375a',
      ...FONTS.body4
    },
  })