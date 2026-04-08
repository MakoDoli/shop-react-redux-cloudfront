import path from "node:path";
import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";

const OUTPUTS_FILE = path.resolve("cdk-outputs.json");
const DIST_DIR = path.resolve("dist");
const shouldInvalidate = process.argv.includes("--invalidate");

async function readStackOutputs() {
  const outputRaw = await fs.readFile(OUTPUTS_FILE, "utf8");
  const parsed = JSON.parse(outputRaw);
  const stackName = Object.keys(parsed)[0];

  if (!stackName) {
    throw new Error("cdk-outputs.json does not contain a deployed stack output.");
  }

  const stackOutput = parsed[stackName];
  const bucketName = stackOutput.WebsiteBucketName;
  const distributionId = stackOutput.DistributionId;

  if (!bucketName) {
    throw new Error("WebsiteBucketName was not found in cdk-outputs.json.");
  }

  if (!distributionId) {
    throw new Error("DistributionId was not found in cdk-outputs.json.");
  }

  return { bucketName, distributionId };
}

function runAwsCli(args) {
  const result = spawnSync("aws", args, { stdio: "inherit", shell: true });

  if (result.status !== 0) {
    throw new Error(`AWS CLI command failed: aws ${args.join(" ")}`);
  }
}

function uploadBuild(bucketName) {
  runAwsCli(["s3", "sync", DIST_DIR, `s3://${bucketName}`, "--delete"]);
}

function invalidateDistribution(distributionId) {
  runAwsCli([
    "cloudfront",
    "create-invalidation",
    "--distribution-id",
    distributionId,
    "--paths",
    "/*"
  ]);

  console.log("CloudFront invalidation created.");
}

async function main() {
  const { bucketName, distributionId } = await readStackOutputs();
  await fs.access(DIST_DIR);

  uploadBuild(bucketName);

  if (shouldInvalidate) {
    invalidateDistribution(distributionId);
  } else {
    console.log("Upload complete. Manual invalidation is required for this flow.");
    console.log(`Run: npm run cloudfront:invalidate:cdk`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
