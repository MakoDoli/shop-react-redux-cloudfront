#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ShopWebAppStack } from "../lib/shop-web-app-stack";

const app = new cdk.App();

new ShopWebAppStack(app, "ShopWebAppStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "us-east-1"
  }
});
