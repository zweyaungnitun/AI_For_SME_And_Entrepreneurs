import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  modifiedTime: string;
  webViewLink?: string;
};

/**
 * GET /api/gdrive/files
 * List files from Google Drive
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folderId = searchParams.get("folderId");
    const fileType = searchParams.get("fileType"); // 'spreadsheet', 'document', etc.

    // In production, this would call the Google Drive API via MCP
    // For now, return mock data structure that matches Google Drive API
    const mockFiles: DriveFile[] = [
      {
        id: "1abc",
        name: "Financial_Report_August_2026.xlsx",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: "245000",
        modifiedTime: "2026-08-28T10:30:00Z",
        webViewLink: "https://drive.google.com/file/d/1abc/view",
      },
      {
        id: "2def",
        name: "Supplier_Invoices_Q3.csv",
        mimeType: "text/csv",
        size: "89000",
        modifiedTime: "2026-08-25T14:20:00Z",
        webViewLink: "https://drive.google.com/file/d/2def/view",
      },
      {
        id: "3ghi",
        name: "Cash_Flow_Statement.xlsx",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: "156000",
        modifiedTime: "2026-08-20T09:15:00Z",
        webViewLink: "https://drive.google.com/file/d/3ghi/view",
      },
    ];

    // Filter by file type if specified
    let filteredFiles = mockFiles;
    if (fileType === "spreadsheet") {
      filteredFiles = mockFiles.filter(
        (f) =>
          f.mimeType.includes("spreadsheet") ||
          f.name.endsWith(".xlsx") ||
          f.name.endsWith(".csv"),
      );
    }

    return NextResponse.json({
      files: filteredFiles,
      nextPageToken: null,
    });
  } catch (error) {
    console.error("Google Drive API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Google Drive files" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/gdrive/download
 * Download a file from Google Drive
 */
export async function POST(request: NextRequest) {
  try {
    const { fileId, fileName } = await request.json();

    if (!fileId) {
      return NextResponse.json({ error: "File ID required" }, { status: 400 });
    }

    // In production, this would download the file via Google Drive API
    // For demo, return success response
    return NextResponse.json({
      success: true,
      fileId,
      fileName,
      message: "File downloaded successfully",
      // In production, would include file content or download URL
    });
  } catch (error) {
    console.error("Google Drive download error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 },
    );
  }
}
