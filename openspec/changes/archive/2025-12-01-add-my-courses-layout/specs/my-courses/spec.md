## ADDED Requirements
### Requirement: My Courses Page Layout
The my-courses page SHALL provide a layout with tab-based navigation between "Bought" and "Upload" sections, and SHALL redirect users from the base route to the default "Bought" section.

#### Scenario: Redirect to default section
- **WHEN** a user navigates to "/my-courses"
- **THEN** the application redirects to "/my-courses/bought"
- **AND** the user sees the Bought courses page

#### Scenario: Display tab navigation
- **WHEN** a user views any page under "/my-courses"
- **THEN** the layout displays tab navigation with "Bought" and "Upload" tabs
- **AND** the tab corresponding to the current route is highlighted as active

#### Scenario: Navigate to bought section
- **WHEN** a user clicks the "Bought" tab
- **THEN** the application navigates to "/my-courses/bought"
- **AND** the Bought tab shows an active state indicator
- **AND** the Bought courses page content is displayed

#### Scenario: Navigate to upload section
- **WHEN** a user clicks the "Upload" tab
- **THEN** the application navigates to "/my-courses/upload"
- **AND** the Upload tab shows an active state indicator
- **AND** the Upload courses page content is displayed

#### Scenario: Active tab reflects route
- **WHEN** a user directly accesses "/my-courses/bought" via URL
- **THEN** the Bought tab is highlighted as active
- **WHEN** a user directly accesses "/my-courses/upload" via URL
- **THEN** the Upload tab is highlighted as active

