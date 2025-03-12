# HIVAT Workshop: Load and Fuzz Testing a REST API  

## Overview  
A workshop exploring how to perform **load and fuzz testing** on a REST API using **Artillery** and **Playwright**, with scenarios for validating system performance and stability under high demand and invalid inputs.

### Tasks  
1. Write **load tests** to measure performance under heavy usage.  
2. Develop **fuzz tests** to test system behavior with invalid or malformed input.  

### Tools  
- **Artillery**: For creating and running high-throughput load test scenarios.  
- **Playwright**: For advanced fuzz testing and endpoint validation.

---

## Implemented Scenarios  

### 1. **Fuzz User Creation**  
Tests user creation with valid, invalid, and malformed JSON data to identify vulnerabilities in error handling and input validation. Response times are logged to compare system performance across scenarios.  

### 2. **Stress POST/GET Scenarios**  
Simulates load using POST and GET requests to assess system response times under increasing traffic. Includes tests for creating, retrieving, and deleting users and movies.  

### 3. **Load User Fetch Movies**  
Combines POST and GET requests to simulate user creation followed by multiple movie fetch operations, testing the API’s performance across phased traffic patterns (baseline, peak, and cool-down).  

### 4. **Invalid User Creation Validation**  
Tests resilience by sending invalid inputs (e.g., long strings, missing fields, malformed emails) to verify robust error handling and rejection of invalid requests.

## Installation  

### Prerequisites  
1. Ensure **MySQL** is installed and running locally.  
2. Update `settings.json` with your MySQL credentials.  

### Setup Instructions  
1. **Download the project**:  
  
2. **Install dependencies and set up the database**:  
   ```bash
   npm install
   npm run create-example-db  # If "cinema" database is not already created
   npm run backend
   ```

### Testing
Run load and fuzz tests by adjusting parameters (e.g., arrivalRate and duration) in the provided YAML configuration files to observe API behavior under various traffic conditions.

#### How to Run Tests
To run load tests:

```bash

npm run load-test
```
To execute a specific test:

```bash
npx artillery run load-tests/name_of_file.yml
```


