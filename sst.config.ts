/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "metawin",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    new sst.aws.Nextjs("MetawinSite", {
      environment: {
        NEXT_PUBLIC_SANITY_PROJECT_ID: "edcyyirq",
        NEXT_PUBLIC_SANITY_DATASET: "metawin-content",
        NEXT_PUBLIC_SANITY_API_VERSION: "2024-01-01",
      },
    });
  },
});
