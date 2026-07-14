const User = require('./User');
const Product = require('./Product');

const defaultProducts = [
  {
    id: 'mock-prod-1',
    name: 'Arduino Starter Kit',
    category: 'Arduino Kits',
    description: 'Designed for students to learn microcontrollers and sensors. Complete Arduino learning kit for beginners.',
    price: 5000,
    stock: 35,
    imageUrl: '/photos/products/arduino_board.jpg',
    difficultyLevel: 'Beginner',
    componentsList: JSON.stringify([
      'Arduino board',
      'Sensors',
      'Jumper wires',
      'Mini projects'
    ]),
    projectsList: JSON.stringify([
      'Beginner friendly',
      'Project-based learning',
      'Includes all required components'
    ])
  },
  {
    id: 'mock-prod-2',
    name: 'IoT Training Kit',
    category: 'IoT Kits',
    description: 'Designed for students to learn cloud telemetry and wireless sensor networks.',
    price: 7500,
    stock: 20,
    imageUrl: '/photos/products/electronics_equipment.jpg',
    difficultyLevel: 'Advanced',
    componentsList: JSON.stringify([
      'WiFi microcontroller board',
      'Cloud telemetry panel',
      'Sensors & Relays',
      'Smart home automation projects'
    ]),
    projectsList: JSON.stringify([
      'Cloud integrated',
      'Real-time data logging',
      'Full API dashboard support'
    ])
  },
  {
    id: 'mock-prod-3',
    name: 'Robotics Kit',
    category: 'Robotics Kits',
    description: 'Construct autonomous wheeled chassis and explore motorized mechanical navigation.',
    price: 9500,
    stock: 25,
    imageUrl: '/photos/products/robotics_kit.jpg',
    difficultyLevel: 'Intermediate',
    componentsList: JSON.stringify([
      'Prototyping chassis',
      'DC gear motors',
      'Ultrasonic distance sensor',
      'Obstacle scanning projects'
    ]),
    projectsList: JSON.stringify([
      'Kinematic movement tracking',
      'Includes motor shields',
      'Complete assembly guides'
    ])
  },
  {
    id: 'mock-prod-4',
    name: 'Embedded System Kit',
    category: 'Embedded Systems Kits',
    description: 'Master register-level programming and real-time operations using standard microcontrollers.',
    price: 8500,
    stock: 15,
    imageUrl: '/photos/products/electronics_equipment.jpg',
    difficultyLevel: 'Advanced',
    componentsList: JSON.stringify([
      'ARM Cortex developer board',
      'LCD alpha matrix display',
      'Inertial gyro modules',
      'Bare-metal programming manuals'
    ]),
    projectsList: JSON.stringify([
      'Bare-metal C training',
      'Interrupt handlers experiments',
      'Industry-ready certification alignment'
    ])
  },
  {
    id: 'mock-prod-5',
    name: 'AI Learning Kit',
    category: 'IoT Kits',
    description: 'Learn machine learning and edge computing classification directly on visual cameras.',
    price: 12000,
    stock: 12,
    imageUrl: '/photos/products/arduino_board.jpg',
    difficultyLevel: 'Advanced',
    componentsList: JSON.stringify([
      'AI visual processor board',
      'High-resolution camera module',
      'Pre-trained neural networks',
      'Python object tracking scripts'
    ]),
    projectsList: JSON.stringify([
      'Edge computing ready',
      'Machine learning basics',
      'Python code libraries'
    ])
  },
  {
    id: 'mock-prod-6',
    name: 'Electronics Lab Kit',
    category: 'Arduino Kits',
    description: 'Learn the essentials of analog circuitry, discrete parts, and schematic measurements.',
    price: 4500,
    stock: 18,
    imageUrl: '/photos/products/electronics_equipment.jpg',
    difficultyLevel: 'Beginner',
    componentsList: JSON.stringify([
      'Digital multi-meter probe',
      'Prototyping breadboard',
      'Resistors & Capacitors set',
      'Transistor logic guides'
    ]),
    projectsList: JSON.stringify([
      'Circuit theory mapped',
      'Troubleshooting schematics',
      'Solderless wire layout'
    ])
  },
  {
    id: 'mock-prod-7',
    name: 'Zero to Hero Electronics Combo',
    category: 'Combo Packs',
    description: 'Perfect starting bundle combining basic analog components and microcontrollers. Learn circuit layout and firmware coding step-by-step.',
    price: 8000,
    stock: 20,
    imageUrl: '/photos/products/electronics_equipment.jpg',
    difficultyLevel: 'Beginner',
    componentsList: JSON.stringify([
      'Arduino Starter Kit',
      'Electronics Lab Kit',
      'Combined experiment manual',
      'Additional capacitors/resistors pack'
    ]),
    projectsList: JSON.stringify([
      'Transition from analog circuits to firmware',
      'Build 15+ labs mapped to basic electronics',
      'Cost-efficient beginner package'
    ])
  },
  {
    id: 'mock-prod-8',
    name: 'Smart Home & IoT Combo',
    category: 'Combo Packs',
    description: 'Learn logic automation and connect it to the cloud. Build relays, triggers, and stream data to telemetry charts.',
    price: 11000,
    stock: 15,
    imageUrl: '/photos/products/iot_kit.jpg',
    difficultyLevel: 'Intermediate',
    componentsList: JSON.stringify([
      'Arduino Starter Kit',
      'IoT Training Kit',
      'Cloud credentials certificate',
      'Combined experiment manual'
    ]),
    projectsList: JSON.stringify([
      'Bridge hardware outputs and wireless telemetry',
      'Build smart lights and environmental sensors',
      'Design fully custom API dashboards'
    ])
  },
  {
    id: 'mock-prod-9',
    name: 'Autonomous AI-Robotics Combo',
    category: 'Combo Packs',
    description: 'Combine high-speed motorized navigation with edge machine learning. Build visual line tracking and self-steering camera vehicles.',
    price: 18500,
    stock: 10,
    imageUrl: '/photos/products/robotics_kit.jpg',
    difficultyLevel: 'Advanced',
    componentsList: JSON.stringify([
      'Robotics Prototyping Chassis Kit',
      'AI Edge Computing & Camera Kit',
      'Python object-tracking pre-loaded scripts',
      'Heavy-duty rechargeable lithium battery'
    ]),
    projectsList: JSON.stringify([
      'Interfacing camera sensors with gear motors',
      'Pre-load object tracking and classification models',
      'Build next-generation autonomous model cars'
    ])
  },
  {
    id: 'mock-prod-10',
    name: 'Ultimate Academic Lab Setup',
    category: 'Combo Packs',
    description: 'Get all 6 signature training packages to build a complete modern hardware prototype lab for university departments.',
    price: 42000,
    stock: 5,
    imageUrl: '/photos/products/electronics_equipment.jpg',
    difficultyLevel: 'Advanced',
    componentsList: JSON.stringify([
      'All 6 signature hardware learning kits',
      'Complete lab manuals for professors',
      '6 months direct instructor priority support',
      'Student group license access'
    ]),
    projectsList: JSON.stringify([
      'Syllabus mapping across multiple departments',
      'Covers analog, digital, embedded, IoT, AI, and robots',
      'Complete ready-to-run package with guides'
    ])
  }
];

const defaultUsers = [
  {
    id: 'mock-user-admin-id-xyz',
    name: 'EduCircuit Admin',
    email: 'admin@educircuit.com',
    password: 'admin123',
    role: 'admin',
    institutionName: 'EduCircuit Head Office'
  },
  {
    id: 'mock-user-student-id-xyz',
    name: 'Jane Student',
    email: 'student@educircuit.com',
    password: 'student123',
    role: 'student',
    institutionName: 'State Tech University'
  },
  {
    id: 'mock-user-college-id-xyz',
    name: 'Dr. Robert Carter',
    email: 'college@educircuit.com',
    password: 'college123',
    role: 'faculty',
    institutionName: 'MIT School of Engineering'
  }
];

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding default users...');
      await User.insertMany(defaultUsers);
      console.log('✅ Default users seeded successfully!');
    } else {
      console.log('👤 Users collection already contains records. Skipping seed.');
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding default products...');
      await Product.insertMany(defaultProducts);
      console.log('✅ Default products seeded successfully!');
    } else {
      console.log('📦 Products collection already contains records. Skipping seed.');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = seedDatabase;
