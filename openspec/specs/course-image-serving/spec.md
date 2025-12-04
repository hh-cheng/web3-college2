# course-image-serving Specification

## Purpose
TBD - created by archiving change fix-course-image-rendering. Update Purpose after archive.
## Requirements
### Requirement: Course Image Serving
The system SHALL serve course cover images from R2 storage via an API route that handles URL encoding correctly and works with Next.js Image Optimization.

#### Scenario: Serve course image successfully
- **WHEN** a request is made to `/api/course-image/{key}` with a valid R2 storage key
- **AND** the key may be URL-encoded one or more times due to Next.js Image Optimization
- **THEN** the system decodes the key correctly regardless of encoding level
- **AND** the system validates the decoded key starts with `courses/`
- **AND** the system generates a presigned download URL from R2
- **AND** the system fetches the image from R2
- **AND** the system streams the image data back with appropriate content-type headers
- **AND** the response includes cache headers for optimal performance

#### Scenario: Handle double-encoded URLs
- **WHEN** a request is made to `/api/course-image/{key}` with a double-encoded key (e.g., `courses%252F...`)
- **THEN** the system decodes the key iteratively until no more encoding remains
- **AND** the system successfully retrieves and serves the image

#### Scenario: Handle special characters in filenames
- **WHEN** a request is made with a key containing special characters (e.g., Chinese characters, spaces, symbols)
- **AND** the key is URL-encoded
- **THEN** the system decodes the key correctly preserving special characters
- **AND** the system successfully retrieves and serves the image

#### Scenario: Invalid key format
- **WHEN** a request is made with a key that does not start with `courses/` after decoding
- **THEN** the system returns a 400 Bad Request error
- **AND** the error message indicates the key format is invalid

#### Scenario: Image not found in R2
- **WHEN** a request is made with a valid key format
- **AND** the image does not exist in R2 storage
- **THEN** the system returns a 404 Not Found error
- **AND** the error message indicates the image was not found

#### Scenario: R2 service error
- **WHEN** a request is made with a valid key
- **AND** R2 service fails to generate a presigned URL or fetch the image
- **THEN** the system returns a 500 Internal Server Error
- **AND** the error message indicates the service failure
- **AND** detailed error information is logged for debugging

