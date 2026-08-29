import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/gdrive/auth/status
 * Check Google Drive connection status
 */
export async function GET() {
  try {
    // Check if Google Drive MCP is configured
    const isConfigured = Boolean(process.env.GOOGLE_DRIVE_ENABLED);
    
    return NextResponse.json({
      connected: isConfigured,
      provider: "Google Drive",
      mcpServer: "gdrive",
      status: isConfigured ? "active" : "not_configured",
    });
  } catch (error) {
    console.error("Auth status check error:", error);
    return NextResponse.json(
      { error: "Failed to check auth status" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/gdrive/auth/connect
 * Initialize Google Drive OAuth flow
 */
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === "connect") {
      // In production, this would initiate OAuth flow
      // For demo, simulate successful connection
      return NextResponse.json({
        success: true,
        message: "Google Drive connected successfully",
        // In production, would return OAuth URL
        authUrl: null,
        connected: true,
      });
    }

    if (action === "disconnect") {
      return NextResponse.json({
        success: true,
        message: "Google Drive disconnected",
        connected: false,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth connection error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Google Drive" },
      { status: 500 },
    );
  }
}
