import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { SharedElement } from 'react-navigation-shared-element'
import * as Animatable from 'react-native-animatable'
import SlidingUpPanel from 'rn-sliding-up-panel'
import Moment from 'moment'
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, icons, FONTS } from '../constants'
import { CustomAlert, BookingSeatModal } from '../components'
import { auth, db } from '../firebase'
import { useSelector } from 'react-redux'
import { WEATHER_API_KEY, BASE_WEATHER_URL } from '../utils'
import { presentPaymentSheet, initPaymentSheet } from "@stripe/stripe-react-native";


//ADD localhost address of your server
const API_URL = "http://192.168.10.9:3000";

const StarReview = ({ rate }) => {

  const starComponents = []
  const fullStar = Math.floor(rate)
  const noStar = Math.floor(5 - rate)
  const halfStar = 5 - fullStar - noStar

  for (let i = 0; i < fullStar; i++) {
    starComponents.push(
      <Image
        key={`full-${i}`}
        source={icons.starFull}
        resizeMode='cover'
        style={{
          width: 20,
          height: 20
        }}
      />
    );
  };

  for (let i = 0; i < halfStar; i++) {
    starComponents.push(
      <Image
        key={`half-${i}`}
        source={icons.starHalf}
        resizeMode='cover'
        style={{
          width: 20,
          height: 20
        }}
      />
    );
  };

  for (let i = 0; i < noStar; i++) {
    starComponents.push(
      <Image
        key={`half-${i}`}
        source={icons.starEmpty}
        resizeMode='cover'
        style={{
          width: 20,
          height: 20
        }}
      />
    );
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {starComponents}
      <Text style={{ marginLeft: SIZES.base, color: COLORS.white }}>{rate}</Text>
    </View>
  );
};

const IconLabel = ({ icon, label, containerStyle, labelStyle, shadowColor }) => {
  return (
    <View
      style={[{
        width: 115,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.white,
        ...containerStyle
      }, { ...styles.shadow, shadowColor }]}
    >
      <View
        style={{
          width: 45,
          height: 45,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.lightyellow
        }}
      >
        <Image
          source={icon}
          resizeMode='cover'
          style={{
            width: 25,
            height: 25,
            tintColor: COLORS.sceondary
          }}
        />
      </View>
      <Text style={{ marginTop: 5, ...FONTS.body5, ...labelStyle }}>{label}</Text>
    </View>
  );
};

