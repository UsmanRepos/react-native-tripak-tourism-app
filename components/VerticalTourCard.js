import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SharedElement } from 'react-navigation-shared-element'
import { COLORS, SIZES, icons, FONTS, images } from '../constants';
import { useSelector } from 'react-redux'
import { IconLabel } from '../components'


const VerticalTourCard = ({ containerStyle, tour, onPress }) => {
    const { appTheme } = useSelector((state) => state.themeReducer)
    return (
        <TouchableOpacity
            style={{
                width: 250,
                ...containerStyle
            }}
            onPress={onPress}
        >
            {/* Thumbnail */}
            {/* <Image
                source={tour?.image}
                resizeMode='cover'
                style={{
                    width: "100%",
                    height: 150,
                    marginBottom: SIZES.radius,
                    borderRadius: SIZES.radius
                }}
            /> */}

            <SharedElement
                id={`Tour-Place-Bg-${tour?.id}-${tour?.name}`}
                style={{
                    marginBottom: SIZES.radius
                }}
            >
                <Image
                    source={{uri :tour.imageUri}}
                    resizeMode='cover'
                    style={{
                        width: '100%',
                        height: 150,
                        borderRadius: SIZES.radius
                    }}
                />
            </SharedElement>

            {/* Details */}
            <View
                style={{ paddingHorizontal: SIZES.radius }}
            >
                {/* Play Icon */}
                <View
                    style={{
                        alignItems: "center",
                        flexDirection: 'row',
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
                    <Text style={{
                        color: COLORS.gray30,
                        marginLeft: SIZES.base,
                        color: appTheme?.textColor,
                        ...FONTS.body5
                    }}>{ tour.provinceName ?? "Punjab"}, Pakistan</Text>
                </View>
                {/* Info */}
                <View
                    style={{
                        paddingVertical: SIZES.base,
                    }}
                >
                    <Text style={{ ...FONTS.h3, color: appTheme?.textColor }}>{"New York in One Day Guided Sightseeing Tour"}</Text>
                    <Text style={{ ...FONTS.h3, color: appTheme?.textColor }}>PKR { tour.price != "" ? tour.price : " 1200" }</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default VerticalTourCard;
