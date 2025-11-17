# Pet Solutions Alliance - Database Schema Design

**Document Type:** Architecture Documentation  
**Status:** Design Phase / Reference  
**Last Updated:** November 16, 2025

---

## Overview

This document outlines the comprehensive database schema design for the Pet Solutions Alliance Corporation, covering all 12 divisions. The schema is designed using Prisma ORM syntax but serves as reference documentation and is not integrated with the existing codebase.

### Database Strategy

**Approach:** Hybrid architecture with shared core entities and division-specific schemas

**Options:**
1. **Multi-tenant single database** - Shared database with schema namespaces per division
2. **Database per service** - Separate databases for each major division (recommended for microservices)
3. **Hybrid** - Shared core database (pet profiles, owners) + division-specific databases

**Recommended:** Hybrid approach with core shared database and optional separate databases for high-traffic divisions (Food, Healthcare, Products)

---

## Core Shared Schema

### Pet & Owner Entities

```prisma
// Core entities shared across all divisions

model Owner {
  id                    String   @id @default(uuid())
  clerkId               String   @unique
  email                 String   @unique
  phone                 String?
  firstName             String
  lastName              String
  middleName            String?
  
  // Address
  street1               String?
  street2               String?
  city                  String?
  state                 String?
  postalCode            String?
  country               String   @default("USA")
  
  // Membership
  membershipLevel       MembershipTier @default(FREE)
  membershipStartDate   DateTime @default(now())
  membershipExpiresAt   DateTime?
  
  // Privacy & Preferences
  emailNotifications    Boolean  @default(true)
  smsNotifications      Boolean  @default(false)
  pushNotifications     Boolean  @default(true)
  newsletterOptIn       Boolean  @default(true)
  
  // Data Sharing Permissions
  dataSharing           Json     // DivisionDataSharing object
  
  // Relationships
  pets                  Pet[]
  households            HouseholdMember[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@map("owners")
}

model Pet {
  id                    String   @id @default(uuid())
  name                  String
  species               PetSpecies
  breed                 String[]
  mixBreed              Boolean  @default(false)
  sex                   PetSex
  birthDate             DateTime
  approximateAge        Boolean  @default(false)
  
  // Physical Characteristics
  weight                Float    // pounds
  height                Float?   // inches
  color                 String[]
  markings              String?
  photos                String[] // URLs
  
  // Identification
  microchipNumber       String?  @unique
  tattooId              String?
  registryNumber        String?  @unique // From Licensure CO
  blockchainId          String?  @unique
  
  // Owner/Household
  ownerId               String
  owner                 Owner    @relation(fields: [ownerId], references: [id])
  householdId           String?
  
  // Status
  status                PetStatus @default(ACTIVE)
  statusUpdatedAt       DateTime @default(now())
  
  // Emergency Contacts
  emergencyContacts     Json     // EmergencyContact[]
  
  // Division-Specific IDs (indexed for quick lookup)
  licenseId             String?  @unique // Licensure CO
  insurancePolicyId     String?  @unique // Healthcare CO
  dnaProfileId          String?  @unique // AI Tech CO
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([ownerId])
  @@index([registryNumber])
  @@index([microchipNumber])
  @@map("pets")
}

model Household {
  id                    String   @id @default(uuid())
  name                  String
  primaryOwnerId        String
  
  members               HouseholdMember[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@map("households")
}

model HouseholdMember {
  id                    String   @id @default(uuid())
  householdId           String
  household             Household @relation(fields: [householdId], references: [id])
  ownerId               String
  owner                 Owner    @relation(fields: [ownerId], references: [id])
  role                  HouseholdRole @default(SECONDARY)
  
  createdAt             DateTime @default(now())
  
  @@unique([householdId, ownerId])
  @@map("household_members")
}

// Enums
enum PetSpecies {
  DOG
  CAT
  BIRD
  RABBIT
  OTHER
}

enum PetSex {
  MALE
  FEMALE
  NEUTERED
  SPAYED
}

enum PetStatus {
  ACTIVE
  LOST
  FOUND
  DECEASED
  TRANSFERRED
}

enum MembershipTier {
  FREE
  BASIC
  PLUS
  PREMIUM
  FAMILY
}

enum HouseholdRole {
  PRIMARY
  SECONDARY
  CAREGIVER
}
```

