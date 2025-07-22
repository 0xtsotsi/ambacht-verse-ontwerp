# Wesley's Ambacht Sopranos-Style Implementation Stories

## 🎯 Epic: Sopranos-Style Catering Website Transformation

**Epic Goal**: Transform Wesley's Ambacht from a functional prototype to a production-ready, conversion-optimized platform with sophisticated elegance reminiscent of high-end catering websites, implementing comprehensive booking functionality and professional Dutch content.

**Sprint Duration**: 3 weeks  
**Story Points**: 89 points total

---

## 📋 STORY 1: Content Quality & Professional Polish

**Priority**: CRITICAL  
**Story Points**: 8  
**Sprint**: Week 1

### User Story

As a potential customer visiting Wesley's Ambacht website,  
I want to see professional, error-free Dutch content throughout,  
So that I perceive the business as credible and trustworthy.

### Acceptance Criteria

- [ ] Replace all placeholder/incorrect Dutch text with professional copy
- [ ] Fix specific content errors: "gesetveerd", "zaorten kookeke saucs", etc.
- [ ] Implement consistent brand voice: warm, professional, emphasizing tradition
- [ ] Ensure all text uses formal Dutch (u/uw not je/jouw)
- [ ] Add proper SEO meta descriptions in Dutch
- [ ] Content passes professional review for grammar and tone

### Technical Implementation

- Update all component text content
- Create content constants file for maintainability
- Implement proper typography hierarchy
- Add structured data markup

---

## 📋 STORY 2: Component Integration & Layout Enhancement

**Priority**: HIGH  
**Story Points**: 13  
**Sprint**: Week 1

### User Story

As a website visitor,  
I want to see testimonials and local supplier information,  
So that I can trust Wesley's quality and local connections.

### Acceptance Criteria

- [ ] Integrate existing Testimonials component into Index.tsx layout
- [ ] Integrate existing LocalSuppliers component into Index.tsx layout
- [ ] Position between Gallery and BookingForm sections
- [ ] Maintain existing spacing and background patterns
- [ ] Ensure mobile responsiveness is preserved
- [ ] Components blend seamlessly with overall design

### Technical Implementation

```typescript
// src/pages/Index.tsx modification
<Gallery />
<Testimonials />        // NEW
<LocalSuppliers />      // NEW
<BookingForm />
```

### Definition of Done

- Components render correctly on all screen sizes
- No layout shifts or visual disruptions
- Performance impact is minimal
- All existing functionality preserved

---

## 📋 STORY 3: Multi-Language Foundation

**Priority**: HIGH  
**Story Points**: 21  
**Sprint**: Week 1-2

### User Story

As an international visitor or English-speaking client,  
I want to view the website in English,  
So that I can understand Wesley's services and make a booking.

### Acceptance Criteria

- [ ] Create LanguageProvider context with Dutch/English support
- [ ] Implement LanguageToggle component in Navigation
- [ ] Create translation files for all content
- [ ] Store language preference in localStorage
- [ ] Default to Dutch with smooth English switching
- [ ] All user-facing text supports both languages

### Technical Implementation

```typescript
// New files:
src/components/i18n/LanguageProvider.tsx
src/components/i18n/LanguageToggle.tsx
src/lib/translations.ts
src/hooks/useLanguage.ts

// Modified files:
src/components/Navigation.tsx
src/App.tsx (wrap with provider)
```

### Translation Coverage

- Navigation items
- Hero section content
- Service descriptions
- Booking form labels
- Footer information
- Error messages

---

## 📋 STORY 4: Multi-Step Booking Form Foundation

**Priority**: HIGH  
**Story Points**: 34  
**Sprint**: Week 2-3

### User Story

As a potential customer wanting to book catering services,  
I want a guided, step-by-step booking process,  
So that I can easily provide all necessary information without feeling overwhelmed.

### Acceptance Criteria

- [ ] Create 5-step booking wizard preserving circular design
- [ ] Implement progress indicator with step validation
- [ ] Maintain existing warm cream background and styling
- [ ] Add smooth transitions between steps
- [ ] Include form validation with clear error feedback
- [ ] Support service pre-selection from Services component

### Step Structure

1. **Service Selection** - BBQ, Office Catering, Event Buffets
2. **Date & Time** - Calendar picker with availability checking
3. **Event Details** - Guest count, location, special requirements
4. **Menu Selection** - Dynamic options based on service type
5. **Contact Information** - Enhanced existing form with company field

### Technical Implementation

```typescript
// New components:
src / components / booking / MultiStepBookingForm.tsx;
src / components / booking / StepIndicator.tsx;
src / components / booking / ServiceSelector.tsx;
src / components / booking / DateTimePicker.tsx;
src / components / booking / EventDetails.tsx;
src / components / booking / MenuSelector.tsx;
src / components / booking / ContactForm.tsx;

// State management:
src / hooks / useBookingForm.ts;
src / types / booking.ts;
```

### Form Data Structure

```typescript
interface BookingFormData {
  serviceType: "bbq" | "office" | "events";
  eventDate: Date;
  eventTime: string;
  guestCount: number;
  location: string;
  menuPreferences: string[];
  dietaryRequirements: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  specialRequests: string;
}
```

