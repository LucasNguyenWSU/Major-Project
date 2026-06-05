# Assignment 2 - Blog - Client App

This project was originally cloned from the Assignment 2 blog application and has been developed further as a full-stack blog CMS. The original client, admin, backend, and test structure are still used, but the project now includes additional features beyond the base assignment.

## Project Overview

The application is a monorepo with two Next.js apps:

- **apps/web** - Public blog website for reading posts, liking posts, searching, filtering, and commenting.
- **apps/admin** - Admin website for managing posts, editing content, filtering posts, and controlling post visibility.

Data is stored in PostgreSQL through Prisma. The project also includes shared packages for UI, utilities, database access, environment validation, linting, Tailwind configuration, and TypeScript configuration.

## Additional Features

### Rich Editor

The admin create/update post screen includes a richer editing experience for post content. It supports formatted content, previewing content before saving, and preserving rich content after the post is saved.

### Comment Function

The public blog supports authenticated commenting. Visitors can register or log in, write comments on posts, and reply to existing comments. Comments are stored in the database and displayed on the post detail page.

### Pagination

Pagination has been added to both the public blog list and the admin post list. This keeps the interface usable when the database contains many posts.

## Success Criteria

- All of the tests must be passing
- You must be able to explain any code in the codebase

## Prerequisites

First, make sure that "pnpm" and "turbo" is installed in your computer. If not, please follow installation instructions for pnpm. If turbo is not installed, please install it using pnpm with the following command:

Then, run the following command to install turborepo.

```
pnpm add -g turbo
```

## Installing the project

Once the pnpm is installed, in the root of the project install the packages

```
pnpm i
```

To run end to end tests you need to install headless browsers. Please run the following command in the `tests/playwright` directory

```
pnpx playwright install
```

## Environment

In `apps/web`, `apps/admin`, and `packages/db`, find `.env.example` files and copy them to `.env`. Set your environment variables accordingly!

Required environment variables include:

```
DATABASE_URL=
DATABASE_URL_UNPOOLED=
PASSWORD=
JWT_SECRET=
```

Use a dedicated test database when running Playwright tests. The seed functions used by the tests delete and recreate data.

## Running the project

To run the project, run the following command in the root directory of your project:

```
turbo dev
```

This will run:

- Client application at [http://localhost:3001](http://localhost:3001)
- Admin application at [http://localhost:3002](http://localhost:3002)

## Running tests

To run the tests please run, you have two options.

### Running Tests in Console

If you only wish to visualise the test results in console, please run the following command in the root of your project for the first part of the second assignment (i.e. Assignment 2.1):

```
turbo test-1
```

This launches the turbo console UI similar to below, where you can swap between different projects:

![Turbo UI](https://skillpies.s3.ap-southeast-2.amazonaws.com/courses/full-stack-development/sections/assignment-2-1-blog-client-in-advanced-react/Screenshot%202025-02-05%20at%2014.30.45.png)

> Make sure that ALL tests pass!

If you want to run the tests for second part (i.e. Assignment 2.2) or third part (i.e. Assignment 2.3), run these commands:

```
turbo test-2 // or
turbo test-3
```

For the additional major project features, run:

```
turbo test-b1 // pagination
turbo test-b2 // rich editor
turbo test-b3 // comments
```

If you want to run all tests, please run

```
turbo all:test
```

### Running Tests in UIs

The packaged tests framework also have the possibility of visually represent your tests for nicer view of test results. To see the UIs, run this command instead of `turbo test-1`:

```
turbo dev:test-1
```

This will launch the End to End testing framework Playwright's test UI similar to below, please use the Play buttons to run individual tests:

![Playwright UI](https://skillpies.s3.ap-southeast-2.amazonaws.com/courses/full-stack-development/sections/assignment-2-1-blog-client-in-advanced-react/Screenshot%202025-02-05%20at%2014.40.35.png)

It also launches the unit and integration test framework Vitest's UI, similar to below. Here, you can also use the play buttons to execute individual tests!

![Vitest UI](https://skillpies.s3.ap-southeast-2.amazonaws.com/courses/full-stack-development/sections/assignment-2-1-blog-client-in-advanced-react/Screenshot%202025-02-05%20at%2014.46.31.png)

## Project structure

The project is monorepo with the following packages split into three categories:

**Applications**

Contains the following web applications:

- **apps/admin** - Admin Website
- **apps/web** - Client website

**Packages**

Contains the following packages with shared code and configurations:

- **packages/ui** - Library of UI elements shared between admin and client
- **packages/utils** - Library of utility functions shared between other projects
- **packages/db** - Library handling the database connection
- **packages/eslint-config**, **packages/tailwind-config** and **packages/typescript-config** contain configuration files for build pipelines for this project

**Tests**

Contains the following test applications:

- **tests/playwright** - End to End tests for the admin and client applications
- **tests/storybook** - Configured storybook instance for development and testing of React components in isolation

## Application Structure

The client application comes with pre-defined router (only one route is missing for your learning).
The client application also comes with pre defined structure of components and utilities for you to complete.
Tha admin application is much more bare with most functionality AND structure needed to be completed by you.
