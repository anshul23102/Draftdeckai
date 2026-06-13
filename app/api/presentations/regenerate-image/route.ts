import { logger } from "@/lib/logger";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { regenerateSlideImage } from "@/lib/flux-image-generator";
import { createRoute } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const supabase = await createRoute();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { prompt, size = "1024x576", imageType } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Generate new image with FLUX, applying the selected style preset
    const imageUrl = await regenerateSlideImage(prompt, size, imageType);

    return NextResponse.json({
      imageUrl,
      success: true,
    });
  } catch (error) {
    logger.error(
      { route: "app/api/presentations/regenerate-image/route.ts" },
      "Error regenerating image:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to regenerate image" },
      { status: 500 },
    );
  }
}
