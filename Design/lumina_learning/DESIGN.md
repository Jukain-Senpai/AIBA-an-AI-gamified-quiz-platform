---
name: Lumina Learning
colors:
  surface: '#fcf8ff'
  surface-dim: '#dad7f3'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#efecff'
  surface-container-high: '#e8e5ff'
  surface-container-highest: '#e2e0fc'
  on-surface: '#1a1a2e'
  on-surface-variant: '#464555'
  inverse-surface: '#2f2e43'
  inverse-on-surface: '#f2efff'
  outline: '#777586'
  outline-variant: '#c8c4d8'
  surface-tint: '#5244de'
  primary: '#4231cf'
  on-primary: '#ffffff'
  primary-container: '#5b4fe8'
  on-primary-container: '#e8e4ff'
  inverse-primary: '#c4c0ff'
  secondary: '#7d5800'
  on-secondary: '#ffffff'
  secondary-container: '#ffb702'
  on-secondary-container: '#6b4b00'
  tertiary: '#005b42'
  on-tertiary: '#ffffff'
  tertiary-container: '#007657'
  on-tertiary-container: '#77ffcc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c0ff'
  on-primary-fixed: '#120068'
  on-primary-fixed-variant: '#3824c7'
  secondary-fixed: '#ffdea9'
  secondary-fixed-dim: '#ffba27'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4100'
  tertiary-fixed: '#54fdc4'
  tertiary-fixed-dim: '#27e0a9'
  on-tertiary-fixed: '#002116'
  on-tertiary-fixed-variant: '#00513b'
  background: '#fcf8ff'
  on-background: '#1a1a2e'
  surface-variant: '#e2e0fc'
typography:
  display-hero:
    fontFamily: Nunito Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Nunito Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.2'
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 24px
  container-padding-desktop: 40px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for an educational quiz platform that bridges the gap between structured learning and playful engagement. The brand personality is encouraging, vibrant, and approachable, catering to a broad demographic of students and lifelong learners. 

The aesthetic follows a **Modern Cartoonism** style—mixing the cleanliness of SaaS design with the high-energy visual cues of modern mobile gaming. It utilizes soft volumes, generous whitespace, and tactile elements to make learning feel low-stakes and rewarding. The UI avoids the sterility of traditional academic software in favor of a "bouncy," responsive interface that celebrates progress through color and motion.

## Colors

The color palette is built on a foundation of high-energy Indigo and Amber. 

- **Primary (Indigo):** Used for main actions, brand identity, and progress tracking.
- **Accent (Amber Gold):** Reserved for "celebration" moments, achievements, and high-priority call-to-outs.
- **Success & Danger:** Emerald and Coral provide immediate, high-contrast feedback during interactive quizzes.
- **Background & Surface:** A warm-white base (#FFFDF7) prevents eye strain, while the lavender-tinted surface (#F5F3FF) provides subtle depth for card-based content.

Avoid pure blacks; use the deep navy (#1A1A2E) for all text to maintain the soft, playful atmosphere.

## Typography

This design system uses a dual-font strategy to balance character with readability.

- **Headings & Labels:** Nunito Sans provides a friendly, rounded terminal that feels approachable. Use ExtraBold (800) for headers to create a "chunky," authoritative look that mirrors game UI.
- **Body Text:** Inter is utilized for long-form content, question descriptions, and technical data to ensure maximum legibility and a grounded, professional feel.

Keep line heights generous to ensure the interface feels airy and accessible for younger readers.

## Layout & Spacing

The layout philosophy follows a **Card-Based Fluid Grid**. Content is encapsulated in distinct containers to help users focus on one task at a time.

- **Grid:** A 12-column grid for desktop, a 4-column grid for mobile.
- **Padding:** Maintain a "generous air" policy. Horizontal container padding should never drop below 24px on mobile.
- **Stacking:** Elements within a card should use consistent vertical rhythm (8px for related items, 16px for distinct sections).
- **Interactive Areas:** Buttons and inputs should have a minimum height of 48px to remain "finger-friendly" for younger users on mobile devices.

## Elevation & Depth

Visual hierarchy is established using **Tonal Layers** and **Indigo-Tinted Shadows**. 

- **Shadows:** Avoid neutral gray shadows. Use a soft primary-tinted shadow (`rgba(91, 79, 232, 0.1)`) for cards to create a cohesive color story. Shadows should feel light and diffused, suggesting that elements are floating just above the warm-white background.
- **Interaction Depth:** Buttons should use a "faux-3D" effect where possible—a slightly darker bottom border or a subtle 2px downward shift on press—to mimic physical feedback.
- **Gradients:** Use linear gradients (Indigo to Purple) exclusively for "Hero" moments or level-up banners to denote high importance.

## Shapes

The shape language is defined by **pronounced roundness**, removing any "sharp" or intimidating edges from the learning experience.

- **Cards:** Use `rounded-xl` (1.5rem/24px) to create a soft, friendly frame for content.
- **Interactive Elements:** Buttons and input fields use a pill-shape (999px) or `rounded-lg` (1rem/16px) to appear inviting and tactile.
- **Icons:** Use filled, rounded icon sets. Avoid thin strokes; use thick, consistent weights that match the visual weight of the Nunito typeface.

## Components

- **Buttons:** Primary buttons are pill-shaped with bold Nunito SemiBold text. They utilize the Indigo-to-Purple gradient for "Start" actions and solid Amber for "Claim Reward" actions.
- **Cards:** All cards feature a 1px border (#E2E0F0) and the signature soft indigo shadow. Padding inside cards should be at least 24px.
- **Progress Bars:** Use a thick (12px+) height with a rounded track. The filler should be a vibrant Success Emerald or Primary Indigo, featuring a slight inner glow for a "liquid" feel.
- **Quiz Options:** Large, full-width selectable cards. When selected, the border should thicken to 3px in Primary Indigo with a Lavender light background.
- **Inputs:** Fields should have a light lavender background (#F5F3FF) instead of white to stand out against the main page background, with labels positioned clearly above the field in Nunito.
- **Chips:** Small, pill-shaped tags used for categories (e.g., "Math", "History"). These use a low-opacity version of the category color with high-contrast text.