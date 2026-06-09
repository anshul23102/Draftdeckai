import { NextRequest, NextResponse } from 'next/server';
import { generateAlternativeImages } from '@/lib/mistral';

export async function POST(req: NextRequest) {
  try {
    const { slideTitle, slideContent, count } = await req.json();
      return NextResponse.json({ error: 'slideTitle and slideContent are required' }, { status: 400 });
    }
    const images = await generateAlternativeImages(slideTitle, slideContent, count ?? 5);
    return NextResponse.json({ images });
  } catch (error) {
    console.error('[generate-alternative-images] Error:', error);
    return NextResponse.json({ error: 'Failed to generate image suggestions' }, { status: 500 });
  }
}
