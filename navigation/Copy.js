import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useReducer, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS, FONTS, SIZES, icons } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton, AuthContext } from '../components'
import {
    TourPlace, Tours, Home, Profile, Notification, ReservedTours,
    PersonalInformation, AccountInformation, ManagePrivacy, Welcome,
    SignIn, SignUp, bookingsWithLogin, OnBoarding, Request
} from '../screens'

const AuthStack = createStackNavigator()
const TourStack = createStackNavigator()
const HomeStack = createStackNavigator()
const ProfileStack = createStackNavigator()
const RootStack = createStackNavigator()
const Tabs = createBottomTabNavigator()
const BoardingStack = createStackNavigator()

const HomeStackScreen = () => {
    return (
        <HomeStack.Navigator
            headerMode='none'
        >
            <HomeStack.Screen
                name='home'
                component={Home}
            />
            <HomeStack.Screen
                name='request'
                component={Request}
            />
        </HomeStack.Navigator>
    );
};

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
            name='SignIn'
            component={SignIn}
        />
        <AuthStack.Screen
            name='signUp'
            component={SignUp}
        />
    </AuthStack.Navigator>
)
const TourStackScreen = () => (
    <TourStack.Navigator
        screenOptions={{
            headerShown: false
        }}
        initialRouteName='tours'
    >
        <TourStack.Screen
            name='tours'
            component={Tours}
        />
        <TourStack.Screen
            name='tourPlace'
            component={TourPlace}
        />
    </TourStack.Navigator>
);

const ProfileStackScreen = () => (
    <ProfileStack.Navigator
        initialRouteName='profile'
    >
        <ProfileStack.Screen
            name='profile'
            component={Profile}
            options={{
                headerRight: () => (
                    <IconButton
                        icon={icons.question}
                        iconStyle={{
                            width: 17,
                            height: 17
                        }}
                        containerStyle={{
                            width: 30,
                            height: 30,
                            marginHorizontal: SIZES.padding,
                            borderRadius: 15,
                            backgroundColor: COLORS.sceondary
                        }}
                        onPress={() => console.log('pressed')}
                    />
                ),
                headerLeft: () => (
                    <View style={{ marginHorizontal: SIZES.padding }}>
                        <Text>Profile</Text>
                    </View>
                ),
                headerTintColor: COLORS.white
            }}
        />
        <ProfileStack.Screen
            name='personalInformation'
            component={PersonalInformation}
            options={{
                title: 'Personal Information'
            }}
        />
        <ProfileStack.Screen
            name='accountInformation'
            component={AccountInformation}
            options={{
                title: 'Account Information'
            }}
        />
        <ProfileStack.Screen
            name='managePrivacy'
            component={ManagePrivacy}
            options={{
                title: 'Manage Privacy'
            }}
        />
    </ProfileStack.Navigator>
);

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
            component={HomeStackScreen}
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
            component={TourStackScreen}
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
            component={ProfileStackScreen}
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
    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
    };

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false,
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };
        }
    };

    const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo(() => ({
        signIn: async (foundUser) => {
            const userToken = String(foundUser[0].userToken);
            const userName = foundUser[0].username;

            try {
                await AsyncStorage.setItem('userToken', userToken);
            } catch (e) {
                console.log(e);
            }
            dispatch({ type: 'LOGIN', id: userName, token: userToken });
        },
        signOut: async () => {
            try {
                await AsyncStorage.removeItem('userToken');
            } catch (e) {
                console.log(e);
            }
            dispatch({ type: 'LOGOUT' });
        },
        signUp: () => {
        }
    }), []);

    useEffect(() => {
        setTimeout(async () => {
            let userToken;
            userToken = null;
            try {
                userToken = await AsyncStorage.getItem('userToken');
            } catch (e) {
                console.log(e);
            }
            dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
        }, 1000);
    }, []);

    if (loginState.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer theme={theme}>
                {
                    loginState.userToken !== null
                        ? <TabsScreen />
                        : <RootStackScreen />
                }
            </NavigationContainer>
        </AuthContext.Provider>
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