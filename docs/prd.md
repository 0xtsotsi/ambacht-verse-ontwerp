# Wesley's Ambacht Sopranos Enhancement Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Transform Wesley's Ambacht into a premium catering platform that matches Sopranos Catering's professional excellence while maintaining Dutch authenticity
- Implement proven conversion optimization features to achieve 40% increase in booking form completion rates
- Establish transparent pricing structure with per-person costs (€12.50-€27.50) to build customer confidence
- Create streamlined booking experience with real-time availability and sub-4-hour quote response times
- Position brand for high-value corporate events and luxury celebrations in Netherlands market
- Build professional trust signals through awards, testimonials, and supplier partnerships
- Enable multi-language support (Dutch formal/English) for international market expansion

### Background Context

Market research reveals the Dutch catering industry faces economic pressures with minimal 1% growth in 2024, yet premium services in Amsterdam/Rotterdam continue showing resilience. The €22.98 billion Netherlands foodservice market is dominated by 54% independent operators, creating opportunity for differentiation through professional digital experience.

Competitive analysis of Sopranos Catering identified key success factors: prominent "Check Your Date" CTA, transparent per-person pricing ($10.99-$22.99), quick booking forms with real-time availability, professional trust signals, and memorable contact methods. Wesley's Ambacht currently lacks these conversion-critical elements, resulting in suboptimal booking rates and positioning for premium market segments.

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
| 2025-06-28 | 1.0 | Initial PRD creation based on project brief and market research | John (PM) |

## Requirements

### Functional

- FR1: FloatingBookingWidget provides persistent "Check Your Date" access throughout site navigation
- FR2: Enhanced DateChecker modal includes time slot selection (10:00-20:00 in 1-hour increments)
- FR3: Guest count estimator calculates preliminary pricing based on per-person service rates
- FR4: Real-time availability system checks date/time conflicts against booking database
- FR5: Service pricing cards display transparent per-person costs for all catering categories
- FR6: Tiered service options present multiple pricing levels within each service category
- FR7: AwardsSection component showcases professional certifications and industry recognition
- FR8: Testimonials carousel rotates client reviews with company names and event details
- FR9: Supplier partnership showcase highlights local artisanal producers with heritage
- FR10: WhatsApp Business integration enables immediate customer communication
- FR11: Multi-language system supports Dutch formal tone and English capability
- FR12: PricingCalculator generates instant preliminary quotes based on selections
- FR13: Navigation prominently displays memorable contact number (similar to 1-800-WE-CATER)
- FR14: Seasonal specials section highlights current menu offerings and promotions
- FR15: Contact form captures event type, guest count, date, time, and special requests
- FR16: PDF menu generation allows downloadable service and pricing information
- FR17: Mobile booking experience maintains full functionality on smartphones/tablets
- FR18: Booking confirmation system sends immediate acknowledgment with quote details

### Non Functional

- NFR1: Page load times must remain under 2 seconds on mobile connections
- NFR2: Lighthouse performance score must achieve 90+ across all categories
- NFR3: WCAG 2.1 AA accessibility compliance for all interactive elements
- NFR4: Mobile-first responsive design supporting viewport widths 320px-2560px
- NFR5: Form completion tracking and conversion analytics integration
- NFR6: Supabase database queries must complete within 500ms for booking operations
- NFR7: Real-time features must handle 100+ concurrent booking sessions
- NFR8: Multi-language content must load without layout shift or flash
- NFR9: WhatsApp integration must fail gracefully if service unavailable
- NFR10: Component architecture must support A/B testing of booking flows
- NFR11: SEO optimization for Dutch catering and Amsterdam/Rotterdam market keywords
- NFR12: Data persistence must maintain booking data integrity during network interruptions

## User Interface Design Goals

### Overall UX Vision

Create a sophisticated, trustworthy catering platform that immediately communicates premium quality while maintaining the warmth and authenticity of Dutch hospitality. The interface should feel both professional enough for corporate executives and welcoming enough for families celebrating milestones. Every interaction should reinforce confidence in Wesley's expertise and reliability.

### Key Interaction Paradigms

- **Immediate Accessibility**: Floating booking widget ensures booking is always one click away
- **Progressive Disclosure**: Information reveals complexity gradually, starting with simple date/guest count
- **Transparent Pricing**: All costs visible upfront, no hidden fees or quote-required barriers
- **Trust-First Design**: Social proof, certifications, and supplier partnerships prominently featured
- **Conversational Flow**: Booking process feels like discussing event needs with a professional caterer
- **Mobile-Native Experience**: Touch-first interactions optimized for smartphone usage

