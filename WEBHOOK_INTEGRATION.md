# Webhook Integration Guide

This document describes the webhook integration that connects the AI Coach application to the n8n workflows.

## Webhooks

### 1. Generate Webhook
**Endpoint:** `https://girishgarry.app.n8n.cloud/webhook/coach-generate`

**Method:** POST

**Request Payload:**
```json
{
  "layer_number": 1,
  "user_input": "User's input text here",
  "project_id": "project-uuid-here"
}
```

**Response Expected:**
```json
{
  "ai_output": "AI generated output text",
  "...": "any other fields returned by your workflow"
}
```

**Trigger:** User clicks the "Generate" button after entering their input for a layer.

**Behavior:**
1. The user input is saved to the database
2. The webhook is called with layer number, user input, and project ID
3. The AI output from the response is displayed in the UI
4. The layer status is updated to "generated"
5. The UI is refreshed

---

### 2. Approve/Edit/Regenerate Webhook
**Endpoint:** `https://girishgarry.app.n8n.cloud/webhook/coach-approve`

**Method:** POST

**Request Payload:**
```json
{
  "layer_number": 1,
  "user_input": "User's input text here",
  "ai_output": "Current AI output",
  "action": "approve|edit|regenerate",
  "project_id": "project-uuid-here"
}
```

**Response Expected:**
```json
{
  "success": true,
  "ai_output": "New AI output (optional, only for regenerate)",
  "...": "any other fields returned by your workflow"
}
```

**Triggers:**
- **Approve Button:** Marks the layer as approved
- **Edit Button:** Sends the current state for editing workflow
- **Regenerate Button:** Regenerates AI output based on current input and output

**Behaviors:**
- **Approve:** Calls webhook with action="approve", updates layer status to "approved"
- **Edit:** Calls webhook with action="edit", no UI changes (workflow can handle modifications)
- **Regenerate:** Calls webhook with action="regenerate", updates AI output if returned in response, maintains "generated" status

---

## Implementation Details

### Files Modified/Created

1. **`lib/webhooks.ts`** - Webhook utility functions
   - `callGenerateWebhook()` - Calls the generate endpoint
   - `callApproveWebhook()` - Calls the approve endpoint
   - TypeScript interfaces for request/response types

2. **`components/workspace/layer-actions.tsx`** - Action buttons component
   - Integrated webhook calls
   - Error handling with user feedback
   - Loading states for each action
   - UI updates based on webhook responses

3. **`components/workspace/content.tsx`** - Main workspace display
   - Added AI output state management
   - Passes callback to update AI output when webhook returns data
   - Displays error messages from failed API calls

### Error Handling

All webhook calls include:
- Try-catch blocks to handle network errors
- Error messages displayed in the UI (red alert box)
- Graceful fallbacks with console logging
- Disabled buttons during loading states

### State Management

- User input is always saved before calling the generate webhook
- AI output updates are synchronous on successful webhook calls
- Database updates are made after UI state is confirmed
- Page refresh occurs after webhook success to ensure data consistency

## Testing the Integration

1. **Navigate to a project workspace**
2. **Enter text in the "Your Input" textarea**
3. **Click "Generate"** - This will:
   - Show "Generating..." state
   - Call the generate webhook
   - Display the AI output in the right panel
   - Show any errors in a red alert if the webhook fails

4. **Click "Approve"** - This will:
   - Show "Approving..." state
   - Call the approve webhook with action="approve"
   - Update the layer status badge to green (Approved)
   - Enable the "Next" button

5. **Click "Edit"** - This will:
   - Show "Editing..." state
   - Call the approve webhook with action="edit"
   - Useful for any pre-processing or validation in your workflow

6. **Click "Regenerate"** - This will:
   - Show "Regenerating..." state
   - Call the approve webhook with action="regenerate"
   - Updates the AI output if the webhook response includes `ai_output` field

## Environment Variables

The app uses these environment variables (provided by Supabase integration):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are already configured in the v0 project settings.

## Database Schema

The application stores:
- **projects table:** Project information including current layer
- **project_layers table:** Layer data including:
  - `layer_number`: 1-8
  - `layer_key`: Unique identifier (e.g., "layer_1")
  - `title`: Layer title
  - `status`: "pending", "generated", or "approved"
  - `user_input`: User's response (stored as JSONB)
  - `ai_output`: AI-generated output (stored as JSONB)
  - `approved_at`: Timestamp when approved

## Next Steps

Once the n8n workflows are set up:
1. Test each webhook independently
2. Verify JSON request/response formats match expectations
3. Add any additional data fields needed in the webhook payloads
4. Monitor the app UI for proper error handling and state updates
