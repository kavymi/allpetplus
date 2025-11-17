# Pet Solutions Alliance - API Specification

**Document Type:** API Reference Documentation  
**Version:** 1.0.0  
**Last Updated:** November 16, 2025  
**Protocol:** tRPC + REST

---

## Overview

This document provides comprehensive API specifications for all 12 divisions of the Pet Solutions Alliance. The system uses a hybrid approach:

- **tRPC** for frontend-to-backend communication (type-safe, recommended)
- **REST** for external integrations, webhooks, and public APIs

### Base URLs

**Development:**
- tRPC: `http://localhost:4000/trpc`
- REST: `http://localhost:4000/api/v1`

**Production:**
- tRPC: `https://api.petalliance.com/trpc`
- REST: `https://api.petalliance.com/api/v1`

---

## Authentication

### Methods

1. **Session-based (Clerk)** - Primary for web/mobile apps
2. **API Keys** - For B2B integrations
3. **JWT Tokens** - For service-to-service communication

### tRPC Context

```typescript
interface Context {
  userId: string | null;  // Clerk user ID
  petId?: string;         // Current pet context
  session: Session | null;
  db: PrismaClient;
}
```

### Headers

```
Authorization: Bearer <token>
X-API-Key: <api-key>  // For B2B
X-Pet-Context: <pet-id>  // Optional pet context
```

---

## Core APIs

### Pet Profile API

**tRPC Router:** `core.pets`

```typescript
// Get pet by ID
pets.byId({
  id: string
}) => Promise<Pet>

// List pets for owner
pets.list({
  ownerId?: string,  // defaults to current user
  status?: PetStatus,
  limit?: number,
  cursor?: string
}) => Promise<PaginatedResponse<Pet>>

// Create pet
pets.create({
  name: string,
  species: string,
  breed: string[],
  birthDate: Date,
  sex: string,
  weight: number,
  // ... other fields
}) => Promise<Pet>

// Update pet
pets.update({
  id: string,
  data: Partial<Pet>
}) => Promise<Pet>

// Delete pet (soft delete)
pets.delete({
  id: string
}) => Promise<{success: boolean}>
```

### Owner Profile API

**tRPC Router:** `core.owners`

```typescript
// Get current owner profile
owners.me() => Promise<Owner>

// Update profile
owners.update({
  data: Partial<Owner>
}) => Promise<Owner>

// Get household
owners.household() => Promise<Household | null>

// Add household member
owners.addHouseholdMember({
  email: string,
  role: HouseholdRole
}) => Promise<HouseholdMember>
```

---

## Division 1: Acquisition CO API

**tRPC Router:** `acquisition`

### Medical Subscriptions

```typescript
// Get subscription plans
acquisition.plans.list() => Promise<MedicalPlan[]>

// Subscribe to plan
acquisition.subscriptions.create({
  planId: string,
  paymentMethodId: string
}) => Promise<MedicalSubscription>

// Get active subscription
acquisition.subscriptions.active() => Promise<MedicalSubscription | null>

// Cancel subscription
acquisition.subscriptions.cancel({
  subscriptionId: string,
  reason?: string
}) => Promise<{success: boolean}>
```

### Telemedicine

```typescript
// Book consultation
acquisition.telemedicine.book({
  providerId?: string,
  consultationType: string,
  preferredTime: Date,
  notes?: string
}) => Promise<Consultation>

// List consultations
acquisition.telemedicine.list({
  status?: string,
  limit?: number
}) => Promise<PaginatedResponse<Consultation>>

// Join video session
acquisition.telemedicine.joinSession({
  consultationId: string
}) => Promise<{sessionUrl: string, token: string}>
```

**REST Endpoints:**

```
POST /api/v1/acquisition/webhooks/stripe
  - Handle Stripe webhooks for subscription events
  
GET /api/v1/acquisition/providers
  - Public list of available providers
```

---

## Division 2: Licensure & Identification CO API

**tRPC Router:** `licensure`

### Pet Registry

```typescript
// Register pet
licensure.registry.register({
  petId: string,
  microchipNumber?: string,
  membershipTier: string
}) => Promise<PetRegistry>

// Get registry by pet ID
licensure.registry.byPetId({
  petId: string
}) => Promise<PetRegistry>

// Update registry
licensure.registry.update({
  petId: string,
  data: Partial<PetRegistry>
}) => Promise<PetRegistry>

// Generate digital ID
licensure.digitalId.generate({
  petId: string,
  cardType: 'digital' | 'apple-wallet' | 'google-wallet'
}) => Promise<{url: string, qrCode: string}>
```

### Municipal Licensing

