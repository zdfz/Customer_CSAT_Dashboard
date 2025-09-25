# Requirements Document

## Introduction

This document outlines the requirements for a single-page HTML customer satisfaction dashboard for Starlinks. The dashboard will connect to Google Sheets API to display real-time customer survey data across four main sections: CSAT Summary, Customer Status, Completed Surveys, and Account Manager Performance. The application will be built as a static HTML file with minimal JavaScript, using the Starlinks design system with Euclid Circular B font and specified color palette.

## Requirements

### Requirement 1: Dashboard Structure and Navigation

**User Story:** As a Starlinks manager, I want a responsive single-page dashboard with tab navigation, so that I can easily switch between different views of customer satisfaction data without page reloads.

#### Acceptance Criteria

1. WHEN the dashboard loads THEN the system SHALL display a header with logo and four navigation tabs (CSAT Summary, Customer Status, Completed Surveys, Account Manager Performance)
2. WHEN a user clicks on a navigation tab THEN the system SHALL switch to that section without page reload and SHALL store the active tab in sessionStorage
3. WHEN switching tabs THEN the system SHALL apply smooth scrolling to the top and SHALL highlight the active tab using design system styling
4. WHEN viewed on mobile devices THEN the system SHALL stack content vertically and SHALL maintain responsive design principles
5. IF the page is refreshed THEN the system SHALL restore the previously active tab from sessionStorage

### Requirement 2: Google Sheets API Integration

**User Story:** As a dashboard user, I want real-time data from our Google Sheets survey responses, so that I can see up-to-date customer satisfaction metrics.

#### Acceptance Criteria

1. WHEN the dashboard loads THEN the system SHALL authenticate with Google Sheets API using service account credentials
2. WHEN fetching data THEN the system SHALL read from a Google Sheet containing columns: company name, service type, overall satisfaction rating, NPS score, last-mile satisfaction, reverse delivery satisfaction, fulfillment satisfaction, account manager name, communication clarity, responsiveness, problem resolution, customization ability, systems satisfaction, IT support satisfaction, suggestions, and submission date
3. WHEN data is successfully retrieved THEN the system SHALL cache the response for 30 seconds to minimize API calls
4. WHEN 30 seconds have elapsed THEN the system SHALL automatically refresh data intelligently without causing UI flickering
5. IF API request fails THEN the system SHALL display user-friendly error messages and SHALL retry after 60 seconds

### Requirement 3: CSAT Summary Page

**User Story:** As a manager, I want to see key satisfaction metrics at a glance, so that I can quickly assess overall customer satisfaction performance.

#### Acceptance Criteria

1. WHEN viewing CSAT Summary THEN the system SHALL display total surveys completed (count of rows with submission dates)
2. WHEN calculating metrics THEN the system SHALL show total surveys pending, progress percentage, and satisfied customers percentage (ratings 4-5)
3. WHEN displaying product type breakdown THEN the system SHALL show separate metric cards for "Last Mile Only", "Fulfillment Only", and "Last Mile & Fulfillment"
4. WHEN showing positive metrics THEN the system SHALL use primary color palette
5. WHEN showing attention-requiring data THEN the system SHALL use secondary orange color
6. WHEN metrics load THEN the system SHALL animate counting from 0 to final value
7. WHEN data is loading THEN the system SHALL display skeleton loading animation with shimmer effect

### Requirement 4: Customer Status Page

**User Story:** As an account manager, I want to see which customers have completed surveys and which are pending, so that I can follow up appropriately.

#### Acceptance Criteria

1. WHEN viewing Customer Status THEN the system SHALL display two separate tables: completed surveys and pending surveys
2. WHEN showing completed surveys THEN the system SHALL include columns for customer name, account manager, and completion date
3. WHEN showing pending surveys THEN the system SHALL include columns for customer name and assigned account manager only
4. WHEN displaying tables THEN the system SHALL use alternating row colors with primary-surface background and primary-border for borders
5. WHEN a customer name is clicked THEN the system SHALL navigate to the detailed survey view in Page 3
6. WHEN sorting completed surveys THEN the system SHALL order by most recent completion date
7. WHEN sorting pending surveys THEN the system SHALL order alphabetically by customer name

