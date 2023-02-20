import { FlatList, StyleSheet, Text, View, Image, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { COLORS, icons, SIZES, FONTS } from '../constants';
import { HorizontalTourCard, LineDivider, PromtComponentWithLogin } from '../components'
import { useSelector } from 'react-redux'
import MapViewDirections from 'react-native-maps-directions';
import { bookings, GOOGLE_API_KEY, BASE_WEATHER_URL } from '../utils';
import { auth, db } from '../firebase';

const bookingsWithLogin = ({ navigation }) => {
    const { appTheme } = useSelector((state) => state.themeReducer)
    const [modalVisible, setModalVisibility] = useState(false)
    const [bookedTours, setBookedTours] = useState(null)
    const [tourPlaces, setTourPlaces] = useState(null)
    const [selectedTour, setSelectedTour] = useState(null)
    const [selectedPlace, setSelectedPlace] = useState(null)

    const mapView = useRef();
    const [fromLocation, setFromLocation] = useState(null);
    const [toLocation, setToLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [duaration, setDuaration] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        setBookedTours([])
        db.collection("users").doc(auth?.currentUser?.uid).collection("booking")
            .get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setBookedTours((previous) => {
                        return [
                            ...previous,
                            doc.data()
                        ]
                    });
                });
            });
    }, [navigation])

    const CalculateAngle = (coordinates) => {
        let startLat = coordinates[0]["latitude"];
        let startLon = coordinates[0]["longitude"];
        let endLat = coordinates[1]["latitude"];
        let endLon = coordinates[1]["longitude"]
        let dx = endLat - startLat;
        let dy = endLon - startLon;

        return Math.atan2(dy, dx) * 180 / Math.PI;
    }

    const ZoomIn = () => {
        const newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta / 2,
            longitudeDelta: region.longitudeDelta / 2,
        }
        setRegion(newRegion);
        mapView.current.animateToRegion(newRegion, 200);


    }
    const ZoomOut = () => {
        const newRegion = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2,
        }
        setRegion(newRegion);
        mapView.current.animateToRegion(newRegion, 200);

    }

    const renderHeader = () => {
        return (
            <View
                style={{
                    marginTop: 30,
                    height: 58,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: SIZES.radius,
                    backgroundColor: COLORS.primary
                }}
            >
                {/* Label / Title */}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ ...FONTS.h1, color: COLORS.white, fontSize: 26 }}>Bookings</Text>
                </View>
            </View>
        );
    };

    const renderBookings = () => {
        return (
            <FlatList
                data={bookedTours}
                keyExtractor={item => `booking-${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginTop: SIZES.radius,
                }}
                renderItem={({ item, index }) => {
                    return (
                        <HorizontalTourCard
                            tour={item}
                            containerStyle={{
                                marginVertical: SIZES.base,
                                marginTop: index == 0 ? SIZES.radius : SIZES.radius,
                                marginHorizontal: SIZES.radius

                            }}
                            onPress={() => {
                                setModalVisibility(true)
                                setSelectedTour(item)
                                setRegion(item?.mapInitialRegion)
                                console.log("NAme...........", item.name)
                                setTourPlaces([])
                                db.collection("users").doc(auth.currentUser.uid).collection("booking").doc(item.name).collection("places").get()
                                    .then((querySnapshot) => {
                                        querySnapshot.forEach((doc) => {
                                            setTourPlaces((previous) => {
                                                return [
                                                    ...previous,
                                                    doc.data()
                                                ]
                                            });
                                        });
                                    });
                            }}
                        />
                    );
                }}
                ItemSeparatorComponent={() => (
                    <LineDivider
                        lineStyle={{ height: 1, marginHorizontal: SIZES.radius }}
                    />
                )}
            />
        );
    };

    const renderTourDetails = () => {
        const renderSourceMarker = () => {
            return (
                <Marker
                    coordinate={selectedTour?.sourceCoordinates}
                >
                    <View
                        style={{
                            width: 45,
                            height: 45,
                            borderRadius: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: COLORS.white
                        }}
                    >
                        <View
                            style={{
                                width: 35,
                                height: 35,
                                borderRadius: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#2596be"
                            }}
                        >
                            <Image
                                source={icons.pin}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: COLORS.white
                                }}
                            />
                        </View>
                    </View>
                </Marker>
            )
        }

        const renderDestinationMarker = () => {
            return (
                <Marker
                    coordinate={selectedTour?.destinationCoordinates}
                >
                    <View
                        style={{
                            width: 45,
                            height: 45,
                            borderRadius: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: COLORS.white
                        }}
                    >
                        <View
                            style={{
                                width: 35,
                                height: 35,
                                borderRadius: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#2596be"
                            }}
                        >
                            <Image
                                source={icons.pin}
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: COLORS.white
                                }}
                            />
                        </View>
                    </View>
                </Marker>
            )
        }

        return (
            <Modal
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisibility(false)}
            >
                <View
                    style={{ flex: 1 }}
                >
                    <MapView
                        ref={mapView}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={region}
                    >

                        <MapViewDirections
                            origin={selectedTour?.sourceCoordinates}
                            destination={selectedTour?.destinationCoordinates}
                            apikey={GOOGLE_API_KEY}
                            strokeWidth={5}
                            strokeColor={"#2596be"}
                            optimizeWaypoints={true}
                            onReady={result => {
                                setDuaration(result.duration);
                                //Fit Route Into Map
                                if (!isReady) {
                                    mapView.current.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: (SIZES.width / 20),
                                            bottom: (SIZES.height / 4),
                                            left: (SIZES.width / 20),
                                            top: (SIZES.height / 8)
                                        }
                                    })
                                }
                                setIsReady(true);
                            }}
                        />
                        {tourPlaces?.map((hotel, index) => (
                            <Marker
                                key={index}
                                identifier={hotel.id}
                                coordinate={hotel?.latlng}
                                onPress={() => setSelectedPlace(hotel)}
                            >
                                <Image
                                    source={selectedPlace?.id == hotel.id ? icons.bedOn : icons.bedOff}
                                    resizeMode='contain'
                                    style={{
                                        width: 50,
                                        height: 50
                                    }}
                                />
                            </Marker>
                        ))}
                        {renderDestinationMarker()}
                        {renderSourceMarker()}
                    </MapView>
                    <View
                        style={[{
                            position: 'absolute',
                            left: 0, right: 0,
                            bottom: 60,
                            padding: SIZES.radius,
                            backgroundColor: COLORS.transparentBlack4,
                        }]}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                borderRadius: SIZES.radius,
                                backgroundColor: COLORS.white,
                                padding: SIZES.base
                            }}
                        >
                            <View
                                style={{
                                    width: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        padding: SIZES.base,
                                        borderRadius: SIZES.radius,
                                        backgroundColor: COLORS.lightyellow
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 15,
                                            height: 15,
                                            backgroundColor: COLORS.sceondary,
                                            borderRadius: SIZES.radius
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ ...FONTS.h3 }}>{selectedTour?.source}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ color: COLORS.gray30, ...FONTS.body4 }}>{selectedTour?.startDate}</Text>
                                    <View
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                    >
                                        <Image
                                            source={icons.time}
                                            resizeMode='cover'
                                            style={{
                                                width: 17,
                                                height: 17,
                                                tintColor: COLORS.gray50
                                            }}
                                        />
                                        <Text style={{ color: COLORS.gray50, marginLeft: 5, ...FONTS.body4 }}>7:45 am</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                borderRadius: SIZES.radius,
                                backgroundColor: COLORS.white,
                                padding: SIZES.base,
                                marginTop: SIZES.base,
                            }}
                        >
                            <View
                                style={{
                                    width: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        width: SIZES.radius,
                                        height: SIZES.radius,
                                        backgroundColor: COLORS.sceondary,
                                        borderRadius: 8
                                    }}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ ...FONTS.h3 }}>{selectedTour?.destination}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ color: COLORS.gray30, ...FONTS.body4 }}>{selectedTour?.endDate}</Text>
                                    <View
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                    >
                                        <Image
                                            source={icons.time}
                                            resizeMode='cover'
                                            style={{
                                                width: 17,
                                                height: 17,
                                                tintColor: COLORS.gray50
                                            }}
                                        />
                                        <Text style={{ color: COLORS.gray50, marginLeft: 5, ...FONTS.body4 }}>9:45 pm</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Vertical Line */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: '14%', left: '11.5%',
                            width: 3,
                            height: 65,
                            backgroundColor: COLORS.sceondary
                        }}
                    >
                    </View>

                    {/* Header */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 10, left: 10,
                            flexDirection: 'row',
                            alignItems:'center'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: 45,
                                height: 45,
                                borderRadius: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: COLORS.transparentBlack4
                            }}
                            onPress={() => setModalVisibility(false)}
                        >
                            <Image
                                source={icons.leftArrow}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: COLORS.white
                                }}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: SIZES.base,
                                width: SIZES.width * .8,
                                paddingHorizontal: SIZES.padding,
                                paddingVertical: SIZES.radius,
                                borderRadius: SIZES.padding,
                                backgroundColor: COLORS.white,
                            }}
                        >
                            <Image
                                source={icons.red_pin}
                                resizeMod={'cover'}
                                style={{
                                    width: 20,
                                    height: 20,
                                    marginRight:SIZES.base
                                }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{ ...FONTS.h4 }}>{selectedTour?.destination}</Text>
                            </View>
                            <Text style={{ ...FONTS.body5 }}>{Math.ceil(duaration)} mins</Text>

                        </View>
                    </View>
                </View>
                {renderButtons()}
            </Modal>
        );
    };

    const renderButtons = () => {
        return (
            <View
                style={{
                    position: "absolute",
                    bottom: SIZES.height * .3,
                    right: SIZES.radius,
                    justifyContent: "space-between",
                    width: 60,
                    height: 110,
                }}
            >
                <TouchableOpacity
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.white,
                    }}
                    onPress={() => ZoomIn()}
                >
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.white,
                    }}
                    onPress={() => ZoomOut()}
                >
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>-</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (bookedTours != null && bookedTours.length > 0) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: appTheme?.backgroundColor
                }}
            >
                <StatusBar backgroundColor='#009387' style='light' />
                {/* Header */}
                {renderHeader()}

                {/* Bookings */}
                {renderBookings()}

                {/* Tour Details */}
                {renderTourDetails()}

            </View>
        );
    } else {
        return (
            <PromtComponentWithLogin title={"Yet No Bookings"} />
        )
    }

};

export default bookingsWithLogin

const styles = StyleSheet.create({
    shadow: {
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
})