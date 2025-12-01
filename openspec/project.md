# Project Context

## Purpose
Web3 College Platform (web3-college2) is a blockchain-based education platform that enables:
- Course creators (authors/instructors) to create and sell courses
- Students to purchase courses using YD Token (ERC20)
- Authors to withdraw earnings from course sales
- User profile management with wallet-based authentication

The platform operates on Ethereum (Sepolia for development) and integrates smart contracts for course management, purchases, and token transactions.

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, CSS Modules
- **State Management**: Zustand 5.0.8
- **Data Fetching**: TanStack Query (React Query) 5.90.10
- **UI Components**: Radix UI, Lucide React icons
- **Animations**: GSAP 3.13.0, Motion 12.23.24

### Blockchain/Web3
- **Ethereum Library**: viem 2.40.0, ethers 6.15.0
- **Wallet Integration**: EIP-1193 compatible wallets (MetaMask, custom wallets)
- **Chain**: Ethereum Sepolia (development), configurable via `lib/config/chain.ts`

### Backend/Database
- **Database**: PostgreSQL
- **ORM**: Prisma 7.0.1
- **Server**: Next.js Server Actions/API Routes

### Storage
- **Object Storage**: AWS S3 (via @aws-sdk/client-s3)
- **Secrets**: AWS Secrets Manager

### Development Tools
- **Linting/Formatting**: Biome 2.3.7
- **Git Hooks**: Husky 9.1.7
- **Commit Linting**: Commitlint (Conventional Commits)
- **Package Manager**: pnpm

## Project Conventions

### Code Style
- **Formatter**: Biome with 2-space indentation, 80 character line width
- **Quotes**: Single quotes for JavaScript/TypeScript, double quotes for JSX
- **Semicolons**: As needed (not required)
- **Trailing Commas**: Always
- **Arrow Functions**: Always use parentheses for parameters
- **File Naming**: kebab-case for files, PascalCase for React components
- **Path Aliases**: Use `@/*` for imports from project root

### Architecture Patterns
- **App Router**: Next.js App Router pattern with `app/` directory
- **Server Components**: Default to Server Components, use `'use client'` only when needed
- **Component Organization**: 
  - `components/` - Reusable UI components
  - `app/` - Page components and route handlers
  - `lib/` - Utilities, hooks, and shared logic
  - `stores/` - Zustand state management
- **Web3 Integration**:
  - Custom hooks (`lib/hooks/useWeb3.ts`, `lib/hooks/useViemClients.ts`)
  - Wallet state managed via Zustand (`stores/useWalletStore.ts`)
  - Chain configuration centralized in `lib/config/chain.ts`
- **Database Access**: Prisma client generated to `app/generated/prisma/`
- **File Structure**: Feature-based organization within `app/` (e.g., `app/market/`, `app/me/`, `app/my-courses/`)

### Testing Strategy
- Testing framework not yet configured
- Focus on manual testing and integration testing for Web3 interactions
- Consider adding Vitest or Jest for unit tests in future

### Git Workflow
- **Branching**: Feature branches (e.g., `dev_1`)
- **Commit Convention**: Conventional Commits (enforced via Commitlint)
- **Pre-commit**: Husky runs Biome linting/formatting via lint-staged
- **Commit Format**: `<type>(<scope>): <subject>`

## Domain Context

### Core Entities
- **Users**: Identified by wallet address, optional nickname and avatar
- **Courses**: On-chain courses with metadata stored off-chain (S3)
- **Purchases**: Record of course purchases with transaction hash
- **YD Token**: ERC20 token used for course purchases and author payouts

### Key Workflows
1. **Course Creation**: Author creates course → CourseManager contract → Metadata stored in S3
2. **Course Purchase**: User approves YD Token → Purchase via CourseManager → Purchase record created
3. **Author Withdrawal**: Author withdraws YD earnings → Can swap to ETH/USDT → Optional AAVE deposit
4. **User Profile**: Wallet-based authentication → Off-chain nickname updates via signature verification

### Smart Contracts (Planned)
- **YDToken**: ERC20 token contract
- **CourseManager**: Course creation, purchase, and author balance management

### Routes Structure
- `/` - Course marketplace/listings
- `/market` - Market page with course listings
- `/course/[id]` - Course details and purchase flow
- `/me` - User profile (wallet connection, nickname management)
- `/my-courses` - User's purchased courses
- `/learn/[courseId]` - Course learning interface

## Important Constraints
- **Blockchain**: Currently targeting Ethereum Sepolia testnet
- **Gas Costs**: Consider gas optimization for user transactions
- **Security**: 
  - All wallet signatures must be verified server-side
  - Prevent replay attacks with timestamp/nonce in signature messages
  - Smart contract ownership should use multisig for production
- **File Storage**: Course content stored in S3, metadata includes `key` and `cover_key`
- **Chain ID**: Stored with courses and purchases for multi-chain support (future)

## External Dependencies
- **Blockchain**: Ethereum network (Sepolia testnet)
- **Storage**: AWS S3 for course content and cover images
- **Secrets**: AWS Secrets Manager for sensitive configuration
- **Block Explorer**: Chain-specific block explorers (configurable per chain)
- **The Graph** (Future): For indexing purchase events and course statistics
- **DEX Integration** (Future): For YD → ETH → USDT swaps
- **AAVE** (Future): For yield generation on author earnings
