# Angular Component Library & Micro Frontend Projects

A collection of Angular 19 projects demonstrating modern component development, signal-based architecture, and micro frontend patterns.

## Projects Overview

### 1. Date Range Picker
**Location:** `date-range-picker/`  
**Port:** 4200  
**Status:** Production-ready reusable component

A fully-featured, highly configurable date range picker component built with Angular 19 standalone components and Signals. Implements `ControlValueAccessor` for seamless integration with Angular Forms (reactive and template-driven).

**Key Features:**
- Single or dual-month calendar views
- Customizable themes (dark, light, custom colors)
- Quick date presets (Today, Last 7 Days, Last 30 Days, etc.)
- Configurable width and layout
- Built-in validators (min/max date, range limits)
- Comprehensive unit test coverage
- Signal-based reactive architecture

[View detailed documentation →](date-range-picker/README.md)

---

### 2. Calendar Component
**Location:** `calendar/`  
**Port:** 4204  
**Status:** Active development

An interactive calendar component with week view functionality built using Angular 19 and Luxon for date handling.

**Key Features:**
- Calendar month and week views
- Event management capabilities
- Date manipulation using Luxon
- Responsive design

**Quick Start:**
```bash
cd calendar
npm install
npm start
```
Access at: 4204

---

### 3. Micro Frontend Architecture
**Location:** `Micro frontend/`  
**Architecture:** Native Federation (Angular Architects)  
**Status:** Demonstration project

A movie theater booking system demonstrating micro frontend architecture with Angular 19 and Native Federation. Showcases runtime integration of independently deployed micro frontends.

#### Sub-Projects:

##### Movie Host (Shell Application)
- **Port:** 4201
- **Role:** Host/container application
- **Responsibilities:** Routes, shared layout, micro frontend orchestration

##### Movie List (Remote)
- **Port:** 4202
- **Role:** Movie catalog micro frontend
- **Features:** Movie browsing and selection

##### Ticket Availability (Remote)
- **Port:** 4203
- **Role:** Booking micro frontend
- **Features:** Seat selection and ticket availability

**Quick Start:**
```bash
# Terminal 1 - Start host
cd "Micro frontend/movie-host"
npm install
npm start

# Terminal 2 - Start movie list remote
cd "Micro frontend/movie-list"
npm install
npm start

# Terminal 3 - Start ticket availability remote
cd "Micro frontend/ticket-availability"
npm install
npm start
```

Access host at: 4201

---

## Technology Stack

All projects use:
- **Angular:** 19.2.0
- **TypeScript:** 5.7.2
- **RxJS:** 7.8.0
- **Testing:** Jasmine + Karma
- **Date Library:** Luxon (where applicable)

### Micro Frontend Stack:
- **@angular-architects/native-federation:** 20.0.6
- **es-module-shims:** 1.5.12

---

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm 9.x or later
- Angular CLI 19.x

### Installation

1. Clone the repository
2. Navigate to the desired project folder
3. Run installation and start commands

```bash
# Example: Date Range Picker
cd date-range-picker
npm install
npm start
```

---

## Development Ports

| Project | Port | URL |
|---------|------|-----|
| Date Range Picker | 4200 | http://localhost:4200 |
| Movie Host (Shell) | 4201 | http://localhost:4201 |
| Movie List Remote | 4202 | http://localhost:4202 |
| Ticket Availability Remote | 4203 | http://localhost:4203 |
| Calendar | 4204 | http://localhost:4204 |

---

## Testing

Each project includes unit tests:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

---

## Building for Production

```bash
# Navigate to project folder
cd <project-name>

# Build for production
npm run build

# Output will be in dist/ folder
```

---

## Project Structure

```
.
├── calendar/                    # Calendar component project
├── date-range-picker/          # Date range picker component
│   ├── src/app/
│   │   ├── components/         # Reusable components
│   │   ├── services/           # Business logic services
│   │   ├── models/             # TypeScript interfaces
│   │   ├── validators/         # Form validators
│   │   ├── utils/              # Utility functions
│   │   └── demo/               # Demo pages
│   └── README.md
└── Micro frontend/             # Micro frontend projects
    ├── movie-host/             # Shell application
    ├── movie-list/             # Movie catalog remote
    └── ticket-availability/    # Booking remote
```

---

## Documentation

- [Date Range Picker - Complete Documentation](date-range-picker/README.md)
- [Angular 19 Documentation](https://angular.dev)
- [Native Federation Guide](https://www.npmjs.com/package/@angular-architects/native-federation)
- [Luxon Documentation](https://moment.github.io/luxon/)

---

## Related Resources

- **Angular Signals:** Modern reactive programming in Angular
- **Standalone Components:** Component architecture without NgModules
- **ControlValueAccessor:** Custom form control integration
- **Native Federation:** Runtime micro frontend integration

---

## License

Each project may have its own license. Check individual project folders for details.

---

**Built with Angular 19 | February 2026**