const TourPlace = ({ navigation, route }) => {

  Moment.locale('en')
  let _panel = useRef(null)
  const _draggedValue = useRef(new Animated.Value(0)).current

  const { appTheme } = useSelector((state) => state.themeReducer)

  const [tourPlaces, setTourPlaces] = useState([])
  const [selectedTour, setSelectedTour] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [allowDragging, setAllowDragging] = useState(true)

  const [currentWeather, setCurrentWeather] = useState(null)
  const [unitsSystem, setUnitsSystem] = useState('metric')

  const [modalVisible, setModalVisible] = useState(false)
  const [alert, setAlert] = useState({
    title: '',
    message: ''
  });

  const [seats, setSeats] = useState(null)
  const [bookingSeatModal, setBookingSeatModal] = useState(false)

  useEffect(() => {
    let { selectedTour, selectedProvince } = route.params
    setSelectedTour(selectedTour)
    setSelectedProvince(selectedProvince)

    let latitude = selectedTour.mapInitialRegion.latitude
    let longitude = selectedTour.mapInitialRegion.longitude
    const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;

    console.log(weatherUrl)
    fetch(weatherUrl)
      .then(response => response.json())
      .then(data => {
        const {
          main: { feels_like, humidity, temp },
          wind: { speed },
          weather: [details]
        } = data;

        const { icon, description } = details
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        setCurrentWeather({
          temp,
          feels_like,
          humidity,
          description,
          speed,
          iconUrl
        });
      });

    setTourPlaces([])
    db.collection("provinces").doc(selectedProvince).collection("tours")
      .doc(selectedTour.name).collection("places").get()
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

    _draggedValue.addListener((valueObj) => {
      if (valueObj.value > SIZES.height) {
        setAllowDragging(false)
      }
    });

    return () => {
      _draggedValue.removeAllListeners();
    }

  }, []);

  const handleBooking = async () => {

    var discount = 0
    var discountPrice = selectedTour.price 
    if (seats > 2){
      discount = (selectedTour.price / 100) * 20
      discountPrice = discountPrice * seats
      discountPrice -= discount

      console.log("Discount: ", discount)
      console.log("Price: ", selectedTour.price)
      console.log("Discount Price: ", discountPrice)

    }

    try {
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        setModalVisible(!modalVisible)
        setAlert({
          title: "Alert",
          message: data.message
        })
        return
      }

      const clientSecret = data.clientSecret;
      const initSheet = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Usman Aslam',
      });

      if (initSheet.error) {
        setModalVisible(!modalVisible)
        setAlert({
          title: "Error",
          message: initSheet.error.message
        })
        return
      }

      const presentSheet = await presentPaymentSheet({
        clientSecret,
      });

      if (presentSheet.error) {
        setModalVisible(!modalVisible)
        setAlert({
          title: "Error",
          message: presentSheet.error.message
        })
        return
      }
      setModalVisible(!modalVisible)
      setAlert({
        title: "Alert",
        message: "Payment Transaction Successfull, Thank You!"
      })

      let toursRef = db.collection("users").doc(auth.currentUser.uid).collection("booking").doc(selectedTour.name)
      toursRef.set({
        ...selectedTour,
        bookSeats: seats,
        provinceName: selectedProvince,
        bookingDate: Moment(new Date()).format('YYYY-MM-DD'),
        bookingTime: Moment(new Date()).format('hh:mm')
      })

      for (let j = 0; j < tourPlaces.length; j++) {
        toursRef.collection("places").doc(tourPlaces[j].name).set(tourPlaces[j])
      }

      let bookingRef = db.collection("provinces").doc(selectedProvince).collection("tours").doc(selectedTour.name)
      bookingRef.update({
        "booking": parseInt(selectedTour.booking + parseInt(seats)),
        "sales": parseInt(selectedTour.sales + discountPrice),
        "revenue": parseInt((selectedTour.sales + discountPrice) - selectedTour.expenses)
      })
    } catch (error) {
      console.error(error)
      setModalVisible(!modalVisible)
      setAlert({
        title: "Error",
        message: error.message
      })
    }
  }

  const renderPlace = () => {
    return (
      <View style={{ flex: 1, backgroundColor: appTheme?.backgroundColor }}>
        <View style={{ flex: 2 }}>
          {/* Background Image */}
          <SharedElement
            id={`Tour-Place-Bg-${selectedTour?.id}`}
            style={[StyleSheet.absoluteFillObject]}
          >
            <Image
              source={{ uri: selectedTour?.imageUri }}
              resizeMode='cover'
              style={{
                width: "100%",
                height: "80%",
              }}
            />
          </SharedElement>
          <Animatable.View
            style={[{
              position: 'absolute',
              left: 10, right: 10,
              bottom: 0,
              borderRadius: 15,
              padding: SIZES.padding,
              backgroundColor: appTheme?.searchBarBackground,
            }, { ...styles.shadow, shadowColor: appTheme?.shadowColor }]}
            animation='bounceIn'
            delay={500}
            duration={3000}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={[{ borderRadius: SIZES.radius * .5 }, { ...styles.shadow, shadowColor: appTheme?.shadowColor }]}>
                <Image
                  source={{ uri: selectedTour?.imageUri }}
                  resizeMode='cover'
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: SIZES.radius * .5
                  }}
                />
              </View>
              <View style={{ paddingHorizontal: SIZES.padding, justifyContent: 'space-around' }}>
                <Text style={{ ...FONTS.h3, color: appTheme?.textColor }}>{selectedTour?.name}</Text>
                <Text style={{ ...FONTS.h4, color: appTheme?.textColor }}>{selectedProvince}, Pakistan</Text>
                <StarReview rate={4.5} />
              </View>
            </View>
            <View style={{ marginTop: SIZES.padding * .5 }}>
              <Text style={{ ...FONTS.body5, color: appTheme?.textColor }}>
                {selectedTour?.description}
              </Text>
            </View>
          </Animatable.View>

          {/* Header */}
          <View
            style={{
              position: 'absolute',
              top: 40, left: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
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
          </View>
        </View>

        {/* Weather And About*/}
        <View style={{ flex: 1.6 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginTop: SIZES.radius,

          }}>
            <IconLabel
              icon={icons.temperature}
              label={`Feels: ${(currentWeather?.feels_like)?.toFixed(0)}°C`}
              containerStyle={{ backgroundColor: appTheme?.searchBarBackground }}
              labelStyle={{ color: appTheme?.textColor }}
              shadowColor={appTheme?.shadowColor}
            />
            <IconLabel
              icon={icons.humidity}
              label={`Humidity: ${currentWeather?.humidity}%`}
              containerStyle={{ backgroundColor: appTheme?.searchBarBackground }}
              labelStyle={{ color: appTheme?.textColor }}
              shadowColor={appTheme?.shadowColor}
            />
            <IconLabel
              icon={icons.wind}
              label={`wind: ${(currentWeather?.speed)?.toFixed(1)}m/s`}
              containerStyle={{ backgroundColor: appTheme?.searchBarBackground }}
              labelStyle={{ color: appTheme?.textColor }}
              shadowColor={appTheme?.shadowColor}
            />
          </View>

          {/* About */}
          <View style={{ marginTop: SIZES.radius, paddingHorizontal: SIZES.padding }}>
            <Text style={{ color: appTheme?.textColor, ...FONTS.h4 }}>About</Text>
            <Text style={{ marginTop: SIZES.base, ...FONTS.body5, color: appTheme?.textColor }}>
              Located at the Alps with an altitude of 1,702 meters. The ski area is the largest ski area in the world and is known as the best Tour to ski. Many other facilities, such as fitness center, sauna, steam room to star-rated restaurants.
            </Text>
          </View>
        </View>

        <View style={{ flex: .45, paddingHorizontal: SIZES.padding }}>
          <LinearGradient
            style={{ width: '100%', height: '80%', borderRadius: 15, marginTop: SIZES.base }}
            colors={[COLORS.sceondary, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, marginHorizontal: SIZES.padding, justifyContent: 'center' }}>
                <Text>${selectedTour?.price}</Text>
              </View>
              <TouchableOpacity
                style={{ width: 130, height: '80%', marginHorizontal: SIZES.radius }}
                onPress={() => {
                  setAlert({
                    title: "Alert",
                    message: "Please login into your account before booking the trip"
                  })

                  auth.currentUser != null
                    ? setBookingSeatModal(!bookingSeatModal)
                    : setModalVisible(!modalVisible)
                }}
              >
                <LinearGradient
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
                  colors={[COLORS.white, COLORS.transparentWhite4]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text>BOOKING</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  };

  const renderMap = () => {
    return (
      <SlidingUpPanel
        ref={c => { _panel = c }}
        allowDragging={allowDragging}
        draggableRange={{ top: SIZES.height + 100, bottom: 100 }}
        animatedValue={_draggedValue}
        showBackdrop={false}
        snappingPoints={[SIZES.height + 100]}
        height={SIZES.height + 100}
        friction={0.7}
        onBottomReached={() => setAllowDragging(true)}
      >
        <Animatable.View
          style={{ flex: 1, backgroundColor: 'transparent' }}
          animation='fadeInUpBig'
        >
          {/* Panel Header */}
          <View
            style={{
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent'
            }}
          >
            <Image
              source={icons.upArrow}
              resizeMode='contain'
              style={{
                width: 20,
                height: 20,
                tintColor: COLORS.primary
              }}
            />
            <Text style={{ color: COLORS.primary }}>SWIPE UP FOR DETAILS</Text>
          </View>

          {/* Panel Details */}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.white
            }}
          >
            <MapView
              style={{
                width: '100%',
                height: '100%'
              }}
              provider={PROVIDER_GOOGLE}
              initialRegion={selectedTour?.mapInitialRegion}
            >
              {tourPlaces.map((hotel, index) => (
                <Marker
                  key={index}
                  identifier={hotel.id}
                  coordinate={hotel.latlng}
                  onPress={() => setSelectedHotel(hotel)}
                >
                  <Image
                    source={selectedHotel?.id == hotel.id ? icons.bedOn : icons.bedOff}
                    resizeMode='contain'
                    style={{
                      width: 50,
                      height: 50
                    }}
                  />
                </Marker>
              ))}
            </MapView>

            {/* Header */}
            <View
              style={{
                position: 'absolute',
                top: 10, left: 10
              }}
            >
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: COLORS.transparentBlack4
                }}
                onPress={() => _panel.hide()}
              >
                <Image
                  source={icons.leftArrow}
                  resizeMode='contain'
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.white
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Hotel Detail */}
            {selectedHotel &&
              <View
                style={[{
                  position: 'absolute',
                  left: 10, right: 10,
                  bottom: 60,
                  borderRadius: 15,
                  padding: SIZES.padding,
                  backgroundColor: COLORS.transparentBlack4,
                  opacity: .85
                }, styles.shadow]}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View style={[{ borderRadius: SIZES.radius * .5 }, styles.shadow]}>
                    <Image
                      source={{ uri: selectedHotel?.imageUri }}
                      resizeMode='cover'
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: SIZES.radius * .5
                      }}
                    />
                  </View>
                  <View style={{ paddingHorizontal: SIZES.padding, justifyContent: 'space-around' }}>
                    <Text style={{ color: COLORS.white, ...FONTS.h3 }}>{selectedHotel?.name}</Text>
                    <Text style={{ color: COLORS.white, ...FONTS.h4 }}>{selectedProvince}, Pakistan</Text>
                    <StarReview rate={4.5} />
                  </View>
                </View>
                <View style={{ marginTop: SIZES.padding * .5 }}>
                  <Text style={{ color: COLORS.white, ...FONTS.body3 }}>
                    {selectedTour?.description}
                  </Text>
                </View>

              </View>
            }
          </View>
        </Animatable.View>

      </SlidingUpPanel>

    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: appTheme?.backgroundColor }}>
      <View
        style={{ flex: .88 }}
      >
        {/* Render About Tour Place */}
        {renderPlace()}
      </View>


      {/* render About Place Map */}
      <View style={{ flex: 0.12 }}>
        {renderMap()}
      </View>

      <CustomAlert
        title={alert.title}
        message={alert.message}
        modalVisible={modalVisible}
        setModalVisible={() => setModalVisible(!modalVisible)}
      />

      <BookingSeatModal
        seats={seats}
        setSeats={setSeats}
        modalVisible={bookingSeatModal}
        setModalVisible={() => setBookingSeatModal(!bookingSeatModal)}
        handleBooking={handleBooking}
      />
      {console.log("Seats: ", seats)}
    </View>
  );
}

export default TourPlace

TourPlace.sharedElements = (route, otherRoute, showing) => {
  const { selectedTour } = route.params;
  return [
    {
      id: `Tour-Place-Bg-${selectedTour?.id}-${selectedTour?.name}`
    },
  ]
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
});