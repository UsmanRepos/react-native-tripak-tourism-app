import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native'
import React, { createRef, useCallback, useRef, useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES } from '../../constants';
import { CustomAlert } from '../../components';
import Moment from 'moment'
import { auth, db } from '../../firebase'
import ScreenOne from './ScreenOne'
import ScreenTwo from './ScreenTwo'
import ScreenThree from './ScreenThree'

const requestSteps = [
    {
        id: 0,
        label: "Contact",
        ref: createRef()
    },
    {
        id: 1,
        label: "Traveller's",
        ref: createRef()
    },
    {
        id: 2,
        label: "Travelling",
        ref: createRef()
    }
];


const TabIndicator = ({ measureLayout, scrollX }) => {

    const inputRange = requestSteps.map((_, i) => i * SIZES.width);
    const tabIndicatorWidth = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure => measure.width)
    });
    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure => measure.x)
    });



    return (
        <Animated.View
            style={{
                position: 'absolute',
                bottom: 0,
                width: tabIndicatorWidth,
                height: "100%",
                backgroundColor: COLORS.sceondary,
                borderRadius: SIZES.radius,
                transform: [
                    {
                        translateX,
                    }
                ]
            }}
        >
        </Animated.View>
    );
};

const Tabs = ({ scrollX, completed }) => {

    const [measureLayout, setMeasureLayout] = useState([])
    const containerRef = useRef()

    useEffect(() => {
        let ml = []
        requestSteps.forEach(step => {
            step?.ref?.current?.measureLayout(
                containerRef.current,
                (x, y, width, height) => {
                    ml.push({
                        x, y, width, height
                    });

                    if (ml.length === requestSteps.length) {
                        setMeasureLayout(ml)
                    }
                }
            );
        });
    }, [containerRef.current])

    return (
        <View
            ref={containerRef}
            style={{
                flex: 1,
                flexDirection: 'row',
            }}
        >
            {/* Tabs Indicator */}
            {measureLayout.length > 0 &&
                <TabIndicator
                    measureLayout={measureLayout}
                    scrollX={scrollX}
                />
            }
            {/* Tabs */}
            {requestSteps.map((item, index) => {
                return (
                    <View
                        key={`Tab-${index}`}
                        ref={item.ref}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: completed.length > index ? COLORS.white : COLORS.primary,
                                backgroundColor: completed.length > index ? COLORS.primary : COLORS.white
                            }}
                        >
                            <Text
                                style={{
                                    color: completed.length > index ? COLORS.white : COLORS.gray60
                                }}
                            >{index + 1}</Text>
                        </View>
                        <View
                            style={{
                                marginTop: SIZES.base,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: COLORS.gray60, lineHeight: 16, }}>{item?.label}</Text>
                            <Text style={{ color: COLORS.gray60, lineHeight: 16, }}>Information</Text>
                        </View>
                    </View>
                )
            })}
        </View>
    );
};

