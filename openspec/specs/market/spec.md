# market Specification

## Purpose
The market page provides a marketplace where users can browse all available courses, purchase courses using YD Token, and access course videos for courses they own (either as creator or buyer). The page supports a two-step purchase flow: token approval followed by on-chain purchase via the CourseManager contract.
## Requirements
### Requirement: Course Ownership Detection
The market page SHALL determine whether a user owns each displayed course by checking if the user is either the course creator or has purchased the course.

#### Scenario: Check creator ownership
- **WHEN** the market page loads courses for a connected user
- **THEN** the system checks if the user's wallet address matches the `creator_address` for each course
- **AND** courses where the user is the creator are marked as owned

#### Scenario: Check buyer ownership
- **WHEN** the market page loads courses for a connected user
- **THEN** the system checks the Purchases table for purchases where `buyer_address` matches the user's wallet address
- **AND** courses where a purchase record exists are marked as owned
- **AND** the purchase check is filtered by `chain_id` to match the current chain

#### Scenario: Ownership status in course data
- **WHEN** courses are fetched for the market page
- **AND** a user wallet address is available
- **THEN** each course object includes an `isOwned` boolean property
- **AND** `isOwned` is `true` if the user is the creator or has purchased the course
- **AND** `isOwned` is `false` if the user is neither the creator nor a buyer

### Requirement: Conditional Action Buttons
The market page SHALL display different action buttons based on course ownership status.

#### Scenario: View button for owned courses
- **WHEN** a course is displayed on the market page
- **AND** the course is owned by the current user (creator or buyer)
- **THEN** the course card displays a "View" button
- **AND** the "View" button navigates to the course video viewing page

#### Scenario: Approve and Buy buttons for unowned courses
- **WHEN** a course is displayed on the market page
- **AND** the course is not owned by the current user
- **THEN** the course card displays an "Approve" button
- **AND** the course card displays a "Buy" button
- **AND** the "Buy" button is disabled until token approval is completed

#### Scenario: Button states during transactions
- **WHEN** a user clicks the "Approve" button
- **THEN** the "Approve" button shows a loading state
- **AND** the button is disabled during the transaction
- **WHEN** a user clicks the "Buy" button
- **THEN** the "Buy" button shows a loading state
- **AND** the button is disabled during the transaction

### Requirement: Token Approval Flow
The system SHALL allow users to approve YD Token spending for the CourseManager contract before purchasing courses.

#### Scenario: Approve token spending
- **WHEN** a user clicks the "Approve" button for an unowned course
- **AND** the user has a connected wallet
- **THEN** the system calls `YDToken.approve()` with the CourseManager contract address and course price
- **AND** the user is prompted to confirm the transaction in their wallet
- **WHEN** the approval transaction succeeds
- **THEN** the system displays a success message
- **AND** the "Buy" button becomes enabled

#### Scenario: Approval transaction failure
- **WHEN** a user attempts to approve token spending
- **AND** the transaction fails (user rejection, insufficient gas, etc.)
- **THEN** the system displays an error message
- **AND** the "Buy" button remains disabled
- **AND** the user can retry the approval

#### Scenario: Check existing allowance
- **WHEN** a course is displayed on the market page
- **AND** the user has already approved sufficient tokens for the course price
- **THEN** the "Buy" button is enabled without requiring approval
- **AND** the "Approve" button may be hidden or disabled

### Requirement: Course Purchase Flow
The system SHALL allow users to purchase courses through the CourseManager contract after token approval.

#### Scenario: Purchase course
- **WHEN** a user clicks the "Buy" button for an unowned course
- **AND** the user has approved sufficient YD Tokens
- **AND** the user has a connected wallet
- **THEN** the system calls `CourseManager.purchase()` with the course ID
- **AND** the user is prompted to confirm the transaction in their wallet
- **WHEN** the purchase transaction succeeds
- **THEN** the system creates a purchase record in the database
- **AND** the course ownership status updates to owned
- **AND** the "View" button replaces the "Approve" and "Buy" buttons
- **AND** the system displays a success message

#### Scenario: Purchase transaction failure
- **WHEN** a user attempts to purchase a course
- **AND** the transaction fails (user rejection, insufficient balance, etc.)
- **THEN** the system displays an error message
- **AND** the course ownership status remains unchanged
- **AND** the user can retry the purchase

#### Scenario: Purchase with insufficient allowance
- **WHEN** a user clicks the "Buy" button
- **AND** the user has not approved sufficient tokens
- **THEN** the system displays a message prompting the user to approve tokens first
- **AND** the purchase transaction is not initiated

### Requirement: Course Video Access
The system SHALL provide a route for users to view course videos for courses they own.

#### Scenario: Access video for owned course
- **WHEN** a user clicks the "View" button on a course they own
- **THEN** the system navigates to `/learn/[courseId]`
- **AND** the video viewing page verifies ownership
- **AND** if ownership is confirmed, the video player is displayed
- **AND** the video is loaded from the course's `key` via the course video API

#### Scenario: Access denied for unowned course
- **WHEN** a user attempts to access `/learn/[courseId]` for a course they don't own
- **THEN** the system displays an access denied message
- **AND** the video is not displayed
- **AND** the user is redirected or shown an error

#### Scenario: Video viewing page
- **WHEN** a user navigates to `/learn/[courseId]` for an owned course
- **THEN** the page displays the course title and metadata
- **AND** the page displays a video player with the course video
- **AND** the video player includes standard controls (play, pause, seek)
- **AND** the video is streamed from the course video API endpoint