---

## Division 1: Acquisition CO (Medical/Wellness)

```prisma
model MedicalSubscription {
  id                    String   @id @default(uuid())
  ownerId               String   // Links to Owner (human)
  
  plan                  MedicalPlan
  monthlyPrice          Float
  services              String[] // List of included services
  
  status                SubscriptionStatus @default(ACTIVE)
  startDate             DateTime @default(now())
  nextBillingDate       DateTime
  cancelledAt           DateTime?
  
  consultations         TelemedicineConsultation[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([ownerId])
  @@map("medical_subscriptions")
}

model TelemedicineConsultation {
  id                    String   @id @default(uuid())
  subscriptionId        String
  subscription          MedicalSubscription @relation(fields: [subscriptionId], references: [id])
  
  providerId            String
  providerName          String
  
  scheduledAt           DateTime
  duration              Int      // minutes
  consultationType      ConsultationType
  
  status                ConsultationStatus @default(SCHEDULED)
  notes                 String?  @db.Text
  prescriptionsIssued   String[]
  
  completedAt           DateTime?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([subscriptionId])
  @@index([providerId])
  @@map("telemedicine_consultations")
}

enum MedicalPlan {
  BASIC
  PLUS
  PREMIUM
  FAMILY
}

enum ConsultationType {
  PRIMARY_CARE
  MENTAL_HEALTH
  SPECIALTY
  FOLLOW_UP
}

enum ConsultationStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum SubscriptionStatus {
  ACTIVE
  PAUSED
  CANCELLED
  EXPIRED
}
```

---

## Division 2: Licensure & Identification CO

```prisma
model PetRegistry {
  id                    String   @id @default(uuid())
  petId                 String   @unique
  registryNumber        String   @unique
  blockchainTxHash      String?
  
  // Registry Details
  microchipNumber       String?
  tattooId              String?
  dnaProfileId          String?
  
  // Status
  status                PetStatus @default(ACTIVE)
  statusUpdatedAt       DateTime @default(now())
  
  // Membership
  membershipTier        MembershipTier @default(FREE)
  membershipExpiresAt   DateTime?
  
  // Related Records
  licenses              MunicipalLicense[]
  certifications        Certification[]
  healthRecords         HealthRecord[]
  vaccinations          Vaccination[]
  lostReports           LostPetReport[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([petId])
  @@index([registryNumber])
  @@map("pet_registry")
}

model MunicipalLicense {
  id                    String   @id @default(uuid())
  petId                 String
  registryId            String
  registry              PetRegistry @relation(fields: [registryId], references: [id])
  
  licenseNumber         String   @unique
  
  // Jurisdiction
  jurisdictionType      JurisdictionType
  jurisdictionName      String
  jurisdictionCode      String
  
  // Dates
  issuedDate            DateTime
  expiresDate           DateTime
  
  // Payment
  fee                   Float
  paid                  Boolean  @default(false)
  paidAt                DateTime?
  transactionId         String?
  
  status                LicenseStatus @default(ACTIVE)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([petId])
  @@index([jurisdictionCode])
  @@map("municipal_licenses")
}

model Certification {
  id                    String   @id @default(uuid())
  petId                 String
  registryId            String
  registry              PetRegistry @relation(fields: [registryId], references: [id])
  
  type                  CertificationType
  name                  String
  description           String?  @db.Text
  
  issuedBy              String
  issuingOrganization   String?
  certificationNumber   String?
  
  issuedDate            DateTime
  expiresDate           DateTime?
  renewalRequired       Boolean  @default(false)
  
  documentUrls          String[]
  badgeUrl              String?
  
  verified              Boolean  @default(false)
  verifiedBy            String?
  verifiedAt            DateTime?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([petId])
  @@index([type])
  @@map("certifications")
}

model HealthRecord {
  id                    String   @id @default(uuid())
  petId                 String
  registryId            String
  registry              PetRegistry @relation(fields: [registryId], references: [id])
  
  recordType            HealthRecordType
  title                 String
  description           String?  @db.Text
  date                  DateTime
  
  veterinarianId        String?
  clinicName            String?
  
  medications           Json?    // Medication[]
  allergies             String[]
  conditions            String[]
  
  documentUrls          String[]
  blockchainTxHash      String?
  immutable             Boolean  @default(false)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([petId])
  @@index([recordType])
  @@map("health_records")
}

model Vaccination {
  id                    String   @id @default(uuid())
  petId                 String
  registryId            String
  registry              PetRegistry @relation(fields: [registryId], references: [id])
  
  vaccineName           String
  vaccineType           VaccineType
  
  administeredDate      DateTime
  nextDueDate           DateTime?
  administeredBy        String
  clinicName            String?
  
  manufacturer          String?
  lotNumber             String?
  expirationDate        DateTime?
  
  certificateUrl        String?
  blockchainTxHash      String?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([petId])
  @@index([nextDueDate])
  @@map("vaccinations")
}

model LostPetReport {
  id                    String   @id @default(uuid())
  petId                 String
  registryId            String
  registry              PetRegistry @relation(fields: [registryId], references: [id])
  reportedBy            String
  
  lostDate              DateTime
  lastSeenLocation      Json     // {address, coordinates, description}
  
  physicalDescription   String   @db.Text
  wearing               String[]
  behaviorNotes         String?  @db.Text
  
  status                LostFoundStatus @default(LOST)
  statusUpdatedAt       DateTime @default(now())
  
  alertRadius           Int      @default(5) // miles
  alertsSent            Int      @default(0)
  sightingsReported     Int      @default(0)
  
  foundDate             DateTime?
  foundBy               String?
  foundLocation         Json?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([petId])
  @@index([status])
  @@map("lost_pet_reports")
}

// Enums for Licensure
enum JurisdictionType {
  CITY
  COUNTY
  STATE
}

enum LicenseStatus {
  ACTIVE
  EXPIRED
  PENDING
  REVOKED
}

enum CertificationType {
  SERVICE_DOG
  ESA
  THERAPY_DOG
  GOOD_CITIZEN
  TRAINING_SPECIALTY
  HEALTH_CLEARANCE
  COMPETITION_TITLE
}

enum HealthRecordType {
  VACCINATION
  SURGERY
  MEDICATION
  LAB_RESULT
  DIAGNOSIS
  TREATMENT
  EXAM
}

enum VaccineType {
  CORE
  NON_CORE
  LIFESTYLE
}

enum LostFoundStatus {
  LOST
  SIGHTING_REPORTED
  FOUND
  CLOSED
}
```

