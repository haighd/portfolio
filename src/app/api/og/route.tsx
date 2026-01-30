import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "Dan Haight";
  const description = searchParams.get("description") || "Analytics Leadership & Technical Innovation";
  const type = searchParams.get("type") || "website";

  return new ImageResponse(
    (
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
              fontSize: title.length > 50 ? "48px" : "64px",
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
              {description.length > 120
                ? description.slice(0, 120) + "..."
                : description}
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
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
