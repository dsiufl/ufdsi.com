/**
 * Google Form → ufdsi.com drafts.
 *
 * Sends each form response to /api/webhooks/submissions, which saves it as a draft
 * workshop or news post. An admin attaches a cover and publishes it from /admin.
 *
 * Setup
 * 1. Generate a token: `openssl rand -hex 32`.
 * 2. Hosting: set FORMS_WEBHOOK_TOKEN to that token and redeploy.
 * 3. In the form: ⋮ → Apps Script, paste this file in.
 *    Project Settings → Script Properties: add WEBHOOK_TOKEN (same token). Add WEBHOOK_URL
 *    too if you're not posting to production.
 * 4. Triggers (clock icon) → Add Trigger: onFormSubmit, From form, On form submit.
 *    Approve the permissions prompt.
 * 5. Submit a test response, then check Executions for errors and /admin for the draft.
 *
 * The form needs a question named "Type" (Workshop or News) unless DEFAULT_TYPE is set.
 * Turn on Settings → Responses → Collect email addresses to fill in who submitted it.
 * Question titles are matched case-insensitively against FIELDS below; anything else is ignored.
 */

var DEFAULT_URL = "https://ufdsi.com/api/webhooks/submissions";
var DEFAULT_TYPE = ""; // e.g. "workshop" for a form that only takes workshops

// question title (lowercase) → field name, per type
var FIELDS = {
  workshop: {
    "title": "title",
    "workshop title": "title",
    "speaker": "speaker",
    "speaker(s)": "speaker",
    "date and time": "datetime",
    "date & time": "datetime",
    "description": "description",
    "link": "link",
    "notebook, slides or recording link": "link",
    "location": "location",
  },
  news: {
    "title": "title",
    "headline": "title",
    "category": "category",
    "summary": "summary",
    "content": "content",
    "body": "content",
  },
};

function onFormSubmit(e) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty("WEBHOOK_TOKEN");
  if (!token) throw new Error("Set the WEBHOOK_TOKEN script property first.");

  var answers = {};
  e.response.getItemResponses().forEach(function (r) {
    answers[r.getItem().getTitle().trim().toLowerCase()] = r.getResponse();
  });

  var type = String(answers["type"] || DEFAULT_TYPE).trim().toLowerCase();
  var map = FIELDS[type] || {};
  var fields = {};
  Object.keys(answers).forEach(function (title) {
    if (map[title]) fields[map[title]] = answers[title];
  });

  var res = UrlFetchApp.fetch(props.getProperty("WEBHOOK_URL") || DEFAULT_URL, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + token },
    payload: JSON.stringify({
      type: type,
      responseId: e.response.getId(),
      fields: fields,
      email: e.response.getRespondentEmail() || undefined,
    }),
    muteHttpExceptions: true,
  });

  var code = res.getResponseCode();
  if (code < 200 || code >= 300) {
    console.error("Webhook returned " + code + ": " + res.getContentText());
  }
}
