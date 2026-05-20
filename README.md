1. Replace the `DATABASE_URL` string in the `.env` file with the correct credentials for your local PostgreSQL database.
1. Push the schema to your database by running:
    ```bash
    bun run db:push
    ```
1. Start the backend:
    ```bash
    bun run start:backend
    ```
1. Start the frontend:
    ```bash
    bun run dev
    ```