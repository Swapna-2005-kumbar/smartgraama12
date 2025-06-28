// MongoDB initialization script
db = db.getSiblingDB('smartgraama');

// Create collections
db.createCollection('users');
db.createCollection('residents');
db.createCollection('schemes');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.residents.createIndex({ "aadhaar": 1 }, { unique: true });
db.schemes.createIndex({ "name": 1 });

// Insert sample admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@smartgraama.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2e", // password: admin123
  role: "admin",
  panchayat: "Sample Panchayat",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert sample officer user
db.users.insertOne({
  name: "Panchayat Officer",
  email: "officer@smartgraama.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2e", // password: officer123
  role: "officer",
  panchayat: "Sample Panchayat",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert sample schemes
db.schemes.insertMany([
  {
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    description: "Housing for All scheme providing affordable housing to urban and rural poor",
    category: "Housing",
    budget: 5000000,
    utilized: 2500000,
    beneficiaries: 25,
    targetBeneficiaries: 50,
    status: "Active",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2025-12-31"),
    eligibilityCriteria: {
      maxIncome: 300000,
      ageMin: 18,
      ageMax: 65,
      categories: ["General", "SC", "ST", "OBC"],
      mustNotHaveHouse: true,
      maxLandSize: 2.5
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Old Age Pension Scheme",
    description: "Financial assistance for senior citizens above 60 years",
    category: "Social Welfare",
    budget: 2000000,
    utilized: 800000,
    beneficiaries: 40,
    targetBeneficiaries: 100,
    status: "Active",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2024-12-31"),
    eligibilityCriteria: {
      maxIncome: 200000,
      ageMin: 60,
      ageMax: 120,
      categories: ["General", "SC", "ST", "OBC"],
      mustNotHaveHouse: false,
      maxLandSize: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Scholarship for SC/ST Students",
    description: "Educational scholarship for students from SC/ST communities",
    category: "Education",
    budget: 1500000,
    utilized: 600000,
    beneficiaries: 30,
    targetBeneficiaries: 75,
    status: "Active",
    startDate: new Date("2023-06-01"),
    endDate: new Date("2024-05-31"),
    eligibilityCriteria: {
      maxIncome: 450000,
      ageMin: 5,
      ageMax: 25,
      categories: ["SC", "ST"],
      mustNotHaveHouse: false,
      maxLandSize: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample residents
db.residents.insertMany([
  {
    name: "Ramesh Kumar",
    aadhaar: "123456789012",
    age: 45,
    gender: "Male",
    phone: "9876543210",
    email: "ramesh@email.com",
    address: "Village: Sample Village, District: Sample District, State: Karnataka",
    category: "General",
    income: 250000,
    education: "12th Standard",
    hasHouse: false,
    landSize: 1.5,
    schemes: [],
    status: "Active",
    joinDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Lakshmi Devi",
    aadhaar: "234567890123",
    age: 65,
    gender: "Female",
    phone: "8765432109",
    email: "lakshmi@email.com",
    address: "Village: Sample Village, District: Sample District, State: Karnataka",
    category: "SC",
    income: 180000,
    education: "8th Standard",
    hasHouse: true,
    landSize: 0.5,
    schemes: ["Old Age Pension Scheme"],
    status: "Active",
    joinDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Arjun Singh",
    aadhaar: "345678901234",
    age: 22,
    gender: "Male",
    phone: "7654321098",
    email: "arjun@email.com",
    address: "Village: Sample Village, District: Sample District, State: Karnataka",
    category: "ST",
    income: 300000,
    education: "Graduation",
    hasHouse: false,
    landSize: 2.0,
    schemes: ["Scholarship for SC/ST Students"],
    status: "Active",
    joinDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Priya Sharma",
    aadhaar: "456789012345",
    age: 35,
    gender: "Female",
    phone: "6543210987",
    email: "priya@email.com",
    address: "Village: Sample Village, District: Sample District, State: Karnataka",
    category: "OBC",
    income: 400000,
    education: "Post Graduation",
    hasHouse: true,
    landSize: 3.0,
    schemes: [],
    status: "Active",
    joinDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Database initialized successfully!"); 