---

## Summary for Remaining Divisions

Due to context constraints, here's a condensed reference for the remaining divisions. Full schemas follow similar patterns:

### Division 3: Content & Media CO
- `ContentPiece` - Videos, podcasts, articles
- `InfluencerPartnership` - Influencer contracts
- `SponsorshipDeal` - Brand sponsorships
- `Competition` - Contests and events

### Division 4: Products CO
- `Product` - Product catalog
- `CustomDesign` - Custom harness designs (already exists)
- `ProductOrder` - E-commerce orders
- `SubscriptionBox` - Monthly subscriptions

### Division 5: Healthcare CO
- `InsurancePolicy` - Pet insurance policies (detailed above)
- `InsuranceClaim` - Claims processing
- `WellnessPlan` - Preventive care subscriptions
- `VetNetworkProvider` - Network veterinarians

### Division 6: Training CO
- `TrainingProgram` - Available programs
- `TrainingEnrollment` - Student enrollments
- `CertifiedTrainer` - Trainer profiles
- `TrainingCertification` - Completed certifications

### Division 7: Pet Food CO
- `MealPlan` - Customized meal plans
- `FoodSubscription` - Meal delivery subscriptions
- `SupplementPlan` - Supplement recommendations
- `HealthScorecard` - AI-generated health scores

### Division 8: AI Plus Tech CO
- `DNATestKit` - DNA test orders and results
- `HealthPredictionModel` - AI predictions
- `WearableIntegration` - Device data
- `APIConsumer` - B2B API customers

### Division 9: Grooming CO
- `GroomingAppointment` - Service bookings
- `GroomingSubscription` - Monthly plans
- `CertifiedGroomer` - Groomer profiles
- `GroomingSalon` - Facility information
- `GroomingProduct` - Product catalog

### Division 10: Care Services CO
- `DayCareBooking` - Daycare reservations
- `BoardingReservation` - Overnight boarding
- `PetTransport` - Transportation services
- `DogWalkingService` - Walking appointments
- `CareFacility` - Facility details