const Request = ({ navigation }) => {

    const [completed, setCompleted] = useState([])

    const scrollX = useRef(new Animated.Value(0)).current
    const flatListRef = useRef()

    const [requestInFo, setRequestInFo] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: 0,
        email: '',
        noOfChildrens: 0,
        noOfAdults: 0,
        noOfInfants: 0,
        noOfCouples: 0,
        departureCity: '',
        departureDate: '',
        destinationCity: '',
        tourDuration: 0,
    })

    const [modalVisible, setModalVisible] = useState(false)
    const [alert, setAlert] = useState({
        title: '',
        message: ''
    });

    const handleRequest = () => {
        let response = checkEmptyFields()
        if(response == 1){
            response = checkValidation()
            if (response == 1) {
                db.collection('requests').doc().set({
                    ...requestInFo,
                    userID: auth.currentUser.uid,
                    requestTime: Moment(new Date()).format('hh:mm')
                }).then(() => {
                    setModalVisible(!modalVisible)
                    setAlert({
                        title: "Alert",
                        message: "Your Request has been noted"
                    })
                })
            } else {
                setModalVisible(!modalVisible)
            }
        } else {
            setModalVisible(!modalVisible)
        } 
    }

    const checkEmptyFields = () => {
        if (requestInFo.lastName == '' || requestInFo.firstName == '' || requestInFo.departureCity == '' || requestInFo.destinationCity == ''
            || requestInFo.email == '' || requestInFo.phoneNumber == 0 || requestInFo.noOfAdults == 0 || requestInFo.noOfChildrens == 0 || requestInFo.noOfInfants == 0
            || requestInFo.noOfCouples == 0 || requestInFo.departureDate == '' || requestInFo.tourDuration == 0) {
            
            console.log('request: ' , requestInFo)
                setAlert({
                title: 'Error',
                message: "Please fill the Place empty fields first",
            })
            return 0
        }
        return 1
    }

    const checkValidation = () => {
        let regEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/
        let phoneReg = /\+[0-9]{12}/

        if (!regEmail.test(requestInFo.email)) {
            setAlert({
                message: "Email address is badly formated ...",
                title:"Error"
            })
            return 0
        }

        if (!phoneReg.test(requestInFo.phoneNumber)) {
            setAlert({
                title:"Error",
                message: 'Invalid Phone Number\nPlease enter the valid information'
            })
            return 0
        }

        let startDate
        if (requestInFo.departureDate.includes('/')) {
            startDate = requestInFo.departureDate.split("/")
        } else if (requestInFo.departureDate.includes('-')) {
            startDate = requestInFo.departureDate.split("-")
        } else {
            setAlert({
                title: 'Error',
                message: 'Invalid Date, Please enter the valid information'
            })
            return 0
        }

        if (parseInt(startDate[0]) < 2000 || parseInt(startDate[1] > 12 || parseInt(startDate[0]) > 31)) {
            setAlert({
                title: 'Error',
                message: 'Invalid Format, Please enter the valid information'
            })
            return 0
        }

        let currentDate = new Date()
        const month = parseInt(currentDate.getMonth() + 1)
        const day = parseInt(currentDate.getDate())
        const year = parseInt(currentDate.getFullYear().toString())

        if ((year > parseInt(startDate[0]))
            || ((year == parseInt(startDate[0])) && (month > parseInt(startDate[1])))
            || ((year == parseInt(startDate[0])) && (month == parseInt(startDate[1])) && (day > parseInt(startDate[2])))
        ) {
            setAlert({
                title: 'Error',
                message: 'Invalid Date, Please enter the valid information'
            })
            return 0
        }
        return 1
    }

    const onTabPress = useCallback((tabIndex) => {
        flatListRef?.current?.scrollToOffset({
            offset: tabIndex * SIZES.width
        });

        completed.length < tabIndex &&
            setCompleted((previous) => {
                return [
                    ...previous,
                    true,
                ]
            });
    });

    const renderHeader = () => {
        return (
            <View
                style={{
                    marginTop: SIZES.padding * 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text style={{ ...FONTS.h2, color: COLORS.white }}>Let Tripak Plan</Text>
                <Text style={{ ...FONTS.h2, color: COLORS.white }}>Your Trip For You</Text>
            </View>
        );
    };

    const renderContent = () => {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <>
                    {/* Tabs */}
                    <View
                        style={{
                            height: 100,
                            marginHorizontal: SIZES.padding,
                            marginTop: SIZES.padding * 0.8,
                            backgroundColor: COLORS.white,
                            borderRadius: SIZES.radius
                        }}
                    >
                        <Tabs
                            scrollX={scrollX}
                            completed={completed}
                        />
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                        <Animated.FlatList
                            ref={flatListRef}
                            horizontal
                            pagingEnabled
                            scrollEnabled={false}
                            snapToAlignment={'center'}
                            snapToInterval={SIZES.width}
                            showsHorizontalScrollIndicator={false}
                            keyboardDismissMode='on-drag'
                            keyExtractor={item => `RequstSteps-${item.id}`}
                            decelerationRate={"fast"}
                            data={requestSteps}
                            onScroll={Animated.event([
                                { nativeEvent: { contentOffset: { x: scrollX } } }
                            ], { useNativeDriver: false })}
                            renderItem={({ index }) => {
                                return (
                                    <View
                                        style={{
                                            width: SIZES.width,
                                            paddingTop: SIZES.padding
                                        }}
                                    >
                                        {index == 0 && <ScreenOne onTabPress={onTabPress} requestInFo={requestInFo} setRequestInFo={setRequestInFo} />}
                                        {index == 1 && <ScreenTwo onTabPress={onTabPress} requestInFo={requestInFo} setRequestInFo={setRequestInFo} />}
                                        {index == 2 && <ScreenThree onTabPress={onTabPress} requestInFo={requestInFo} setRequestInFo={setRequestInFo} handleRequest={handleRequest} />}
                                    </View>
                                );
                            }}
                        />
                    </View>
                </>
                <CustomAlert
                    title={alert.title}
                    message={alert.message}
                    modalVisible={modalVisible}
                    setModalVisible={() => {
                        setModalVisible(!modalVisible)
                        if (alert.message.includes("Your Request has been noted")) {
                            navigation.goBack()
                        }
                    }}
                />
            </View>
        );
    };

    return (
        <View
            style={styles.container}
        >
            {/* Header */}
            {renderHeader()}

            {/* Content */}
            {renderContent()}
        </View>
    );
}

export default Request

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    }
})