```typescript
// Search jurisdictions
licensure.licenses.searchJurisdictions({
  postalCode: string
}) => Promise<Jurisdiction[]>

// Apply for license
licensure.licenses.apply({
  petId: string,
  jurisdictionCode: string
}) => Promise<MunicipalLicense>

// Renew license
licensure.licenses.renew({
  licenseId: string
}) => Promise<MunicipalLicense>

// List licenses
licensure.licenses.list({
  petId: string
}) => Promise<MunicipalLicense[]>
```

### Certifications

```typescript
// Add certification
licensure.certifications.add({
  petId: string,
  type: CertificationType,
  issuedBy: string,
  issuedDate: Date,
  expiresDate?: Date,
  documentUrl: string
}) => Promise<Certification>

// List certifications
licensure.certifications.list({
  petId: string
}) => Promise<Certification[]>

// Verify certification
licensure.certifications.verify({
  certificationId: string
}) => Promise<{verified: boolean}>
```

### Health Records (Blockchain)

```typescript
// Add health record
licensure.health.addRecord({
  petId: string,
  recordType: string,
  title: string,
  description: string,
  date: Date,
  veterinarianId?: string,
  documentUrls: string[]
}) => Promise<HealthRecord>

// List health records
licensure.health.list({
  petId: string,
  recordType?: string
}) => Promise<HealthRecord[]>

// Get vaccination history
licensure.health.vaccinations({
  petId: string
}) => Promise<Vaccination[]>

// Add vaccination
licensure.health.addVaccination({
  petId: string,
  vaccineName: string,
  administeredDate: Date,
  nextDueDate?: Date,
  clinicName: string
}) => Promise<Vaccination>
```

### Lost & Found

```typescript
// Report lost pet
licensure.lostFound.reportLost({
  petId: string,
  lostDate: Date,
  lastSeenLocation: Location,
  description: string,
  alertRadius: number
}) => Promise<LostPetReport>

// Report found pet
licensure.lostFound.reportFound({
  foundDate: Date,
  foundLocation: Location,
  description: string,
  photos: string[],
  contactInfo: Contact
}) => Promise<FoundPetReport>

// Search lost pets
licensure.lostFound.searchLost({
  location: Location,
  radius: number,
  species?: string
}) => Promise<LostPetReport[]>

// Mark as found
licensure.lostFound.markFound({
  reportId: string,
  foundDetails: object
}) => Promise<LostPetReport>
```

**REST Endpoints:**

```
GET /api/v1/licensure/scan/:qrCode
  - Public endpoint for scanning lost pet QR codes
  
POST /api/v1/licensure/webhooks/blockchain
  - Blockchain transaction confirmations
```

---

## Division 5: Healthcare CO API

**tRPC Router:** `healthcare`

### Insurance Policies

```typescript
// Get quote
healthcare.insurance.quote({
  petId: string,
  plan: string,
  addOns?: string[]
}) => Promise<Quote>

// Purchase policy
healthcare.insurance.purchase({
  petId: string,
  plan: string,
  addOns?: string[],
  paymentMethodId: string
}) => Promise<InsurancePolicy>

// Get active policy
healthcare.insurance.active({
  petId: string
}) => Promise<InsurancePolicy | null>

// Update coverage
healthcare.insurance.updateCoverage({
  policyId: string,
  addOns: string[]
}) => Promise<InsurancePolicy>

// Cancel policy
healthcare.insurance.cancel({
  policyId: string,
  effectiveDate: Date,
  reason: string
}) => Promise<{success: boolean}>
```

### Claims

```typescript
// Submit claim
healthcare.claims.submit({
  policyId: string,
  incidentDate: Date,
  claimType: string,
  diagnosis: string,
  treatmentDescription: string,
  totalBilled: number,
  invoiceUrl: string,
  medicalRecords?: string[]
}) => Promise<InsuranceClaim>

// List claims
healthcare.claims.list({
  policyId: string,
  status?: string
}) => Promise<PaginatedResponse<InsuranceClaim>>

// Get claim status
healthcare.claims.status({
  claimId: string
}) => Promise<InsuranceClaim>

// Upload additional documents
healthcare.claims.addDocuments({
  claimId: string,
  documentUrls: string[]
}) => Promise<{success: boolean}>
```

### Wellness Plans

```typescript
// Get wellness plans
healthcare.wellness.plans() => Promise<WellnessPlan[]>

// Subscribe to wellness plan
healthcare.wellness.subscribe({
  petId: string,
  tier: string
}) => Promise<Subscription>

// Track usage
healthcare.wellness.usage({
  petId: string
}) => Promise<{services: ServiceUsage[]}>

// Schedule wellness exam
healthcare.wellness.scheduleExam({
  petId: string,
  preferredDate: Date,
  clinicId?: string
}) => Promise<Appointment>
```

**REST Endpoints:**

