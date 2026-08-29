# Google Drive Integration

The Foundry platform includes Google Drive integration to allow businesses to import financial data directly from their Drive files.

## Setup

1. **Configure MCP Server**
   
   The Google Drive MCP server is configured in `.cursor/mcp.json`:

   ```json
   {
     "mcpServers": {
       "gdrive": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-gdrive"]
       }
     }
   }
   ```

2. **Enable in Environment**
   
   Add to your `.env.local`:

   ```bash
   GOOGLE_DRIVE_ENABLED=true
   ```

3. **Access the Integration**
   
   Navigate to `/admin/gdrive` to:
   - Connect your Google Drive account
   - View available Excel/CSV files
   - Import financial documents
   - Download and parse data

## Features

- **OAuth Authentication**: Secure connection via Google OAuth
- **File Filtering**: Automatically shows only Excel (.xlsx) and CSV files
- **Real-time Sync**: See your latest Drive files
- **One-click Import**: Download and parse files directly
- **File Preview**: View file details before importing

## API Endpoints

### `GET /api/gdrive/auth`
Check connection status

### `POST /api/gdrive/auth`
Connect or disconnect Google Drive
```json
{ "action": "connect" | "disconnect" }
```

### `GET /api/gdrive/files`
List files from Google Drive
- Query params: `?fileType=spreadsheet&folderId=xxx`

### `POST /api/gdrive/files`
Download a specific file
```json
{ "fileId": "abc123", "fileName": "report.xlsx" }
```

## Usage Flow

1. Admin visits `/admin/gdrive`
2. Clicks "Connect Google Drive"
3. Authorizes access (OAuth flow)
4. System lists available financial files
5. Admin clicks "Import" on desired files
6. Files are downloaded and parsed
7. Data becomes available in dashboard

## Demo Mode

When `GOOGLE_DRIVE_ENABLED=false` or not set, the integration works in demo mode:
- Shows sample files from Google Drive
- Simulates connection/import flow
- No actual OAuth required
- Perfect for testing and demos

## Production Setup

For production deployment with real Google Drive access:

1. Create a Google Cloud project
2. Enable Google Drive API
3. Configure OAuth credentials
4. Set environment variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_secret
   GOOGLE_DRIVE_ENABLED=true
   ```

The MCP server handles the OAuth flow and file access automatically.
