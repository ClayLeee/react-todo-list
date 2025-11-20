---
tools: ['playwright']
description: 'Manually test a site and create a report'
mode: 'agent'
---

# Manual Testing Instructions

1. Use the Playwright MCP Server to navigate to the website, take a page snapshot and analyze the key functionalities. Then manually test the scenario provided by the user. Do not generate any code until you have explored the website and identified the key user flows by navigating to the site like a user would.
2. Navigate to the url provided by the user and perform the described interactions. If no url is provided, ask the user to provide one.
3. Observe and verify the expected behavior, focusing on accessibility, UI structure, and user experience.
4. Report back in clear, natural language:
  - What steps you preformed (navigation, interactions, assertions).
  - What you observed (outcomes, UI changes, accessibility results).
  - Any issues, unexpected behaviors, or accessibility concerns found.
5. Reference URLs, element roles, and relevant details to support your findings.

Example report format:

-**Scenario:** [Brief description]
-**Steps Token:** [List of actions performed]
-**Outcomes:** [What happened, including any assertions or accessibility checks]
-**Issues Found:** [List any problems or unexpected results]

DO run steps one by one using the tools provided by the Playwright MCP.
- Generate a .md file with report in the `tests` directory and include any relevant screenshots or shapshots.
- Take screenshots or snapshots of the page if necessary to illustrate issues or confirm expected behavior.
- Implement a Playwright TypeScript test that uses @playwright/test based on the .md report, auto retrying assertions and with no added timeouts unless necessary as Playwright has built in retries and autowaiting if the correct locators and assertions are used.
- Save generated test file in the `tests` directory.
- Execute the test file and iterate until the test passes.
- Include appropriate assertions to verify the expected behavior.
- Structure tests properly with descriptive test titles and comments.
- Close the browser after completing the manual test.
