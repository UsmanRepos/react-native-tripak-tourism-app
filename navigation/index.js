import { StyleSheet, Text, View, Image, TouchableOpacity, Easing } from 'react-native'
import React, { useReducer, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS, FONTS, SIZES, icons } from '../constants'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import {
    TourPlace, Tours, Home, Profile, Notification, ReservedTours,
    PersonalInformation, AccountInformation, ManagePrivacy, Welcome,
    SignIn, SignUp, bookingsWithLogin, OnBoarding, Request, SearchTours, Help, About
} from '../screens'

const AuthStack = createStackNavigator()
const MainStack = createSharedElementStackNavigator()
const RootStack = createStackNavigator()
const Tabs = createBottomTabNavigator()
const BoardingStack = createStackNavigator()


const BoardingStackScreen = () => {
    return (
        <BoardingStack.Navigator
            headerMode='none'
            initialRouteName='welcome'
        >
            <BoardingStack.Screen
                name='welcome'
                component={Welcome}
            />
            <BoardingStack.Screen
                name='onBoarding'
                component={OnBoarding}
            />
        </BoardingStack.Navigator>
    );
};

const AuthStackScreen = () => (
    <AuthStack.Navigator
        initialRouteName='signIn'
        headerMode='none'
    >
        <AuthStack.Screen
            name='signIn'
            component={SignIn}
        />
        <AuthStack.Screen
            name='signUp'
            component={SignUp}  
        />
    </AuthStack.Navigator>
)

const TabBarIcon = ({ icon, tintColor }) => (
    <View
        style={{
            justifyContent: "center",
            alignItems: "center"
        }}
    >
        <Image
            source={icon}
            resizeMode="contain"
            style={{
                width: 25,
                height: 25,
                tintColor: tintColor
            }}
        />
    </View>
);

const TabBarButton = ({ children, onPress }) => {
    return (
        <TouchableOpacity
            style={[{
                top: -25,
                justifyContent: 'center',
                alignItems: 'center',
            }, styles.shadow]}
            onPress={onPress}
        >
            <LinearGradient
                colors={[COLORS.primary, COLORS.sceondary]}
                style={{
                    width: 65,
                    height: 65,
                    borderRadius: 35
                }}
            >
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const tabBarOptions = {
    showLabel: false,
    style: {
        position: 'absolute',
        left: SIZES.padding,
        right: SIZES.padding,
        bottom: SIZES.radius,
        height: 60,
        elevation: 0,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary
    }
}

const TabsScreen = () => (
    <Tabs.Navigator
        tabBarOptions={tabBarOptions}
        initialRouteName='home'
    >
        <Tabs.Screen
            name='home'
            component={Home}
            options={{
                tabBarIcon: ({ focused }) => {
                    let tintColor = focused ? COLORS.sceondary : COLORS.white
                    return (
                        <TabBarIcon icon={icons.home} tintColor={tintColor} />
                    )
                }
            }}
        />
        <Tabs.Screen
            name='reservedTours'
            component={bookingsWithLogin}
            options={{
                tabBarIcon: ({ focused }) => {
                    let tintColor = focused ? COLORS.sceondary : COLORS.white
                    return (
                        <TabBarIcon icon={icons.booking} tintColor={tintColor} />
                    )
                },
            }}
        />
        <Tabs.Screen
            name='tours'
            component={Tours}
            options={{
                tabBarIcon: ({ focused }) => {
                    return (
                        <TabBarIcon icon={icons.destination} tintColor={COLORS.white} />
                    )
                },
                tabBarButton: (props) => (
                    <TabBarButton {...props} />
                ),
            }}
        />
        <Tabs.Screen
            name='notification'
            component={Notification}
            options={{
                tabBarIcon: ({ focused }) => {
                    let tintColor = focused ? COLORS.sceondary : COLORS.white
                    return (
                        <TabBarIcon icon={icons.notification} tintColor={tintColor} />
                    )
                },
            }}
        />
        <Tabs.Screen
            name='profile'
            component={Profile}
            options={{
                tabBarIcon: ({ focused }) => {
                    let tintColor = focused ? COLORS.sceondary : COLORS.white
                    return (
                        <TabBarIcon icon={icons.user} tintColor={tintColor} />
                    )
                },
            }}
        />
    </Tabs.Navigator>
);

const options = {
    gestureEnabled: false,
    transitionSpec: {
        open: {
            animation: 'timing',
            config: { duration: 400, easing: Easing.inOut(Easing.ease) }
        },
        close: {
            animation: "timing",
            config: { duration: 400, easing: Easing.inOut(Easing.ease) }
        }
    }
};

const MainStackScreen = () => {
    return (
        <MainStack.Navigator
            headerMode='none'
            screenOptions={{
                useNativeDriver:true,
            }}
            
        >
            <MainStack.Screen
                name='tabs'
                component={TabsScreen}
            />
             <MainStack.Screen
                name='searchTours'
                component={SearchTours}
            />
            <MainStack.Screen
                name='request'
                component={Request}
            />
            <MainStack.Screen
                name='tourPlace'
                component={TourPlace}
                options={() => options}
            />
            <MainStack.Screen
                name='personalInformation'
                component={PersonalInformation}
                options={{
                    title: 'Personal Information'
                }}
            />
            <MainStack.Screen
                name='accountInformation'
                component={AccountInformation}
                options={{
                    title: 'Account Information'
                }}
            />
            <MainStack.Screen
                name='help'
                component={Help}
                options={{
                    title: 'HelpCenter | Tripak'
                }}
            />
            <MainStack.Screen
                name='about'
                component={About}
                options={{
                    title: 'AboutUs | Tripak'
                }}
            />
            <MainStack.Screen
                name='managePrivacy'
                component={ManagePrivacy}
                options={{
                    title: 'Manage Privacy'
                }}
            />
        </MainStack.Navigator>
    );
};

const RootStackScreen = () => {
    return (
        <RootStack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={'boarding'}
        >
            <RootStack.Screen
                name='boarding'
                component={BoardingStackScreen}
            />
            <RootStack.Screen
                name='authentication'
                component={AuthStackScreen}
            />
            <RootStack.Screen
                name='tabs'
                component={MainStackScreen}
            />
        </RootStack.Navigator>
    );
};

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: COLORS.transparent
    }
};

const Index = () => {

    return (
        <NavigationContainer theme={theme}>
            <RootStackScreen />
        </NavigationContainer>
    );
};

export default Index

const styles = StyleSheet.create({
    shadow: {
        shadowColor: COLORS.sceondary,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 8
    }
})