```
POST /api/v1/healthcare/webhooks/stripe
  - Payment webhooks
  
GET /api/v1/healthcare/network-vets
  - Public vet network directory
  
POST /api/v1/healthcare/claims/direct-pay
  - Direct vet payment processing
```

---

## Division 7: Pet Food CO API

**tRPC Router:** `food`

### Meal Plans

```typescript
// Get meal plan recommendations
food.mealPlans.recommend({
  petId: string
}) => Promise<MealPlanRecommendation[]>

// Create custom meal plan
food.mealPlans.create({
  petId: string,
  planType: string,
  recipeName: string,
  portionSize: number,
  frequency: string,
  customizations?: object
}) => Promise<MealPlan>

// Subscribe to meal delivery
food.subscriptions.create({
  petId: string,
  mealPlanId: string,
  deliveryFrequency: string,
  deliveryAddress: Address
}) => Promise<FoodSubscription>

// Update meal plan
food.mealPlans.update({
  mealPlanId: string,
  changes: object
}) => Promise<MealPlan>

// Pause subscription
food.subscriptions.pause({
  subscriptionId: string,
  resumeDate: Date
}) => Promise<FoodSubscription>
```

### Health Scorecard

```typescript
// Generate health scorecard
food.healthScore.generate({
  petId: string
}) => Promise<HealthScorecard>

// Get latest scorecard
food.healthScore.latest({
  petId: string
}) => Promise<HealthScorecard | null>

// Get supplement recommendations
food.supplements.recommend({
  petId: string,
  healthScoreId: string
}) => Promise<SupplementRecommendation[]>
```

**REST Endpoints:**

```
POST /api/v1/food/webhooks/delivery
  - Delivery status updates from 3PL
  
GET /api/v1/food/nutrition-info/:productId
  - Public nutrition information
```

---

## Division 9: Grooming CO API

**tRPC Router:** `grooming`

### Appointments

```typescript
// Search groomers
grooming.groomers.search({
  location: Location,
  serviceType: string,
  date?: Date
}) => Promise<Groomer[]>

// Check availability
grooming.appointments.availability({
  groomerId: string,
  date: Date
}) => Promise<TimeSlot[]>

// Book appointment
grooming.appointments.book({
  petId: string,
  groomerId: string,
  serviceType: string,
  scheduledAt: Date,
  addOns?: string[]
}) => Promise<GroomingAppointment>

// Cancel appointment
grooming.appointments.cancel({
  appointmentId: string,
  reason?: string
}) => Promise<{success: boolean}>

// Reschedule
grooming.appointments.reschedule({
  appointmentId: string,
  newDate: Date
}) => Promise<GroomingAppointment>
```

### Subscriptions

```typescript
// Get subscription plans
grooming.subscriptions.plans({
  petSize: string
}) => Promise<GroomingPlan[]>

// Subscribe
grooming.subscriptions.create({
  petId: string,
  plan: string
}) => Promise<GroomingSubscription>

// Redeem monthly groom
grooming.subscriptions.redeem({
  subscriptionId: string,
  groomerId: string,
  date: Date
}) => Promise<GroomingAppointment>
```

---

## Division 10: Care Services CO API

**tRPC Router:** `care`

### Day Care

```typescript
// Check daycare availability
care.daycare.availability({
  facilityId: string,
  date: Date
}) => Promise<{available: boolean, spotsRemaining: number}>

// Book daycare
care.daycare.book({
  petId: string,
  facilityId: string,
  date: Date,
  serviceType: string,
  addOns?: string[]
}) => Promise<DayCareBooking>

// Check in
care.daycare.checkIn({
  bookingId: string
}) => Promise<{success: boolean, checkInTime: Date}>

// Check out
care.daycare.checkOut({
  bookingId: string
}) => Promise<{success: boolean, dailyReport: DailyReport}>
```

### Boarding

```typescript
// Check boarding availability
care.boarding.availability({
  facilityId: string,
  checkIn: Date,
  checkOut: Date,
  accommodationType: string
}) => Promise<{available: boolean}>

// Create reservation
care.boarding.reserve({
  petId: string,
  facilityId: string,
  checkInDate: Date,
  checkOutDate: Date,
  accommodationType: string,
  addOns?: string[],
  specialNeeds?: object
}) => Promise<BoardingReservation>

// Pay deposit
care.boarding.payDeposit({
  reservationId: string,
  amount: number
}) => Promise<{success: boolean}>
```

### Pet Transport

```typescript
// Request transport
care.transport.request({
  petId: string,
  type: string,
  pickupLocation: Location,
  dropoffLocation: Location,
  pickupTime: Date
}) => Promise<PetTransport>

// Track transport
care.transport.track({
  transportId: string
}) => Promise<{currentLocation: Location, eta: Date}>

// Complete transport
care.transport.complete({
  transportId: string
}) => Promise<{success: boolean}>
```

