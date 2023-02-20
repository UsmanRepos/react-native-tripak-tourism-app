import { Modal, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { Rating } from 'react-native-ratings';
import { COLORS, SIZES, icons, FONTS } from '../constants'

const CustomReviewModal = ({
    modalVisible, setModalVisible, setReview, review, addReview
}) => {

    const [disable, setDisable] = useState(true)

    const handleVisibility = () => {
        const text = review.text.trim()

        if (text == "") {
            setDisable(true);
        } else {
            setDisable(false)
        }

    };

    function ratingCompleted(rating) {
        console.log("Rating is: " + rating)
        setReview({
            ...review,
            rating: rating
        })
    }

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.text_header}>Review Form</Text>
                </View>

                {/* Footer */}
                <Animatable.View
                    style={styles.footer}
                    animation='fadeInUpBig'
                >
                    <Rating
                        type='star'
                        ratingCount={5}
                        imageSize={60}
                        showRating
                        onFinishRating={ratingCompleted}
                    />
                    <Text style={styles.text_footer}>Review</Text>
                    <View style={styles.action}>
                        <TextInput
                            multiline
                            placeholder='How Was Your Experience With Us'
                            style={styles.textInput}
                            autoCapitalize='none'
                            onChangeText={(text) => {
                                setReview({
                                    ...review,
                                    text: text
                                })
                                handleVisibility()
                            }}
                            value={review.text}
                        />
                    </View>

                    {/* Buttons */}
                    <View style={styles.button}>
                        <TouchableOpacity
                            disabled={disable}
                            style={{ width: '100%' }}
                            onPress={() => addReview()}
                        >
                            <LinearGradient
                                colors={['#08d4c4', '#01ab9d']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, { color: 'white' }]}>Submit Review</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.signIn, {
                                marginTop: 15,
                                borderColor: '#009387',
                                borderWidth: 1
                            }]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={[styles.textSign, {
                                color: '#009387'
                            }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View >
            </View>
        </Modal>
    )
}

export default CustomReviewModal


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        ...FONTS.body3,
        color: '#05375a',
        fontSize: 18,
        marginTop: SIZES.padding * 2
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },

    textInput: {
        flex: 1,
        height: '100%',
        marginLeft: 10,
        color: '#05375a',
        ...FONTS.body4
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        ...FONTS.h3,
        fontSize: 18,
    }
});



