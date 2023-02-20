import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Animated } from 'react-native';
import React, { useEffect } from 'react';
import { COLORS, SIZES, FONTS, images } from '../../constants'
import { TextButton } from '../../components'

const onBoardings = [
  {
    title: "Let's Travelling",
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut",
    img: images.onboarding1
  },
  {
    title: "Navigation",
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut",
    img: images.onboarding2
  },
  {
    title: "Destination",
    description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut",
    img: images.onboarding3
  }
];

const OnBoarding = ({navigation}) => {

  const scrollX = new Animated.Value(0)
  const [completed, setCompleted] = React.useState(false);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      if (Math.floor(value / SIZES.width) === onBoardings.length - 1) {
        setCompleted(true);
      }
    });

    return () => scrollX.removeListener();
  }, []);

  const renderContent = () => {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEnabled
        scrollEventThrottle={16}
        decelerationRate={0}
        snapToAlignment={"center"}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { x: scrollX } } }
        ], { useNativeDriver: false })}

      >
        {
          onBoardings.map((item, index) => (
            <View
              key={`key-${index}`}
              style={{
                width: SIZES.width,
                height: "100%"
              }}

            >
              {/* Image */}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={item.img}
                  resizeMode="cover"
                  style={{
                    width: "100%",
                    height: "100%"
                  }}
                />
              </View>

              {/* Text */}
              <View
                style={{
                  position: "absolute",
                  bottom: "13%",
                  left: 40,
                  right: 40
                }}
              >
                <Text style={{ color: COLORS.gray70, textAlign: "center" }}>{item.title}</Text>
                <Text style={{ textAlign: "center" }}>{item.description}</Text>
              </View>

              {/* Button */}
              {/* <TouchableOpacity
                style={styles.button}
                onPress={() => console.warn("button pressed")}
              >
                <Text style={{ ...FONTS.h1, color: COLORS.white }}>Skip</Text>
              </TouchableOpacity> */}
            </View>
          ))
        }
      </Animated.ScrollView>
    );
  };

  const renderDots = () => {

    const dotPosition = Animated.divide(scrollX, SIZES.width);

    return (
      <View style={styles.dotContainer}>
        {
          onBoardings.map((item, index) => {

            const opacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp"
            });

            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base, 17, SIZES.base],
              extrapolate: "clamp"
            });

            return (
              <Animated.View
                key={`dot-${index}`}
                opacity={opacity}
                style={[styles.dot, { width: dotSize, height: dotSize }]}
              >

              </Animated.View>
            );
          })
        }
      </View>
    );
  };


  const renderFooter = () => {
    return (
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SIZES.height * 0.13,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.height > 700 ? SIZES.padding : 20,
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
              // ...FONTS.h3,

            }}
            onPress={() => navigation.navigate('authentication')}
          />
          <TextButton
            label={completed ? 'Explore' : 'Skip'}
            containerStyle={{
              flex: 1,
              borderRadius: SIZES.radius,
              marginLeft: SIZES.radius,
              backgroundColor: COLORS.primary
            }}
            labelStyle={{
              // ...FONTS.h3,
            }}
            onPress={() => navigation.navigate('tabs', {
              screen:'home'
            })}
          />
        </View>

      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* Dots */}
      <View style={styles.dotRootContainer}>
        {renderDots()}
      </View>

      {/* Footer */}
      {renderFooter()}
    </SafeAreaView>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  dotRootContainer: {
    width: "100%",
    position: "absolute",
    bottom: SIZES.height > 700 ? '25%' : '20%',
    alignItems: "center"
  },
  dotContainer: {
    flexDirection: "row",
    height: SIZES.padding,
    justifyContent: "center",
    alignItems: "center"
  },
  dot: {
    borderRadius: SIZES.padding,
    marginHorizontal: SIZES.radius / 2,
    backgroundColor: COLORS.sceondary
  },

});
