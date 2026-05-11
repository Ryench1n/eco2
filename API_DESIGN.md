# API Design for ECO Platform

## Overview

This document outlines the RESTful API design for the ECO (Esport Center Order) platform, covering 3 main endpoints: Users, PC Centers, and Bookings. URLs follow REST conventions with resource-based paths.

## Base URL

All endpoints are prefixed with `/api`.

## Endpoints

### Users

- **GET /api/users** - Retrieve all users
- **GET /api/users/:id** - Retrieve a specific user by ID
- **POST /api/users** - Create a new user
- **PUT /api/users/:id** - Update a user
- **DELETE /api/users/:id** - Delete a user

### PC Centers

- **GET /api/pc-centers** - Retrieve all PC centers
- **GET /api/pc-centers/:id** - Retrieve a specific PC center by ID
- **POST /api/pc-centers** - Create a new PC center
- **PUT /api/pc-centers/:id** - Update a PC center
- **DELETE /api/pc-centers/:id** - Delete a PC center

### Bookings

- **GET /api/bookings** - Retrieve all bookings
- **GET /api/bookings/:id** - Retrieve a specific booking by ID
- **POST /api/bookings** - Create a new booking
- **PUT /api/bookings/:id** - Update a booking
- **DELETE /api/bookings/:id** - Delete a booking

## Response Formats

- Success: 200 OK with JSON data
- Created: 201 Created
- Not Found: 404 Not Found
- Bad Request: 400 Bad Request
- Internal Error: 500 Internal Server Error

## Data Structures

- Users: { id, name, email, role }
- PC Centers: { id, name, location, capacity }
- Bookings: { id, userId, pcCenterId, date, time }
