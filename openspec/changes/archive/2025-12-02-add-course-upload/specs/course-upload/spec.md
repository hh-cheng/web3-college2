## ADDED Requirements

### Requirement: Course Upload Form
The system SHALL provide a course upload form that allows authenticated users to submit course information including title, price, cover image, and video file.

#### Scenario: Display upload form
- **WHEN** a user navigates to "/my-courses/upload"
- **THEN** the system displays a form with fields for course title, price, cover image, and video file
- **AND** all fields are marked as required
- **AND** the form includes a submit button

#### Scenario: Cover image preview
- **WHEN** a user selects a cover image file
- **THEN** the system displays a preview of the selected image
- **AND** the preview appears before form submission

#### Scenario: Form validation
- **WHEN** a user attempts to submit the form with missing required fields
- **THEN** the system displays validation errors
- **AND** the form submission is prevented
- **AND** the user is informed which fields are required

### Requirement: Course Upload Workflow
The system SHALL upload course files to Cloudflare R2 and store course metadata in PostgreSQL database when a user submits a valid course upload form.

#### Scenario: Successful course upload
- **WHEN** a user submits a valid course upload form with title, price, cover image, and video
- **AND** the user has a connected wallet
- **THEN** the system uploads the cover image to R2 and captures the generated key
- **AND** the system uploads the video file to R2 and captures the generated key
- **AND** the system creates a course record in PostgreSQL with:
  - `title` from form input
  - `price` from form input
  - `creator_address` from connected wallet address
  - `chain_id` from connected wallet's chain ID
  - `cover_key` from R2 upload result
  - `key` from R2 video upload result
  - `course_onchain_id` as a unique identifier
- **AND** the system displays a success message
- **AND** the page refreshes to show updated state

#### Scenario: Upload with disconnected wallet
- **WHEN** a user attempts to submit the upload form without a connected wallet
- **THEN** the system displays an error message prompting the user to connect their wallet
- **AND** the upload process does not proceed

#### Scenario: R2 upload failure
- **WHEN** a user submits a valid form
- **AND** the R2 upload fails (network error, authentication error, etc.)
- **THEN** the system displays an error message to the user
- **AND** no course record is created in the database
- **AND** the form data is preserved for retry

#### Scenario: Database write failure
- **WHEN** a user submits a valid form
- **AND** the R2 uploads succeed
- **AND** the database write fails
- **THEN** the system displays an error message to the user
- **AND** the uploaded files remain in R2 (cleanup handled separately if needed)

### Requirement: R2 Upload Key Return
The R2 upload function SHALL return the generated storage key when an upload succeeds, enabling the caller to store the key in the database.

#### Scenario: Upload function returns key
- **WHEN** a file is successfully uploaded to R2 via `uploadFile`
- **THEN** the function returns an object with `success: true` and `key: string` containing the R2 storage key
- **AND** the key format matches the pattern used for R2 object keys (e.g., `courses/{timestamp}-{filename}`)

#### Scenario: Upload function returns error
- **WHEN** a file upload to R2 fails
- **THEN** the function returns an object with `success: false` and `msg: string` containing the error message
- **AND** no key is returned

