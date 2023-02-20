import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDynamicAnimation, MotiImage } from 'moti'
import { SIZES, images, COLORS } from '../constants'
import { TextButton } from '../components'
import { useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

const ReservedTours = ({ navigation, route }) => {
  const { appTheme } = useSelector((state) => state.themeReducer)
  const isFocused = useIsFocused();

  const imageOne = useDynamicAnimation(() => ({
    top: "30%",
    left: "25%"
  }));
  const imageTwo = useDynamicAnimation(() => ({
    top: "45%",
    left: "15%"
  }));
  const imageThree = useDynamicAnimation(() => ({
    top: "58%",
    left: "25%"
  }));
  const imageFour = useDynamicAnimation(() => ({
    top: "61%",
    left: "40%"
  }));
  const imageFive = useDynamicAnimation(() => ({
    top: "27%",
    left: "50%"
  }));

  useEffect(() => {
    if (isFocused) {
      imageOne.animateTo({
        top: "20%",
        left: "15%"
      });

      imageTwo.animateTo({
        top: "38%",
        left: -10
      });

      imageThree.animateTo({
        top: "62%",
        left: "5%"
      });

      imageFour.animateTo({
        top: "75%",
        left: "40%"
      });
      imageFive.animateTo({
        top: "15%",
        left: "65%"
      });
    } else {
      imageOne.animateTo({
        top: "30%",
        left: "25%"
      });

      imageTwo.animateTo({
        top: "45%",
        left: "15%"
      });

      imageThree.animateTo({
        top: "58%",
        left: "25%"
      });

      imageFour.animateTo({
        top: "61%",
        left: "40%"
      });
      imageFive.animateTo({
        top: "27%",
        left: "50%"
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
          />
        </View>

      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white
      }}
    >
      {/* Animated Images */}
      <View
        style={{
          flex: 1,
          overflow: 'hidden'
        }}
      >
        <Image
          source={images.walkthrough_02_01}
          style={{
            ...styles.image,
            top: "35%",
            left: "35%",
            width: 106,
            height: 161,
            zIndex: 1
          }}
        />
        <Image
          source={images.walkthrough_02_02}
          style={{
            ...styles.image,
            top: "50%",
            left: "50%",
          }}
        />
        <MotiImage
          state={imageOne}
          source={images.walkthrough_02_03}
          style={styles.image}
        />
        <MotiImage
          state={imageTwo}
          source={images.walkthrough_02_04}
          style={styles.image}
        />
        <MotiImage
          state={imageThree}
          source={images.walkthrough_02_05}
          style={styles.image}
        />
        <MotiImage
          state={imageFour}
          source={images.walkthrough_02_06}
          style={styles.image}
        />
        <MotiImage
          state={imageFive}
          source={images.walkthrough_02_07}
          style={styles.image}
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
        <Text style={{}}>
          No Active Bookings
        </Text>
        <Text style={{ marginTop: SIZES.radius, textAlign: 'center', color: COLORS.grey }}>
          Find your next unforgettable experience on Tripak
        </Text>
      </View>

      {/* Footer */}
      {renderFooter()}
    </View>
  );
};

export default ReservedTours

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: 86,
    height: 112,
    zIndex: 0,
    borderRadius: SIZES.radius
  }
})