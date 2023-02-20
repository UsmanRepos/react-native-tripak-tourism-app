import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, Animated, Platform } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SharedElement } from 'react-navigation-shared-element'
import { StatusBar } from 'expo-status-bar'
import { useSelector } from 'react-redux'
import { COLORS, FONTS, SIZES, images, icons } from '../constants'
import { countriesData } from '../utils'
import { TextButton } from '../components'
import { auth, db } from '../firebase'


const COUNTRY_ITEM_SIZE = SIZES.width / 3
const PLACES_ITEM_SIZE = SIZES.width / 1.2
const EMPTY_ITEM_SIZE = (SIZES.width - PLACES_ITEM_SIZE) / 2

const Tours = ({ navigation }) => {
  const { appTheme } = useSelector((state) => state.themeReducer)
  // const [countries, setCountries] = useState([{ id: -1 }, ...countriesData, { id: -2 }])
  const [countries, setCountries] = useState([])
  // const [tours, setTours] = useState([{ id: -1 }, countriesData[0].places[0], { id: -2 }])
  const [tours, setTours] = useState([])
  const [provinceName, setProvinceName] = useState('Balochistan')
  const [tourScrollPos, setTourScrollPos] = useState(0)

  const countryScrollX = useRef(new Animated.Value(0)).current
  const tourScrollX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    //   for (let i = 0; i < countriesData.length; i++) {
    //     let toursRef = db.collection("provinces").doc(countriesData[i].name).collection("tours")
    //     for (let j = 0; j < countriesData[i].places.length; j++) {
    //       let placesRef = toursRef.doc(countriesData[i].places[j].name).collection('places')
    //       for(let k=0; k < countriesData[i].places[j].hotels.length; k++){
    //         placesRef.doc(countriesData[i].places[j].hotels[k].name).set(countriesData[i].places[j].hotels[k])
    //       }
    //     }

    //     // .then((docRef) => {
    //     //   console.log("Document written with ID: ", docRef.id);
    //     //   // var placesRef = db.collection("provinces").doc(countriesData[i].name).collection("places")
    //     //   // for (let j = 0; j < countriesData[i].places.length; j++) {
    //     //   //   placesRef.doc("tour").set(countriesData[i].places[j])
    //     //   // }
    //     // })
    //     // .catch((error) => {
    //     //   console.error("Error adding document: ", error);
    //     // });
    //   }

    setCountries([{ id: -1 }])
    db.collection("provinces").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setCountries((previous) => {
          return [
            ...previous,
            doc.data()
          ]
        });
      });
      setCountries((previous) => {
        return [
          ...previous,
          { id: -2 }
        ]
      });
    });

    setTours([{ id: -1 }])
    db.collection("provinces").doc(provinceName).collection("tours").where("booking", "<", 18 ).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setTours((previous) => {
            return [
              ...previous,
              doc.data()
            ]
          });
        });
        setTours((previous) => {
          return [
            ...previous,
            { id: -2 }
          ]
        });
      });

  }, [navigation])

  const renderHeader = () => {
    return (
      <View
        style={{
          height: 58,
          marginTop: 30,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: SIZES.radius,
          backgroundColor: COLORS.primary
        }}
      >
        {/* Label / Title */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ ...FONTS.h1, color: COLORS.white, fontSize: 26 }}>Tours</Text>
        </View>
      </View>
    );
  };

  const renderProvinces = () => {
    return (
      <Animated.FlatList
        horizontal
        pagingEnabled
        data={countries}
        decelerationRate={0}
        snapToAlignment={'center'}
        snapToInterval={COUNTRY_ITEM_SIZE}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => `country-${item.id}`}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { x: countryScrollX } } }
        ], { useNativeDriver: false })}
        onScrollEndDrag={(event) => {
          let position = ((event.nativeEvent.contentOffset.x / COUNTRY_ITEM_SIZE) + 1).toFixed(0)
          setProvinceName(countries[position].name)

          // setTours([{ id: -1 }, ...countries[position].places[0], { id: -2 }])
          setTours([{ id: -1 }])
          db.collection("provinces").doc(countries[position].name).collection("tours").get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                setTours((previous) => {
                  return [
                    ...previous,
                    doc.data()
                  ]
                });
              });
              setTours((previous) => {
                return [
                  ...previous,
                  { id: -2 }
                ]
              });
            });
        }}

        // onMomentumScrollEnd={(event) => {
        //   let position = ((event.nativeEvent.contentOffset.x / COUNTRY_ITEM_SIZE) + 1).toFixed(0)

        //   setTours([{ id: -1 }])
        //   db.collection("provinces").doc(countries[position].name).collection("tour").get()
        //     .then((querySnapshot) => {
        //       querySnapshot.forEach((doc) => {
        //         setTours((previous) => {
        //           return [
        //             ...previous,
        //             doc.data()
        //           ]
        //         });
        //       });
        //       setTours((previous) => {
        //         return [
        //           ...previous,
        //           { id: -2 }
        //         ]
        //       });
        //     });
        // }}

        renderItem={({ item, index }) => {

          const opacity = countryScrollX.interpolate({
            inputRange: [
              (index - 2) * COUNTRY_ITEM_SIZE,
              (index - 1) * COUNTRY_ITEM_SIZE,
              index * COUNTRY_ITEM_SIZE
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });

          const mapSize = countryScrollX.interpolate({
            inputRange: [
              (index - 2) * COUNTRY_ITEM_SIZE,
              (index - 1) * COUNTRY_ITEM_SIZE,
              index * COUNTRY_ITEM_SIZE
            ],
            outputRange: [25, 70, 25],
            extrapolate: 'clamp'
          });

          const fontSize = countryScrollX.interpolate({
            inputRange: [
              (index - 2) * COUNTRY_ITEM_SIZE,
              (index - 1) * COUNTRY_ITEM_SIZE,
              index * COUNTRY_ITEM_SIZE
            ],
            outputRange: [14, 18, 14],
            extrapolate: 'clamp'
          })

          if (index == 0 || index == countries.length - 1) {
            return (
              <View
                style={{ width: COUNTRY_ITEM_SIZE }}
              ></View>
            );
          } else {
            return (
              <Animated.View
                opacity={opacity}
                style={{
                  height: 130,
                  width: COUNTRY_ITEM_SIZE,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Animated.Image
                  // source={item.image}
                  source={{ uri: item.imageUri }}
                  resizeMode='contain'
                  style={{
                    width: mapSize,
                    height: mapSize,
                    tintColor: COLORS.primary
                  }}
                />

                <Animated.Text
                  style={{
                    marginTop: 3, color: COLORS.primary,
                    ...FONTS.h2, fontSize: fontSize
                  }}
                >
                  {item?.name}
                </Animated.Text>
              </Animated.View>
            )
          }
        }}
      />
    );
  };

  const renderTours = () => {
    return (
      <Animated.FlatList
        horizontal
        pagingEnabled
        data={tours}
        bounces={false}
        snapToAlignment={'center'}
        decelerationRate={0}
        snapToInterval={PLACES_ITEM_SIZE}
        scrollEventThrottle={16}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => `place-${item.id}`}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { x: tourScrollX } } }
        ], { useNativeDriver: false })}
        onMomentumScrollEnd={(event) => {
          let position = (event.nativeEvent.contentOffset.x / PLACES_ITEM_SIZE).toFixed(0)
          setTourScrollPos(position)
        }}

        renderItem={({ item, index }) => {

          const opacity = tourScrollX.interpolate({
            inputRange: [
              (index - 2) * PLACES_ITEM_SIZE,
              (index - 1) * PLACES_ITEM_SIZE,
              index * PLACES_ITEM_SIZE
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });

          let activeHeight = 0
          if (Platform.OS == 'ios') {
            if (SIZES.height > 800) {
              activeHeight = SIZES.height / 2
            } else {
              activeHeight = SIZES.height / 1.65
            }
          } else {
            activeHeight = SIZES.height / 1.7
          };

          const height = tourScrollX.interpolate({
            inputRange: [
              (index - 2) * PLACES_ITEM_SIZE,
              (index - 1) * PLACES_ITEM_SIZE,
              index * PLACES_ITEM_SIZE
            ],
            outputRange: [SIZES.height / 2.25, activeHeight, SIZES.height / 2.25],
            extrapolate: 'clamp'
          });

          if (index == 0 || index == tours.length - 1) {
            return (
              <View
                style={{
                  width: EMPTY_ITEM_SIZE
                }}
              />
            )
          } else {
            return (
              <Animated.View
                opacity={opacity}
                style={{
                  height: height,
                  width: PLACES_ITEM_SIZE,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  padding: 10
                }}
              >
                {/* Background Image */}
                <SharedElement
                  id={`Tour-Place-Bg-${item?.id}-${item?.name}`}
                  style={[StyleSheet.absoluteFillObject, { marginHorizontal: 8 }]}
                >
                  <Image
                    source={{uri: item?.imageUri}}
                    resizeMode='cover'
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: 20
                    }}
                  />
                </SharedElement>

                {/* Name & Description */}
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: "center",
                    marginHorizontal: SIZES.radius
                  }}
                >
                  <Text style={{ color: COLORS.white, marginBottom: SIZES.radius, ...FONTS.h1 }}>{item?.name}</Text>
                  <Text style={{ color: COLORS.white, marginBottom: SIZES.padding * 2, ...FONTS.body3, textAlign: 'center' }}>{item?.description}</Text>
                  <TextButton
                    label={"Explore"}
                    containerStyle={{
                      position: 'absolute',
                      bottom: -20,
                      width: 150,
                    }}
                    onPress={() => {
                      var currentIndex = parseInt(tourScrollPos, 10) + 1
                      navigation.navigate("tourPlace", {
                        selectedTour: tours[currentIndex],
                        selectedProvince: provinceName
                      })
                    }}
                  />
                </View>
              </Animated.View>
            )
          }
        }
        }
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: appTheme?.backgroundColor }}>
      <StatusBar backgroundColor='#009387' style='light' />
      {/* Header */}
      {renderHeader()}

      {/* Body Content */}
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          paddingBottom: Platform.OS == 'ios' ? 40 : 0
        }}
      >
        <View style={{ flex: 1 }}>
          {/* Provinces FlatList*/}
          <View>
            {renderProvinces()}
          </View>

          {/* Tours FlatList */}
          <View
            style={{ flex: 1 }}
          >
            {renderTours()}
          </View>
          <View
            style={{
              height: 100
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tours

const styles = StyleSheet.create({})