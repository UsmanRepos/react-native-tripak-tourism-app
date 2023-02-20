const nearByTours = [
    {
        id: 1,
        name: "Neelam Valley",
        title:'One Week Trip to Neelam Valley from Islamabad',
        description: "Known for its gorgeous beaches, stellar nightlife, delish seafood, world-heritage listed monuments, Goa is where all the fun is in kashmir.",
        image: require("../assets/images/kashmir/goa.png"),
        booking: 15,
        destination: 'Taobut',
        source: 'Islamabad, Pakistan',
        sourceCoordinates: {
            latitude: 33.6844,
            longitude: 73.0479
        },
        destinationCoordinates: {
            latitude: 34.726674,
            longitude: 74.712491
        },
        startDate: '2022-08-30',
        endDate: '2022-09-06',
        status: 'open',
        travelAgencyID: '',
        vehicleID: '',
        provinceName: 'Kashmir',
        price: 17000,
        imageUri: '',
        sales: 255000,
        expenses: 200000,
        revenue: 55000,
        mapInitialRegion: {
            latitude: 34.205537,
            longitude: 73.8801955,
            latitudeDelta: 2.084548,
            longitudeDelta: 2.609182
        },
        hotels: [
            {
                id: "1",
                name: "Arang Kel",
                image: require("../assets/images/kashmir/goa/taj_holiday_village.jpg"),
                latlng: {
                    latitude: 34.8261,
                    longitude: 74.3577,
                },
                coordinates: {
                    lat: 34.8261,
                    lng: 74.3577,
                },
            },
            {
                id: "2",
                name: "Ratti Gali Lake",
                image: require("../assets/images/kashmir/goa/taj_fort_aguada.jpeg"),
                latlng: {
                    latitude: 34.8293,
                    longitude: 74.0609,
                },
                coordinates: {
                    lat: 34.8293,
                    lng: 74.0609,
                },
            },
            {
                id: "3",
                name: "Athmuqam",
                image: require("../assets/images/kashmir/goa/taj_fort_aguada.jpeg"),
                latlng: {
                    latitude: 34.5883,
                    longitude: 73.9311,
                },
                coordinates: {
                    lat: 34.5883,
                    lng: 73.9311,
                },
            },
        ]
    },
    {
        id: 2,
        name: "Rawalakot",
        title:'Four Days Trip to Rawalakot from Islamabad',
        description: "Known for its gorgeous beaches, stellar nightlife, delish seafood, world-heritage listed monuments, Goa is where all the fun is in kashmir.",
        image: require("../assets/images/kashmir/agra.png"),
        booking: 15,
        destination: 'Banjosa Lake',
        source: 'Islamabad, Pakistan',
        sourceCoordinates: {
            latitude: 33.6844,
            longitude: 73.0479
        },
        destinationCoordinates: {
            latitude: 33.8100,
            longitude: 73.8164,
        },
        startDate: '2022-08-06',
        endDate: '2022-09-10',
        status: 'open',
        travelAgencyID: '',
        vehicleID: '',
        provinceName: 'Kashmir',
        price: 10000,
        imageUri: '',
        sales: 15000,
        expenses: 100000,
        revenue: 50000,
        mapInitialRegion: {
            latitude: 33.7472,
            longitude: 73.44715,
            latitudeDelta: 0.2512,
            longitudeDelta: 1.537
        },
        hotels: [
            {
                id: "1",
                name: "Toli Peer, Toli Peer Road",
                image: require("../assets/images/kashmir/goa/taj_holiday_village.jpg"),
                latlng: {
                    latitude: 33.8928,
                    longitude: 73.9080,
                },
                coordinates: {
                    latitude: 33.8928,
                    lng: 73.9080,
                },
            },
            {
                id: "2",
                name: "Rawalakot",
                image: require("../assets/images/kashmir/goa/taj_fort_aguada.jpeg"),
                latlng: {
                    latitude: 33.8584,
                    longitude: 73.7654
                },
                coordinates: {
                    lat: 33.8584,
                    lng: 73.7654
                },
            },
        ]
    },
    {
        id: 3,
        name: "Jaipur",
        description: "The Pink City, Jaipur is a destination you cannot miss when visiting kashmir. Jaipur is a perfect reflection of what the royal state of Rajasthan is about.",
        image: require("../assets/images/kashmir/jaipur.png"),
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
            latitude: 26.928055,
            longitude: 75.788295,
            latitudeDelta: 0.0053,
            longitudeDelta: 0.0044
        },
        hotels: [
            {
                id: "1",
                name: "Umaid Mahal",
                image: require("../assets/images/kashmir/jaipur/umaid_mahal.webp"),
                latlng: {
                    latitude: 26.927940,
                    longitude: 75.789056,
                },
                coordinates: {
                    lat: 26.927940,
                    lng: 75.789056,
                },
            },
        ]
    },
]
export default nearByTours