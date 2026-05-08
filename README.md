# RX Pay — UPI Payment Flow Demo

A functional UPI payment flow built with React Native + Expo, showcasing production-level mobile architecture.

## Features
- UPI ID validation and recipient resolution
- Multi-step payment flow (Verify → Amount → Confirm → Process → Result)
- Transaction history with local persistence (AsyncStorage)
- 20% simulated failure rate with realistic error messages
- Clean state management with Zustand + React Query

## Tech Stack
- React Native + Expo (TypeScript)
- Zustand — state management
- React Query — async state
- AsyncStorage — local persistence
- React Navigation — stack navigation

## Screens
- **Home** — Enter and verify UPI ID
- **Amount** — Enter payment amount and note
- **Confirm** — Review payment details
- **Processing** — Payment in progress
- **Result** — Success or failure with transaction ID
- **History** — All past transactions

## Run Locally
```bash
npm install
npx expo start
```
Scan QR code with Expo Go app.
