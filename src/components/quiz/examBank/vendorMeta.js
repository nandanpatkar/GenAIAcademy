// Vendor → brand icon (via @iconify/react) + accent color, used for the
// Exam Bank card corner badges. Falls back to a generic badge for anything
// unmapped (e.g. AWS's welding-certification exams, which share the "AWS"
// name but aren't cloud content).
const VENDOR_META = {
  "AWS (Amazon Web Services)": { icon: "logos:aws", color: "#FF9900" },
  "AWS (American Welding Society)": { icon: "mdi:certificate-outline", color: "#9CA3AF" },
  "Azure": { icon: "logos:microsoft-azure", color: "#0078D4" },
  "Databricks": { icon: "simple-icons:databricks", color: "#FF3621" },
  "Google / GCP": { icon: "logos:google-cloud", color: "#4285F4" },
};

const DEFAULT_META = { icon: "mdi:certificate-outline", color: "var(--accent)" };

export function getVendorMeta(vendor) {
  return VENDOR_META[vendor] || DEFAULT_META;
}
