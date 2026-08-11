import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const ALERT_EMAIL = "admin@kdcandfilms.com";
const healthWorkflow = readFileSync(".github/workflows/domain-health-check.yml", "utf8");
const testWorkflow = readFileSync(".github/workflows/email-alert-test.yml", "utf8");

describe("email alert configuration", () => {
  it("emails the owner when the domain health check fails", () => {
    expect(healthWorkflow).toContain("dawidd6/action-send-mail");
    expect(healthWorkflow).toContain(ALERT_EMAIL);
    expect(healthWorkflow).toContain("if: failure()");
  });

  it("no longer depends on Slack", () => {
    expect(healthWorkflow.toLowerCase()).not.toContain("slack");
  });

  it("still opens a GitHub issue on failure as a backup alert", () => {
    expect(healthWorkflow).toContain("actions/github-script");
    expect(healthWorkflow).toContain("domain-health");
  });

  it("has a manually runnable self-test that sends a real test email", () => {
    expect(testWorkflow).toContain("workflow_dispatch");
    expect(testWorkflow).toContain("dawidd6/action-send-mail");
    expect(testWorkflow).toContain(ALERT_EMAIL);
  });

  it("self-test fails loudly when the mail secrets are missing", () => {
    expect(testWorkflow).toContain("MAIL_USERNAME");
    expect(testWorkflow).toContain("MAIL_PASSWORD");
    expect(testWorkflow).toContain("exit 1");
  });
});
