import { StyleSheet, Text, View, StatusBar, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SIZES, images, COLORS, FONTS } from '../constants'
import { TextButton, LineDivider, NotificationCard, PromtComponentWithLogin } from '../components'
import { useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import { auth, db } from '../firebase'

const Notification = ({ navigation }) => {
  const { appTheme } = useSelector((state) => state.themeReducer)
  // const [notifications, setNotifications] = useState([
  //   // {
  //   //   tourTitle:'One Day Tour to Murree From Islamabad',
  //   //   tourStartDate:'2022-08-18',
  //   //   travelAgencyName:"Wah Traveller's",
  //   //   isOpen:false
  //   // },
  //   // {
  //   //   tourTitle:'One Day Tour to Murree From Islamabad',
  //   //   tourStartDate:'2022-08-18',
  //   //   travelAgencyName:"Wah Traveller's",
  //   //   isOpen: true
  //   // }
  // ])
  
  const [notifications, setNotifications] = useState(null)

  useEffect(() => {
    setNotifications([])
    db.collection("users").doc(auth?.currentUser?.uid).collection("notifications")
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setNotifications((previous) => {
            return [
              ...previous,
              doc.data()
            ]
          });

        });
      });
  }, [navigation])

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
          <Text style={{ ...FONTS.h1, color: COLORS.white, fontSize: 26 }}>Notifications</Text>
        </View>
      </View>
    );
  };


  const renderNotifications = () => {
    return (
      <FlatList
        data={notifications}
        keyExtractor={item => `notification-${item.id}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <NotificationCard
              notification={item}
              containerStyle={{
                paddingHorizontal: SIZES.base,
                paddingVertical: SIZES.base
              }}

              onPress={() => {
                let notificationRef = db.collection("users").doc(auth.currentUser.uid).collection("notifications").doc(item.id)
                notificationRef.update({
                  isOpen: true
                })
                navigation.navigate("tourPlace", {
                  selectedTour: item.tour,
                  selectedProvince: item.tour.provinceName
                })
              }}

            />
          );
        }}
        ItemSeparatorComponent={() => (
          <LineDivider
            lineStyle={{ height: 1, backgroundColor: COLORS.gray30 }}
          />
        )}
      />
    )
  }

  if (notifications != null && notifications.length > 0) {
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

        {/* Notification */}
        {renderNotifications()}
      </View>
    );
  } else {
    return (
      <PromtComponentWithLogin title={"Yet No Notification"} />
    )
  }


};

export default Notification

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: 130,
    height: 130,
    zIndex: 0,
    borderRadius: SIZES.radius
  }
})