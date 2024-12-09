// data.js
export const categories = [
  {
    uniqueID: "cat001",
    name: "Jabones Artesanales",
    description: "Jabones hechos a mano con ingredientes naturales.",
    dateCreated: new Date("2024-01-15T10:00:00Z"),
    dateModified: new Date("2024-04-20T15:30:00Z"),
    ownerId: "user123",
    url: "jabones-artesanales",
  },
  {
    uniqueID: "cat002",
    name: "Aromaterapia",
    description: "Productos con esencias naturales para el bienestar.",
    dateCreated: new Date("2024-02-10T09:30:00Z"),
    dateModified: new Date("2024-05-18T12:45:00Z"),
    ownerId: "user123",
    url: "aromaterapia",
  },
];

export const subcategories = [
  {
    uniqueID: "subcat001",
    name: "Jabones de Lavanda",
    description: "Jabones infusionados con esencia de lavanda.",
    dateCreated: new Date("2024-03-05T11:00:00Z"),
    dateModified: new Date("2024-06-10T14:20:00Z"),
    categoryID: "cat001",
    ownerId: "user123",
    url: "jabones-de-lavanda",
  },
  {
    uniqueID: "subcat002",
    name: "Jabones de Menta",
    description: "Jabones refrescantes con extracto de menta.",
    dateCreated: new Date("2024-03-10T10:30:00Z"),
    dateModified: new Date("2024-06-15T13:15:00Z"),
    categoryID: "cat001",
    ownerId: "user123",
    url: "jabones-de-menta",
  },
];

export const brands = [
  {
    uniqueID: "brand001",
    name: "Naturaleza Pura",
    description: "Marca enfocada en productos 100% naturales.",
    dateCreated: new Date("2024-01-20T08:00:00Z"),
    dateModified: new Date("2024-04-25T16:00:00Z"),
    ownerId: "user123",
    url: "naturaleza-pura",
    categoryID: "cat002" 
  },
  {
    uniqueID: "brand002",
    name: "EcoVida",
    description: "Productos ecológicos para una vida sostenible.",
    dateCreated: new Date("2024-02-15T09:45:00Z"),
    dateModified: new Date("2024-05-30T11:25:00Z"),
    ownerId: "user123",
    url: "ecovida",
    categoryID: "cat001" 
  },
];

export const types = [
  {
    uniqueID: "type001",
    name: "Sólido",
    description: "Jabones en barra sólida.",
    dateCreated: new Date("2024-01-25T07:30:00Z"),
    dateModified: new Date("2024-04-28T10:10:00Z"),
    ownerId: "user123",
    url: "solido",
    categoryID: "cat001" 
  },
  {
    uniqueID: "type002",
    name: "Líquido",
    description: "Jabones en presentación líquida.",
    dateCreated: new Date("2024-02-20T08:15:00Z"),
    dateModified: new Date("2024-05-22T12:35:00Z"),
    ownerId: "user123",
    url: "liquido",
    categoryID: "cat001" 
  },
];

