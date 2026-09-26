# Turbo Barnacle

Turbo Barnacle is a file mapping and review application with a React frontend and an ASP.NET Core Web API backend.

## Repository Structure

```text
.
|-- WebAPI/                  # ASP.NET Core Web API targeting .NET 10
|-- react/                   # React 19 + Vite + TypeScript frontend
|-- docs/                    # Deeper implementation notes
|-- .github/workflows/ci.yml # CI build and lint workflow
`-- README.MD                # Canonical setup and handoff guide
```

The repository previously contained a Blazor WebAssembly client at `ClientApp/`. It has been removed in favor of the React client under `react/`. Its history is still available through git with:

```bash
git log --all -- ClientApp/
```

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Bun](https://bun.sh/) for the React app
- SQL Server or Azure SQL access for `ConnectionStrings:DefaultConnection`
- Microsoft Entra app registration values for frontend MSAL and backend JWT validation
- Optional: Azurite or another local Azure Storage emulator if using `UseDevelopmentStorage=true` for blob storage

## Configuration

### Backend Secrets

The API reads its database connection from .NET configuration. For local development, store the connection string in user secrets instead of editing `appsettings.json`.

```bash
cd WebAPI
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=YOUR_SERVER_NAME;Database=YOUR_DATABASE_NAME;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

Useful user-secrets commands:

```bash
cd WebAPI
dotnet user-secrets list
dotnet user-secrets remove "ConnectionStrings:DefaultConnection"
dotnet user-secrets clear
```

Backend configuration lives in:

- `WebAPI/appsettings.json`
- `WebAPI/appsettings.Development.json`
- local .NET user secrets for machine-specific values

The default `AzureAd` block in `WebAPI/appsettings.json` configures JWT validation. Update it when working against a different tenant or app registration.

### Frontend Environment

Create `react/.env.local` from the example file (`.env.example`):

```bash
cp react/.env.example react/.env.local
```

What each value does:

- `VITE_CLIENT_ID` is the frontend Entra application client ID.
- `VITE_TENANT_ID` is the Entra tenant ID used for sign-in.
- `VITE_APPLICATION_ID` is used to request the API scope `api://<VITE_APPLICATION_ID>/access_as_user`.
- `VITE_API_URL` is the WebAPI base URL.

## Install

Install frontend dependencies:

```bash
cd react
bun install #or bun i
```

Restore backend dependencies:

```bash
dotnet restore WebAPI/WebAPI.csproj
```

## Run Locally

Start the API from the repository root:

```bash
dotnet run --project WebAPI/WebAPI.csproj
```

By default, the HTTP launch profile serves the API at:

```text
http://localhost:5248
```

The HTTPS launch profile also exposes:

```text
https://localhost:7063
```

Start the frontend in a second terminal:

```bash
cd react
bun run dev
```

Open the frontend at:

```text
http://localhost:5173
```

The API CORS policy currently allows `http://localhost:5173` and `http://localhost:5248`.

## Validate Changes

These commands match the current CI workflow.

Backend:

```bash
dotnet restore WebAPI/WebAPI.csproj
dotnet build WebAPI/WebAPI.csproj --configuration Release
```

Frontend:

```bash
cd react
bun install
bun run lint
bun run build
```

There is no committed automated test project or frontend `test` script at the time of writing, so CI validates restore/build for the API and install/lint/build for the React app.

## Common Workflows

### Run Frontend And Backend Together

Use two terminals:

```bash
dotnet run --project WebAPI/WebAPI.csproj
```

```bash
cd react
bun run dev
```

Then open `http://localhost:5173`.

### Update The Local Database Connection

```bash
cd WebAPI
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=YOUR_SERVER_NAME;Database=YOUR_DATABASE_NAME;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

The API checks database connectivity during startup. If the connection is wrong or the database is unreachable, the API logs the failure and exits.

### Add A Frontend Dependency

```bash
cd react
bun add PACKAGE_NAME
```

Run the frontend validation commands before opening a pull request:

```bash
bun run lint
bun run build
```

### Check OpenAPI During Development

OpenAPI is mapped only in the Development environment. Start the API with the default launch profile and use the generated OpenAPI endpoint exposed by ASP.NET Core.

```bash
dotnet run --project WebAPI/WebAPI.csproj
```

## Troubleshooting

### API Fails On Startup

The API calls `CanConnectAsync()` during startup and rethrows if SQL Server cannot be reached. Check:

- The `ConnectionStrings:DefaultConnection` user secret exists.
- The SQL Server or Azure SQL database is reachable from your machine.
- The username, password, database name, encryption, and trust settings match your environment.

### Browser Shows CORS Errors

Use the default Vite URL, `http://localhost:5173`. If you run the frontend on another port, add that origin to the CORS policy in `WebAPI/Program.cs`.

### Login Works But API Calls Return 401

Check that the frontend and backend app registration values line up:

- `react/.env.local` has the correct `VITE_CLIENT_ID`, `VITE_TENANT_ID`, and `VITE_APPLICATION_ID`.
- `WebAPI/appsettings.json` has the matching `AzureAd:TenantId`, `AzureAd:ClientId`, and `AzureAd:Audience`.
- The frontend requests `api://<VITE_APPLICATION_ID>/access_as_user`.

### Frontend Starts But API Requests Fail

Check `VITE_API_URL` in `react/.env.local`. For the default local API profile it should be:

```text
VITE_API_URL=http://localhost:5248
```

Restart the Vite dev server after editing `.env.local`.

### Blob Storage Fails Locally

`WebAPI/appsettings.json` defaults `AzureBlobStorage:ConnectionString` to `UseDevelopmentStorage=true`. Run a compatible local storage emulator such as Azurite, or replace the setting through local configuration for your environment.

## Known Limitations

- The API requires a reachable database at startup. There is no built-in offline mode for backend development.
- There is no committed automated test suite beyond the current CI build and lint checks.
- A static `/demo` route is mentioned in older project notes, and demo components exist under `react/src/pages/demo/`, but the route is not currently wired in `react/src/router.tsx`.
- `react/README.md` intentionally points back to this file instead of duplicating setup instructions.

## Deeper Docs

- `[docs/toast-guidelines.md](docs/toast-guidelines.md)` explains the shared toast helper and user-facing notification rules.