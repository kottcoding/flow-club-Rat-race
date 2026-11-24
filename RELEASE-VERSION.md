# Flow Club release version
Public version starts at Ver 1.00. Before each subsequent published minor update, run:
    node scripts/bump-app-version.mjs
This advances 1.00 → 1.01 → 1.02 and updates both header and footer through lib/app-version.mjs.
Run once per release, not per build or retry. Do not change API_VERSION or RULE_VERSION just to change the public version.
