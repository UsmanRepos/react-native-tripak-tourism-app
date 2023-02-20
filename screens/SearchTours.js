import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useSelector } from 'react-redux'
import { COLORS, SIZES, FONTS, icons } from '../constants'
import { TextButton, HorizontalTourCard, LineDivider } from '../components'
import { auth, db } from '../firebase'
import { color } from 'react-native-reanimated'

const SearchTours = ({ navigation }) => {
    const { appTheme } = useSelector((state) => state.themeReducer)
    const [selectedProvince, setSelectedProvince] = useState("Punjab")
    const [searchText, setSearchText] = useState("")
    const [filterTours, SetFilterTours] = useState([])

    const renderHeader = () => {
        return (
            <View
                style={{
                    height: 58,
                    marginTop: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.primary
                }}
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={{
                        marginHorizontal: SIZES.radius,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.goBack()}
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

                {/* Label / Title */}
                <View style={{ flex: 1 }}>
                    <Text style={{ ...FONTS.h3, color: COLORS.white, fontSize: 18 }}>Choose Your Trip</Text>
                </View>
            </View>
        );
    }

    const renderProvinces = () => {
        return (
            < View
                style={{
                    marginTop: SIZES.radius
                }}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {["Punjab", "Sindh", "Kpk", "Balochistan", "Kashmir", "Gilgit"].map((item, index) => (
                        <TextButton
                            key={`Provinces-${index}`}
                            label={item}
                            containerStyle={{
                                height: 45,
                                paddingHorizontal: SIZES.radius,
                                marginLeft: SIZES.radius,
                                marginRight: index == 5 ? SIZES.radius : 0,
                                borderRadius: SIZES.radius,
                                borderColor: item == selectedProvince ? appTheme?.checkBoxColor : COLORS.gray20,
                                borderWidth: 1,
                                backgroundColor: item == selectedProvince ? appTheme?.checkBoxColor : null
                            }}
                            labelStyle={{
                                color: item == selectedProvince ? COLORS.white: appTheme?.textColor,
                                ...FONTS.body4
                            }}
                            onPress={() => {
                                setSelectedProvince(item)
                                SetFilterTours([])
                                db.collection("provinces").doc(item).collection("tours").where('name', '==', searchText).get()
                                    .then((querySnapshot) => {
                                        querySnapshot.forEach((doc) => {
                                            SetFilterTours((previous) => {
                                                return [
                                                    ...previous,
                                                    doc.data()
                                                ]
                                            });
                                        });
                                    });
                            }}
                        />
                    ))}
                </ScrollView>
            </View >
        )
    }

    const renderSearchBar = () => {
        return (
            <View style={[{
                flexDirection: 'row',
                borderRadius: SIZES.base,
                alignItems: 'center',
                padding: SIZES.radius,
                backgroundColor: appTheme?.searchBarBackground,
                marginTop: SIZES.radius,
                marginHorizontal: SIZES.radius,
            },  { ...styles.shadow, shadowColor: appTheme?.shadowColor }]}>
                <Image
                    source={icons.search}
                    resizeMode='contain'
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: COLORS.gray40
                    }}
                />
                <TextInput
                    placeholder='Where Are You going?'
                    placeholderTextColor={COLORS.gray40}
                    style={{...styles.textInput, color:appTheme?.searchBarColor }}
                    onEndEditing={() => {
                        SetFilterTours([])
                        db.collection("provinces").doc(selectedProvince).collection("tours").where('name', '==', searchText).get()
                            .then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    SetFilterTours((previous) => {
                                        return [
                                            ...previous,
                                            doc.data()
                                        ]
                                    });
                                });
                            });
                    }}
                    onChangeText={(text) => {
                        setSearchText(text)
                    }}
                    value={searchText}
                />
            </View>

        )
    }

    const renderFilterTours = () => {
        return (
            <FlatList
                data={filterTours}
                keyExtractor={item => `tours-${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginTop: SIZES.padding,
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
                                navigation.navigate("tourPlace", {
                                    selectedTour: item,
                                    selectedProvince: selectedProvince
                                })

                                // setTourPlaces([])
                                // db.collection("bookings").doc(item?.name)?.collection("places").get()
                                //     .then((querySnapshot) => {
                                //         querySnapshot.forEach((doc) => {
                                //             setTourPlaces((previous) => {
                                //                 return [
                                //                     ...previous,
                                //                     doc.data()
                                //                 ]
                                //             });
                                //         });
                                //     });
                            }}
                        />
                    );
                }}
                ItemSeparatorComponent={() => (
                    <LineDivider
                        lineStyle={{ height: 1 }}
                    />
                )}
            />
        );
    };

    return (
        <View
            style={{ flex: 1, backgroundColor: appTheme?.backgroundColor }}
        >
            <StatusBar backgroundColor='#009387' style='light' />

            {/* Header */}
            {renderHeader()}

            {/* Search Bar */}
            {renderSearchBar()}

            {/* Provinces */}
            {renderProvinces()}

            <View
                style={{ flex: 1 }}
            >
                {/* Filter Tours */}
                {renderFilterTours()}
            </View>

        </View>
    )
}

export default SearchTours

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
    textInput: {
        flex: 1,
        height: '100%',
        marginLeft: 10,
        color: '#05375a',
        ...FONTS.body3
    },
})