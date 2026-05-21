# Interest Rate Calculator

An interactive web application built with **Angular 24** and **Node.js 11** that helps users calculate and compare **Simple Interest (SI)** and **Compound Interest (CI)** over a selected investment duration.

The application provides detailed financial insights through:

- Real-time calculations
- Year-by-year earnings breakdown
- Visual comparison charts
- Difference analysis between SI and CI
- Automatic currency detection based on the user's current location

---

## Features

### Interest Calculations

- Calculate **Simple Interest (SI)**
- Calculate **Compound Interest (CI)**
- Compare both side-by-side
- Display total earnings and maturity amounts

### User Inputs

The application accepts the following inputs:

| Field                        | Description                              |
|------------------------------|------------------------------------------|
| Principal Amount             | Initial investment amount                |
| Opening Balance _(Optional)_ | Existing balance before investment       |
| Rate of Interest             | Annual interest rate (%)                 |
| Number of Years              | Investment duration                      |
| Auto Step Up (%)             | Annual percentage increase in investment |

---

## Comparison & Analytics

### SI vs CI Comparison

- Compare growth between Simple Interest and Compound Interest
- View total difference in returns
- Understand long-term investment impact

### Interactive Chart

A graphical representation is displayed with:

- **X-axis:** Number of Years
- **Y-axis:** Amount

The chart visually compares:

- Simple Interest growth
- Compound Interest growth

### Year-by-Year Breakdown

A detailed yearly table includes:

- Year
- Investment amount
- SI earnings
- CI earnings
- Total accumulated value
- Difference between SI and CI

---

## Currency Support

The application automatically defaults the currency based on the user's current geographical location.

Example:

- India → INR (₹)
- USA → USD ($)
- UK → GBP (£)

---

## Tech Stack

### Frontend

- Angular 24
- TypeScript
- Angular Material / Charts Library

### Backend

- Node.js 11

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/sharmasatvik/interest-calculator.git
cd interest-rate-calculator
```

---

## Frontend Setup

Install dependencies:

```bash
npm install
```

Run Angular application:

```bash
npx ng serve
```

Application will run at:

```bash
http://localhost:4200
```

---

## Formula Used

### Simple Interest

```text
SI = (P × R × T) / 100
```

Where:

- P = Principal Amount
- R = Rate of Interest
- T = Time in Years

---

### Compound Interest

```text
CI = P × (1 + R/100)^T
```

---

## Planned Enhancements

- Export reports to PDF/Excel
- Dark mode support
---
