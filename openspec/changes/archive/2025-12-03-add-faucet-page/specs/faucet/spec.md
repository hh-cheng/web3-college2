# faucet Specification

## ADDED Requirements

### Requirement: Wallet Connection Requirement
The faucet page SHALL require users to connect their wallet before claiming tokens.

#### Scenario: Wallet not connected
- **WHEN** a user navigates to the faucet page
- **AND** no wallet is connected
- **THEN** the page displays a message prompting the user to connect their wallet
- **AND** the claim button is disabled or hidden
- **AND** a wallet connection button is displayed

#### Scenario: Wallet connected
- **WHEN** a user navigates to the faucet page
- **AND** a wallet is connected
- **THEN** the page displays the claim interface
- **AND** the claim button is enabled (if user hasn't claimed)
- **AND** the user's wallet address is displayed or accessible

### Requirement: Claim Amount Display
The faucet page SHALL display the amount of tokens that can be claimed from the contract.

#### Scenario: Display claim amount
- **WHEN** a user navigates to the faucet page
- **AND** a wallet is connected
- **THEN** the page fetches the claim amount from the YDFaucet contract using `amountPerClaim()`
- **AND** the claim amount is displayed to the user
- **AND** the amount is formatted appropriately (e.g., with token symbol or decimals)

#### Scenario: Claim amount loading state
- **WHEN** the claim amount is being fetched
- **THEN** the page displays a loading indicator
- **AND** the claim button is disabled until the amount is loaded

### Requirement: Claim Eligibility Check
The faucet page SHALL check whether the connected wallet address has already claimed tokens.

#### Scenario: User has not claimed
- **WHEN** a user navigates to the faucet page
- **AND** a wallet is connected
- **THEN** the page checks `hasClaimed(address)` for the user's wallet address
- **AND** if the user has not claimed, the claim button is enabled
- **AND** the page displays a message indicating the user is eligible to claim

#### Scenario: User has already claimed
- **WHEN** a user navigates to the faucet page
- **AND** a wallet is connected
- **AND** the user has already claimed tokens
- **THEN** the page checks `hasClaimed(address)` and determines the user has claimed
- **AND** the claim button is disabled
- **AND** the page displays a message indicating the user has already claimed
- **AND** the page may display when the claim was made (if available)

### Requirement: Token Claim Transaction
The faucet page SHALL allow users to claim tokens by calling the YDFaucet contract's `claim()` function.

#### Scenario: Successful claim
- **WHEN** a user clicks the claim button
- **AND** the user has not claimed tokens before
- **AND** a wallet is connected
- **THEN** the system calls `YDFaucet.claim()` on the contract
- **AND** the user is prompted to confirm the transaction in their wallet
- **WHEN** the transaction succeeds
- **THEN** the system displays a success message
- **AND** the claim button becomes disabled
- **AND** the claim status updates to show the user has claimed
- **AND** the transaction hash is displayed or linked to a block explorer

#### Scenario: Claim transaction failure
- **WHEN** a user attempts to claim tokens
- **AND** the transaction fails (user rejection, insufficient gas, contract error, etc.)
- **THEN** the system displays an error message
- **AND** the claim button remains enabled (if user hasn't claimed)
- **AND** the user can retry the claim

#### Scenario: Claim transaction pending
- **WHEN** a user clicks the claim button
- **AND** the transaction is submitted
- **THEN** the claim button shows a loading state
- **AND** the button is disabled during the transaction
- **AND** a loading message is displayed
- **WHEN** the transaction completes (success or failure)
- **THEN** the loading state is removed

#### Scenario: Attempting to claim when already claimed
- **WHEN** a user attempts to claim tokens
- **AND** the user has already claimed tokens
- **THEN** the claim button is disabled
- **AND** the transaction is not initiated
- **AND** a message indicates the user has already claimed

### Requirement: Transaction Feedback
The faucet page SHALL provide clear feedback to users about transaction status and outcomes.

#### Scenario: Transaction success feedback
- **WHEN** a claim transaction succeeds
- **THEN** the system displays a success notification
- **AND** the notification includes the transaction hash
- **AND** the notification may include a link to view the transaction on a block explorer
- **AND** the claim status updates immediately

#### Scenario: Transaction error feedback
- **WHEN** a claim transaction fails
- **THEN** the system displays an error notification
- **AND** the error message is user-friendly and actionable
- **AND** common errors are handled with specific messages (e.g., "Transaction rejected", "Insufficient gas", "Already claimed")

#### Scenario: User rejection feedback
- **WHEN** a user rejects the transaction in their wallet
- **THEN** the system displays a message indicating the transaction was cancelled
- **AND** the claim button remains enabled
- **AND** no error state is shown (user intentionally cancelled)