export const products = [
  {
    "uniqueID": "prod001",
    "name": "Jabón de Lavanda",
    "description": "Jabón artesanal con esencia de lavanda, ideal para relajar la mente.",
    "price": 12.99,
    "stockQuantity": 150,
    "total_sales": 120,  // Total de unidades vendidas
    "categoryID": "cat001",
    "subcategoryID": "subcat001",
    "brandID": "brand001",
    "typeID": "type001",
    "images": [
      "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      "https://mahetsipage.web.app/assets/images/products/img-1.jpeg"
    ],
    "averageRating": 5,
    "numReviews": 34,
    "dateCreated": "2024-03-01T09:00:00Z",
    "dateModified": "2024-06-20T14:50:00Z",
    "ownerId": "user123",
    "url": "jabon-de-lavanda"
  },
  {
    "uniqueID": "prod002",
    "name": "Jabón de Menta Refrescante",
    "description": "Jabón líquido con extracto de menta, perfecto para una limpieza revitalizante.",
    "price": 9.99,
    "stockQuantity": 200,
    "total_sales": 180,  // Total de unidades vendidas
    "categoryID": "cat001",
    "subcategoryID": "subcat002",
    "brandID": "brand002",
    "typeID": "type002",
    "images": [
      "https://mahetsipage.web.app/assets/images/products/img-2.jpeg",
      "https://mahetsipage.web.app/assets/images/products/img-3.jpeg"
    ],
    "averageRating": 3.7,
    "numReviews": 7,
    "dateCreated": "2024-03-15T10:30:00Z",
    "dateModified": "2024-06-25T16:20:00Z",
    "ownerId": "user123",
    "url": "jabon-de-menta-refrescante"
  },
  {
    "uniqueID": "prod003",
    "name": "Jabón de Chetos",
    "description": "Jabón líquido con aroma peculiar.",
    "price": 9.99,
    "stockQuantity": 200,
    "total_sales": 220,  // Total de unidades vendidas
    "categoryID": "cat002",
    "subcategoryID": "subcat002",
    "brandID": "brand002",
    "typeID": "type002",
    "images": [
      "https://mahetsipage.web.app/assets/images/products/img-4.jpeg",
      "https://mahetsipage.web.app/assets/images/products/img-3.jpeg"
    ],
    "averageRating": 2.7,
    "numReviews": 4,
    "dateCreated": "2024-03-15T10:30:00Z",
    "dateModified": "2024-06-25T16:20:00Z",
    "ownerId": "user123",
    "url": "jabon-de-chetos"
  },
    {
      "uniqueID": "prod004",
      "name": "4",
      "description": "Jabón artesanal con esencia de lavanda, ideal para relajar la mente.",
      "price": 82.99,
      "stockQuantity": 150,
      "total_sales": 120,  // Total de unidades vendidas
      "categoryID": "cat001",
      "subcategoryID": "subcat001",
      "brandID": "brand001",
      "typeID": "type001",
      "images": [
        "https://mahetsipage.web.app/assets/images/products/img-2.jpeg",
        "https://mahetsipage.web.app/assets/images/products/img-4.jpeg"
      ],
      "averageRating": 5,
      "numReviews": 34,
      "dateCreated": "2024-03-01T09:00:00Z",
      "dateModified": "2024-06-20T14:50:00Z",
      "ownerId": "user123",
      "url": "jabon-4"
    },
    {
      "uniqueID": "prod005",
      "name": "Jabón 5",
      "description": "Jabón artesanal con esencia de lavanda, ideal para relajar la mente.",
      "price": 12.99,
      "stockQuantity": 150,
      "total_sales": 120,  // Total de unidades vendidas
      "categoryID": "cat001",
      "subcategoryID": "subcat001",
      "brandID": "brand001",
      "typeID": "type001",
      "images": [
        "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
        "https://mahetsipage.web.app/assets/images/products/img-1.jpeg"
      ],
      "averageRating": 5,
      "numReviews": 34,
      "dateCreated": "2024-03-01T09:00:00Z",
      "dateModified": "2024-06-20T14:50:00Z",
      "ownerId": "user123",
      "url": "jabon-5"
    },
    {
      "uniqueID": "prod006",
      "name": "Jabón 6",
      "description": "Jabón artesanal con esencia de lavanda, ideal para relajar la mente.",
      "price": 12.99,
      "stockQuantity": 150,
      "total_sales": 120,  // Total de unidades vendidas
      "categoryID": "cat001",
      "subcategoryID": "subcat001",
      "brandID": "brand001",
      "typeID": "type001",
      "images": [
        "https://mahetsipage.web.app/assets/images/products/img-2.jpeg",
        "https://mahetsipage.web.app/assets/images/products/img-1.jpeg"
      ],
      "averageRating": 5,
      "numReviews": 34,
      "dateCreated": "2024-03-01T09:00:00Z",
      "dateModified": "2024-06-20T14:50:00Z",
      "ownerId": "user123",
      "url": "jabon-6"
    },
    {
      "uniqueID": "prod007",
      "name": "Jabón 7",
      "description": "Jabón artesanal con esencia de lavanda, ideal para relajar la mente.",
      "price": 12.99,
      "stockQuantity": 150,
      "total_sales": 120,  // Total de unidades vendidas
      "categoryID": "cat001",
      "subcategoryID": "subcat001",
      "brandID": "brand001",
      "typeID": "type001",
      "images": [
        "https://mahetsipage.web.app/assets/images/products/img-1.jpeg",
        "https://mahetsipage.web.app/assets/images/products/img-2.jpeg"
      ],
      "averageRating": 5,
      "numReviews": 34,
      "dateCreated": "2024-03-01T09:00:00Z",
      "dateModified": "2024-06-20T14:50:00Z",
      "ownerId": "user123",
      "url": "jabon-de-lavanda"
    },


]