### Core Screens and Views

- **Enhanced Landing Page**: Hero with floating booking widget, services overview, trust signals
- **Floating Booking Widget**: Persistent overlay with date/time/guest selection and instant quotes
- **Service Detail Pages**: Comprehensive pricing, menu options, and customization capabilities
- **Supplier Showcase Page**: Local artisanal partnerships with heritage stories and quality focus
- **Testimonials & Awards Section**: Professional credibility through client reviews and recognition
- **Quote Confirmation Page**: Detailed booking summary with next steps and contact information
- **Mobile-Optimized Navigation**: Collapsible menu with prominent contact and booking access

### Accessibility: WCAG 2.1 AA

Full accessibility compliance including keyboard navigation, screen reader support, color contrast ratios, focus indicators, and semantic HTML structure. All interactive elements must be accessible via keyboard and assistive technologies.

### Branding

- **Sophisticated Color Palette**: sopranos-gold (#CC5D00), elegant-cream (#FFEFDA), sophisticated-green (#2B4040)
- **Typography Hierarchy**: Baskerville serif for headers (elegance), Open Sans for body (readability)
- **Dutch Heritage Elements**: Subtle integration of traditional craftsmanship imagery and language
- **Professional Photography**: High-quality food and event imagery showcasing quality and presentation
- **Trust Visual Language**: Awards, certifications, and supplier logos prominently featured

### Target Device and Platforms

Web responsive design optimized for mobile-first experience. Primary targets: iPhone/Android smartphones (320px-428px), tablets (768px-1024px), desktop (1280px+). Progressive Web App capabilities for enhanced mobile experience.

## Technical Assumptions

### Repository Structure: Monorepo

Maintain existing monorepo structure with clear component organization. New features integrate into current architecture without major restructuring.

### Service Architecture

**Enhanced Monolith with Supabase Integration**: Build upon existing React/Supabase foundation with new components and enhanced database schema. Maintain current JAMstack approach with API-driven backend operations.

### Testing Requirements

- **Unit Testing**: Jest/React Testing Library for component logic and user interactions
- **Integration Testing**: Supabase operations and booking flow end-to-end functionality
- **Performance Testing**: Lighthouse CI for automated performance monitoring
- **Accessibility Testing**: Automated a11y testing integrated into development workflow
- **Manual Testing**: User acceptance testing for booking flows and mobile experience

### Additional Technical Assumptions and Requests

- **WhatsApp Business API**: Integration for immediate customer communication
- **PDF Generation**: Library selection for downloadable menus and quotes (react-pdf or similar)
- **Real-time Updates**: Leverage Supabase real-time capabilities for availability checking
- **Analytics Integration**: Google Analytics 4 enhanced e-commerce tracking for conversion monitoring
- **Performance Monitoring**: Implement Core Web Vitals tracking for ongoing optimization
- **Internationalization**: React i18n for Dutch/English content management
- **Form Validation**: Enhanced Zod schemas for booking and contact forms
- **Image Optimization**: Implement next-gen image formats and lazy loading
- **Progressive Enhancement**: Ensure core booking functionality works with JavaScript disabled

## Epics

1. **Epic 1 - Enhanced Booking Foundation**: Establish floating booking widget and enhanced date/time selection
2. **Epic 2 - Transparent Pricing & Services**: Implement per-person pricing display and service enhancement
3. **Epic 3 - Professional Trust Signals**: Build awards, testimonials, and supplier partnership showcase
4. **Epic 4 - Communication & Integration**: Enable WhatsApp integration and multi-language support

## Epic 1 - Enhanced Booking Foundation

Establish the core booking experience that positions Wesley's Ambacht as a professional, accessible catering service. This epic delivers the fundamental infrastructure for improved conversion rates through streamlined booking access and enhanced date/time selection capabilities.

### Story 1.1 - Floating Booking Widget Implementation

As a potential catering client,
I want to access booking functionality from any page on the website,
so that I can immediately check availability when I'm ready to make a decision.

#### Acceptance Criteria

- 1.1.1: Floating "Check Your Date" button appears in bottom-right corner on all pages
- 1.1.2: Button maintains consistent styling with sopranos-gold color scheme
- 1.1.3: Widget is responsive and repositions appropriately on mobile devices
- 1.1.4: Click/tap opens booking modal overlay without page navigation
- 1.1.5: Widget includes subtle animation to draw attention without being intrusive
- 1.1.6: Widget automatically hides on scroll down, shows on scroll up (mobile optimization)
- 1.1.7: Accessibility: Widget is keyboard accessible and screen reader compatible

### Story 1.2 - Enhanced DateChecker Modal

As a potential client checking catering availability,
I want to select specific dates and times with immediate feedback,
so that I can quickly understand if my preferred event timing is possible.

#### Acceptance Criteria

- 1.2.1: Modal opens with calendar component for date selection
- 1.2.2: Time slot selection offers 11 one-hour options from 10:00 to 20:00
- 1.2.3: Guest count input with stepper controls (minimum 10, maximum 500)
- 1.2.4: Real-time availability checking queries Supabase booking database
- 1.2.5: Visual feedback shows available/unavailable dates with color coding
- 1.2.6: Selected date/time/guest count displays prominently in modal header
- 1.2.7: "Check Availability" button enables only when all fields completed
- 1.2.8: Error states handle network failures gracefully with retry options
- 1.2.9: Mobile optimization maintains functionality on smaller screens

### Story 1.3 - Preliminary Quote Calculator

As a client exploring catering options,
I want to see estimated pricing based on my event requirements,
so that I can determine if the service fits within my budget before contacting.

#### Acceptance Criteria

- 1.3.1: Guest count automatically calculates base pricing for selected service type
- 1.3.2: Pricing displays as "Starting from €X per person" format
- 1.3.3: Service type selector offers Corporate (€12.50), Social (€27.50), Wedding (€22.50), Custom (quote)
- 1.3.4: Total estimated cost calculation displays prominently
- 1.3.5: Disclaimer text explains pricing is preliminary and subject to customization
- 1.3.6: "Get Detailed Quote" button captures current selections and opens contact form
- 1.3.7: Pricing updates dynamically as user modifies guest count or service type
- 1.3.8: Error handling for invalid inputs with clear user feedback

### Story 1.4 - Booking Database Schema Enhancement

As the system,
I need enhanced database structure to support real-time availability and booking management,
so that accurate availability information can be provided to clients.

#### Acceptance Criteria

- 1.4.1: Create `bookings` table with date, time, guest_count, service_type, status fields
- 1.4.2: Implement `availability_slots` table for managing time slot availability
- 1.4.3: Create `quotes` table for storing preliminary quote information
- 1.4.4: Add indexes for efficient date/time range queries
- 1.4.5: Implement real-time subscription capability for availability updates
- 1.4.6: Create database functions for availability checking logic
- 1.4.7: Add RLS policies for data security and client privacy
- 1.4.8: Database migration scripts for deploying schema changes

## Epic 2 - Transparent Pricing & Services

Transform service presentation to build customer confidence through transparent pricing and professional service descriptions. This epic establishes Wesley's Ambacht as a premium service provider with clear value propositions.

### Story 2.1 - Service Pricing Cards Enhancement

As a potential client evaluating catering options,
I want to see clear per-person pricing for different service levels,
so that I can make informed decisions about which option fits my needs and budget.

#### Acceptance Criteria

- 2.1.1: Corporate Events card displays "From €12.50 per person" prominently
- 2.1.2: Social Events card shows "From €27.50 per person" with service highlights
- 2.1.3: Wedding Services card presents "From €22.50 per person" with luxury positioning
- 2.1.4: Custom Services card offers "On Request" with consultation booking
- 2.1.5: Each card includes service description, included items, and add-on options
- 2.1.6: Hover effects reveal additional pricing tiers and customization options
- 2.1.7: "Book This Service" buttons connect directly to booking widget with service pre-selected
- 2.1.8: Mobile-optimized card layout maintains readability and functionality

### Story 2.2 - Tiered Service Options

As a client with specific catering needs,
I want to see different service levels within each category,
so that I can choose the appropriate level of service for my event.

#### Acceptance Criteria

- 2.2.1: Each service category offers 3 tiers: Essential, Premium, Luxury
- 2.2.2: Essential tier displays basic service with clear inclusions
- 2.2.3: Premium tier highlights enhanced options with value additions
- 2.2.4: Luxury tier showcases full-service experience with premium elements
- 2.2.5: Tier comparison shows incremental value and pricing differences
- 2.2.6: Interactive tier selector updates pricing calculator in real-time
- 2.2.7: Add-on services display with individual pricing and descriptions
- 2.2.8: Station upgrades (chef stations) show additional fees and requirements

### Story 2.3 - Interactive Menu System

As a client planning an event,
I want to explore menu options and dietary accommodations,
so that I can ensure the catering meets my guests' needs and preferences.

#### Acceptance Criteria

- 2.3.1: Menu categories organize by event type and dietary requirements
- 2.3.2: Dietary filter options include vegetarian, vegan, gluten-free, halal
- 2.3.3: Seasonal menu highlights showcase current specialties and availability
- 2.3.4: Menu item descriptions include ingredients and allergen information
- 2.3.5: PDF download functionality generates printable menu with pricing
- 2.3.6: Custom menu request form captures specific dietary needs and preferences
- 2.3.7: Visual menu presentation with professional food photography
- 2.3.8: Mobile-optimized menu browsing with touch-friendly interactions

### Story 2.4 - Seasonal Specials Section

As a client interested in current offerings,
I want to see seasonal menu highlights and promotional packages,
so that I can take advantage of special offerings and seasonal ingredients.

#### Acceptance Criteria

- 2.4.1: Seasonal specials prominently featured on homepage below hero section
- 2.4.2: Current season highlighting (Spring, Summer, Fall, Winter) with appropriate imagery
- 2.4.3: Special pricing or package deals clearly displayed with savings calculations
- 2.4.4: Limited-time offers with expiration dates and availability windows
- 2.4.5: Seasonal ingredient highlighting with local supplier attribution
- 2.4.6: "Book Seasonal Special" CTA connects to booking widget with pre-filled selections
- 2.4.7: Admin capability to update seasonal content without code deployment
- 2.4.8: Mobile-responsive seasonal showcase with engaging visual presentation

## Epic 3 - Professional Trust Signals

Establish Wesley's Ambacht as a credible, professional catering service through awards, testimonials, and supplier partnerships. This epic builds the confidence and trust necessary for premium market positioning.

### Story 3.1 - Awards and Certifications Section

As a potential corporate client,
I want to see professional credentials and industry recognition,
so that I can feel confident choosing Wesley's Ambacht for important business events.

#### Acceptance Criteria

- 3.1.1: Awards section displays professional certifications and industry recognition
- 3.1.2: Quality assurance badges (food safety, organic certification, etc.) prominently shown
- 3.1.3: Industry association memberships with official logos and links
- 3.1.4: Years of experience highlighting ("Serving Netherlands since 1989")
- 3.1.5: Professional photography showcasing Wesley and team in action
- 3.1.6: Achievement statistics (500+ events, 98% satisfaction, etc.) with visual impact
- 3.1.7: Responsive layout maintains visual hierarchy across device sizes
- 3.1.8: Trust signals integrated naturally into overall page design

### Story 3.2 - Enhanced Testimonials Carousel

As a potential client researching caterers,
I want to read detailed reviews from previous clients,
so that I can understand the quality and reliability of the service.

#### Acceptance Criteria

- 3.2.1: Testimonials carousel with auto-rotation every 5 seconds
- 3.2.2: Client testimonials include company names and event details for authenticity
- 3.2.3: 5-star rating display with elegant star icons and overall score
- 3.2.4: Professional client photos or company logos where available
- 3.2.5: Testimonial categories (Corporate, Wedding, Social) with filtering options
- 3.2.6: Navigation arrows and dot indicators for manual testimonial browsing
- 3.2.7: Social proof statistics display (total reviews, average rating, recommendation rate)
- 3.2.8: Mobile-optimized carousel with touch gesture support

### Story 3.3 - Local Supplier Partnership Showcase

As a quality-conscious client,
I want to understand the sourcing and ingredient quality,
so that I can feel confident about the food quality and sustainability practices.

#### Acceptance Criteria

- 3.3.1: Four featured supplier partnership cards with heritage stories
- 3.3.2: Kaasboerderij van Schaik (artisanal cheese, since 1954) with specialties
- 3.3.3: Bakkerij van Harberden (traditional bakery, since 1923) with location
- 3.3.4: Vishandel Sperling (sustainable fish, since 1967) with quality focus
- 3.3.5: Biologische Hoeve Zonneveld (organic farm, since 1989) with values
- 3.3.6: Values section highlighting Sustainability, Quality, and Local focus
- 3.3.7: Supplier stories with authentic photography and heritage messaging
- 3.3.8: Interactive elements revealing additional supplier information and certifications

### Story 3.4 - Professional Contact Enhancement

As a client ready to make a booking,
I want multiple convenient ways to contact Wesley's Ambacht,
so that I can choose my preferred communication method and get immediate assistance.

#### Acceptance Criteria

- 3.4.1: Prominent phone number display in navigation (memorable format like 1-800-WE-CATER)
- 3.4.2: WhatsApp Business integration with floating chat widget
- 3.4.3: Business hours display with current availability status
- 3.4.4: Emergency catering contact option for urgent requests
- 3.4.5: Contact form with event type categorization and priority handling
- 3.4.6: Automatic response acknowledgment with expected reply timeframe
- 3.4.7: Multiple contact methods (phone, WhatsApp, email, form) clearly presented
- 3.4.8: Mobile-optimized contact experience with native app integration

## Epic 4 - Communication & Integration

Enable professional communication capabilities and multi-language support to serve diverse clientele and provide immediate customer assistance. This epic completes the professional platform transformation.

### Story 4.1 - WhatsApp Business Integration

As a client with immediate questions or urgent catering needs,
I want to communicate directly with Wesley's Ambacht through WhatsApp,
so that I can get quick responses and discuss my requirements conversationally.

#### Acceptance Criteria

- 4.1.1: WhatsApp Business API integration with official business account
- 4.1.2: Floating WhatsApp chat button with branded messaging
- 4.1.3: Automated welcome message introducing Wesley's services
- 4.1.4: Business hours messaging with expected response times
- 4.1.5: Quick action buttons for common inquiries (pricing, availability, menus)
- 4.1.6: Chat history preservation for ongoing client relationships
- 4.1.7: Fallback to email form if WhatsApp unavailable
- 4.1.8: Analytics tracking for WhatsApp engagement and conversion rates

### Story 4.2 - Multi-Language Support System

As an international client or English-speaking expat,
I want to browse and book catering services in English,
so that I can fully understand the offerings and complete my booking confidently.

#### Acceptance Criteria

- 4.2.1: Language toggle with Netherlands and UK flag icons in navigation
- 4.2.2: Dutch content uses formal tone (u/uw) appropriate for business context
- 4.2.3: English translation maintains professional catering industry terminology
- 4.2.4: Content switching preserves current page and form state
- 4.2.5: Language preference stored in localStorage for session persistence
- 4.2.6: All interactive elements (forms, buttons, modals) fully translated
- 4.2.7: Pricing displays in Euros with appropriate currency formatting
- 4.2.8: SEO optimization for both Dutch and English search terms

### Story 4.3 - Enhanced Analytics and Conversion Tracking

As Wesley (business owner),
I need detailed insights into website performance and booking conversions,
so that I can optimize the platform and understand customer behavior patterns.

#### Acceptance Criteria

- 4.3.1: Google Analytics 4 integration with enhanced e-commerce tracking
- 4.3.2: Conversion funnel tracking (visit → service view → booking start → completion)
- 4.3.3: Event tracking for floating widget usage and engagement
- 4.3.4: A/B testing capability for booking flow optimization
- 4.3.5: Performance monitoring with Core Web Vitals tracking
- 4.3.6: Mobile vs desktop usage analytics with conversion rate comparison
- 4.3.7: Service popularity metrics to inform menu and pricing decisions
- 4.3.8: Customer journey mapping from first visit to booking completion

### Story 4.4 - Performance Optimization and PWA Features

As a mobile user browsing catering options,
I want fast loading times and offline capability,
so that I can explore services and save bookings even with poor connectivity.

#### Acceptance Criteria

- 4.4.1: Progressive Web App manifest for mobile installation
- 4.4.2: Service worker implementation for offline content access
- 4.4.3: Image optimization with next-gen formats (WebP, AVIF)
- 4.4.4: Lazy loading for images and non-critical components
- 4.4.5: Critical CSS inlining for above-the-fold content
- 4.4.6: Resource preloading for booking flow components
- 4.4.7: Lighthouse score optimization targeting 90+ across all categories
- 4.4.8: Performance monitoring with automated alerts for degradation

## Checklist Results Report

*This section will be populated after PM checklist execution.*

## Next Steps

### Design Architect Prompt

"Based on the Wesley's Ambacht Sopranos Enhancement PRD, please create a comprehensive UI/UX design specification. Focus on the floating booking widget interaction patterns, service pricing card layouts, trust signal presentation, and mobile-first responsive design. Incorporate the sophisticated color palette (sopranos-gold, elegant-cream, sophisticated-green) and typography hierarchy (Baskerville/Open Sans). Ensure designs support WCAG 2.1 AA accessibility requirements and optimize for conversion rate improvements."

### Architect Prompt

"Review the Wesley's Ambacht Sopranos Enhancement PRD and create the technical architecture specification. Design the enhanced Supabase database schema for booking management, real-time availability checking, and quote generation. Plan the React component architecture for the floating booking widget, enhanced service cards, and trust signal components. Specify API integrations for WhatsApp Business and analytics tracking. Ensure architecture supports the performance requirements (sub-2-second load times, 90+ Lighthouse score) and scalability for 100+ concurrent booking sessions."