### Division 11: Foundation
- `Grant` - Grant applications and awards
- `Donation` - Individual and corporate donations
- `VolunteerProfile` - Volunteer management
- `AdoptionEvent` - Adoption events
- `WelfareProgram` - Program tracking

### Division 12: Real Estate CO
- `Property` - Property portfolio
- `PropertyDevelopment` - Development projects
- `FacilityManagement` - Operations and maintenance
- `FranchiseLocation` - Franchise tracking

---

## Database Relationships & Integration

### Cross-Division Data Flow

```
Owner (Core)
├─> Pet (Core)
    ├─> PetRegistry (Licensure)
    ├─> InsurancePolicy (Healthcare)
    ├─> MealPlan (Food)
    ├─> TrainingEnrollment (Training)
    ├─> DNATestKit (AI Tech)
    ├─> GroomingAppointment (Grooming)
    ├─> DayCareBooking (Care)
    └─> CustomDesign (Products)
```

### Data Sharing Patterns

1. **Event-Driven Sync:** Changes in core entities trigger events to division databases
2. **API Integration:** Divisions query core database for pet/owner data
3. **Materialized Views:** Division databases cache frequently accessed core data
4. **Federation:** GraphQL federation layer for cross-division queries

---

## Indexing Strategy

### Core Indexes
- Pet: `ownerId`, `registryNumber`, `microchipNumber`, `status`
- Owner: `clerkId`, `email`, `membershipLevel`

### Division-Specific Indexes
- All booking/appointment tables: `petId`, `ownerId`, `status`, `date`
- All subscription tables: `ownerId`, `status`, `nextBillingDate`
- Transaction tables: `transactionId`, `createdAt`
- Search-heavy tables: Full-text search indexes on `name`, `description`

---

## Backup & Recovery

**Strategy:**
- Daily automated backups
- Point-in-time recovery (PITR) enabled
- Cross-region replication for core database
- Division databases: Region-specific with backup

**Retention:**
- Daily backups: 30 days
- Weekly backups: 1 year
- Monthly backups: 7 years

---

## Scaling Considerations

### Read Replicas
- Core database: 2-3 read replicas
- High-traffic divisions (Healthcare, Food, Products): 1-2 read replicas each

### Sharding Strategy (Future)
- Shard by geographic region
- Shard by customer tier (Free vs Premium)
- Time-series data: Shard by date range

### Caching Layer
- Redis for hot data (pet profiles, active bookings)
- Memcached for session data
- Application-level caching for static data

---

## Migration Path

### Phase 1: Shared Database (Current)
- Single Postgres database
- Schema namespaces per division
- Simplest to implement

### Phase 2: Separate High-Traffic Divisions
- Extract Healthcare, Food, Products to separate databases
- Core database remains shared
- Event-driven sync

### Phase 3: Full Microservices
- Each division gets dedicated database
- Service mesh for communication
- Data federation layer

---

## Compliance & Data Retention

### GDPR Compliance
- Right to access: Export all user data
- Right to erasure: Soft delete with retention policy
- Data portability: JSON export format

### Data Retention Policies
- Active pets/owners: Indefinite
- Deleted accounts: 90-day grace period, then purge
- Transaction history: 7 years (financial regulations)
- Health records: 10 years (medical best practice)
- Analytics/logs: 2 years

---

## Conclusion

This database schema provides a comprehensive foundation for the Pet Solutions Alliance ecosystem. The hybrid approach balances data sharing needs with division autonomy, enabling both rapid development and long-term scalability.

**Next Steps:**
1. Review schema with stakeholders
2. Prioritize divisions for initial implementation
3. Create migration scripts
4. Set up CI/CD for schema deployments
5. Implement monitoring and alerting

---

## Related Documentation

- [Pet Solutions Alliance Master](/docs/features/pet-solutions-alliance-master.md)
- [TypeScript Domain Types](/libs/domain/src/lib/pet-alliance/types.ts)
- [API Specification](/docs/api/pet-alliance-api-specification.md)
- [Architecture Overview](/docs/architecture/architecture.md)

---

**Document Version:** 1.0  
**Last Updated:** November 16, 2025  
**Maintained By:** Architecture Team

