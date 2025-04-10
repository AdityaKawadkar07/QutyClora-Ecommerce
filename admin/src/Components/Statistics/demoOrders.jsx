const demoOrders = [
    {
      orderId: "ORD1001",
      items: [
        { name: "Product A", quantity: 2 },
        { name: "Product B", quantity: 1 },
      ],
      userName: "John Doe",
      address: "123 Main St, City, Some Landmark, Near XYZ",
      contact: "9876543210",
      totalItems: 3,
      totalAmount: 2499,
      couponUsed: "WELCOME200",
      date: "2025-01-22T11:45:15.327+00:00"
    },
    {
      orderId: "ORD1002",
      items: [
        { name: "Product C", quantity: 1 },
        { name: "Product D", quantity: 2 },
      ],
      userName: "Jane Smith",
      address: "456 Elm St, Town, Apartment 12B, Near ABC Mall",
      contact: "9876543211",
      totalItems: 3,
      totalAmount: 1599,
      couponUsed: "WELCOME200",
      date: "2025-02-10T14:12:08.721+00:00"
    },
    {
      orderId: "ORD1003",
      items: [
        { name: "Product E", quantity: 1 },
        { name: "Product F", quantity: 1 },
      ],
      userName: "Alice Johnson",
      address: "789 Oak Ave, Village, Flat 3C, Near DEF Tower",
      contact: "9876543212",
      totalItems: 2,
      totalAmount: 1899,
      couponUsed: "SAVE10",
      date: "2025-03-05T09:33:44.199+00:00"
    },
    {
      orderId: "ORD1004",
      items: [
        { name: "Product G", quantity: 3 },
        { name: "Product H", quantity: 1 },
      ],
      userName: "Bob Williams",
      address: "101 Pine Rd, Metro, House No. 45, Near GHI Park",
      contact: "9876543213",
      totalItems: 4,
      totalAmount: 2999,
      couponUsed: "WELCOME200",
      date: "2025-03-25T18:29:57.530+00:00"
    },
    {
      orderId: "ORD1005",
      items: [
        { name: "Product I", quantity: 1 },
        { name: "Product J", quantity: 2 },
      ],
      userName: "Charlie Brown",
      address: "202 Cedar Blvd, City Central, Block B, Near JKL Cafe",
      contact: "9876543214",
      totalItems: 3,
      totalAmount: 2199,
      couponUsed: "FREESHIP",
      date: "2025-04-03T07:51:35.827+00:00"
    },
  
    // Additional 20 orders
    {
      orderId: "ORD1006",
      items: [
        { name: "Product K", quantity: 1 },
        { name: "Product L", quantity: 2 },
      ],
      userName: "Daniel Green",
      address: "303 Willow Ln, Suburbia, Floor 5, Near MNO Station",
      contact: "9876543215",
      totalItems: 3,
      totalAmount: 1999,
      couponUsed: "SAVE10",
      date: "2025-04-04T09:30:22.111+00:00"
    },
    {
      orderId: "ORD1007",
      items: [
        { name: "Product M", quantity: 2 },
        { name: "Product N", quantity: 1 },
      ],
      userName: "Emma Watson",
      address: "404 Maple St, Urban Heights, Suite 21, Near PQR Market",
      contact: "9876543216",
      totalItems: 3,
      totalAmount: 2799,
      couponUsed: "WELCOME200",
      date: "2025-04-04T12:45:10.222+00:00"
    },
    {
      orderId: "ORD1008",
      items: [
        { name: "Product O", quantity: 2 },
      ],
      userName: "Liam Miller",
      address: "505 Birch Rd, Lakeview, Apt 9A, Near STU Park",
      contact: "9876543217",
      totalItems: 2,
      totalAmount: 1299,
      couponUsed: "FREESHIP",
      date: "2025-04-05T10:11:43.321+00:00"
    },
    {
      orderId: "ORD1009",
      items: [
        { name: "Product P", quantity: 1 },
      ],
      userName: "Sophia Lee",
      address: "606 Chestnut Blvd, Downtown, Unit 4B, Near VWX Plaza",
      contact: "9876543218",
      totalItems: 1,
      totalAmount: 899,
      couponUsed: "",
      date: "2025-04-05T15:55:23.101+00:00"
    },
    {
      orderId: "ORD1010",
      items: [
        { name: "Product Q", quantity: 3 },
        { name: "Product R", quantity: 2 },
      ],
      userName: "Noah Davis",
      address: "707 Walnut St, Uptown, Flat 11C, Near YZA Market",
      contact: "9876543219",
      totalItems: 5,
      totalAmount: 3499,
      couponUsed: "WELCOME200",
      date: "2025-04-06T17:28:15.778+00:00"
    },
    {
      orderId: "ORD1011",
      items: [
        { name: "Product S", quantity: 1 },
      ],
      userName: "Olivia Brown",
      address: "808 Fir Ln, Highlands, Apt 7B, Near BCD Cafe",
      contact: "9876543220",
      totalItems: 1,
      totalAmount: 499,
      couponUsed: "NEW50",
      date: "2025-04-06T18:42:50.457+00:00"
    },
    {
      orderId: "ORD1012",
      items: [
        { name: "Product T", quantity: 4 },
      ],
      userName: "Mason White",
      address: "909 Ash Ave, Cityside, Tower 10, Near EFG Gym",
      contact: "9876543221",
      totalItems: 4,
      totalAmount: 1996,
      couponUsed: "",
      date: "2025-04-06T20:09:30.222+00:00"
    },
    {
      orderId: "ORD1013",
      items: [
        { name: "Product U", quantity: 2 },
        { name: "Product V", quantity: 2 },
      ],
      userName: "Ava Moore",
      address: "111 Palm Blvd, Sub City, House 34, Near HIJ Station",
      contact: "9876543222",
      totalItems: 4,
      totalAmount: 2899,
      couponUsed: "FREESHIP",
      date: "2025-04-06T21:00:00.000+00:00"
    },
    {
      orderId: "ORD1014",
      items: [
        { name: "Product W", quantity: 1 },
      ],
      userName: "Ethan Taylor",
      address: "222 Oakwood Rd, Near KLM Church",
      contact: "9876543223",
      totalItems: 1,
      totalAmount: 1099,
      couponUsed: "",
      date: "2025-04-07T08:10:10.010+00:00"
    },
    {
      orderId: "ORD1015",
      items: [
        { name: "Product X", quantity: 3 },
      ],
      userName: "Isabella Clark",
      address: "333 Cherry St, Lakeside, Cottage 3, Near NOP Lake",
      contact: "9876543224",
      totalItems: 3,
      totalAmount: 1599,
      couponUsed: "SAVE10",
      date: "2025-04-07T09:00:00.000+00:00"
    },
    {
      orderId: "ORD1016",
      items: [
        { name: "Product Y", quantity: 1 },
        { name: "Product Z", quantity: 1 },
      ],
      userName: "James Lewis",
      address: "444 Spruce Ave, Midtown, Floor 2, Near QRS Hospital",
      contact: "9876543225",
      totalItems: 2,
      totalAmount: 1299,
      couponUsed: "WELCOME200",
      date: "2025-04-07T09:45:20.000+00:00"
    },
    {
      orderId: "ORD1017",
      items: [
        { name: "Product AA", quantity: 1 },
        { name: "Product BB", quantity: 1 },
      ],
      userName: "Mia Young",
      address: "555 Cypress Rd, Upper City, Apt 101, Near TUV Plaza",
      contact: "9876543226",
      totalItems: 2,
      totalAmount: 1199,
      couponUsed: "",
      date: "2025-04-07T10:30:30.000+00:00"
    },
    {
      orderId: "ORD1018",
      items: [
        { name: "Product CC", quantity: 2 },
      ],
      userName: "Logan Hall",
      address: "666 Hickory Ln, Central Zone, House 78, Near WXY Park",
      contact: "9876543227",
      totalItems: 2,
      totalAmount: 999,
      couponUsed: "SAVE10",
      date: "2025-04-07T11:22:22.222+00:00"
    },
    {
      orderId: "ORD1019",
      items: [
        { name: "Product DD", quantity: 1 },
      ],
      userName: "Harper Allen",
      address: "777 Magnolia Ave, Crossroads, Near ZAB Stadium",
      contact: "9876543228",
      totalItems: 1,
      totalAmount: 699,
      couponUsed: "",
      date: "2025-04-07T12:12:12.000+00:00"
    },
    {
      orderId: "ORD1020",
      items: [
        { name: "Product EE", quantity: 3 },
      ],
      userName: "Lucas Martin",
      address: "888 Redwood Blvd, Eastside, House 22, Near CDE Plaza",
      contact: "9876543229",
      totalItems: 3,
      totalAmount: 2099,
      couponUsed: "WELCOME200",
      date: "2025-04-07T13:13:13.000+00:00"
    },
    {
      orderId: "ORD1021",
      items: [
        { name: "Product FF", quantity: 2 },
      ],
      userName: "Ella King",
      address: "999 Pinecrest St, Southtown, Apt 5D, Near FGH Stop",
      contact: "9876543230",
      totalItems: 2,
      totalAmount: 1899,
      couponUsed: "FREESHIP",
      date: "2025-04-07T14:14:14.000+00:00"
    }
  ];
  
  export default demoOrders;
  