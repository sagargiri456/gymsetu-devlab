# GymSetu API Test Data

This directory contains comprehensive test data for the GymSetu backend API that can be used with Postman or any other API testing tool.

## Files Overview

### 1. `postman_test_data.json`
- **Purpose**: General test data structure and examples
- **Use**: Reference for understanding API endpoints and data formats
- **Contains**: Sample requests, responses, and data relationships

### 2. `GymSetu_API_Collection.postman_collection.json`
- **Purpose**: Complete Postman collection that can be imported directly
- **Use**: Import into Postman for immediate testing
- **Contains**: All API endpoints with pre-configured requests

### 3. `test_data_samples.json`
- **Purpose**: Detailed test scenarios and bulk data
- **Use**: For comprehensive testing and edge case validation
- **Contains**: Multiple test scenarios, bulk data, and edge cases

## Quick Start

### Option 1: Import Postman Collection
1. Open Postman
2. Click "Import" button
3. Select `GymSetu_API_Collection.postman_collection.json`
4. Set the `base_url` variable to `http://127.0.0.1:5000`
5. Start testing!

### Option 2: Manual Setup
1. Use the data from `postman_test_data.json` to create requests manually
2. Follow the test scenarios in `test_data_samples.json`

## Test Scenarios

### Basic Workflow
1. **Login** - Get access token
2. **Add Members** - Create gym members
3. **Add Trainers** - Add gym trainers
4. **Add Contests** - Create fitness contests
5. **Add Participants** - Register members for contests
6. **Add Subscriptions** - Create member subscriptions

### Data Relationships
- Members belong to Gyms (`gym_id`)
- Subscriptions link Members to Gyms
- Participants link Members to Contests
- All entities have proper foreign key relationships

## Sample Data Examples

### Member Data
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "555-0001",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "gym_id": 1
}
```

### Contest Data
```json
{
  "name": "Summer Strength Challenge",
  "description": "Compete to lift your limits and earn rewards!",
  "banner_link": "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800&q=60",
  "start_date": "2024-06-01T00:00:00.000Z",
  "end_date": "2024-08-31T23:59:59.000Z",
  "gym_id": 1
}
```

### Participant Data
```json
{
  "member_id": 1,
  "contest_id": 1,
  "contest_rank": 1,
  "gym_id": 1,
  "participant_status": "Active"
}
```

## Environment Variables

Set these variables in Postman:
- `base_url`: `http://127.0.0.1:5000`
- `access_token`: (Will be set automatically after login)

## Testing Tips

1. **Start with Login**: Always login first to get the access token
2. **Follow Dependencies**: Create gyms before members, members before participants
3. **Test Relationships**: Verify foreign key relationships work correctly
4. **Edge Cases**: Use the edge case data to test error handling
5. **Bulk Data**: Use bulk test data for performance testing

## Common Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/members/add_member` - Add new member
- `POST /api/trainers/add_trainer` - Add new trainer
- `POST /api/contests/add_contest` - Create new contest
- `POST /api/participants/add_participant` - Register participant
- `POST /api/subscriptions/add_subscription` - Create subscription

## Error Testing

The test data includes examples for:
- Invalid email formats
- Missing required fields
- Invalid date ranges
- Boundary value testing
- Performance testing with bulk data

## Notes

- All dates should be in ISO 8601 format
- Phone numbers can be in any format
- Email addresses should be valid
- Foreign key IDs should reference existing records
- Status fields should use predefined values (Active, Inactive, etc.)



