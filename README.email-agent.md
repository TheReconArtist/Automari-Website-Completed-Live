# Email Automation Agent Demo

This document outlines the setup, usage, and integration of the Email Automation Agent Live Demo for the Automari/Ione website.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Demo](#running-the-demo)
- [Embedding the Component](#embedding-the-component)
- [Going Live (Future Steps)](#going-live-future-steps)
- [Accessibility](#accessibility)

## Features

This live demo showcases a self-contained, mobile-driven \"Email Automation Agent\" with the following functionalities:

- **Mobile-First UX Shell**: Sticky header with brand and \"Demo\" badge, bottom tab bar with 4 tabs (Inbox, Smart Reply, Rules, Metrics), and a floating \"New Rule\" / \"Compose\" action button.
- **Inbox (Demo Mode)**: Virtualized list of ~25 mock emails with sender, subject, preview, time, and labels (Priority, Billing, Sales, Support). Includes swipe actions (right → archive, left → snooze), an overflow menu (Assign, Mark Priority), search and filter chips, and a pull-to-refresh animation.
- **Thread View**: Message timeline, AI Summary card, Priority score chip, and 3 one-tap Suggested Replies. A \"Draft Reply\" panel with Tone selector (Professional, Friendly, Brief) and Insert Snippets (FAQ, Pricing, Booking link). Buttons for Categorize, Assign, Snooze, Create Rule from this.
- **Smart Reply Tab**: A mini playground to paste an email, generate 3 AI-powered replies, edit them, and Copy or Insert to Draft. Features a typing animation.
- **Rules Tab (No-code builder)**: Allows users to create rules with \"IF [sender/contains/subject includes/has label/age] THEN [auto-reply template/apply label/assign to teammate/snooze X/draft follow-up]\" logic. Rules are persisted in `localStorage` and come with 3 starter rules. Includes a \"Test panel\" to run rules on a sample inbox.
- **Metrics Tab**: Displays cards with tiny charts for processed emails, average response time, auto-reply rate, and saved minutes, including a \"Last 7 days\" sparkline.
- **Demo/Live Switch**: Controlled by the `NEXT_PUBLIC_EMAIL_AGENT_MODE` environment flag.
- **Animations**: Buttery gestures and animations using Framer Motion for subtle page/tab transitions, list item swipe with resistance, and springy modals.
- **Brand Polish**: Consistent spacing, typography, empty states with helpful illustrations/icons, and error/success toasts.

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Icons**: [lucide-react](https://lucide.dev/)
-   **Animations**: [framer-motion](https://www.framer.com/motion/)
-   **Data**: Local JSON (`/data/mock-inbox.json`) and `localStorage` for demo mode rules.

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd automari-website-1 # or your project directory
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # Install shadcn/ui components if not already installed (verify `components/ui` for presence)
    # The following shadcn/ui components are used:
    # button, badge, card, dialog, input, label, select, switch, textarea, toast, toaster
    # If any are missing, add them using:
    # npx shadcn-ui@latest add <component-name>
    npm install uuid # for rule IDs
    ```

## Environment Variables

Create a `.env.local` file in the project root with the following:

```env
NEXT_PUBLIC_EMAIL_AGENT_MODE="demo" # Set to "live" for live mode scaffolding
```

## Running the Demo

1.  **Start the development server:**

    ```bash
    npm run dev
    ```

2.  **Access the demo:** Open your browser and navigate to `http://localhost:3000/demo/email-agent` (or `http://localhost:3001/demo/email-agent` if port 3000 is in use).

## Embedding the Component

The `<EmailAgentDemo />` component is designed to be self-contained and can be embedded into any Next.js page. 

**Example:** To embed it in `app/page.tsx`:

```tsx
// app/page.tsx

'use client'; // Ensure it's a client component if interactive features are used

import { EmailAgentDemo } from '@/components/email-agent/EmailAgentDemo';

export default function HomePage() {
  return (
    <div>
      {/* Your existing page content */}

      <div style={{ maxWidth: '400px', margin: '0 auto', height: '800px', border: '1px solid #333', borderRadius: '10px', overflow: 'hidden' }}>
        <EmailAgentDemo />
      </div>

      {/* More of your existing page content */}
    </div>
  );
}
```

## Going Live (Future Steps)

To switch to \"live\" mode and integrate with real email APIs (e.g., Gmail, IMAP, Zendesk), you will need to:

1.  Set `NEXT_PUBLIC_EMAIL_AGENT_MODE="live"` in your `.env.local` file.
2.  Implement the actual API calls in the placeholder live API routes. The current demo mode uses mock data and stubbed API routes.

    -   `/app/api/live/classify/route.ts`: **TODO**: Implement logic to classify real emails using your AI backend.
    -   `/app/api/live/draft/route.ts`: **TODO**: Implement logic to draft replies using your AI backend.
    -   **TODO**: Develop API routes for sending emails, managing rules, fetching live metrics, etc., based on your chosen email API integration.

3.  Update the `agentStub.ts` or create a new `agentLive.ts` to connect to your real backend services.

## Accessibility

The demo is built with accessibility in mind:

-   **ARIA Labels**: Interactive elements are labeled with `aria-label` for screen reader users.
-   **Focus States**: Clear visual focus indicators are provided for keyboard navigation.
-   **Keyboard Navigation**: All interactive elements are reachable and operable via keyboard.
-   **Semantic HTML**: Proper HTML elements are used to convey meaning.

## Performance & Developer Experience (DX)

-   **Lighthouse Mobile**: Aiming for a score ≥ 90.
-   **Chunk Imports**: Components are structured to allow for efficient chunking.
-   **Lazy Loading**: Thread view (and potentially other heavy components) can be lazy-loaded.
-   **TypeScript & ESLint**: Strict TypeScript and ESLint configurations are used for code quality.
-   **Prettier**: Consistent code formatting.

## Minimal Unit Tests & E2E Test

-   **Unit Tests**: (TODO: Add unit tests for `agentStub.evaluateRules` and other critical logic).
-   **Playwright E2E Test**: (TODO: Add a Playwright happy-path test for basic demo functionality).