---

## B2B APIs

### AI Tech CO - Platform APIs

**Authentication:** API Key required

```
POST /api/v1/tech/health-prediction
Body: {
  petBreed: string,
  age: number,
  weight: number,
  healthHistory: object
}
Response: {
  predictions: Prediction[],
  confidence: number
}

POST /api/v1/tech/nutrition-optimization
Body: {
  petId: string,
  activityLevel: string,
  healthConditions: string[]
}
Response: {
  calorieNeeds: number,
  macronutrients: object,
  supplements: string[]
}

POST /api/v1/tech/breed-identification
Body: {
  imageUrl: string
}
Response: {
  breeds: Array<{breed: string, confidence: number}>,
  traits: object
}
```

### Real Estate CO - Franchise API

```
GET /api/v1/real-estate/properties
  - List available properties for franchise
  
POST /api/v1/real-estate/franchise-application
  - Submit franchise application
  
GET /api/v1/real-estate/franchise/:id/performance
  - Franchise performance metrics
```

---

## Webhooks

### Supported Events

```typescript
// Subscription events
'subscription.created'
'subscription.updated'
'subscription.cancelled'
'subscription.renewed'

// Booking events
'booking.created'
'booking.confirmed'
'booking.completed'
'booking.cancelled'

// Payment events
'payment.succeeded'
'payment.failed'
'refund.processed'

// Pet events
'pet.lost'
'pet.found'
'pet.health_alert'

// Insurance events
'claim.submitted'
'claim.approved'
'claim.denied'
'claim.paid'
```

### Webhook Payload

```json
{
  "id": "evt_xxx",
  "type": "subscription.created",
  "created": "2025-11-16T10:00:00Z",
  "data": {
    "object": {...}
  },
  "livemode": true
}
```

### Verification

All webhooks include `X-Signature` header for HMAC verification:

```typescript
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(payload))
  .digest('hex');
  
if (signature !== req.headers['x-signature']) {
  throw new Error('Invalid signature');
}
```

---

## Rate Limiting

### Tier Limits

**Free Tier:**
- 100 requests/hour
- 1,000 requests/day

**Basic Membership:**
- 500 requests/hour
- 5,000 requests/day

**Premium Membership:**
- 2,000 requests/hour
- 20,000 requests/day

**B2B/Enterprise:**
- Custom limits
- Burst allowance
- Dedicated infrastructure

### Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1635532800
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Pet ID is required",
    "details": {
      "field": "petId",
      "issue": "missing"
    }
  }
}
```

### Error Codes

```
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
409 - Conflict
422 - Unprocessable Entity
429 - Too Many Requests
500 - Internal Server Error
503 - Service Unavailable
```

---

## Pagination

### Cursor-based Pagination

```typescript
{
  data: T[],
  pagination: {
    nextCursor: string | null,
    hasMore: boolean,
    total?: number
  }
}
```

### Usage

```typescript
// First page
const page1 = await trpc.pets.list.query({limit: 20});

// Next page
const page2 = await trpc.pets.list.query({
  limit: 20,
  cursor: page1.pagination.nextCursor
});
```

---

## Versioning

APIs are versioned via URL path:
- `/api/v1/...` - Current stable version
- `/api/v2/...` - Future version (beta)

**Deprecation Policy:**
- New versions announced 6 months in advance
- Old versions supported for 12 months after new release
- Critical security fixes backported for 6 months

---

## Testing

### Sandbox Environment

**Base URL:** `https://sandbox-api.petalliance.com`

- Test data provided
- No real payments processed
- Webhooks sent to test endpoints
- Reset daily at midnight UTC

### Test API Keys

```
Test Secret Key: sk_test_xxx
Test Publishable Key: pk_test_xxx
```

---

## SDK Libraries

### Official SDKs

```typescript
// TypeScript/JavaScript
import { PetAllianceClient } from '@pet-alliance/sdk';

const client = new PetAllianceClient({
  apiKey: 'your-api-key',
  environment: 'production' // or 'sandbox'
});

// Python
from pet_alliance import Client

client = Client(api_key='your-api-key')

// Go
import "github.com/pet-alliance/go-sdk"

client := petalliance.NewClient("your-api-key")
```

---

## Related Documentation

- [TypeScript Types](/libs/domain/src/lib/pet-alliance/types.ts)
- [Database Schema](/docs/architecture/pet-alliance-database-schema.md)
- [JSON Config](/docs/api/pet-alliance-api-config.json)
- [Division Documentation](/docs/features/)

---

**Document Version:** 1.0.0  
**Last Updated:** November 16, 2025  
**Maintained By:** API Team

