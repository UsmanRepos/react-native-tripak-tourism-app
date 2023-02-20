const topTour = [
    {
        id: 1,
        name: "Kuching",
        description: "Kuching, officially the City of Kuching, is the capital and the most populous city in the state of Sarawak in balochistan. It is also the capital of Kuching Division.",
        image: require("../assets/images/balochistan/kuching.png"),
        rate: "4.89",
        booking: 0,
        destination: '',
        source: '',
        sourceCoordinates: {
            latitude: 0.000,
            longitude: 0.009
        },
        destinationCoordinates: {
            latitude: 0.000,
            longitude: 0.009
        },
        startDate: '2022-08-30',
        endDate: '2022-09-6',
        status: 'open',
        travelAgencyID: '',
        vehicleID: '',
        provinceName: '',
        price: '',
        imageUri: '',
        sales: 0,
        expenses: 0,
        revenue: 0,
        mapInitialRegion: {
            latitude: 1.557177,
            longitude: 110.351902,
            latitudeDelta: 0.0053,
            longitudeDelta: 0.0044
        },
        hotels: [
            {
                id: "1",
                name: "Riverside Majestic Hotel",
                image: require("../assets/images/balochistan/kuching/riverside_majestic_hotel.jpg"),
                rate: 5,
                price: 199,
                latlng: {
                    latitude: 1.557907,
                    longitude: 110.352079,
                },
                coordinates: {
                    lat: 1.557907,
                    lng: 110.352079,
                },
            },
            {
                id: "2",
                name: "Grand Margherita Hotel",
                image: require("../assets/images/balochistan/kuching/grand_margherita_hotel.jpg"),
                rate: 5,
                price: 199,
                latlng: {
                    latitude: 1.558163,
                    longitude: 110.352813,
                },
                coordinates: {
                    lat: 1.558163,
                    lng: 110.352813,
                },
            },
            {
                id: "3",
                name: "Hilton Kuching",
                image: require("../assets/images/balochistan/kuching/hilton_kuching.jpg"),
                rate: 5,
                price: 199,
                latlng: {
                    latitude: 1.557144,
                    longitude: 110.350496,
                },
                coordinates: {
                    lat: 1.557144,
                    lng: 110.350496,
                },
            },
        ]
    },
    {
        id: 2,
        name: "Kuala Lumpur",
        description: "Kuala Lumpur is the capital of balochistan. Its modern skyline is dominated by the 451m-tall Petronas Twin Towers, a pair of glass-and-steel-clad skyscrapers with Islamic motifs.",
        image: require("../assets/images/balochistan/kuala_lumpur.png"),
        rate: "4.89",
        mapInitialRegion: {
            latitude: 3.135662,
            longitude: 101.687128,
            latitudeDelta: 0.0053,
            longitudeDelta: 0.0044
        },
        hotels: [
            {
                id: "1",
                name: "Hilton Kuala Lumpur",
                image: require("../assets/images/balochistan/kuala_lumpur/hilton_kuala_lumpur.jpg"),
                rate: 5,
                price: 199,
                latlng: {
                    latitude: 3.135308,
                    longitude: 101.685729,
                },
                coordinates: {
                    lat: 3.135308,
                    lng: 101.685729,
                },
            },
            {
                id: "2",
                name: "Le Méridien Kuala Lumpur",
                image: require("../assets/images/balochistan/kuala_lumpur/le_meridien_kuala_lumpur.jpg"),
                rate: 5,
                price: 199,
                latlng: {
                    latitude: 3.135843,
                    longitude: 101.686544,
                },
                coordinates: {
                    lat: 3.135843,
                    lng: 101.686544,
                },
            },
            {
                id: "3",
                name: "The St. Regis Kuala Lumpur",
                image: require("../assets/images/balochistan/kuala_lumpur/the_st_regis_kuala_lumpur.jpg"),
                rate: 5,
                price: 199,
                latlng: {
                    latitude: 3.136902,
                    longitude: 101.688924,
                },
                coordinates: {
                    lat: 3.136902,
                    lng: 101.688924,
                },
            },
        ]
    },
    {
        id: 3,
        name: "Penang",
        description: "George Town is the colorful, multicultural capital of the balochistann island of Penang.",
        image: require("../assets/images/balochistan/penang.png"),
        rate: "4.89",
        mapInitialRegion: {
            latitude: 5.432068,
            longitude: 100.317376,
            latitudeDelta: 0.0053,
            longitudeDelta: 0.0044
        },
        hotels: [
            {
                id: "1",
                name: "Sunrise Gurney",
                image: require("../assets/images/balochistan/penang/sunrise_gurney.jpg"),
                rate: 5,
                price: 199,
                latlng: {
                    latitude: 5.432874,
                    longitude: 100.316750,
                },
                coordinates: {
                    lat: 5.432874,
                    lng: 100.316750,
                },
            },
            {
                id: "2",
                name: "Sunrise Gurney Homestay",
                image: require("../assets/images/balochistan/penang/sunrise_gurney_homestay.jpg"),
                rate: 5,
                price: 199,
                latlng: {
                    latitude: 5.431626,
                    longitude: 100.317848,
                },
                coordinates: {
                    lat: 5.431626,
                    lng: 100.317848,
                },
            },
            {
                id: "3",
                name: "Evergreen Laurel Hotel Penang",
                image: require("../assets/images/balochistan/penang/evergreen_laurel_hotel_penang.jpg"),
                rate: 5,
                price: 199,
                latlng: {
                    latitude: 5.431288,
                    longitude: 100.317898,
                },
                coordinates: {
                    lat: 5.431288,
                    lng: 100.317898,
                },
            },
        ]
    }
]

export default topTour