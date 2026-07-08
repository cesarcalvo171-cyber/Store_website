{/* 
  */}export const products = [
  {
    id: '1',
    name: 'Abrigo Trench Clásico de Doble Botonadura',
    price: 129.99,
    originalPrice: 159.99,
    category: 'Abrigos',
    description: 'Un abrigo trench atemporal confeccionado con una mezcla de algodón resistente al agua. Diseñado con una silueta de doble botonadura, cinturón ajustable y solapas pronunciadas. Perfecto para capas de entretiempo sobre cualquier look minimalista.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige Arena', hex: '#D2C3B2' },
      { name: 'Negro Carbón', hex: '#1E1E1E' }
    ],
    image: '/images/trench_coat.png',
    images: ['/images/trench_coat.png'],
    rating: 4.8,
    reviewsCount: 142,
    details: [
      'Material: 65% Algodón, 35% Poliéster',
      'Forro interior completo de viscosa',
      'Cinturón desmontable con hebilla forrada',
      'Bolsillos laterales con solapa y botón'
    ]
  },
  {
    id: '2',
    name: 'Suéter de Punto Fino y Cuello Alto',
    price: 49.99,
    category: 'Tops',
    description: 'Suéter suave de punto fino acanalado en el cuello, puños y dobladillo. Confeccionado en una mezcla de lana merino y viscosa que se siente increíblemente suave sobre la piel. Su silueta relajada pero estructurada complementa pantalones de vestir y faldas por igual.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Crema', hex: '#F0ECE3' },
      { name: 'Gris Melange', hex: '#A8A7A5' },
      { name: 'Negro', hex: '#111111' }
    ],
    image: '/images/knit_sweater.png',
    images: ['/images/knit_sweater.png'],
    rating: 4.6,
    reviewsCount: 88,
    details: [
      'Material: 50% Lana Merino, 30% Viscosa, 20% Nailon',
      'Cuello alto acanalado de doble capa',
      'Ajuste relajado contemporáneo',
      'Lavado a mano recomendado'
    ]
  },
  {
    id: '3',
    name: 'Vestido Midi de Lino con Botones',
    price: 79.99,
    originalPrice: 89.99,
    category: 'Vestidos',
    description: 'Vestido midi fluido de lino 100% lavado. Cuenta con tirantes anchos, escote cuadrado sutil y una hilera de botones de madera de coco en la parte delantera. Una pieza fresca y transpirable ideal para días cálidos e informales.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Blanco Crudo', hex: '#FAF5EF' },
      { name: 'Verde Salvia', hex: '#8F9779' }
    ],
    image: '/images/linen_dress.png',
    images: ['/images/linen_dress.png'],
    rating: 4.9,
    reviewsCount: 215,
    details: [
      'Material: 100% Lino Orgánico',
      'Largo midi con caída suave',
      'Botones de coco naturales funcionales',
      'Bolsillos laterales ocultos'
    ]
  },
  {
    id: '4',
    name: 'Pantalón Sastrero de Pinzas Alto',
    price: 69.99,
    category: 'Pantalones',
    description: 'Pantalón sastrero de tiro alto con pinzas pronunciadas en la parte delantera. Confeccionado con un tejido de sarga fluida de peso medio que ofrece una caída impecable. Silueta de pierna ancha que estiliza y alarga la figura.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro Sólido', hex: '#111111' },
      { name: 'Marrón Café', hex: '#584D42' },
      { name: 'Blanco Off-White', hex: '#EAE5DF' }
    ],
    image: '/images/pleated_trousers.png',
    images: ['/images/pleated_trousers.png'],
    rating: 4.7,
    reviewsCount: 178,
    details: [
      'Material: 80% Poliéster reciclado, 16% Viscosa, 4% Elastano',
      'Tiro alto con pretina estructurada',
      'Cierre con cremallera y corchete oculto',
      'Trabillas para cinturón'
    ]
  },
  {
    id: '5',
    name: 'Bolso de Hombro en Cuero Minimalista',
    price: 85.00,
    originalPrice: 110.00,
    category: 'Accesorios',
    description: 'Bolso bandolera de silueta estructurada confeccionado en cuero vacuno suave con acabado semi-mate. Cierre magnético invisible, correa ajustable para el hombro y costuras tonales limpias. Espacio ideal para tus esenciales diarios con un toque de lujo sutil.',
    sizes: ['Única'],
    colors: [
      { name: 'Marrón Tan', hex: '#C08A58' },
      { name: 'Negro Clásico', hex: '#1A1A1A' }
    ],
    image: '/images/leather_handbag.png',
    images: ['/images/leather_handbag.png'],
    rating: 4.8,
    reviewsCount: 94,
    details: [
      'Material: 100% Cuero Vacuno genuino',
      'Forro interno de microfibra tacto gamuza',
      'Compartimento interno con cremallera',
      'Herrajes en acabado latón cepillado'
    ]
  },
  {
    id: '6',
    name: 'Botas Chelsea de Cuero Liso',
    price: 115.00,
    category: 'Calzado',
    description: 'Botas Chelsea clásicas con paneles elásticos laterales y tirador trasero para calzar con facilidad. Construidas con cuero vacuno liso premium sobre una suela de goma duradera y ligera. Ideales para completar un estilo urbano y sofisticado.',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'Negro Liso', hex: '#151515' },
      { name: 'Marrón Oscuro', hex: '#402E2A' }
    ],
    image: '/images/chelsea_boots.png',
    images: ['/images/chelsea_boots.png'],
    rating: 4.5,
    reviewsCount: 63,
    details: [
      'Exterior: 100% Cuero Vacuno',
      'Paneles elásticos reforzados en los costados',
      'Plantilla acolchada de cuero transpirable',
      'Altura del tacón: 3 cm'
    ]
  }
];

export const MENU_STRUCTURE = {
  'Hombre': [
    'Camisetas', 'Camisas', 'Polos', 'Pantalones', 'Jeans', 
    'Shorts', 'Chaquetas', 'Suéteres', 'Ropa deportiva', 
    'Ropa interior', 'Ofertas'
  ],
  'Mujer': [
    'Blusas', 'Camisetas', 'Vestidos', 'Faldas', 'Pantalones', 
    'Jeans', 'Shorts', 'Chaquetas', 'Suéteres', 'Ropa deportiva', 
    'Lencería', 'Ofertas'
  ],
  'Niños': [
    'Niño', 'Niña', 'Bebés', 'Uniformes', 'Ropa deportiva', 'Ofertas'
  ],
  'Marcas': [],
  'Novedades': [],
  'Ofertas': []
};

// Flattened categories for simple dropdowns if needed, or keeping the variable exported so App doesn't crash before being updated.
export const categories = ['Todos', ...Object.keys(MENU_STRUCTURE)];
