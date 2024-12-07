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
    uniqueID: "prod001",
    name: "Jabón de Lavanda",
    description: "Jabón artesanal con esencia de lavanda, ideal para relajar la mente.",
    price: 12.99,
    stockQuantity: 150,
    categoryID: "cat001",
    subcategoryID: "subcat001",
    brandID: "brand001",
    typeID: "type001",
    images: [
      "https://mahetsipage.web.app/assets/images/products/img-5.jpeg",
      "https://mahetsipage.web.app/assets/images/products/img-1.jpeg",
    ],
    averageRating: 4.5,
    numReviews: 34,
    dateCreated: new Date("2024-03-01T09:00:00Z"),
    dateModified: new Date("2024-06-20T14:50:00Z"),
    ownerId: "user123",
    url: "jabon-de-lavanda",
  },
  {
    uniqueID: "prod002",
    name: "Jabón de Menta Refrescante",
    description: "Jabón líquido con extracto de menta, perfecto para una limpieza revitalizante.",
    price: 9.99,
    stockQuantity: 200,
    categoryID: "cat001",
    subcategoryID: "subcat002",
    brandID: "brand002",
    typeID: "type002",
    images: [
      "https://mahetsipage.web.app/assets/images/products/img-2.jpeg",
      "https://mahetsipage.web.app/assets/images/products/img-3.jpeg",
    ],
    averageRating: 4.7,
    numReviews: 45,
    dateCreated: new Date("2024-03-15T10:30:00Z"),
    dateModified: new Date("2024-06-25T16:20:00Z"),
    ownerId: "user123",
    url: "jabon-de-menta-refrescante",
  },
  {
    uniqueID: "prod003",
    name: "Jabón de Chetos",
    description: "Jabón líquido con aroma peculiar.",
    price: 9.99,
    stockQuantity: 200,
    categoryID: "cat002",
    subcategoryID: "subcat002",
    brandID: "brand002",
    typeID: "type002",
    images: [
      "https://mahetsipage.web.app/assets/images/products/img-4.jpeg",
      "https://mahetsipage.web.app/assets/images/products/img-3.jpeg",
    ],
    averageRating: 4.7,
    numReviews: 45,
    dateCreated: new Date("2024-03-15T10:30:00Z"),
    dateModified: new Date("2024-06-25T16:20:00Z"),
    ownerId: "user123",
    url: "jabon-de-chetos",
  },
];
