# Chatbot Flow Editor

A web application for visually creating and editing conversation flows for chatbots. Use an intuitive node-based editor to easily design complex conversation scenarios.

## Features

- **Hierarchical Node Structure**: Visualize conversation flows in a tree structure
- **Intuitive UI**: Easy operation without drag and drop
- **Interactive Chat Preview**: Test your chatbot flows with a fully functional chat simulator
- **Multi-path Support**: Properly handles complex flows where the same node can be reached through different paths
- **Import/Export Functionality**: Save and load in JSON format
- **Hierarchical Naming Convention**: Clear identifiers like Node 1, Node 1-1, Node 1-1-1, etc.

## Tech Stack

- [Next.js 15](https://nextjs.org/) - Frontend framework
- [React](https://react.dev/) - version 19
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [shadcn/ui](https://ui.shadcn.com/) - Reusable UI component collection
- [Lucide React](https://lucide.dev/) - Icon library
- [class-variance-authority](https://cva.style/docs) - Component variant management

## Getting Started

### Prerequisites

- Node.js 18.18.0 or later
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/enumura1/chatflow-editor.git
cd chatflow-editor

# Install dependencies
npm install
# or
yarn install
# or 
pnpm install
# or
bun install
```

### Starting the Development Server

```bash
npm run dev
# or
yarn dev
# or 
pnpm install
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

1. **Adding Nodes**: Click the "Add Node" button to create a new node
2. **Editing Nodes**: Click on a node to select it, then edit its title or options
3. **Adding Options**: Click the "Add Option" button to add choices to the current node
4. **Testing Your Chatbot**: 
   - Click the "Start Chat" button in the Chat Preview panel
   - Interact with your chatbot by selecting options
   - See how conversation flows through different paths
   - Use the "Reset" button to start over
5. **Export/Import**: Save or load your flow as a JSON file

## Project Structure

```
src/
├── app/                # Next.js application root
├── components/         # React components
│   ├── chatbot-editor/ # Editor-related components
│   └── ui/             # Reusable UI components
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## Customization

- `src/types/chatbot.ts` - Modify the chatbot data structure
- `src/components/chatbot-editor/index.tsx` - Customize initial flow data
- `src/app/globals.css` - Adjust global styles
