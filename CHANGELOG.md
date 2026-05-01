# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
