import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with psychologists...");

  // Pre-generated psychologists with profile pictures from Unsplash
  const psychologists = [
    {
      fullName: "Dr. Sarah Johnson",
      email: "sarah.johnson@mentalhealth.com",
      password: await bcryptjs.hash("SecurePass123!", 10),
      phone: "+1-555-0101",
      gender: "Female",
      clinicAddress: "123 Wellness St, New York, NY",
      qualifications: "PhD in Clinical Psychology, M.S. in Counseling",
      specialization: "Depression & Anxiety",
      licenseNumber: "LIC-NY-001",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      yearsExperience: 8,
      rating: 4.9,
      consultationFee: 499,
      about: "Compassionate therapist specializing in cognitive behavioral therapy for depression and anxiety disorders. 8+ years of clinical experience.",
    },
    {
      fullName: "Dr. Michael Chen",
      email: "michael.chen@mentalhealth.com",
      password: await bcryptjs.hash("SecurePass123!", 10),
      phone: "+1-555-0102",
      gender: "Male",
      clinicAddress: "456 Mindful Ave, San Francisco, CA",
      qualifications: "MD in Psychiatry, Board Certified",
      specialization: "Bipolar Disorder & PTSD",
      licenseNumber: "LIC-CA-001",
      profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      yearsExperience: 12,
      rating: 4.8,
      consultationFee: 599,
      about: "Experienced psychiatrist with expertise in mood disorders and trauma. Offers medication management and psychotherapy.",
    },
    {
      fullName: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@mentalhealth.com",
      password: await bcryptjs.hash("SecurePass123!", 10),
      phone: "+1-555-0103",
      gender: "Female",
      clinicAddress: "789 Hope Lane, Los Angeles, CA",
      qualifications: "LMFT, Certified Family Therapist",
      specialization: "Relationship & Family Therapy",
      licenseNumber: "LIC-CA-002",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      yearsExperience: 10,
      rating: 4.95,
      consultationFee: 450,
      about: "Family and relationship therapist helping couples and families improve communication and resolve conflicts.",
    },
    {
      fullName: "Dr. James Wilson",
      email: "james.wilson@mentalhealth.com",
      password: await bcryptjs.hash("SecurePass123!", 10),
      phone: "+1-555-0104",
      gender: "Male",
      clinicAddress: "321 Serenity Blvd, Chicago, IL",
      qualifications: "MA in Clinical Mental Health Counseling",
      specialization: "Stress Management & Mindfulness",
      licenseNumber: "LIC-IL-001",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      yearsExperience: 7,
      rating: 4.7,
      consultationFee: 399,
      about: "Mindfulness expert and stress management specialist. Uses meditation and relaxation techniques.",
    },
    {
      fullName: "Dr. Lisa Thompson",
      email: "lisa.thompson@mentalhealth.com",
      password: await bcryptjs.hash("SecurePass123!", 10),
      phone: "+1-555-0105",
      gender: "Female",
      clinicAddress: "654 Wellness Dr, Houston, TX",
      qualifications: "PhD in Psychology, Specialized in Child Psychology",
      specialization: "Child & Adolescent Mental Health",
      licenseNumber: "LIC-TX-001",
      profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      yearsExperience: 9,
      rating: 4.85,
      consultationFee: 449,
      about: "Specializes in therapy for children and adolescents. Creates safe, supportive environment for young clients.",
    },
    {
      fullName: "Dr. David Kumar",
      email: "david.kumar@mentalhealth.com",
      password: await bcryptjs.hash("SecurePass123!", 10),
      phone: "+1-555-0106",
      gender: "Male",
      clinicAddress: "987 Peace St, Boston, MA",
      qualifications: "MA in Counseling Psychology, Trauma Specialist",
      specialization: "Trauma & PTSD",
      licenseNumber: "LIC-MA-001",
      profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      yearsExperience: 11,
      rating: 4.9,
      consultationFee: 549,
      about: "Trauma-informed therapist specializing in PTSD and complex trauma recovery. Certified in EMDR.",
    },
    {
      fullName: "Dr. Angela Martinez",
      email: "angela.martinez@mentalhealth.com",
      password: await bcryptjs.hash("SecurePass123!", 10),
      phone: "+1-555-0107",
      gender: "Female",
      clinicAddress: "246 Health Ave, Miami, FL",
      qualifications: "PhD in Behavioral Psychology",
      specialization: "Addiction & Substance Abuse",
      licenseNumber: "LIC-FL-001",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      yearsExperience: 10,
      rating: 4.8,
      consultationFee: 499,
      about: "Addiction specialist with 10+ years of experience in recovery support and substance abuse counseling.",
    },
    {
      fullName: "Dr. Robert Chang",
      email: "robert.chang@mentalhealth.com",
      password: await bcryptjs.hash("SecurePass123!", 10),
      phone: "+1-555-0108",
      gender: "Male",
      clinicAddress: "135 Success Lane, Seattle, WA",
      qualifications: "MS in Counseling, Career Counselor",
      specialization: "Career & Life Coaching",
      licenseNumber: "LIC-WA-001",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      yearsExperience: 8,
      rating: 4.75,
      consultationFee: 399,
      about: "Life and career coach helping clients achieve personal and professional goals through guided counseling.",
    },
  ];

  // Create psychologists
  for (const psychologist of psychologists) {
    try {
      const created = await prisma.psychologist.create({
        data: psychologist,
      });
      console.log(`✅ Created: ${created.fullName}`);

      // Add availability for each psychologist
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      for (const day of days) {
        await prisma.availability.create({
          data: {
            psychologistId: created.id,
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "17:00",
            slotDurationMins: 30,
          },
        });
      }
      console.log(`   ⏰ Added availability for ${created.fullName}`);
    } catch (error) {
      console.log(`⚠️  ${psychologist.fullName} already exists`);
    }
  }

  // Seed default admin account
  console.log("🔐 Seeding admin account...");
  const adminEmail = "admin@mentalhealth.com";
  const adminPassword = await bcryptjs.hash("Admin123!", 10);
  try {
    await prisma.admin.create({
      data: {
        fullName: "Site Administrator",
        email: adminEmail,
        password: adminPassword,
      },
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  } catch (error) {
    console.log("ℹ️ Admin already exists");
  }

  console.log("✨ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
