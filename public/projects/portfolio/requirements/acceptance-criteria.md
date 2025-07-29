# Acceptance Criteria

**Project:** Ayomikun Festus-Olaleye Portfolio
**Version:** 1.0.0
**Date:** 2026-06-28
**Format:** Given / When / Then

---

## FR-001 - Name, Title, Location on Home

**Given** a visitor loads the portfolio
**When** the Home section is visible
**Then** the visitor shall see "Ayomikun Festus-Olaleye", the role title, and the location badge displayed above the fold.

## FR-002 - Get in Touch CTA

**Given** a visitor is on any section
**When** they click "Get in touch"
**Then** the page shall smooth-scroll to the Contact section within 700 ms.

## FR-004 - Download CV

**Given** a visitor clicks the "Download CV" button
**When** the browser processes the click
**Then** the browser shall download `Resume.pdf` without navigating away from the page.

## FR-015 - Contact Form Fields

**Given** a visitor navigates to the Contact section
**When** the Contact section is rendered
**Then** the form shall display input fields for: Name, Email, Subject, and Message, each with a visible label and placeholder text.

## FR-016 - Form Submission with Toast

**Given** a visitor fills in all required fields with valid values
**When** they click the "Send" button
**Then** the system shall call EmailJS with the provided data, and on success display a green success toast notification.

**Given** EmailJS returns an error
**When** the send attempt completes
**Then** the system shall display a red error toast notification.

## FR-017 - Form Reset After Success

**Given** the EmailJS send call succeeds
**When** the success toast is displayed
**Then** all four form fields shall be cleared to empty strings.

## FR-018 - Disabled Button During Send

**Given** a visitor clicks "Send" and the form is being submitted
**When** the EmailJS promise is pending
**Then** the submit button shall be disabled and display a loading icon, preventing duplicate submissions.

## FR-019 - Theme Persistence

**Given** a visitor toggles the theme to "light"
**When** they close and reopen the browser tab
**Then** the portfolio shall load in light mode without requiring another toggle.

**Given** a first-time visitor's OS is set to dark mode
**When** they load the portfolio for the first time
**Then** the portfolio shall load in dark mode automatically.

## FR-020 - Language Switch and Persistence

**Given** a visitor opens the language picker and selects "Deutsch"
**When** the selection is confirmed
**Then** all translatable text throughout the portfolio shall update to German within the same page load.

**Given** a visitor has previously selected "Français"
**When** they return to the portfolio in a new session
**Then** the portfolio shall load in French without requiring re-selection.

## NFR-002 - Mobile Navigation

**Given** a visitor is using a viewport narrower than 1024 px
**When** they tap the hamburger icon in the top navigation bar
**Then** a drawer shall open displaying links to all 6 sections, and tapping any link shall smooth-scroll to that section and close the drawer.