export const reviews  = [
  {
    "review_id": "review001",
    "product_id": "prod001",
    "user_id": "user123",
    "rating": 5,
    "comment": "Excelente producto, me dejó la piel suave y con un aroma increíble.",
    "date_created": "2024-12-07T10:00:00Z"
  },
  {
    "review_id": "review002",
    "product_id": "prod003",
    "user_id": "user123",
    "rating": 2,
    "comment": "Excelente producto, me dejó la piel suave y con un aroma increíble.",
    "date_created": "2024-12-07T10:00:00Z"
  },
  {
    "review_id": "review003",
    "product_id": "prod003",
    "user_id": "user123",
    "rating": 4,
    "comment": "Excelente producto, me dejó la piel suave y con un aroma increíble.",
    "date_created": "2024-12-07T10:00:00Z"
  },
  
]

export const orders = [
  {
    uniqueID: "order001",
    ownerId: "user123",
    orderItems: [
      {
        productID: "prod001",
        quantity: 2,
        priceAtPurchase: 12.99,
        totalAmount: 25.98
      }
    ],
    paymentMethod: "Tarjeta de Crédito",
    shippingAddress: {
      street: "Calle Ficticia 123",
      city: "Ciudad Imaginaria",
      postalCode: "12345",
      country: "Pais Ficticio"
    },
    orderStatus: "pendiente",
    transactionID: "txn001",
    dateCreated: new Date("2024-12-07T10:00:00Z"),
    dateModified: new Date("2024-12-07T10:30:00Z"),
  },
  {
    uniqueID: "order002",
    ownerId: "user124",
    orderItems: [
      {
        productID: "prod002",
        quantity: 1,
        priceAtPurchase: 9.99,
        totalAmount: 9.99
      }
    ],
    paymentMethod: "PayPal",
    shippingAddress: {
      street: "Avenida Siempre Viva 742",
      city: "Springfield",
      postalCode: "67890",
      country: "Fictionland"
    },
    orderStatus: "enviado",
    transactionID: "txn002",
    dateCreated: new Date("2024-12-07T12:00:00Z"),
    dateModified: new Date("2024-12-07T12:20:00Z"),
  },
  {
    uniqueID: "order003",
    ownerId: "user125",
    orderItems: [
      {
        productID: "prod003",
        quantity: 3,
        priceAtPurchase: 9.99,
        totalAmount: 29.97
      }
    ],
    paymentMethod: "Tarjeta de Crédito",
    shippingAddress: {
      street: "Calle Luna 45",
      city: "Valle Solitario",
      postalCode: "54321",
      country: "OtroPais"
    },
    orderStatus: "entregado",
    transactionID: "txn003",
    dateCreated: new Date("2024-12-07T14:00:00Z"),
    dateModified: new Date("2024-12-07T14:30:00Z"),
  },
  {
    uniqueID: "order003",
    ownerId: "user125",
    orderItems: [
      {
        productID: "prod003",
        quantity: 20,
        priceAtPurchase: 9.99,
        totalAmount: 29.97
      }
    ],
    paymentMethod: "Tarjeta de Crédito",
    shippingAddress: {
      street: "Calle Luna 45",
      city: "Valle Solitario",
      postalCode: "54321",
      country: "OtroPais"
    },
    orderStatus: "entregado",
    transactionID: "txn003",
    dateCreated: new Date("2024-12-07T14:00:00Z"),
    dateModified: new Date("2024-12-07T14:30:00Z"),
  },
  {
    uniqueID: "order004",
    ownerId: "user126",
    orderItems: [
      {
        productID: "prod001",
        quantity: 5,
        priceAtPurchase: 12.99,
        totalAmount: 64.95
      }
    ],
    paymentMethod: "Transferencia Bancaria",
    shippingAddress: {
      street: "Calle Principal 100",
      city: "Centro Ciudad",
      postalCode: "10101",
      country: "Pais General"
    },
    orderStatus: "pendiente",
    transactionID: "txn004",
    dateCreated: new Date("2024-12-08T10:00:00Z"),
    dateModified: new Date("2024-12-08T10:10:00Z"),
  },
  {
    uniqueID: "order005",
    ownerId: "user127",
    orderItems: [
      {
        productID: "prod002",
        quantity: 2,
        priceAtPurchase: 9.99,
        totalAmount: 19.98
      }
    ],
    paymentMethod: "Tarjeta de Débito",
    shippingAddress: {
      street: "Calle Norte 200",
      city: "Ciudad Sol",
      postalCode: "23456",
      country: "Territorio Libre"
    },
    orderStatus: "enviado",
    transactionID: "txn005",
    dateCreated: new Date("2024-12-08T12:30:00Z"),
    dateModified: new Date("2024-12-08T13:00:00Z"),
  },
  {
    uniqueID: "order006",
    ownerId: "user128",
    orderItems: [
      {
        productID: "prod003",
        quantity: 1,
        priceAtPurchase: 9.99,
        totalAmount: 9.99
      }
    ],
    paymentMethod: "PayPal",
    shippingAddress: {
      street: "Calle Sur 300",
      city: "Villa Esperanza",
      postalCode: "98765",
      country: "Ciudad Fantasía"
    },
    orderStatus: "cancelado",
    transactionID: "txn006",
    dateCreated: new Date("2024-12-08T14:00:00Z"),
    dateModified: new Date("2024-12-08T14:20:00Z"),
  },
  {
    uniqueID: "order007",
    ownerId: "user129",
    orderItems: [
      {
        productID: "prod001",
        quantity: 3,
        priceAtPurchase: 12.99,
        totalAmount: 38.97
      }
    ],
    paymentMethod: "Tarjeta de Crédito",
    shippingAddress: {
      street: "Calle 2 de Octubre 101",
      city: "San Pedro",
      postalCode: "55555",
      country: "Pais No Existente"
    },
    orderStatus: "pendiente",
    transactionID: "txn007",
    dateCreated: new Date("2024-12-08T15:00:00Z"),
    dateModified: new Date("2024-12-08T15:30:00Z"),
  },
  {
    uniqueID: "order008",
    ownerId: "user130",
    orderItems: [
      {
        productID: "prod002",
        quantity: 4,
        priceAtPurchase: 9.99,
        totalAmount: 39.96
      }
    ],
    paymentMethod: "Transferencia Bancaria",
    shippingAddress: {
      street: "Calle Azul 50",
      city: "Mar de la Tranquilidad",
      postalCode: "34321",
      country: "Reino Unido"
    },
    orderStatus: "enviado",
    transactionID: "txn008",
    dateCreated: new Date("2024-12-09T10:00:00Z"),
    dateModified: new Date("2024-12-09T10:15:00Z"),
  },
  {
    uniqueID: "order009",
    ownerId: "user131",
    orderItems: [
      {
        productID: "prod003",
        quantity: 2,
        priceAtPurchase: 9.99,
        totalAmount: 19.98
      }
    ],
    paymentMethod: "PayPal",
    shippingAddress: {
      street: "Calle Vista Hermosa 400",
      city: "Ciudad de los Ángeles",
      postalCode: "65432",
      country: "Estados Unidos"
    },
    orderStatus: "entregado",
    transactionID: "txn009",
    dateCreated: new Date("2024-12-09T12:00:00Z"),
    dateModified: new Date("2024-12-09T12:20:00Z"),
  },
  {
    uniqueID: "order010",
    ownerId: "user132",
    orderItems: [
      {
        productID: "prod001",
        quantity: 1,
        priceAtPurchase: 12.99,
        totalAmount: 12.99
      },
      {
        productID: "prod002",
        quantity: 2,
        priceAtPurchase: 9.99,
        totalAmount: 19.98
      }
    ],
    paymentMethod: "Tarjeta de Débito",
    shippingAddress: {
      street: "Calle de la Paz 550",
      city: "Ciudad del Sol",
      postalCode: "12321",
      country: "Reino Esperanza"
    },
    orderStatus: "pendiente",
    transactionID: "txn010",
    dateCreated: new Date("2024-12-09T14:00:00Z"),
    dateModified: new Date("2024-12-09T14:30:00Z"),
  }
];
