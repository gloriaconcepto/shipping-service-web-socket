let shipData = {
    shipment: {
        service_code: "usps_priority_mail",
        ship_to: {
            name: "Amanda Miller",
            phone: "555-555-5555",
            address_line1: "525 S Winchester Blvd",
            city_locality: "San Jose",
            state_province: "CA",
            postal_code: "95128",
            country_code: "US",
            address_residential_indicator: "yes",
        },
        ship_from: {
            name: "John Doe",
            phone: "111-111-1111",
            company_name: "Example Corp.",
            address_line1: "4009 Marathon Blvd",
            address_line2: "Suite 300",
            city_locality: "Austin",
            state_province: "TX",
            postal_code: "78756",
            country_code: "US",
            address_residential_indicator: "no",
        },
        packages: [
            {
                weight: {
                    value: 20,
                    unit: "ounce",
                },
            },
        ],
    },
};
