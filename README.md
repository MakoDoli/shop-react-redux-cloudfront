# AWS CDK Deployment Guide

This project now supports AWS CDK based infrastructure provisioning and static website deployment to S3 + CloudFront.

## Prerequisites

1. AWS CLI configured locally (`aws configure`).
2. Valid AWS credentials with permissions for S3, CloudFront, and CloudFormation.
3. Node.js and npm installed.

## Install dependencies

```bash
npm install
```

## 1) Automated Infra + App Deployment (manual invalidation flow)

This flow creates infrastructure with CDK, builds your app, and uploads `dist` files to S3.
After upload, invalidate CloudFront manually.

```bash
npm run cdk:bootstrap
npm run deploy:cdk:manual
```

Manual invalidation command:

```bash
npm run cloudfront:invalidate:cdk
```

You can also run pieces separately:

```bash
npm run cdk:synth
npm run cdk:deploy
npm run build:web
npm run site:upload:cdk
```

## 2) Destroy AWS infrastructure

This removes the CDK-managed S3 bucket and CloudFront distribution.

```bash
npm run cdk:destroy
```

## 3) Automated Infra + Build + Upload + Invalidation

This end-to-end flow deploys infra, builds your app, uploads to S3, and invalidates CloudFront in one command:

```bash
npm run deploy:cdk:auto
```

## Useful outputs

`npm run cdk:deploy` writes stack outputs to `cdk-outputs.json` (ignored by git), including:

1. S3 bucket name
2. CloudFront distribution ID
3. CloudFront URL

## Existing URLs

S3 website URL (legacy):

http://aws-for-js-shop-react.s3-website-us-east-1.amazonaws.com/

CloudFront URL (legacy):

https://d3b7a37p5eucdj.cloudfront.net/
