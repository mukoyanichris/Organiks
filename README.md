# Poultry Management System Documentation 🐔

## Overview

This system is designed to manage poultry records, egg production records, and egg pricing information on the Internet Computer (IC) using Azle, a TypeScript framework for IC development. It supports creating, retrieving, updating, and deleting records with stability and efficiency through stable B-Tree maps.

## Dependencies

- `@dfinity/candid`: Utilized for Candid types and serialization.
- `azle`: The core framework for defining interactions with the Internet Computer.
- `uuid`: To generate unique identifiers for each record.

## 🚀 Installation

To set up the Poultry Management System on your local machine or server, follow these steps:

### Prerequisites

Ensure you have the following installed:

- Node.js (recommended: the latest LTS version)
- A package manager like npm or Yarn

### Step 1: Clone the Repository

Clone the application repository to your local machine:

```bash
git https://github.com/warrenshiv/organiks.git
cd organiks
```

## Data Structures 🛠️

### Structs

#### `PoultryRecord` 🐔

- Represents a poultry record.
- Fields:
    - `id`: Unique identifier (UUID).
    - `record_name`: Descriptive name of the poultry record.
    - `age_month`: Age in months.
    - `weight_kg`: Weight in kilograms.
    - `health_status`: Health status of the poultry.
    - `category`: Category or type of poultry.
    - `creator`: The Principal ID of the record's creator.
    - `createdAt`: Timestamp of creation.
    - `updatedAt`: Optional timestamp of the last update.

#### `EggRecord` 🥚📜

- Represents an egg record.
- Fields:
    - `id`: Unique identifier (UUID).
    - `egg_type`: Type of egg.
    - `total_egg_count`: Total number of eggs produced.
    - `cracked_egg_count`: Number of cracked eggs.
    - `creator`: The Principal ID of the record's creator.
    - `createdAt`: Timestamp of creation.
    - `updatedAt`: Optional timestamp of the last update.

#### `EggOrder` 🛒🥚

- Represents an egg order.
- Fields:
  - `id`: Unique identifier for the order.
  - `customer_name`: String representing the name of the customer.
  - `egg_type`: Type of the egg in the order.
  - `quantity`: Quantity of eggs in the order.
  - `total_price`: Total price of the order.
  - `created_at`: Timestamp indicating when the order was placed.

#### `EggPrice` 💰🥚

- Represents an egg price.
- Fields:
    - `id`: Unique identifier (UUID).
    - `price`: Price per egg.
    - `egg_type`: Type of egg.
    - `createdAt`: Timestamp of creation.
    - `updatedAt`: Optional timestamp of the last update.

## 🛠 Functionalities Overview

## Poultry 🐔

### 🐥 Get All Poultry Records

Retrieves all stored poultry records from the system. If no records are found or an error occurs, an appropriate error message is returned.

### 📄 Get Specific Poultry Record

Fetches a specific poultry record by its unique ID. Verifies that the provided ID exists and is valid.

### ➕ Add Poultry Record

Creates and stores a new poultry record using provided data. Ensures all necessary fields are validated before adding the record.

### 🔄 Update Poultry Record

Updates an existing poultry record with new details. Performs data validation and checks for the record's existence before applying updates.

### 🏷 Filter Poultry Records by Category

Selects poultry records that match a specified category. Validates the category input and ensures records exist within it.

### ❌ Delete Poultry Record

Removes a poultry record from the system based on its unique ID, after verifying the record exists.

### 📊 Get Poultry Records by Health Status

Retrieves poultry records matching a specific health status. Validates the input health status and checks for record existence.

## Eggs🥚📜

### 🥚 Get All Egg Records

Fetches all egg production records stored in the system. Returns an error message if no records are found or an error occurs.

### 📄 Get Specific Egg Record

Retrieves a specific egg record by its ID, ensuring the ID is valid and exists within the system.

### ➕ Add Egg Record

Allows the addition of a new egg production record with provided details, after performing necessary validations on the data.

### 🔄 Update Egg Record

Updates details of an existing egg record. Checks for the record's existence and validates the data before updating.

### ❌ Delete Egg Record

Deletes an egg record based on its unique ID, following a verification of the record's presence in the system.


## Egg Price💰

### 💰 Get All Egg Prices

Retrieves all egg price records. If no records are found or there's an error, an appropriate message is returned.

### 📄 Get Specific Egg Price

Fetches a particular egg price record by its ID. Ensures the ID is valid and the record exists.

### ➕ Add Egg Price Record

Creates a new record for egg pricing with the provided information, following a validation of the data.

### 🔄 Update Egg Price Record

Updates an existing egg price record. Validates the data and ensures the record exists before applying changes.

### ❌ Delete Egg Price Record

Removes an egg price record from the system based on its ID, after confirming the record's existence.

### 📊 Filter Egg Records by Type

Selects egg records matching a specified egg type. Ensures the input type is valid and that matching records exist.

### 📈 Get Egg Prices by Type

Retrieves egg price records for a specific type of egg. Validates the egg type and ensures records are available.

### 🗂 Pagination Support for Records

Enables browsing through records (poultry, egg, or egg prices) in paginated form. This functionality allows users to specify a range (start and end) to fetch a subset of records, ensuring efficient data retrieval without overwhelming the system or the user

## Error Handling 🚨

The system employs robust error handling mechanisms to ensure reliability and ease of use:

- **Validation Errors**: All inputs are validated for correctness before processing. If an input does not meet the expected format or value, an error message clearly indicates the issue.

- **Existence Checks**: Before updating or deleting records, the system checks for their existence. Non-existent records trigger an error message informing the user of the issue.

- **System Errors**: Any unexpected system errors are caught and returned as generic error messages to prevent sensitive system information leakage.

- **Pagination Errors**: Incorrect pagination range inputs result in errors, guiding users to correct their request.


This overview encapsulates the core functionalities provided by the system for managing poultry records, egg production, and egg pricing efficiently, with an emphasis on validation and error handling to ensure data integrity and usability.
