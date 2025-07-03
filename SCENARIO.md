# JWT Encoder/Decoder Test Automation Plan


## Implemented Test Scenarios

### Scenario 1: Basic JWT Decoding Validation
**Description**: "Verify user can paste a JWT token and see it decoded into header/payload with 'Invalid Signature' warning."
**Priority**: High

**Steps**:
1. Navigate to JWT.io and ensure JWT Decoder tab is active
2. Paste a valid JWT token in the Encoded Value text area
3. Verify the decoded header shows correct algorithm (HS256) and type (JWT)
4. Verify the decoded payload contains expected values
5. Assert "Invalid Signature" message appears (without secret)

**Expected Results**:
- Header displays: `{"alg": "HS256", "typ": "JWT"}`
- Payload displays expected JSON structure with values a:1, b:2, c:3
- Signature status shows "Invalid Signature"

### Scenario 2: JWT Signature Verification with Correct Secret
**Description**: "Verify user can enter correct secret to change status from 'Invalid Signature' to 'Signature Verified'."
**Priority**: High

**Steps**:
1. Navigate to JWT.io and ensure JWT Decoder tab is active
2. Paste a valid JWT token in the Encoded Value text area
3. Verify "Invalid Signature" message initially appears
4. Enter the correct secret in the Secret field
5. Verify "Signature Verified" message appears
6. Confirm token remains unchanged
7. Verify payload values remain consistent

**Expected Results**:
- Initial state shows "Invalid Signature"
- After entering correct secret: "Signature Verified"
- Token value remains identical
- Payload data is preserved

### Scenario 3: JWT Signature Verification with Incorrect Secret
**Description**: "Verify user sees 'Invalid Signature' with wrong secrets but can still read decoded content."
**Priority**: High

**Steps**:
1. Navigate to JWT.io and ensure JWT Decoder tab is active
2. Paste a valid JWT token in the Encoded Value text area
3. Enter an incorrect secret in the Secret field
4. Verify "Invalid Signature" message persists
5. Try multiple incorrect secrets
6. Verify payload is still readable despite invalid signature
7. Verify header information remains accessible

**Expected Results**:
- "Invalid Signature" message remains visible with wrong secrets
- Payload is still decoded and displayed
- Header information remains accessible

### Scenario 4: JWT Encoding from Scratch
**Description**: "Verify user can create new JWT by entering custom header/payload/secret and decode it successfully."
**Priority**: High

**Steps**:
1. Navigate to JWT.io and switch to JWT Encoder tab
2. Modify the header JSON (algorithm, type)
3. Modify the payload JSON with custom data
4. Enter a secret for signing
5. Verify a new JWT token is generated
6. Switch back to Decoder tab
7. Verify the generated token decodes correctly
8. Verify signature is valid with the same secret

**Expected Results**:
- New JWT token generated in real-time
- Token format follows JWT standard (header.payload.signature)
- Decoding shows exact header and payload entered
- Signature verification works with same secret

### Scenario 5: Payload Manipulation and Token Regeneration
**Description**: "Verify user can modify payload data and see JWT token automatically regenerate with new values."
**Priority**: Medium

**Steps**:
1. Navigate to JWT.io and switch to JWT Encoder tab
2. Enter initial payload data
3. Set a secret for signing
4. Note the generated token
5. Modify payload values (add/remove/change fields)
6. Verify token changes automatically
7. Switch to Decoder tab and verify new payload
8. Confirm signature verification works

**Expected Results**:
- Token updates automatically with payload changes
- Each payload modification generates different token
- Signature remains valid with same secret
- Payload modifications are accurately reflected

### Scenario 6: Algorithm Switching Test
**Description**: "Verify user can switch algorithm from HS256 to HS512 and generate different valid tokens."
**Priority**: Medium

**Steps**:
1. Navigate to JWT.io and switch to JWT Encoder tab
2. Create a token with HS256 algorithm
3. Note the generated token and signature length
4. Change algorithm to HS512 in header and use 512-bit secret for signing
5. Verify token regenerates with different signature
6. Test decoding for each algorithm variant
7. Verify signature verification works for each

**Expected Results**:
- Different algorithms produce different signature lengths
- Token structure remains consistent (3 parts)
- Each algorithm variant decodes correctly
- Signature verification works for respective algorithms

### Scenario 7: Special Characters and Unicode Testing
**Description**: "Verify JWT handles special characters and Unicode in payload data."
**Priority**: Medium

**Steps**:
1. Navigate to JWT.io and switch to JWT Encoder tab
2. Create payload with special characters (!@#$%^&*)
3. Add Unicode characters (emojis, Chinese, Arabic, accented characters)
4. Generate token and verify encoding
5. Switch to Decoder tab and verify decoding
6. Verify Unicode characters are preserved
7. Verify special characters are encoded/decoded correctly
8. Verify very long string values are shown in decoded payload
9. Verify signature with secret

**Expected Results**:
- Special characters encoded/decoded correctly
- Unicode characters preserved (José María, 🚀✨🎉, 你好世界, مرحبا بالعالم)
- No data loss in round-trip encoding/decoding
- Generated tokens remain valid

### Scenario 8: Empty Fields and Error Handling
**Description**: "Verify token is not generated when required fields are empty and proper error messages appear."
**Priority**: High

**Steps**:
1. Navigate to JWT.io and switch to JWT Encoder tab
2. Test with empty header - verify no token generated
3. Test with empty payload - verify no token generated  
4. Test with empty secret - verify no token generated
5. Test with invalid header (missing 'alg') - verify secret field is disabled
6. Verify appropriate error messages appear for each case

**Expected Results**:
- Empty fields prevent token generation
- Error messages appear: "The header must be a valid JSON Object", "Unexpected end of JSON input"
- Missing 'alg' claim shows: "Missing 'alg' claim in header. Required by RFC 7515"
- Secret field is disabled when header has errors
- Message appears: "Fix any errors in the JWT header to enable editing this field"

## Test Data Requirements

### JWT Tokens for Testing
```json
{
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoxLCJiIjoyLCJjIjozLCJpYXQiOjE2OTYzOTc5Mjd9.6S9s1qxsu454fCUtOOME3Y_LLw7jq1owBleccDmPwvo",
  "secret": "helloworld",
  "newSecret": "newsecretnewsecretnewsecretnewsecret",
  "incorrectSecret": "wrongsecret"
}
```

### Headers for Testing
```json
{
  "customHeader": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "hs512Header": {
    "alg": "HS512", 
    "typ": "JWT"
  }
}
```

### Payload Test Data
```json
{
  "customPayload": {
    "sub": "123456789056",
    "name": "sumit kumar", 
    "admin": true
  },
  "modifiedPayload": {
    "sub": "987654321",
    "name": "Jane Smith",
    "admin": false,
    "role": "user"
  },
  "specialCharPayload": {
    "name": "José María",
    "emoji": "🚀✨🎉",
    "chinese": "你好世界", 
    "arabic": "مرحبا بالعالم",
    "specialChars": "!@#$%^&*()_+-=[]{}|;:,.<>?",
    "quotes": "He said \"Hello World\" and 'Welcome'",
    "escaped": "Line1\\nLine2\\tTabbed",
    "longString": "This is a very long string that contains many characters to test the handling of large text data..."
  }
}
```

### Secrets for Testing
```json
{
  "encoderSecret": "mysecretkey",
  "encoderSecret512": "mysecretkeymysecretkeymysecretkeymysecretkeymysecretkeymysecretkey"
}
```