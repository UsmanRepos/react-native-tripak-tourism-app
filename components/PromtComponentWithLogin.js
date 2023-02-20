import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDynamicAnimation, MotiImage } from 'moti'
import { SIZES, images, COLORS, FONTS } from '../constants'
import { TextButton } from '../components'
import { useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const PromtComponentWithLogin = ({title}) => {
  const { appTheme } = useSelector((state) => state.themeReducer)
  const isFocused = useIsFocused();
  const navigation = useNavigation()

  const imageOne = useDynamicAnimation(() => ({
    top: "30%",
    left: "25%"
  }));
  
  const imageTwo = useDynamicAnimation(() => ({
    top: "35%",
    left: "40%"
  }));

  const imageThree = useDynamicAnimation(() => ({
    top: "45%",
    left: "20%"
  }));

  const imageFour = useDynamicAnimation(() => ({
    top: "50%",
    left: "45%"
  }));

  useEffect(() => {
    if (isFocused) {
      imageOne.animateTo({
        top: "20%",
        left: "15%"
      });

      imageTwo.animateTo({
        top: "30%",
        left: "55%"
      });

      imageThree.animateTo({
        top: "50%",
        left: "8%"
      });

      imageFour.animateTo({
        top: "60%",
        left: "48%"
      });
    } else {
      imageOne.animateTo({
        top: "30%",
        left: "25%"
      });

      imageTwo.animateTo({
        top: "35%",
        left: "40%"
      });

      imageThree.animateTo({
        top: "45%",
        left: "20%"
      });

      imageFour.animateTo({
        top: "50%",
        left: "45%"
      });
    }
  }, [isFocused]);

  function renderFooter() {
    return (
      <View style={{
        position: 'absolute',
        bottom: '3%',
        left: 0,
        right: 0,
        height: SIZES.height * 0.2,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.height > 700 ? SIZES.padding : 20
      }}>
        <View
          style={{
            width: "100%",
            flexDirection: 'row',
            height: 55
          }}>
          <TextButton
            label='Join Now'
            containerStyle={{
              flex: 1,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.sceondary

            }}
            labelStyle={{
              color: COLORS.white,
            }}
            onPress={() => {
              navigation.replace('authentication', {
                screen: 'signUp',
              })
            }}
          />
          <TextButton
            label='Log In'
            containerStyle={{
              flex: 1,
              borderRadius: SIZES.radius,
              marginLeft: SIZES.radius,
              backgroundColor: COLORS.primary
            }}
            labelStyle={{
              color: COLORS.white
            }}
            onPress={() => {
              navigation.replace('authentication', {
                screen: 'signIn',
              })
            }}
          />
        </View>

      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: appTheme?.backgroundColor
      }}
    >
      {/* Animated Images */}
      <View
        style={{
          flex: 1,
          overflow: 'hidden'
        }}
      >
        <MotiImage
          state={imageOne}
          source={images.walkthrough_03_03}
          style={[styles.image, { zIndex: 3 }]}
        />
        <MotiImage
          state={imageTwo}
          source={images.walkthrough_03_01}
          style={[styles.image, { zIndex: 0 }]}
        />
        <MotiImage
          state={imageThree}
          source={images.walkthrough_03_02}
          style={[styles.image, { zIndex: 1 }]}
        />
        <MotiImage
          state={imageFour}
          source={images.walkthrough_03_04}
          style={[styles.image, { zIndex: 2 }]}
        />
      </View>

      {/* Text */}
      <View
        style={{
          height: SIZES.height * 0.35,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingHorizontal: SIZES.padding
        }}>
        <Text style={{ ...FONTS.h2, color: appTheme?.textColor}}>
          {title}
        </Text>
        <Text style={{ textAlign: 'center', color: COLORS.gray50, ...FONTS.body3 }}>
          Get information about your bookings, travel inspiration, and more right here.
        </Text>
      </View>

      {/* Footer */}
      { auth.currentUser == null && renderFooter()}
    </View>
  );
};

export default PromtComponentWithLogin

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: 130,
    height: 130,
    zIndex: 0,
    borderRadius: SIZES.radius
  }
})