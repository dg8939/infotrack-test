This project implements a small full-stacked slice to normalize external property data, allow user edits for missing volume/folio values, and answer basic reporting questions using SQL.

**Tech Stack**

- Backend: C# / .NET 8
- Frontend: React 18 + TypeScript
- Database: SQL (SQLite compatible)
- Testing: xUnit (backend), Vitest + React Testing Library (frontend)

## How to Run

### Backend (C# / .NET)

**Requirements:** .NET SDK 8.0

- cd API
- dotnet build
- $env:ASPNETCORE_ENVIRONMENT="Development"
- dotnet run
- http://localhost:<port>/swagger

In the UI, you can insert the ExternalProperty.json and the API will respond with InternalProperty.

https://github.com/user-attachments/assets/536f3b3a-fdf7-4abc-91d5-02f622b9a32a

Run tests:

cd API/Api.tests
dotnet test

### Frontend (React / Typescript)

**Requirements:** Node.js

cd UI/PropertyCard
npm install
npm run dev

Run tests:
cd UI/PropertyCard
npm test

### SQL

SQL answers and the recommended index are included in the property.sql file and were validated using an online SQLite tool.

## Time Spent

- Backend mapping and tests ~ 1.5hrs
- UI and tests ~ 2 hrs
- SQL ~ 1 hr
- Documentation ~ 30 mins

Total ~ 5 hrs

## Assumptions

- formattedAddress is used directly for fullAddress.

- Empty strings for title.volume / title.folio are treated as unknown and mapped to null.

- status is "KnownVolFol" only when both volume and folio are present; otherwise "UnkownVolFol" (as per current implementation).

## Approach & trade-offs

- Focused on correct normalisation logic and clear tests rather than a full REST API.

- Used a console app to validate behaviour quickly within the timebox.

- UI implementation is minimal but functional, with validation and state updates.

- Prioritised clarity and correctness over extra features.

## AI Usage

AI (ChatGPT) was used to:

- Assist with test scaffolding and project setup

- Draft SQL and README structure

All generated code was reviewed, adapted to the actual models, and verified by running the application and tests locally.
