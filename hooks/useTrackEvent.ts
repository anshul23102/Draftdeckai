"use client";

import { usePlausible } from "next-plausible";
import { logger } from "@/lib/logger";

export function useTrackEvent() {
  const plausible = usePlausible();

  const trackEvent = (
    eventName: string,
    additionalProps: Record<string, any> = {},
  ) => {
    let utmData = {};

    // 1. Check if we have any trapped UTMs in storage
    if (typeof window !== "undefined") {
      const savedUTMs = sessionStorage.getItem("draftdeck_utms");
      if (savedUTMs) {
        try {
          utmData = JSON.parse(savedUTMs);
        } catch (e) {
          logger.error(
            { route: "hooks/useTrackEvent.ts" },
            "Failed to parse UTM data",
            e,
          );
        }
      }
    }

    // 2. Fire the event to Plausible, combining our UTMs with any extra data
    plausible(eventName, {
      props: {
        ...additionalProps,
        ...utmData,
      },
    });

    logger.debug(
      { route: "hooks/useTrackEvent.ts" },
      `📡 Event Tracked: ${eventName}`,
      { ...additionalProps, ...utmData },
    );
  };

  return { trackEvent };
}
