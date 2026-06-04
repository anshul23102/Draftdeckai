import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/usage-dashboard
 * Returns aggregated usage data for the authenticated user:
 *  - AI credit consumption (total, used, remaining)
 *  - Credit usage over time (daily/weekly/monthly)
 *  - Breakdown by document type
 *  - Most used templates and AI models
 *  - Recent generation history
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    const daysBack = range === '7d' ? 7 : range === '90d' ? 90 : 30;
    const since = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000).toISOString();

    // Run all queries in parallel for performance
    const [creditsResult, documentsResult, creditLogResult] = await Promise.all([
      // Credit info
      supabase
        .from('user_credits')
        .select('tier, credits_used, credits_total, credits_reset_at, subscription_status')
        .eq('user_id', user.id)
        .single(),

      // All user documents
      supabase
        .from('documents')
        .select('id, title, type, created_at, template_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),

      // Credit usage log within range
      supabase
        .from('credit_usage_log')
        .select('credits_used, action_type, created_at, metadata')
        .eq('user_id', user.id)
        .gte('created_at', since)
        .order('created_at', { ascending: true }),
    ]);

    const credits = creditsResult.data;
    const documents = documentsResult.data || [];
    const creditLog = creditLogResult.data || [];

    // --- Credit summary ---
    const creditsTotal = credits?.credits_total ?? 0;
    const creditsUsed = credits?.credits_used ?? 0;
    const creditsRemaining = creditsTotal - creditsUsed;

    // --- Document breakdown by type ---
    const docsByType: Record<string, number> = {};
    for (const doc of documents) {
      const type = doc.type || 'unknown';
      docsByType[type] = (docsByType[type] || 0) + 1;
    }
    const documentTypeBreakdown = Object.entries(docsByType).map(([type, count]) => ({
      type,
      count,
    }));

    // --- Credit usage over time (grouped by day) ---
    const usageByDay: Record<string, number> = {};
    for (const entry of creditLog) {
      const day = entry.created_at.slice(0, 10); // YYYY-MM-DD
      usageByDay[day] = (usageByDay[day] || 0) + (entry.credits_used || 0);
    }

    // Fill in missing days with 0 for a continuous timeline
    const creditUsageOverTime: { date: string; credits: number }[] = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = d.toISOString().slice(0, 10);
      creditUsageOverTime.push({ date: dayStr, credits: usageByDay[dayStr] || 0 });
    }

    // --- Most used AI models ---
    const modelCounts: Record<string, number> = {};
    for (const entry of creditLog) {
      const model: string = (entry.metadata as { model?: string })?.model || 'gemini';
      modelCounts[model] = (modelCounts[model] || 0) + 1;
    }
    const topModels = Object.entries(modelCounts)
      .map(([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // --- Most used action types ---
    const actionCounts: Record<string, number> = {};
    for (const entry of creditLog) {
      const action = entry.action_type || 'unknown';
      actionCounts[action] = (actionCounts[action] || 0) + 1;
    }
    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // --- Recent generation history (last 20 documents) ---
    const generationHistory = documents.slice(0, 20).map((doc) => ({
      id: doc.id,
      title: doc.title,
      type: doc.type,
      created_at: doc.created_at,
      template_id: doc.template_id,
    }));

    // --- Most used templates ---
    const templateCounts: Record<string, number> = {};
    for (const doc of documents) {
      if (doc.template_id) {
        templateCounts[doc.template_id] = (templateCounts[doc.template_id] || 0) + 1;
      }
    }
    const topTemplates = Object.entries(templateCounts)
      .map(([templateId, count]) => ({ templateId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      credits: {
        tier: credits?.tier || 'free',
        total: creditsTotal,
        used: creditsUsed,
        remaining: creditsRemaining,
        resetAt: credits?.credits_reset_at,
        subscriptionStatus: credits?.subscription_status || 'active',
      },
      totalDocuments: documents.length,
      documentTypeBreakdown,
      creditUsageOverTime,
      topModels,
      topActions,
      generationHistory,
      topTemplates,
      range,
    });
  } catch (error: unknown) {
    logger.error({ route: 'app/api/usage-dashboard/route.ts' }, 'Usage dashboard API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
