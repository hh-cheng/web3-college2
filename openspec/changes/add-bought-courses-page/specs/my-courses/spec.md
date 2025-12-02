## ADDED Requirements

### Requirement: Bought Courses Display
The system SHALL provide a page that displays courses purchased by the authenticated user, filtered by the user's wallet address and current chain ID.

#### Scenario: Display bought courses
- **WHEN** a user navigates to "/my-courses/bought"
- **AND** the user has a connected wallet
- **THEN** the system fetches purchases where `buyer_address` matches the user's wallet address
- **AND** the system filters purchases by the user's current `chain_id`
- **AND** the system joins purchase data with course data to retrieve course details
- **AND** the system displays courses in a grid layout
- **AND** each course card displays:
  - Course cover image (if available)
  - Course title
  - Course price
  - Purchase date
  - Purchase transaction hash (optional, for reference)

#### Scenario: Empty state for no bought courses
- **WHEN** a user navigates to "/my-courses/bought"
- **AND** the user has a connected wallet
- **AND** the user has not purchased any courses
- **THEN** the system displays an empty state message indicating no purchased courses
- **AND** the empty state suggests browsing courses in the marketplace

#### Scenario: Wallet connection required
- **WHEN** a user navigates to "/my-courses/bought"
- **AND** the user does not have a connected wallet
- **THEN** the system displays a message prompting the user to connect their wallet
- **AND** the system provides a button to connect the wallet

#### Scenario: Loading state
- **WHEN** a user navigates to "/my-courses/bought"
- **AND** the system is fetching purchase data
- **THEN** the system displays a loading indicator
- **AND** course cards are not displayed until data is loaded

#### Scenario: Error handling
- **WHEN** a user navigates to "/my-courses/bought"
- **AND** an error occurs while fetching purchases
- **THEN** the system displays an error message
- **AND** the system provides an option to retry the request

### Requirement: Bought Courses Data Fetching
The system SHALL provide a server action that retrieves courses purchased by a specific wallet address, filtered by chain ID.

#### Scenario: Fetch courses by buyer
- **WHEN** the `getBoughtCourses` server action is called with a wallet address and chain ID
- **THEN** the system queries the Purchases table for purchases where `buyer_address` matches the provided address
- **AND** the system filters results where `chain_id` matches the provided chain ID
- **AND** the system joins Purchases with Courses table using `course_onchain_id`
- **AND** the system orders results by purchase `created_at` descending (newest first)
- **AND** the system returns course data including: id, title, price, cover_key, course_onchain_id, purchase date, transaction hash

#### Scenario: No purchases found
- **WHEN** the `getBoughtCourses` server action is called
- **AND** no purchases exist for the provided buyer address and chain ID
- **THEN** the system returns an empty array
- **AND** the response indicates success with empty data

#### Scenario: Database error handling
- **WHEN** the `getBoughtCourses` server action encounters a database error
- **THEN** the system returns an error response
- **AND** the error message is included in the response
- **AND** no partial data is returned

#### Scenario: Missing course data
- **WHEN** the `getBoughtCourses` server action finds a purchase
- **AND** the corresponding course does not exist in the Courses table
- **THEN** the system handles the missing course gracefully
- **AND** either excludes the purchase from results or displays it with limited information

