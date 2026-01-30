import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Sanitizes and validates text input for OG image generation.
 * Removes control characters and enforces length limits.
 */
function sanitizeText(
  input: string | null,
  defaultValue: string,
  maxLength: number
): string {
  if (!input) {
    return defaultValue;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return defaultValue;
  }

  // Remove ASCII control characters that could cause rendering issues
  const sanitized = trimmed.replace(/[\x00-\x1F\x7F]/g, "");
  const truncated = sanitized.slice(0, maxLength);

  return truncated || defaultValue;
}

/**
 * Truncates text at word boundaries to avoid cutting words in half.
 * Handles Unicode characters properly.
 */
function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space before maxLength
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > maxLength * 0.5) {
    // Only use word boundary if it's past halfway
    return truncated.slice(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
}

/**
 * Determines font size based on title length with multiple breakpoints.
 */
function getTitleFontSize(titleLength: number): number {
  if (titleLength <= 30) return 72;
  if (titleLength <= 50) return 64;
  if (titleLength <= 80) return 48;
  return 40;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rawTitle = searchParams.get("title");
  const rawDescription = searchParams.get("description");
  const rawType = searchParams.get("type");

  const title = sanitizeText(rawTitle, "Dan Haight", 100);
  const description = sanitizeText(
    rawDescription,
    "Analytics Leadership & Technical Innovation",
    200
  );

  const allowedTypes = new Set(["website", "article"]);
  const type = rawType && allowedTypes.has(rawType) ? rawType : "website";

  // Build JSX element for OG image
  const imageElement = (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0a0a0a",
        padding: "60px",
      }}
    >
      {/* Top: Type badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {type === "article" && (
          <span
            style={{
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            Blog Post
          </span>
        )}
      </div>

      {/* Middle: Title and description */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h1
          style={{
            fontSize: `${getTitleFontSize(title.length)}px`,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {description && type === "article" && (
          <p
            style={{
              fontSize: "28px",
              color: "#a1a1aa",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {truncateAtWordBoundary(description, 120)}
          </p>
        )}
      </div>

      {/* Bottom: Branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            DH
          </div>
          <span
            style={{
              fontSize: "24px",
              color: "#ffffff",
              fontWeight: 500,
            }}
          >
            Dan Haight
          </span>
        </div>
        <span
          style={{
            fontSize: "22px",
            color: "#71717a",
          }}
        >
          danalytics.info
        </span>
      </div>
    </div>
  );

  try {
    return new ImageResponse(imageElement, {
      width: 1200,
      height: 630,
    });
  } catch (error) {
    console.error("Error generating OG image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
