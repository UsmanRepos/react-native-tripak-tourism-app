import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, {
  interpolate, Extrapolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withDelay, withTiming, runOnJS
} from 'react-native-reanimated'
import axios from 'axios'
import Moment from 'moment'
import { toggleTheme } from '../actions'
import { useSelector, useDispatch } from 'react-redux'
import { COLORS, FONTS, SIZES, icons, images } from '../constants'
import { CustomReviewModal, LineDivider, VerticalTourCard, CustomAlert } from '../components';
import { auth, db } from '../firebase'
// import { topTour, nearByTours } from '../utils'
// import appTheme from '../constants/theme'

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)
const HEADER_HEIGHT = 280

const Home = ({ navigation }) => {

  const [topTours, setTopTours] = useState([])
  const [nearByTours, setNearByTours] = useState([])

  const scrollY = useSharedValue(0)
  const scrollViewRef = useRef()

  const { appTheme } = useSelector((state) => state.themeReducer)
  const dispatch = useDispatch()

  const [reviewModal, setReviewModal] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    text: "",
    userID: auth?.currentUser?.uid
  });

  const [modalVisible, setModalVisible] = useState(false)
  const [alert, setAlert] = useState({
    title: '',
    message: ''
  });

  const [closedTour, setClosedTour] = useState(null)

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  });

  useEffect(() => {
    // for (let i = 0; i < topTour.length; i++) {
    //   let toursRef = db.collection("users").doc(auth.currentUser.uid).collection("topTours").doc(topTour[i].name).collection("places")
    //   for (let j = 0; j < topTour[i].hotels.length; j++) {
    //     let placesRef = toursRef.doc(topTour[i].hotels[j].name).set(topTour[i].hotels[j])
    //   }
    // }

    // for (let i = 0; i < nearByTours.length; i++) {
    //   let toursRef = db.collection("users").doc(auth.currentUser.uid).collection("nearByTours").doc(nearByTours[i].name).collection("places")
    //   for (let j = 0; j < nearByTours[i].hotels.length; j++) {
    //     let placesRef = toursRef.doc(nearByTours[i].hotels[j].name).set(nearByTours[i].hotels[j])
    //   }
    // }

    setTopTours([])
    db.collection("topTours").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setTopTours((previous) => {
          return [
            ...previous,
            doc.data()
          ]
        });
      });
    });

    setNearByTours([])
    db.collection("nearByTours").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setNearByTours((previous) => {
          return [
            ...previous,
            doc.data()
          ]
        });
      });
    });

  }, [navigation])

  // useEffect(() => {

  //   if(topTours.length > 2){
  //      for (let i = 0; i < topTours.length; i++) {
  //       let toursRef = db.collection("topTours").doc(topTours[i].name).set(topTours[i])
  //      }
  //   }
  // }, [topTours])
  // useEffect(() => {
  //   if(nearByTours.length > 2){
  //     for (let i = 0; i < nearByTours.length; i++) {
  //           let toursRef = db.collection("nearByTours").doc(nearByTours[i].name).set(nearByTours[i])
  //     }
  //   }
  // }, [nearByTours])

  useEffect(() => {
    let currentDate = new Date()
    const month = parseInt(currentDate.getMonth() + 1)
    const day = parseInt(currentDate.getDate())
    const year = parseInt(currentDate.getFullYear().toString())

    let bookingRef = db.collection('users').doc(auth?.currentUser?.uid).collection('booking')
    bookingRef.get().then((querySnapshot) => {

      querySnapshot.forEach((doc) => {
        console.log("Tours: ", doc.data())
        let endDate = (doc.data().endDate).split("-")


        console.log("CurrentDate", month + "/" + day + "/" + year)
        console.log("birthDate", parseInt(endDate[1]) + "/" + parseInt(endDate[2]) + "/" + parseInt(endDate[0]))

        if ((year > parseInt(endDate[0]))
          || ((year == parseInt(endDate[0])) && (month > parseInt(endDate[1])))
          || ((year == parseInt(endDate[0])) && (month == parseInt(endDate[1])) && (day > parseInt(endDate[2])))
        ) {
          setClosedTour(doc.data())
          setReviewModal(!reviewModal)

          let tourRef = db.collection("provinces").doc(doc.data().provinceName).collection("tours").doc(doc.data().name)
          tourRef.update({
            status: "closed"
          })

          bookingRef.doc(doc.data().name).delete().then(() => {
            console.log("Document successfully deleted!");
          }).catch((error) => {
            console.error("Error removing document: ", error);
          });

        }
      });
    })
  }, [])

  // useEffect(() => {
  //   setClosedTour(bookings[0] ?? null)
  // }, [bookings])


  const addReview = () => {
    setReviewModal(!reviewModal)
    db.collection('travelAgency').doc(closedTour.travelAgencyID).collection("reviews").doc()
      .set(review).then(() => {
        setModalVisible(!modalVisible)
        setAlert({
          title: 'Alert',
          message: "Thanks, We have a nice journey with you"
        });
      })

    let agencyRef = db.collection('travelAgency').doc(closedTour.travelAgencyID)
    agencyRef.get().then((doc) => {
      let agency = doc.data()
      db.collection('travelAgency').doc(closedTour?.travelAgencyID).update({
        rating: parseInt((parseInt(agency.rating) + parseInt(review.rating)) / 2)
      })
    })
  }

  const toggleThemeHandler = () => {
    if (appTheme?.name == "light") {
      dispatch(toggleTheme("dark"))
      console.warn(appTheme?.name)
    } else {
      dispatch(toggleTheme("light"))
      console.warn(appTheme?.name)
    }
  };

  const recommendedToursGetter = () => {
    let allTours = []
    let topFiveTours = []
    let provinces = ['Punjab', 'Sindh', 'Kpk', 'Balochistan', 'Gilgit', 'Kashmir']
    provinces.forEach(province => {
      const tourRef = db.collection('provinces').doc(province).collection('tours').where('travelAgencyName', 'in', travelAgencyName).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          allTours.push(doc.data())
        });
      });
    })

    allTours = allTours.sort(function (a, b) { return b.booking - a.booking });

    for (let i = 0; i > allTours.length; i++) {
      topFiveTours.push(allTours[i])
      if (i >= 5)
        break;
    }
    setTopTours(topFiveTours)
  }

  const nearByToursGetter = () => {
    let tuorist = {}
    db.collection('users').doc(auth.currentUser.uid).get()
      .then((doc) => {
        tuorist = doc.data()
      })

    let travelAgencies = []
    db.collection("travelAgency").get().then((querySnapshot) => {
      querySnapshot.forEach((travelAgency) => {
        var config = {
          method: 'get',
          url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + tuorist.coordinates.latitude + '%2C' + tuorist.coordinates.longitude + '&destinations=' + travelAgency.coordinates.latitude + '%2C' + travelAgency.coordinates.longitude + '&key=' + GOOGLE_MAPS_API,
          headers: {}
        };

        console.log("URL=>", config.url);
        axios(config)
          .then(function (response) {
            travelAgencies.push({
              ...travelAgency,
              distance: JSON.stringify(response.data.rows[0].elements[0].distance.value)
            })
          })
          .catch(function (error) {
            console.log(error);
          })
      })

      travelAgencies = travelAgencies.sort(function (a, b) { return a.distance - b.distance });
      console.log("The Destination Information is:", JSON.stringify(travelAgencies));
    });

    let nearToursList = []
    let provinces = ['Punjab', 'Sindh', 'Kpk', 'Balochistan', 'Gilgit', 'Kashmir']

    let travelAgencyName = []
    for (let i = 0; i < travelAgencies.length; i++) {
      travelAgencyName.push(travelAgencies[i].name)
      if (i >= 1)
        break;
    }

    provinces.forEach(province => {
      const tourRef = db.collection('provinces').doc(province).collection('tours').where('travelAgency', '==', travelAgencyName).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          nearToursList.push(doc.data())
        });
      });
      setNearByTours(nearToursList)
    });
  }

  const renderHeader = () => {
    const inputRange = [0, HEADER_HEIGHT - 100]

    const headerHeightAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: interpolate(scrollY.value, inputRange, [HEADER_HEIGHT, 100], Extrapolate.CLAMP)
      }
    });
    const iconFadeAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollY.value, inputRange, [1, 0])
      }
    });

    return (
      <Animated.View
        style={[{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          zIndex: 1
        }, headerHeightAnimatedStyle]}>
        {/* Place Image */}
        <Image
          source={images.banner}
          resizeMode='cover'
          style={{
            width: '100%',
            height: '95%'
          }}
        />
        {/* Search Bar */}
        <TouchableOpacity
          style={[{
            position: 'absolute',
            left: 10, right: 10,
            bottom: 0,
            flexDirection: 'row',
            borderRadius: SIZES.base,
            alignItems: 'center',
            padding: SIZES.radius,
            backgroundColor: appTheme?.searchBarBackground,
          }, { ...styles.shadow, shadowColor: appTheme?.shadowColor }]}
          onPress={() => navigation.navigate('searchTours')}
        >
          <Image
            source={icons.search}
            resizeMode='contain'
            style={{
              width: 25,
              height: 25,
              tintColor: COLORS.gray40
            }}
          />
          <Text style={{ flex: 1, marginLeft: SIZES.base, color: COLORS.gray40, ...FONTS.body4 }}>
            Where Are You going?
          </Text>
        </TouchableOpacity>

        {/* Header Bar */}
        <Animated.View
          style={[{
            position: 'absolute',
            top: 0, left: 0,
            right: 0,
            paddingTop: 30,
            paddingHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }, iconFadeAnimatedStyle]}
        >
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => toggleThemeHandler()}
          >
            <Image
              source={icons.sun}
              resizeMode='contain'
              style={{
                width: 25,
                height: 25,
                tintColor: COLORS.white
              }}
            />
          </TouchableOpacity>
        </Animated.View>

      </Animated.View>
    );
  };

  const renderTopTours = () => {
    return (
      <View>
        <View
          style={{
            paddingTop: SIZES.padding,
            padding: SIZES.radius,
            alignItems: 'center'
          }}
        >
          <Text style={{
            ...FONTS.h3,
            fontSize: 20,
            textAlign: 'center',
            color: appTheme?.textColor
          }}>recommended where you've been exploring</Text>
          <LineDivider
            lineStyle={{
              width: 60,
              height: 2,
              marginVertical: SIZES.base,
              backgroundColor: COLORS.primary
            }}
          />
        </View>
        <FlatList
          horizontal
          data={topTours}
          snapToAlignment='center'
          decelerationRate={0}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <VerticalTourCard
                tour={item}
                containerStyle={{
                  marginLeft: index == 0 ? SIZES.padding : SIZES.radius,
                  marginRight: index == topTours.length - 1 ? SIZES.padding : 0
                }}
                onPress={() => {
                  navigation.navigate("tourPlace", {
                    selectedTour: item,
                    selectedProvince: item.provinceName
                  })
                }}
              />
            );
          }}
        />
      </View>
    );
  };

  const renderPlanYourTrip = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightRed,
          marginHorizontal: SIZES.padding,
          marginVertical: SIZES.padding,
          paddingHorizontal: SIZES.radius,
          paddingVertical: SIZES.base
        }}
        onPress={() => {
          setAlert({
            title: "Alert",
            message: "Please login into your account before planning the trip"
          })

          auth.currentUser != null
            ? navigation.navigate('request')
            : setModalVisible(!modalVisible)
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.white
          }}
        >
          <Image
            source={images.banner}
            resizeMode='cover'
            style={{
              width: 35,
              height: 35,
              borderRadius: 20,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          <View
            style={{ flex: 1, justifyContent: 'center', marginLeft: SIZES.base }}
          >
            <Text>Plan Your Trip</Text>
            <Text>Let Tripak plan your trip fro you</Text>
          </View>
          <Image
            source={icons.rightArrow}
            resizeMode='contain'
            style={{
              width: 15,
              height: 15,
              tintColor: COLORS.gray50
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderNearByTours = () => {
    return (
      <View>
        <View
          style={{
            padding: SIZES.radius,
            alignItems: 'center'
          }}
        >
          <Text style={{ ...FONTS.h3, fontSize: 20, textAlign: 'center', color: appTheme?.textColor }}>recommended where you've been Nearby</Text>
          <LineDivider
            lineStyle={{
              width: 60,
              height: 2,
              marginVertical: SIZES.base,
              backgroundColor: COLORS.primary
            }}
          />
        </View>
        <FlatList
          horizontal
          data={nearByTours}
          snapToAlignment='center'
          decelerationRate={0}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <VerticalTourCard
                tour={item}
                containerStyle={{
                  marginLeft: index == 0 ? SIZES.padding : SIZES.radius,
                  marginRight: index == nearByTours.length - 1 ? SIZES.padding : 0
                }}
                onPress={() => {
                  navigation.navigate("tourPlace", {
                    selectedTour: item,
                    selectedProvince: item?.provinceName
                  })
                }}
              />
            );
          }}
        />
      </View>
    );
  };


  return (
    <View
      style={{ flex: 1, backgroundColor: appTheme?.backgroundColor }}
    >
      <StatusBar backgroundColor='transparent' style='light' />

      {renderHeader()}
      <AnimatedScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          paddingBottom: 110
        }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={"on-drag"}
        onScroll={onScroll}
      >
        {renderTopTours()}
        {renderPlanYourTrip()}
        {renderNearByTours()}
      </AnimatedScrollView>

      <CustomAlert
        title={alert.title}
        message={alert.message}
        modalVisible={modalVisible}
        setModalVisible={() => setModalVisible(!modalVisible)}
      />

      <CustomReviewModal
        review={review}
        setReview={setReview}
        addReview={addReview}
        modalVisible={reviewModal}
        setModalVisible={() => setReviewModal(!reviewModal)}
      />
    </View>
  )
}

export default Home

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
  }
})