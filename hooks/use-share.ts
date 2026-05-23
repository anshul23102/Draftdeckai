"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Configuration options for the useShare hook.
 * All fields are optional; sensible defaults are applied when omitted.
 */
export interface ShareConfig {
  /** Default URL to share. Falls back to window.location.href when not provided. */
  url?: string;
  /** Title used for the Web Share API and as a subject hint for social platforms. */
  title?: string;
  /** Short descriptive text sent to social sharing targets. */
  text?: string;
  /** Subject line for the mailto share. */
  emailSubject?: string;
  /**
   * Body text for the mailto share (plain text, no HTML).
   * If omitted the resolved URL is appended automatically.
   */
  emailBody?: string;
}

export interface UseShareReturn {
  /** True for two seconds after a successful clipboard copy. */
  copied: boolean;
  copyToClipboard: (url?: string) => Promise<void>;
  shareViaEmail: (config?: Pick<ShareConfig, "url" | "emailSubject" | "emailBody">) => void;
  shareViaWhatsApp: (config?: Pick<ShareConfig, "url" | "text">) => void;
  shareViaTwitter: (config?: Pick<ShareConfig, "url" | "text">) => void;
  shareViaLinkedIn: (url?: string) => void;
  shareViaFacebook: (url?: string) => void;
  shareViaTelegram: (config?: Pick<ShareConfig, "url" | "text">) => void;
  shareViaWebShare: (config?: Pick<ShareConfig, "url" | "title" | "text">) => Promise<void>;
}

/**
 * useShare provides a single, reusable set of social-sharing utilities that
 * can be dropped into any component. It encapsulates clipboard access, all
 * seven supported share targets, the Web Share API wrapper, and success or
 * failure toast notifications so callers do not need to duplicate that logic.
 *
 * @param defaultUrl  URL shared by default. Falls back to window.location.href.
 * @param defaults    Default text/title/subject used when a caller omits them.
 */
export function useShare(
  defaultUrl?: string,
  defaults?: Omit<ShareConfig, "url">
): UseShareReturn {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const resolveUrl = useCallback(
    (override?: string): string =>
      override ??
      defaultUrl ??
      (typeof window !== "undefined" ? window.location.href : ""),
    [defaultUrl]
  );

  const copyToClipboard = useCallback(
    async (url?: string) => {
      const target = resolveUrl(url);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Link copied!",
          description: "Share link has been copied to your clipboard",
        });
      } catch {
        toast({
          title: "Failed to copy",
          description: "Please copy the URL manually",
          variant: "destructive",
        });
      }
    },
    [resolveUrl, toast]
  );

  const shareViaEmail = useCallback(
    (config?: Pick<ShareConfig, "url" | "emailSubject" | "emailBody">) => {
      const url = resolveUrl(config?.url);
      const subject = encodeURIComponent(
        config?.emailSubject ?? defaults?.emailSubject ?? "Check this out!"
      );
      const body = encodeURIComponent(
        config?.emailBody ??
          defaults?.emailBody ??
          `I wanted to share this link with you:\n\n${url}`
      );
      window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    },
    [resolveUrl, defaults?.emailSubject, defaults?.emailBody]
  );

  const shareViaWhatsApp = useCallback(
    (config?: Pick<ShareConfig, "url" | "text">) => {
      const url = resolveUrl(config?.url);
      const text = encodeURIComponent(
        config?.text ?? defaults?.text ?? `Check this out: ${url}`
      );
      window.open(`https://wa.me/?text=${text}`, "_blank");
    },
    [resolveUrl, defaults?.text]
  );

  const shareViaTwitter = useCallback(
    (config?: Pick<ShareConfig, "url" | "text">) => {
      const url = resolveUrl(config?.url);
      const text = encodeURIComponent(
        config?.text ?? defaults?.text ?? "Check this out!"
      );
      const encodedUrl = encodeURIComponent(url);
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
        "_blank"
      );
    },
    [resolveUrl, defaults?.text]
  );

  const shareViaLinkedIn = useCallback(
    (url?: string) => {
      const encodedUrl = encodeURIComponent(resolveUrl(url));
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        "_blank"
      );
    },
    [resolveUrl]
  );

  const shareViaFacebook = useCallback(
    (url?: string) => {
      const encodedUrl = encodeURIComponent(resolveUrl(url));
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        "_blank"
      );
    },
    [resolveUrl]
  );

  const shareViaTelegram = useCallback(
    (config?: Pick<ShareConfig, "url" | "text">) => {
      const url = resolveUrl(config?.url);
      const text = encodeURIComponent(
        config?.text ?? defaults?.text ?? "Check this out!"
      );
      const encodedUrl = encodeURIComponent(url);
      window.open(
        `https://t.me/share/url?url=${encodedUrl}&text=${text}`,
        "_blank"
      );
    },
    [resolveUrl, defaults?.text]
  );

  const shareViaWebShare = useCallback(
    async (config?: Pick<ShareConfig, "url" | "title" | "text">) => {
      const url = resolveUrl(config?.url);
      if (navigator.share) {
        try {
          await navigator.share({
            title: config?.title ?? defaults?.title ?? "Shared via DraftDeckAI",
            text: config?.text ?? defaults?.text ?? "Check this out!",
            url,
          });
          toast({
            title: "Shared successfully!",
            description: "Content shared via Web Share API",
          });
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            toast({
              title: "Share failed",
              description: "An error occurred while sharing. Please try again.",
              variant: "destructive",
            });
          }
        }
      } else {
        await copyToClipboard(url);
      }
    },
    [resolveUrl, defaults?.title, defaults?.text, copyToClipboard, toast]
  );

  return {
    copied,
    copyToClipboard,
    shareViaEmail,
    shareViaWhatsApp,
    shareViaTwitter,
    shareViaLinkedIn,
    shareViaFacebook,
    shareViaTelegram,
    shareViaWebShare,
  };
}