---

## 📋 STORY 5: Database Schema & API Integration

**Priority**: MEDIUM  
**Story Points**: 13  
**Sprint**: Week 2

### User Story

As Wesley (business owner),  
I want booking requests to be stored in the database,  
So that I can manage and respond to customer inquiries efficiently.

### Acceptance Criteria

- [ ] Create Supabase tables for booking management
- [ ] Generate TypeScript types for database operations
- [ ] Implement booking submission with validation
- [ ] Add reference number generation for tracking
- [ ] Include error handling and retry logic
- [ ] Create booking status management system

### Database Schema

```sql
-- Booking requests table
CREATE TABLE booking_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_company TEXT,
  service_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  guest_count INTEGER NOT NULL,
  location TEXT NOT NULL,
  menu_preferences TEXT[],
  dietary_requirements TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service availability table
CREATE TABLE service_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  service_type TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  max_capacity INTEGER DEFAULT 500,
  notes TEXT
);

-- Menu options table
CREATE TABLE menu_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_per_person DECIMAL(10,2),
  dietary_tags TEXT[],
  available BOOLEAN DEFAULT true
);
```

### API Operations

```typescript
// src/integrations/supabase/booking-operations.ts
export const submitBookingRequest = async (data: BookingFormData)
export const checkDateAvailability = async (date: Date, serviceType: string)
export const getMenuOptions = async (serviceType: string)
```

---

## 📋 STORY 6: Enhanced Services with Booking Integration

**Priority**: MEDIUM  
**Story Points**: 13  
**Sprint**: Week 3

### User Story

As a visitor exploring catering services,  
I want to directly book a specific service from the Services section,  
So that I can quickly proceed with my preferred option.

### Acceptance Criteria

- [ ] Add "Boek Nu" (Book Now) CTAs to each service card
- [ ] Implement service pre-selection in booking form
- [ ] Add pricing information display
- [ ] Include service-specific feature highlights
- [ ] Maintain existing card design and animations
- [ ] Support smooth scrolling to booking form

### Enhanced Service Cards

```typescript
// src/components/enhanced/EnhancedServices.tsx
interface ServiceCardProps {
  serviceType: "bbq" | "office" | "events";
  title: string;
  description: string;
  pricing: string;
  features: string[];
  onBookingClick: (serviceType: string) => void;
}
```

### Service Information Updates

- **BBQ Service**: "Vanaf €27,50 per persoon"
- **Office Catering**: "Vanaf €12,50 per persoon"
- **Event Buffets**: "Vanaf €22,50 per persoon"

---

## 📋 STORY 7: Performance & SEO Optimization

**Priority**: MEDIUM  
**Story Points**: 8  
**Sprint**: Week 3

### User Story

As a website visitor on mobile,  
I want the site to load quickly and rank well in search results,  
So that I have a smooth experience and can easily find Wesley's services.

### Acceptance Criteria

- [ ] Achieve 90+ Lighthouse scores across all categories
- [ ] Implement lazy loading for images below the fold
- [ ] Add structured data markup for local business
- [ ] Optimize Core Web Vitals metrics
- [ ] Include proper meta tags and Open Graph data
- [ ] Ensure mobile-first performance optimization

### Technical Implementation

- Image optimization with WebP format
- Code splitting for booking form
- Structured data for catering business
- Meta tag optimization for Dutch SEO
- Performance monitoring setup

---

## 🚀 Implementation Timeline

### Week 1: Foundation (Stories 1-3)

- **Days 1-2**: Content quality improvement
- **Days 3-4**: Component integration
- **Days 5-7**: Multi-language foundation

### Week 2: Core Functionality (Stories 4-5)

- **Days 1-4**: Multi-step booking form
- **Days 5-7**: Database schema and API integration

### Week 3: Enhancement & Polish (Stories 6-7)

- **Days 1-3**: Enhanced services integration
- **Days 4-5**: Performance and SEO optimization
- **Days 6-7**: Testing and final validation

## 📊 Success Metrics

**Conversion Optimization:**

- 40% increase in booking form completion rate
- 25% increase in service inquiry conversion
- 80%+ multi-step form completion rate

**Technical Performance:**

- 90+ Lighthouse Performance score
- 90+ Lighthouse Accessibility score
- <2.5s First Contentful Paint on mobile

**Content Quality:**

- Professional Dutch content throughout
- SEO visibility improvement for local searches
- Reduced bounce rate from landing pages

## 🎯 Definition of Done

**Each Story Must:**

- [ ] Pass all acceptance criteria
- [ ] Maintain existing functionality
- [ ] Include appropriate tests
- [ ] Follow established code patterns
- [ ] Be responsive across all screen sizes
- [ ] Support both Dutch and English languages
- [ ] Meet accessibility requirements (WCAG 2.1 AA)
- [ ] Maintain performance benchmarks

**Epic Completion Criteria:**

- [ ] All 7 stories completed successfully
- [ ] Comprehensive booking system functional
- [ ] Professional content quality achieved
- [ ] Multi-language support operational
- [ ] Database integration working
- [ ] Performance targets met
- [ ] No regressions in existing functionality
