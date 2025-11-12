# Lumina-Notes 🗒️

A note-taking application built with Next.js and TypeScript.

<p align="center">
  <a href="https://lumina-notes-pi.vercel.app">
    <img src="https://files.edgestore.dev/6cais180wsi0m009/publicFiles/_public/b9209cc4-8797-4773-b529-52aaca873826.png" width="500">
 </a>
</p>

## Key Features & Benefits

*   **Authentication:** Secure user authentication implemented using `better-auth`.
*   **Document Editor:** A rich text editor for creating and managing notes.
*   **File Storage:** Utilizes EdgeStore for efficient file storage and management.
*   **Real-time Updates:** TRPC enables real-time communication and updates.
*   **Modern UI:** A clean and intuitive user interface built with Tailwind CSS.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 18 or higher.  It is recommended to use the latest LTS version.
*   **npm or yarn or pnpm or bun:**  Package managers for installing dependencies.
*   **A Text Editor or IDE:**  Such as VSCode, Sublime Text, or similar.

## Installation & Setup Instructions

Follow these steps to get Lumina-Notes up and running on your local machine:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/aledx18/Lumina-Notes.git
    cd Lumina-Notes
    ```

2.  **Install Dependencies:**

    Using npm:

    ```bash
    npm install
    ```

    Using pnpm:

    ```bash
    pnpm install
    ```

    Using bun:

    ```bash
    bun install
    ```

3.  **Set up Environment Variables:**

    Create a `.env` file in the root directory of the project. You will need to configure the appropriate environment variables, such as database connection strings, authentication secrets, and EdgeStore API keys.  Refer to `better-auth` and `edgestore` documentation for required variables.

4.  **Run the Development Server:**

    Using npm:

    ```bash
    npm run dev
    ```
    
    Using pnpm:

    ```bash
    pnpm dev
    ```

    Using bun:

    ```bash
    bun dev
    ```

5.  **Access the Application:**

    Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage Examples

### Authentication

The authentication logic is located in `app/api/auth/[...all]/route.ts`.  It uses `better-auth` to handle user sign-in, sign-up, and session management.

```typescript
import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/auth'

export const { GET, POST } = toNextJsHandler(auth)
```

### File Uploads

EdgeStore is used for file uploads and storage.  The API endpoint is located in `app/api/edgestore/[...edgestore]/route.ts`.

```typescript
import { initEdgeStore } from '@edgestore/server'
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app'

const es = initEdgeStore.create()

const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket().beforeDelete(() => {
    return true
  })
})

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter
})

export { handler as GET, handler as POST }
```

### TRPC API

TRPC is used for defining and consuming API endpoints.  The main router is located in `app/api/trpc/[trpc]/route.ts`.

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createTRPCContext } from '@/trpc/init'
import { appRouter } from '@/trpc/routers/_app'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext
  })
export { handler as GET, handler as POST }
```

## Configuration Options

The application can be configured via environment variables.  These variables are loaded from the `.env` file. Some key configuration options include:

*   **Database Connection String:**  Specify the connection string for your database.
*   **Authentication Secrets:**  Set the secrets used for JWT signing.
*   **EdgeStore API Keys:**  Provide the API keys for accessing your EdgeStore buckets.
*   **TRPC API Endpoint:**  The endpoint for the TRPC API is `/api/trpc`.

## License Information

This project does not have a specified license. All rights are reserved by the owner.

## Acknowledgments

*   [Next.js](https://nextjs.org/) - For the React framework.
*   [TypeScript](https://www.typescriptlang.org/) - For the programming language.
*   [Tailwind CSS](https://tailwindcss.com/) - For the styling.
*   [better-auth](https://github.com/your-better-auth-repo) - For the authentication library.
*   [EdgeStore](https://edgestore.dev/) - For the file storage service.
*   [TRPC](https://trpc.io/) - For the API layer.
