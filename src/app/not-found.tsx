import { site } from "@/config/site";
import { StatusPage } from "@/components/common/status-page";

export default function NotFound() {
  return <StatusPage title={site.errorPage.notFoundTitle} body={site.errorPage.notFoundBody} />;
}
