// Client-side Mock Database and Axios emulator for Task 1 (Frontend-Only Submission)

// Seed default products/kits catalog
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
      'Integrated home-automation relay shield'
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

// Seed default users
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
    role: 'college_rep',
    institutionName: 'MIT School of Engineering'
  }
];

// Initialize localStorage values if they do not exist
const initLocalStorage = () => {
  if (!localStorage.getItem('mock_products')) {
    localStorage.setItem('mock_products', JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem('mock_users')) {
    localStorage.setItem('mock_users', JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem('mock_orders')) {
    localStorage.setItem('mock_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('mock_inquiries')) {
    localStorage.setItem('mock_inquiries', JSON.stringify([]));
  }
  if (!localStorage.getItem('mock_contacts')) {
    localStorage.setItem('mock_contacts', JSON.stringify([]));
  }
};

initLocalStorage();

// Database helper functions
const db = {
  getProducts: () => JSON.parse(localStorage.getItem('mock_products')),
  saveProducts: (products) => localStorage.setItem('mock_products', JSON.stringify(products)),
  
  getUsers: () => JSON.parse(localStorage.getItem('mock_users')),
  saveUsers: (users) => localStorage.setItem('mock_users', JSON.stringify(users)),
  
  getOrders: () => JSON.parse(localStorage.getItem('mock_orders')),
  saveOrders: (orders) => localStorage.setItem('mock_orders', JSON.stringify(orders)),
  
  getInquiries: () => JSON.parse(localStorage.getItem('mock_inquiries')),
  saveInquiries: (inquiries) => localStorage.setItem('mock_inquiries', JSON.stringify(inquiries)),
  
  getContacts: () => JSON.parse(localStorage.getItem('mock_contacts')),
  saveContacts: (contacts) => localStorage.setItem('mock_contacts', JSON.stringify(contacts)),

  getCurrentUser: () => {
    const token = localStorage.getItem('techforge_token');
    if (!token) return null;
    const users = db.getUsers();
    return users.find(u => u.email === token) || null;
  }
};

// Helper to simulate request latency (e.g. 200ms)
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Axios API emulator
const mockApi = {
  // GET requests
  get: async (url, config) => {
    await delay();
    
    // 1. Fetch current profile
    if (url === '/api/auth/profile') {
      const currentUser = db.getCurrentUser();
      if (!currentUser) {
        throw { response: { status: 401, data: { message: 'Unauthorized' } } };
      }
      return { data: currentUser };
    }
    
    // 2. Fetch products list
    if (url === '/api/products' || url === '/api/products/') {
      return { data: db.getProducts() };
    }

    // 3. Fetch single product details
    if (url.startsWith('/api/products/')) {
      const id = url.split('/').pop();
      const products = db.getProducts();
      const product = products.find(p => p.id === id || p._id === id);
      if (!product) {
        throw { response: { status: 404, data: { message: 'Product not found' } } };
      }
      return { data: product };
    }

    // 4. Fetch orders list
    if (url === '/api/orders' || url === '/api/orders/') {
      const currentUser = db.getCurrentUser();
      if (!currentUser) {
        throw { response: { status: 401, data: { message: 'Unauthorized' } } };
      }
      const orders = db.getOrders();
      if (currentUser.role === 'admin') {
        return { data: orders };
      }
      return { data: orders.filter(o => o.userId === currentUser.id || o.userId === currentUser._id) };
    }

    // 5. Fetch inquiries
    if (url === '/api/inquiries' || url === '/api/inquiries/') {
      return { data: db.getInquiries() };
    }

    // 6. Fetch users list
    if (url === '/api/users' || url === '/api/users/') {
      return { data: db.getUsers() };
    }

    // 7. Fetch contact messages
    if (url === '/api/contact' || url === '/api/contact/') {
      return { data: db.getContacts() };
    }

    throw { response: { status: 404, data: { message: 'Not Found' } } };
  },

  // POST requests
  post: async (url, data, config) => {
    await delay();

    // 1. Auth Login
    if (url === '/api/auth/login') {
      const { email, password } = data;
      const users = db.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw { response: { status: 400, data: { message: 'Invalid credentials.' } } };
      }
      // Use email as token for simplicity
      return { data: { token: email, user } };
    }

    // 2. Auth Register
    if (url === '/api/auth/register') {
      const { name, email, password, role, institutionName } = data;
      const users = db.getUsers();
      if (users.find(u => u.email === email)) {
        throw { response: { status: 400, data: { message: 'Email already registered.' } } };
      }
      const newUser = {
        id: 'user-' + Date.now(),
        _id: 'user-' + Date.now(),
        name,
        email,
        password,
        role: role || 'student',
        institutionName: institutionName || ''
      };
      users.push(newUser);
      db.saveUsers(users);
      return { data: { token: email, user: newUser } };
    }

    // 3. Create Order
    if (url === '/api/orders' || url === '/api/orders/') {
      const currentUser = db.getCurrentUser();
      const orders = db.getOrders();
      const newOrder = {
        id: 'order-' + Date.now(),
        _id: 'order-' + Date.now(),
        userId: currentUser ? (currentUser.id || currentUser._id) : 'guest',
        userName: currentUser ? currentUser.name : data.shippingDetails?.fullName || 'Guest',
        items: data.items || [],
        totalAmount: data.totalAmount || 0,
        shippingDetails: data.shippingDetails || {},
        paymentDetails: data.paymentDetails || {},
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      orders.push(newOrder);
      db.saveOrders(orders);
      return { data: newOrder };
    }

    // 4. Create Inquiry
    if (url === '/api/inquiries' || url === '/api/inquiries/') {
      const inquiries = db.getInquiries();
      const newInquiry = {
        id: 'inquiry-' + Date.now(),
        _id: 'inquiry-' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        institutionName: data.institutionName,
        kitRequired: data.kitName,
        kitName: data.kitName,
        quantity: parseInt(data.quantity) || 10,
        message: data.message || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      inquiries.push(newInquiry);
      db.saveInquiries(inquiries);
      return { data: newInquiry };
    }

    // 5. Create Contact Message
    if (url === '/api/contact' || url === '/api/contact/') {
      const contacts = db.getContacts();
      const newContact = {
        id: 'contact-' + Date.now(),
        _id: 'contact-' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        createdAt: new Date().toISOString()
      };
      contacts.push(newContact);
      db.saveContacts(contacts);
      return { data: newContact };
    }

    // 6. Create Product (Optional Admin action)
    if (url === '/api/products' || url === '/api/products/') {
      const products = db.getProducts();
      const newProduct = {
        id: 'prod-' + Date.now(),
        _id: 'prod-' + Date.now(),
        name: data.name,
        category: data.category,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        imageUrl: data.imageUrl || '/photos/products/arduino_board.jpg',
        difficultyLevel: data.difficultyLevel || 'Beginner',
        componentsList: data.componentsList || '[]',
        projectsList: data.projectsList || '[]'
      };
      products.push(newProduct);
      db.saveProducts(products);
      return { data: newProduct };
    }

    throw { response: { status: 404, data: { message: 'Not Found' } } };
  },

  // PUT requests
  put: async (url, data, config) => {
    await delay();

    // 1. Update Order Status
    if (url.startsWith('/api/orders/')) {
      const id = url.split('/').pop();
      const orders = db.getOrders();
      const orderIndex = orders.findIndex(o => o.id === id || o._id === id);
      if (orderIndex === -1) {
        throw { response: { status: 404, data: { message: 'Order not found' } } };
      }
      orders[orderIndex] = { ...orders[orderIndex], ...data };
      db.saveOrders(orders);
      return { data: orders[orderIndex] };
    }

    // 2. Update Inquiry Status
    if (url.startsWith('/api/inquiries/')) {
      const parts = url.split('/');
      const id = parts[parts.length - 2];
      const inquiries = db.getInquiries();
      const inquiryIndex = inquiries.findIndex(i => i.id === id || i._id === id);
      if (inquiryIndex === -1) {
        throw { response: { status: 404, data: { message: 'Inquiry not found' } } };
      }
      inquiries[inquiryIndex] = { ...inquiries[inquiryIndex], ...data };
      db.saveInquiries(inquiries);
      return { data: inquiries[inquiryIndex] };
    }

    // 3. Update User Role
    if (url.startsWith('/api/users/') && url.endsWith('/role')) {
      const parts = url.split('/');
      const id = parts[parts.length - 2];
      const users = db.getUsers();
      const userIndex = users.findIndex(u => u.id === id || u._id === id);
      if (userIndex === -1) {
        throw { response: { status: 404, data: { message: 'User not found' } } };
      }
      users[userIndex] = { ...users[userIndex], role: data.role };
      db.saveUsers(users);
      return { data: users[userIndex] };
    }

    throw { response: { status: 404, data: { message: 'Not Found' } } };
  },

  // DELETE requests
  delete: async (url, config) => {
    await delay();

    // 1. Delete Product
    if (url.startsWith('/api/products/')) {
      const id = url.split('/').pop();
      const products = db.getProducts();
      const filtered = products.filter(p => p.id !== id && p._id !== id);
      db.saveProducts(filtered);
      return { data: { success: true, message: 'Product deleted' } };
    }

    throw { response: { status: 404, data: { message: 'Not Found' } } };
  },

  // Axios interceptor mock object
  interceptors: {
    request: {
      use: () => {}
    },
    response: {
      use: () => {}
    }
  }
};

export default mockApi;
