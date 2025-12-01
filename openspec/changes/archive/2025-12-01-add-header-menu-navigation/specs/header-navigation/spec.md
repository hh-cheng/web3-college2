# Header Navigation Specification

## ADDED Requirements

### Requirement: Header Menu Navigation
The application SHALL provide a header menu component that displays navigation links to key pages (market, me, my-courses) using an animated pill-style navigation interface.

#### Scenario: Display navigation menu
- **WHEN** the user views any page
- **THEN** the header menu displays navigation pills for Market, Me, and My Courses pages
- **AND** the current page's navigation pill is highlighted with an active indicator

#### Scenario: Navigate to market page
- **WHEN** the user clicks the Market navigation pill
- **THEN** the application navigates to the `/market` page
- **AND** the Market pill shows an active state indicator

#### Scenario: Navigate to user profile page
- **WHEN** the user clicks the Me navigation pill
- **THEN** the application navigates to the `/me` page
- **AND** the Me pill shows an active state indicator

#### Scenario: Navigate to my courses page
- **WHEN** the user clicks the My Courses navigation pill
- **THEN** the application navigates to the `/my-courses` page
- **AND** the My Courses pill shows an active state indicator

#### Scenario: Responsive mobile menu
- **WHEN** the user views the application on a mobile device
- **THEN** the navigation pills are hidden
- **AND** a hamburger menu button is displayed
- **WHEN** the user clicks the hamburger menu button
- **THEN** a mobile menu dropdown appears with navigation links
- **WHEN** the user clicks a navigation link in the mobile menu
- **THEN** the application navigates to the selected page
- **AND** the mobile menu closes automatically

#### Scenario: Pill navigation hover animation
- **WHEN** the user hovers over a navigation pill
- **THEN** an animated circle expands from the bottom of the pill
- **AND** the pill text color changes to the hover color
- **AND** the animation uses smooth easing transitions

#### Scenario: Active route highlighting
- **WHEN** the user is on the `/market` page
- **THEN** the Market navigation pill displays an active indicator dot below it
- **WHEN** the user is on the `/me` page
- **THEN** the Me navigation pill displays an active indicator dot below it
- **WHEN** the user is on the `/my-courses` page
- **THEN** the My Courses navigation pill displays an active indicator dot below it