### Requirement 5: Completed Surveys Page

**User Story:** As a manager, I want to see detailed survey responses for each customer, so that I can understand specific feedback and satisfaction levels.

#### Acceptance Criteria

1. WHEN viewing Completed Surveys THEN the system SHALL display each customer as a collapsible accordion card
2. WHEN showing card headers THEN the system SHALL include customer name, completion date, and overall satisfaction score
3. WHEN a card is clicked THEN the system SHALL expand to reveal all survey questions and corresponding answers with smooth CSS transitions
4. WHEN displaying satisfaction ratings THEN the system SHALL use color-coded indicators: green for ratings 4-5, orange for ratings 2-3, red for ratings 1
5. WHEN showing expanded content THEN the system SHALL maintain visual hierarchy using the typography system
6. WHEN cards are collapsed THEN the system SHALL use progressive disclosure principles

### Requirement 6: Account Manager Performance Page

**User Story:** As a senior manager, I want to see performance metrics for each account manager, so that I can evaluate team performance and identify areas for improvement.

#### Acceptance Criteria

1. WHEN viewing Account Manager Performance THEN the system SHALL display three performance cards for Abdullah Ahmed, Ibrahim Fadaly, and Ahmed Salem
2. WHEN showing manager metrics THEN the system SHALL include manager name, completed surveys count, pending surveys count, completion percentage, and satisfied customers percentage
3. WHEN displaying progress bars THEN the system SHALL use primary-main color for filled portion and primary-border for background
4. WHEN calculating satisfied customers THEN the system SHALL count ratings of 4-5 for surveys assigned to each manager
5. WHEN managers are not found in data THEN the system SHALL dynamically detect account managers from the survey data
6. WHEN progress bars load THEN the system SHALL use CSS-only implementation without JavaScript animation

### Requirement 7: Design System Implementation

**User Story:** As a user, I want a consistent and professional interface, so that the dashboard aligns with Starlinks branding and is easy to use.

#### Acceptance Criteria

1. WHEN styling the application THEN the system SHALL use Euclid Circular B font throughout
2. WHEN applying colors THEN the system SHALL use the specified CSS custom properties for primary and secondary color palettes
3. WHEN laying out content THEN the system SHALL use CSS Grid with F-pattern optimization
4. WHEN creating interactive elements THEN the system SHALL include proper focus indicators and keyboard navigation support
5. WHEN displaying metric cards THEN the system SHALL use consistent card styling from the design system
6. WHEN showing loading states THEN the system SHALL implement skeleton loading with shimmer effect

### Requirement 8: Technical Performance and Accessibility

**User Story:** As any user, I want the dashboard to load quickly and be accessible, so that I can efficiently access the information regardless of my technical setup or abilities.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL work as a single static HTML file with embedded CSS and JavaScript
2. WHEN processing data THEN the system SHALL calculate all metrics client-side after retrieving raw survey data
3. WHEN implementing interactions THEN the system SHALL meet accessibility requirements with ARIA labels and keyboard navigation
4. WHEN displaying content THEN the system SHALL be compatible with modern browsers without requiring additional dependencies
5. WHEN handling errors THEN the system SHALL provide clear user feedback and graceful degradation

### Requirement 9: Data Quality Notice Management

**User Story:** As a dashboard user, I want a clean interface without data quality warnings, so that I can focus on the actual metrics without distracting notifications.

#### Acceptance Criteria

1. WHEN data quality validation detects missing critical information THEN the system SHALL NOT display warning notifications to users
2. WHEN processing survey data THEN the system SHALL continue to validate data quality internally for system reliability
3. WHEN displaying metrics THEN the system SHALL show available data without alerting users to missing fields
4. WHEN data has quality issues THEN the system SHALL handle them silently and display what data is available