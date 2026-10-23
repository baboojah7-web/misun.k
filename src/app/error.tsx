"use client";

import { site } from "@/config/site";
import { StatusPage } from "@/components/common/status-page";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatusPage
      title={site.errorPage.errorTitle}
      body={site.errorPage.errorBody}
      action={
        <button type="button" onClick={reset} className="btn btn-accent btn-lg">
          {site.errorPage.retry}
        </button>
      }
    />
  );
}
