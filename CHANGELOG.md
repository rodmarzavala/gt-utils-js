# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.7] - 2026-05-01

### Security
- Removed hardcoded sensitive identifying information (NIT/CUI) from all documentation examples and replaced them con generic mock data to prevent personal data leakage.

### Chore
- Reduced NPM package size by excluding documentation source code from the final tarball.

## [1.0.4] - 2026-05-01

### Added
- Created a dedicated `docs/installation.md` page for better visibility of installation instructions and basic usage.

### Changed
- Consolidated GitHub Actions workflows (`ci.yml`, `deploy.yml`, `publish.yml`) into a single, parallelized `ci.yml` pipeline.

### Fixed
- Fixed NPM Provenance (OIDC) deployment issues by delegating authentication natively to `npm publish` and avoiding empty/legacy `NPM_TOKEN` collisions.
- Resolved GitHub Pages `Environment protection rules` error preventing deployments triggered by tags.

## [1.0.3] - 2026-05-01

### Changed
- **BREAKING**: Renamed package to scoped `@rodmarzavala/gt-utils-js`.
- Removed emojis from documentation to improve technical formalism.
- Configured automated NPM deployments using OpenID Connect (Trusted Publishers).

## [1.0.2] - 2026-05-01

### Added
- Included package installation instructions (`npm`, `yarn`, `pnpm`, `bun`) on the VitePress documentation homepage.

## [1.0.1] - 2026-05-01

### Fixed
- Added `ignoreDeprecations: "6.0"` to silence `TS5101` warning breaking CI/CD pipeline on TypeScript 6.x builds.

## [1.0.0] - 2026-05-01

### Added
- **Core Identity (`gt-utils-js/identity`)**
  - Validation for traditional NITs (`isValidNit`).
  - Validation for 13-digit CUI/DPI using strict Modulo 11 checksum (`isValidCui`).
  - Extract geographical data from CUI trailing digits (`getCuiInformation`).
  - Adheres to SAT 2025 rule allowing DPI as valid NIT.

- **Finance & Taxes (`gt-utils-js/finance`, `gt-utils-js/taxes`)**
  - Convert monetary amounts to Spanish text for electronic invoicing (FEL) via `amountToWords`.
  - Calculate precise Guatemalan taxes (IVA 12%, ISR 5%/7% based on total) depending on Regime ('GENERAL', 'SMALL_TAXPAYER') via `calculateTaxes`.
  - Infer banks from IBAN/account prefixes (`getBankFromAccount`).

- **Labor & HR (`gt-utils-js/labor`)**
  - Robust Severance Calculator (`calculateSeverance`) processing proportional Aguinaldo, Bono 14, and Vacations.
  - Indemnity calculations based on "14 salaries / 12 months" formula when dealing with Unjustified Firing.

- **Geography (`gt-utils-js/geo`)**
  - Offline Reverse Geocoding via `findMunicipalityByLatLng` utilizing a local dataset and Ray-Casting algorithm.
  - Maps `(Lat, Lng)` coordinate pairs to corresponding Department and Municipality.

- **Holidays & Calendar (`gt-utils-js/holidays`, `gt-utils-js/calendar`)**
  - Computus astronomy algorithm dynamically calculates Easter/Semana Santa for any given year.
  - Hardcoded list of official national holidays.
  - Implementation of "Decreto 42-2010" (Ley de Turismo Interno) shifting movable holidays (e.g. Día del Ejército) to Monday.

- **Vehicles (`gt-utils-js/vehicles`)**
  - Strict Guatemalan License Plate validation parsing plate types (P, C, M, A, U, etc.) and separating numeric and alphanumeric segments (`parseLicensePlate`).

- **Documentation & CI/CD**
  - Fully documented VitePress site covering all edge-first functionalities.
  - Integrated GitHub Actions pipeline for linting, security audits, parallel testing, and automated GitHub Pages deployment.
  - `playground.ts` added to showcase common implementation scenarios.

### Changed
- Refactored entire codebase to strict TypeScript with Zero Dependencies.
- Configured Edge-first outputs supporting ESM and CJS formats via `tsup`.
