# DineFlow - Multi-Tenant Restaurant Management & POS Platform

React Native mobile app + Express backend for restaurant operations.

## Project Structure
- `/backend` - Express API server
- `/admin` - React admin panel (planned)
- `/docs` - Specifications, roadmap, context
- `/src` - Mobile app (to be restructured as we build features)

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env  # configure
npm run dev
```

### Mobile App
```bash
npm install
npm start
npm run android  # or npm run ios
```

## Documentation
- [Project Plan](docs/PROJECT_PLAN.md)
- [Project Context](docs/context.md)
- [API Spec](docs/specs/api-spec.md)
- [ERD/Collections](docs/specs/erd-collections.md)
- [Roles & Permissions](docs/specs/roles-permissions.md)
- [State Machines](docs/specs/state-machines.md)
- [Screens & Navigation](docs/specs/screens-navigation.md)
- [MVP Cut Lines](docs/specs/mvp-cutlines.md)

## Current Phase
Working through phases per roadmap. MVP target: complete dine-in loop (Tables → Menu → Orders → Kitchen → Billing → Payments → Reports).