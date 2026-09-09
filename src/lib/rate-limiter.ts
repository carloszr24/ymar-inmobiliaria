import { createAdminSupabase } from '@/lib/supabase/admin'

export type RateLimitOptions = {
  maxAttempts: number
  windowMinutes: number
  blockMinutes: number
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfter?: Date
}

type RateLimitRow = {
  id: string
  key: string
  window_start: string
  attempts: number
  blocked_until: string | null
}

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  try {
    const supabase = createAdminSupabase()
    const now = new Date()
    const windowStartCutoff = new Date(now.getTime() - options.windowMinutes * 60 * 1000)

    const { data: rows, error: selectError } = await supabase
      .from('rate_limits')
      .select('id, key, window_start, attempts, blocked_until')
      .eq('key', key)
      .gte('window_start', windowStartCutoff.toISOString())
      .order('window_start', { ascending: false })
      .limit(1)

    if (selectError) throw selectError

    const row = (rows?.[0] as RateLimitRow | undefined) ?? null

    if (!row) {
      const { error: insertError } = await supabase.from('rate_limits').insert({
        key,
        window_start: now.toISOString(),
        attempts: 1,
        blocked_until: null,
      })
      if (insertError) throw insertError
      return { allowed: true, remaining: Math.max(0, options.maxAttempts - 1) }
    }

    if (row.blocked_until) {
      const blockedUntil = new Date(row.blocked_until)
      if (blockedUntil > now) {
        return {
          allowed: false,
          remaining: 0,
          retryAfter: blockedUntil,
        }
      }
    }

    if (row.attempts < options.maxAttempts) {
      const nextAttempts = row.attempts + 1
      const { error: updateError } = await supabase
        .from('rate_limits')
        .update({ attempts: nextAttempts })
        .eq('id', row.id)
      if (updateError) throw updateError
      return {
        allowed: true,
        remaining: Math.max(0, options.maxAttempts - nextAttempts),
      }
    }

    const blockedUntil = new Date(now.getTime() + options.blockMinutes * 60 * 1000)
    const { error: blockError } = await supabase
      .from('rate_limits')
      .update({ blocked_until: blockedUntil.toISOString() })
      .eq('id', row.id)
    if (blockError) throw blockError

    return {
      allowed: false,
      remaining: 0,
      retryAfter: blockedUntil,
    }
  } catch (error) {
    console.error('[rate-limiter] Fallo al consultar/actualizar rate_limits. Fail-open:', error)
    return { allowed: true, remaining: options.maxAttempts }
  }
}

export async function isRateLimitBlocked(key: string): Promise<{
  blocked: boolean
  retryAfter?: Date
}> {
  try {
    const supabase = createAdminSupabase()
    const now = new Date()

    const { data: rows, error } = await supabase
      .from('rate_limits')
      .select('blocked_until')
      .eq('key', key)
      .not('blocked_until', 'is', null)
      .gt('blocked_until', now.toISOString())
      .order('blocked_until', { ascending: false })
      .limit(1)

    if (error) throw error

    const blockedUntil = rows?.[0]?.blocked_until
    if (!blockedUntil) return { blocked: false }

    return { blocked: true, retryAfter: new Date(blockedUntil) }
  } catch (error) {
    console.error('[rate-limiter] Fallo al comprobar bloqueo. Fail-open:', error)
    return { blocked: false }
  }
}

export async function resetRateLimit(key: string): Promise<void> {
  try {
    const supabase = createAdminSupabase()
    const { error } = await supabase.from('rate_limits').delete().eq('key', key)
    if (error) throw error
  } catch (error) {
    console.error('[rate-limiter] Fallo al resetear rate limit:', error)
  }
}
