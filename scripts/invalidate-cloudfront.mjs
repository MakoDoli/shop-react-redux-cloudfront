import path from "node:path";
import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";

const OUTPUTS_FILE = path.resolve("cdk-outputs.json");

async function readDistributionId() {
  const outputRaw = await fs.readFile(OUTPUTS_FILE, "utf8");
  const parsed = JSON.parse(outputRaw);
  const stackName = Object.keys(parsed)[0];

  if (!stackName) {
    throw new Error("cdk-outputs.json does not contain a deployed stack output.");
  }

  const stackOutput = parsed[stackName];
  const distributionId = stackOutput.DistributionId;

  if (!distributionId) {
    throw new Error("DistributionId was not found in cdk-outputs.json.");
  }

  return distributionId;
}

async function main() {
  const distributionId = await readDistributionId();
  const result = spawnSync(
    "aws",
    ["cloudfront", "create-invalidation", "--distribution-id", distributionId, "--paths", "/*"],
    { stdio: "inherit", shell: true }
  );

  if (result.status !== 0) {
    throw new Error("AWS CLI invalidation command failed.");
  }

  console.log("CloudFront invalidation created.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
