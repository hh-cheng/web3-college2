## ADDED Requirements

### Requirement: User Profile Page Display
The `/me` page SHALL display the user's wallet information including wallet address, chain ID, and ETH balance when a wallet is connected. When no wallet is connected, the page SHALL display a prompt to connect a wallet.

#### Scenario: Display wallet info when connected
- **WHEN** a user navigates to `/me` page with a connected wallet
- **THEN** the page displays the wallet address (formatted/truncated appropriately)
- **AND** the page displays the current chain ID
- **AND** the page displays the ETH balance (formatted with appropriate decimals)
- **AND** the page displays the current nickname if set, or indicates nickname is not set

#### Scenario: Prompt wallet connection when disconnected
- **WHEN** a user navigates to `/me` page without a connected wallet
- **THEN** the page displays a message prompting the user to connect their wallet
- **AND** a connect wallet button is displayed
- **WHEN** the user clicks the connect button
- **THEN** the wallet connection flow is initiated
- **AND** after successful connection, the wallet information is displayed

### Requirement: Nickname Display and Editing
The `/me` page SHALL allow users to view and update their nickname. The nickname SHALL be displayed in an editable form field, and users SHALL be able to save changes to update their nickname in the database.

#### Scenario: Display current nickname
- **WHEN** a user navigates to `/me` page with a connected wallet
- **THEN** the current nickname is displayed in an editable input field
- **AND** if no nickname is set (null), the input field is empty or shows a placeholder

#### Scenario: Update nickname successfully
- **WHEN** a user enters a new nickname in the input field
- **AND** the user clicks the save button
- **THEN** the nickname is updated in the database for the user's wallet address
- **AND** a success notification is displayed
- **AND** the updated nickname is reflected in the UI
- **AND** the nickname update is reflected in other parts of the application (e.g., Wallet component)

#### Scenario: Nickname update validation
- **WHEN** a user attempts to save an empty nickname
- **THEN** validation prevents the update
- **AND** an error message is displayed indicating nickname cannot be empty
- **WHEN** a user attempts to save a nickname that exceeds maximum length (e.g., 50 characters)
- **THEN** validation prevents the update
- **AND** an error message is displayed indicating the maximum length

#### Scenario: Nickname update error handling
- **WHEN** a database error occurs during nickname update
- **THEN** an error notification is displayed to the user
- **AND** the previous nickname value is preserved in the input field
- **AND** the wallet connection remains functional

### Requirement: Balance Display and Refresh
The `/me` page SHALL display the user's ETH balance and provide a mechanism to refresh the balance.

#### Scenario: Display current balance
- **WHEN** a user navigates to `/me` page with a connected wallet
- **THEN** the ETH balance is fetched and displayed
- **AND** the balance is formatted appropriately (e.g., showing 4 decimal places for small amounts, 2 for larger amounts)

#### Scenario: Refresh balance
- **WHEN** a user clicks a refresh balance button
- **THEN** the balance is re-fetched from the blockchain
- **AND** the displayed balance is updated with the latest value
- **AND** a loading state is shown during the refresh operation

