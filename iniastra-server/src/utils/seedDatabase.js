import mongoose from 'mongoose';
import dotenv from 'dotenv';
import University from '../models/University.js';
import User from '../models/User.js';

dotenv.config();

const universities = [
  {
    name: "Harvard University",
    country: "USA",
    city: "Cambridge",
    description: "One of the world's leading academic institutions, known for excellence in teaching, research, and learning.",
    degreeLevel: "Masters",
    programs: ["Computer Science", "Business Administration", "Law", "Medicine", "Engineering"],
    minGPA: 3.7,
    minIELTS: 7.5,
    tuitionFee: 52000,
    scholarshipsAvailable: true,
    applicationDeadline: new Date('2026-07-15'),
    intakeSeasons: ["Fall"],
    ranking: 1,
    website: "https://www.harvard.edu",
    contactEmail: "admissions@harvard.edu",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Harvard_shield_wreath.svg/1200px-Harvard_shield_wreath.svg.png",
    campusPhotos: [
      "https://example.com/harvard1.jpg",
      "https://example.com/harvard2.jpg"
    ]
  },
  {
    name: "University of Toronto",
    country: "Canada",
    city: "Toronto",
    description: "Canada's leading institution of learning, discovery, and knowledge creation.",
    degreeLevel: "Masters",
    programs: ["Computer Science", "Business", "Engineering", "Life Sciences", "Social Sciences"],
    minGPA: 3.3,
    minIELTS: 7.0,
    tuitionFee: 45000,
    scholarshipsAvailable: true,
    applicationDeadline: new Date('2026-05-30'),
    intakeSeasons: ["Fall", "Winter"],
    ranking: 18,
    website: "https://www.utoronto.ca",
    contactEmail: "ask@utoronto.ca",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/University_of_Toronto_CoA.svg/1200px-University_of_Toronto_CoA.svg.png"
  },
  {
    name: "University of Oxford",
    country: "UK",
    city: "Oxford",
    description: "The oldest university in the English-speaking world, renowned for academic excellence.",
    degreeLevel: "Masters",
    programs: ["Computer Science", "Mathematics", "Physics", "Economics", "Law"],
    minGPA: 3.6,
    minIELTS: 7.5,
    tuitionFee: 32000,
    scholarshipsAvailable: true,
    applicationDeadline: new Date('2026-08-15'),
    intakeSeasons: ["Fall"],
    ranking: 2,
    website: "https://www.ox.ac.uk",
    contactEmail: "undergraduate.admissions@ox.ac.uk",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/ff/Oxford-University-Circlet.svg/1200px-Oxford-University-Circlet.svg.png"
  },
  {
    name: "ETH Zurich",
    country: "Switzerland",
    city: "Zurich",
    description: "One of the world's leading universities in science and technology.",
    degreeLevel: "Masters",
    programs: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Physics", "Mathematics"],
    minGPA: 3.5,
    minIELTS: 7.0,
    tuitionFee: 1500,
    scholarshipsAvailable: true,
    applicationDeadline: new Date('2026-07-31'),
    intakeSeasons: ["Fall"],
    ranking: 6,
    website: "https://www.ethz.ch",
    contactEmail: "master@ethz.ch",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/ETH_Z%C3%BCrich_Logo_black.svg/1200px-ETH_Z%C3%BCrich_Logo_black.svg.png"
  },
  {
    name: "National University of Singapore",
    country: "Singapore",
    city: "Singapore",
    description: "Asia's leading global university with transformative education and high-impact research.",
    degreeLevel: "Masters",
    programs: ["Computer Science", "Business Analytics", "Engineering", "Law", "Medicine"],
    minGPA: 3.4,
    minIELTS: 6.5,
    tuitionFee: 38000,
    scholarshipsAvailable: true,
    applicationDeadline: new Date('2026-08-15'),
    intakeSeasons: ["Fall", "Spring"],
    ranking: 11,
    website: "https://www.nus.edu.sg",
    contactEmail: "enquiry@nus.edu.sg",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/1200px-NUS_coat_of_arms.svg.png"
  },
  {
    name: "University of Melbourne",
    country: "Australia",
    city: "Melbourne",
    description: "Consistently ranked as Australia's leading comprehensive research-intensive university.",
    degreeLevel: "Masters",
    programs: ["Computer Science", "Business", "Engineering", "Arts", "Science"],
    minGPA: 3.2,
    minIELTS: 6.5,
    tuitionFee: 42000,
    scholarshipsAvailable: true,
    applicationDeadline: new Date('2026-06-31'),
    intakeSeasons: ["Fall", "Spring"],
    ranking: 33,
    website: "https://www.unimelb.edu.au",
    contactEmail: "admissions-info@unimelb.edu.au",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/University_of_Melbourne_coat_of_arms.svg/1200px-University_of_Melbourne_coat_of_arms.svg.png"
  },
  {
    name: "Stanford University",
    country: "USA",
    city: "Stanford",
    description: "One of the world's leading research and teaching institutions, located in California's Bay Area.",
    degreeLevel: "Masters",
    programs: ["Computer Science", "Business", "Engineering", "Law", "Medicine"],
    minGPA: 3.8,
    minIELTS: 7.0,
    tuitionFee: 56000,
    scholarshipsAvailable: true,
    applicationDeadline: new Date('2026-07-05'),
    intakeSeasons: ["Fall"],
    ranking: 3,
    website: "https://www.stanford.edu",
    contactEmail: "admission@stanford.edu",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Stanford_University_seal_2003.svg/1200px-Stanford_University_seal_2003.svg.png"
  },
  {
    name: "University of Tokyo",
    country: "Japan",
    city: "Tokyo",
    description: "Japan's highest ranked university, known for research excellence across multiple disciplines.",
    degreeLevel: "Masters",
    programs: ["Engineering", "Science", "Agriculture", "Medicine", "Economics"],
    minGPA: 3.3,
    minIELTS: 6.5,
    tuitionFee: 5500,
    scholarshipsAvailable: true,
    applicationDeadline: new Date('2026-07-20'),
    intakeSeasons: ["Fall", "Spring"],
    ranking: 23,
    website: "https://www.u-tokyo.ac.jp",
    contactEmail: "koho.adm@gs.mail.u-tokyo.ac.jp",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/University_of_Tokyo_logo.png/800px-University_of_Tokyo_logo.png"
  },
  {
    name: "University of British Columbia",
    country: "Canada",
    city: "Vancouver",
    description: "A global centre for research and teaching, consistently ranked among the top 20 public universities.",
    degreeLevel: "Masters",
    programs: ["Computer Science", "Business", "Forestry", "Arts", "Science"],
    minGPA: 3.2,
    minIELTS: 6.5,
    tuitionFee: 42000,
    scholarshipsAvailable: true,
    applicationDeadline: new Date('2026-08-15'),
    intakeSeasons: ["Fall"],
    ranking: 34,
    website: "https://www.ubc.ca",
    contactEmail: "international.reception@ubc.ca",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/58/University_of_British_Columbia_logo.svg/1200px-University_of_British_Columbia_logo.svg.png"
  },
  {
    name: "Imperial College London",
    country: "UK",
    city: "London",
    description: "A world top ten university with an international reputation for excellence in science and engineering.",
    degreeLevel: "Masters",
    programs: ["Engineering", "Medicine", "Business", "Natural Sciences", "Computing"],
    minGPA: 3.5,
    minIELTS: 7.0,
    tuitionFee: 35000,
    scholarshipsAvailable: true,
    applicationDeadline: new Date('2026-05-15'),
    intakeSeasons: ["Fall"],
    ranking: 7,
    website: "https://www.imperial.ac.uk",
    contactEmail: "admissions@imperial.ac.uk",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Imperial_College_London_logo.svg/1200px-Imperial_College_London_logo.svg.png"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Seed universities
    const createdUniversities = await University.insertMany(universities);
    console.log(`✅ Seeded ${createdUniversities.length} universities`);

    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();