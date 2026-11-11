import assets from "./thumbnail_assets.svg";
import businessSnapshot from "./thumbnail_businesssnapshot.svg";
import clientActivity from "./thumbnail_clientactivity.svg";
import dayAtAGlance from "./thumbnail_dayataglance.svg";
import favoriteReports from "./thumbnail_favoritereportswidget.svg";
import lastHouseholdsViewed from "./thumbnail_lasthhviewed.svg";
import myLinks from "./thumbnail_mylinks.svg";
import statistics from "./thumbnail_statistics.svg";
import workflow from "./thumbnail_workflow.svg";
import notifications from "./thumbnail_notifications.svg";
import financialCalculators from "./thumbnail_fincalc.svg";
import insurance from "./thumbnail_insurance.svg";

/** Widget id -> thumbnail image. Ids without an image fall back to the drawn preview. */
export const WIDGET_THUMBNAILS: Record<string, string> = {
  assets,
  businessSnapshot,
  clientActivity,
  dayAtAGlance,
  favoriteReports,
  lastHouseholdsViewed,
  popularApplications: myLinks,
  statistics,
  workflows: workflow,
  workflow,
  notifications,
  financialCalculators,
  insurance,
};
