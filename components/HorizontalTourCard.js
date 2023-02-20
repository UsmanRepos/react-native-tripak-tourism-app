import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { SharedElement } from 'react-navigation-shared-element'
import { icons, SIZES, COLORS, FONTS } from '../constants'

const HorizontalTourCard = ({ containerStyle, tour, onPress }) => {
    const { appTheme } = useSelector((state) => state.themeReducer)
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                ...containerStyle
            }}
            onPress={onPress}
        >
            <SharedElement
                id={`Tour-Place-Bg-${tour?.id}-${tour?.name}`}
                style={{
                    marginBottom: SIZES.radius
                }}
            >
                <Image
                    source={{ uri: tour.imageUri}}
                    resizeMode='cover'
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: SIZES.radius
                    }}
                />
            </SharedElement>
            
            <View
                style={{
                    position: 'absolute',
                    top: 8, left: 87,
                    width: 27,
                    height: 27,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: COLORS.white,
                    borderRadius: 5
                }}
            >
                <Image
                    source={icons.heart}
                    resizeMode='contain'
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: !tour.is_favourite && COLORS.gray20
                    }}
                />
            </View>
            {/* <ImageBackground
                source={tour?.image}
                resizeMode='cover'
                style={{
                    width: 120,
                    height: 120,
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    marginBottom: SIZES.radius
                }}
                imageStyle={{
                    borderRadius: SIZES.radius
                }}
            >
                <View
                    style={{
                        width: 27,
                        height: 27,
                        margin: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.white,
                        borderRadius: 5
                    }}
                >
                    <Image
                        source={icons.heart}
                        resizeMode='contain'
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: !tour.is_favourite && COLORS.gray20
                        }}
                    />
                </View>
            </ImageBackground> */}

            {/* Details  */}
            <View
                style={{ flex: 1 }}
            >
                {/* Play Icon */}
                <View
                    style={{
                        alignItems: "center",
                        flexDirection: 'row',
                        marginLeft: SIZES.radius
                    }}
                >
                    <Image
                        source={icons.location}
                        resizeMode='contain'
                        style={{
                            width: 15,
                            height: 15,
                            tintColor: COLORS.gray30
                        }}
                    />
                    <Text style={{ color: COLORS.gray30, marginLeft: SIZES.base, ...FONTS.body5 }}>{ tour.provinceName ?? "New York"}, Pakistan</Text>
                </View>

                {/* Info */}
                <View
                    style={{
                        paddingHorizontal: SIZES.radius,
                    }}
                >
                    <Text style={{ ...FONTS.h4, color:appTheme?.textColor }}>{ tour.title ?? "New York in One Day Guided Sightseeing Tour"}</Text>
                    <Text style={{ ...FONTS.h4, color:appTheme?.textColor }}>{ tour.travelAgencyName ?? "By WahTraveller's"}</Text>
                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        <Image
                            source={icons.calendar}
                            resizeMode='cover'
                            style={{
                                width: 17,
                                height: 17,
                                tintColor: COLORS.gray60
                            }}
                        />
                        <Text style={{ marginLeft: SIZES.base, color: COLORS.gray60, ...FONTS.body5 }}>{ tour.startDate ??"22-04-2022"}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default HorizontalTourCard

const styles = StyleSheet.create({})