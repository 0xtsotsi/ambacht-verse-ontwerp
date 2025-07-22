# Elegant Catering Design Variations Specification

## Project Context

Transform Wesley's Ambacht catering website using the Elegant Catering Design System (design.json) while preserving all existing functionality and layout structure. Generate 5 distinct design variations, each committed to its own git branch.

## Design System Foundation (from design.json)

### Core Design Tokens

- **Primary Accent**: Terracotta Orange (#E08A4F) for buttons and accents
- **Text Colors**: Dark Grey (#333333), White/Light Beige (#FFFFFF)
- **Navigation**: Dark Grey (#555555)
- **Background Overlay**: Semi-transparent Dark (rgba(0, 0, 0, 0.6))
- **Typography**: Sans-serif (Inter, Open Sans) for all text, elegant script for accents
- **Shapes**: Rounded corners, subtle shadows for depth
- **Style**: Modern Elegance, Clean, Professional, Refined, Warm, Inviting

### Design Principles

1. Generous padding and consistent margins
2. Rounded corners on buttons and panels
3. Subtle shadows for depth and separation
4. High-quality atmospheric background images
5. Semi-transparent overlays for text readability
6. Clear hover and active states on interactive elements

## 5 Design Variations to Generate

### Variation 1: "Classic Elegance"

**Branch**: `design-v1-classic-elegance`
**Theme**: Traditional interpretation with refined sophistication
**Key Characteristics**:

- Conservative application of terracotta accents
- Generous white space and classic proportions
- Elegant typography hierarchy with script accents
- Subtle shadows and professional warmth
- Traditional button styles with rounded corners
- Classic navigation with proper spacing

**Component Focus**:

- Navigation: Clean header with elegant logo positioning
- Hero: Classic overlay treatment with centered content
- Buttons: Traditional rounded style with terracotta background
- Services: Clean card layouts with subtle shadows
- Typography: Classical hierarchy with script elements

### Variation 2: "Modern Fusion"

**Branch**: `design-v2-modern-fusion`
**Theme**: Contemporary twist on elegant design language
**Key Characteristics**:

- Bold use of terracotta with modern geometries
- Dynamic button hover effects and transitions
- Contemporary spacing and layout rhythms
- Modern typography with strong visual hierarchy
- Sleek interactive elements
- Progressive enhancement approach

**Component Focus**:

- Navigation: Modern sticky header with smooth transitions
- Hero: Dynamic background treatments
- Buttons: Modern hover effects with elegant transitions
- Services: Contemporary card designs with bold accents
- Typography: Strong hierarchy with modern proportions

### Variation 3: "Organic Sophistication"

**Branch**: `design-v3-organic-sophistication`
**Theme**: Nature-inspired interpretation with soft elegance
**Key Characteristics**:

- Soft, organic rounded corners and flowing shapes
- Natural texture influences in backgrounds
- Warm, inviting atmosphere with earthy undertones
- Gentle animations and organic transitions
- Soft shadows mimicking natural lighting
- Flowing, comfortable spacing

**Component Focus**:

- Navigation: Flowing, organic header design
- Hero: Natural background treatments with organic overlays
- Buttons: Soft, pillowy button designs
- Services: Organic card shapes with natural shadows
- Typography: Flowing, comfortable text treatments

### Variation 4: "Minimalist Luxury"

**Branch**: `design-v4-minimalist-luxury`
**Theme**: High-end simplification with maximum impact
**Key Characteristics**:

- Clean, minimalist interpretation of design system
- Premium spacing with luxurious white space
- Simplified color palette with strategic terracotta usage
- Sophisticated typography with premium feel
- Minimal but impactful interactive elements
- Ultra-clean button and component designs

**Component Focus**:

- Navigation: Minimal, premium header design
- Hero: Clean, impactful presentation
- Buttons: Minimal luxury button styling
- Services: Clean, premium card layouts
- Typography: Sophisticated minimal hierarchy

### Variation 5: "Interactive Elegance"

**Branch**: `design-v5-interactive-elegance`
**Theme**: Enhanced interactivity with elegant animations
**Key Characteristics**:

- Rich hover states and micro-interactions
- Elegant glow effects on interactive elements
- Smooth page transitions and scrolling effects
- Dynamic visual feedback systems
- Advanced button hover animations
- Interactive elegance throughout

**Component Focus**:

- Navigation: Interactive header with hover effects
- Hero: Dynamic interactive elements
- Buttons: Rich hover animations and glow effects
- Services: Interactive cards with elegant transitions
- Typography: Dynamic text effects and treatments

## Implementation Constraints

### MUST PRESERVE (Absolutely No Changes)

- ✅ App.tsx routing structure
- ✅ Index.tsx component composition and layout
- ✅ All component functionality and state management
- ✅ Existing TypeScript interfaces and props
- ✅ Modal and widget behavior
- ✅ Form validation and submission logic
- ✅ All existing features and interactions

### ALLOWED CHANGES (Design Only)

- 🎨 Tailwind CSS classes in component files
- 🎨 Component styling and visual presentation
- 🎨 Color schemes using new design tokens
- 🎨 Typography classes and font families
- 🎨 Spacing, shadows, and border radius
- 🎨 Hover states and animations
- 🎨 Background treatments and overlays

## Components to Style (Preserve Structure)

### Primary Components

1. **Navigation.tsx** - Header styling with logo and navigation
2. **Hero.tsx** - Background overlays and typography hierarchy
3. **Button components** - Apply elegant rounded styling
4. **Services.tsx** - Card layouts with elegant shadows
5. **About.tsx** - Typography and spacing refinements
6. **Gallery.tsx** - Visual element treatments
7. **BookingForm.tsx** - Form styling with design consistency
8. **Footer.tsx** - Complete styling alignment

### UI Components (in components/ui/)

1. **button.tsx** - Core button styling with design system
2. **card.tsx** - Elegant card treatments
3. **dialog.tsx** - Modal styling consistency
4. **All other UI components** - Apply design system tokens

### Variation Components

1. **FloatingBookingWidget** - Apply variation-specific styling
2. **DateCheckerModal** - Elegant modal treatments
3. **Quote Calculator** - Form and interface styling

## Quality Standards

### Visual Requirements

- ✅ Matches design.json specifications
- ✅ Consistent application of design tokens
- ✅ Professional typography hierarchy
- ✅ Elegant hover and active states
- ✅ Responsive design across all devices
- ✅ WCAG accessibility compliance

### Technical Requirements

- ✅ All existing functionality preserved
- ✅ No breaking changes to component APIs
- ✅ Clean Tailwind class usage
- ✅ Optimized for performance
- ✅ Cross-browser compatibility

### Git Management

- ✅ Each variation on separate branch
- ✅ Clean commit messages with design rationale
- ✅ Branch naming convention followed
- ✅ No merge conflicts with main branch

## Implementation Instructions

For each variation:

1. **Create new git branch** with proper naming
2. **Apply design tokens** from Tailwind config
3. **Update component styling** preserving all structure
4. **Test functionality** to ensure nothing breaks
5. **Verify responsive design** across devices
6. **Commit changes** with descriptive messages
7. **Document design decisions** in commit messages

Each variation should feel distinct while maintaining the core elegant catering design language and professional quality standards.
