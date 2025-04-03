# Activity Diagram Generator

A React application that generates activity diagrams from text descriptions using Mermaid.js.

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

## Setup Instructions

1. Clone or download this repository to your local machine

2. Open a terminal in the project directory

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:5173
```

## Usage

1. Enter a description of your activity flow in the text area. For example:
```
User logs in. If credentials are correct, they access the dashboard. Otherwise, they see an error message and try again. After using the dashboard, they log out.
```

2. Click the "Generate Diagram" button to create the activity diagram.

## Project Structure

- `src/App.tsx` - Main application component
- `src/utils/diagramGenerator.ts` - Diagram generation logic
- `src/index.css` - Global styles
- `tailwind.config.js` - Tailwind CSS configuration