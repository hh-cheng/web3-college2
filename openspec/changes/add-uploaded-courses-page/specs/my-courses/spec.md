## MODIFIED Requirements

### Requirement: My Courses Page Layout
The my-courses page SHALL provide a layout with tab-based navigation between "Bought", "Upload", and "Uploaded" sections, and SHALL redirect users from the base route to the default "Bought" section.

#### Scenario: Redirect to default section
- **WHEN** a user navigates to "/my-courses"
- **THEN** the application redirects to "/my-courses/bought"
- **AND** the user sees the Bought courses page

#### Scenario: Display tab navigation
- **WHEN** a user views any page under "/my-courses"
- **THEN** the layout displays tab navigation with "Bought", "Upload", and "Uploaded" tabs
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

#### Scenario: Navigate to uploaded section
- **WHEN** a user clicks the "Uploaded" tab
- **THEN** the application navigates to "/my-courses/uploaded"
- **AND** the Uploaded tab shows an active state indicator
- **AND** the Uploaded courses page content is displayed

#### Scenario: Active tab reflects route
- **WHEN** a user directly accesses "/my-courses/bought" via URL
- **THEN** the Bought tab is highlighted as active
- **WHEN** a user directly accesses "/my-courses/upload" via URL
- **THEN** the Upload tab is highlighted as active
- **WHEN** a user directly accesses "/my-courses/uploaded" via URL
- **THEN** the Uploaded tab is highlighted as active

## ADDED Requirements

### Requirement: Uploaded Courses Display
The system SHALL provide a page that displays courses uploaded by the authenticated user, filtered by the user's wallet address and current chain ID.

#### Scenario: Display uploaded courses
- **WHEN** a user navigates to "/my-courses/uploaded"
- **AND** the user has a connected wallet
- **THEN** the system fetches courses where `creator_address` matches the user's wallet address
- **AND** the system filters courses by the user's current `chain_id`
- **AND** the system displays courses in a grid layout
- **AND** each course card displays:
  - Course cover image (if available)
  - Course title
  - Course price
  - Creation date

#### Scenario: Empty state for no uploaded courses
- **WHEN** a user navigates to "/my-courses/uploaded"
- **AND** the user has a connected wallet
- **AND** the user has not uploaded any courses
- **THEN** the system displays an empty state message indicating no uploaded courses
- **AND** the empty state suggests uploading a course via the Upload tab

#### Scenario: Wallet connection required
- **WHEN** a user navigates to "/my-courses/uploaded"
- **AND** the user does not have a connected wallet
- **THEN** the system displays a message prompting the user to connect their wallet
- **AND** the system provides a button to connect the wallet

#### Scenario: Loading state
- **WHEN** a user navigates to "/my-courses/uploaded"
- **AND** the system is fetching course data
- **THEN** the system displays a loading indicator
- **AND** course cards are not displayed until data is loaded

#### Scenario: Error handling
- **WHEN** a user navigates to "/my-courses/uploaded"
- **AND** an error occurs while fetching courses
- **THEN** the system displays an error message
- **AND** the system provides an option to retry the request

### Requirement: Uploaded Courses Data Fetching
The system SHALL provide a server action that retrieves courses created by a specific wallet address, filtered by chain ID.

#### Scenario: Fetch courses by creator
- **WHEN** the `getUploadedCourses` server action is called with a wallet address and chain ID
- **THEN** the system queries the database for courses where `creator_address` matches the provided address
- **AND** the system filters results where `chain_id` matches the provided chain ID
- **AND** the system orders results by `created_at` descending (newest first)
- **AND** the system returns course data including: id, title, price, cover_key, created_at, course_onchain_id

#### Scenario: No courses found
- **WHEN** the `getUploadedCourses` server action is called
- **AND** no courses exist for the provided creator address and chain ID
- **THEN** the system returns an empty array
- **AND** the response indicates success with empty data

#### Scenario: Database error handling
- **WHEN** the `getUploadedCourses` server action encounters a database error
- **THEN** the system returns an error response
- **AND** the error message is included in the response
- **AND** no partial data is returned

