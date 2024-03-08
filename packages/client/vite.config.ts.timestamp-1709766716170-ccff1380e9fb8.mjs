var __glob = (map) => (path2) => {
  var fn = map[path2];
  if (fn)
    return fn();
  throw new Error("Module not found in bundle: " + path2);
};

// vite.config.ts
import { viteCommonjs } from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/@originjs/vite-plugin-commonjs/lib/index.js";
import packageRoot from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/app-root-path/index.js";
import dotenv from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/dotenv/lib/main.js";
import fs from "fs";
import lodash from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/lodash/lodash.js";
import path from "path";
import { defineConfig } from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/vite/dist/node/index.js";
import viteCompression from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/vite-plugin-compression/dist/index.mjs";
import { ViteEjsPlugin } from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/vite-plugin-ejs/index.js";
import { nodePolyfills } from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/vite-plugin-node-polyfills/dist/index.js";
import svgr from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/vite-plugin-svgr/dist/index.js";

// manifest.default.json
var manifest_default_default = {
  name: "Ethereal Engine",
  start_url: "/",
  id: "EtherealEngine",
  short_name: "EE",
  description: "Connected Worlds for Everyone",
  theme_color: "#ffffff",
  background_color: "#ffffff",
  display: "standalone",
  icons: [
    {
      src: "android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png"
    },
    {
      src: "apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    },
    {
      src: "favicon-16x16.png",
      sizes: "16x16",
      type: "image/png"
    },
    {
      src: "favicon-32x32.png",
      sizes: "32x32",
      type: "image/png"
    },
    {
      src: "mstile-150x150.png",
      sizes: "150x150",
      type: "image/png"
    }
  ]
};

// pwa.config.ts
import { VitePWA } from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/vite-plugin-pwa/dist/index.mjs";
var PWA = (clientSetting) => VitePWA({
  srcDir: "public",
  filename: "service-worker.js",
  // Merge custom client settings with default values from manifest.default.json
  manifest: {
    ...manifest_default_default,
    name: clientSetting?.title || "Ethereal Engine",
    description: clientSetting?.siteDescription || "Connected Worlds for Everyone",
    short_name: clientSetting?.shortName || "EE",
    theme_color: clientSetting?.themeColor || "#ffffff",
    background_color: clientSetting?.backgroundColor || "#000000",
    start_url: process.env.APP_ENV === "development" || process.env.VITE_LOCAL_BUILD === "true" ? "/" : process.env.APP_URL,
    scope: `./`,
    id: `ETHEREAL_ENGINE`,
    protocol_handlers: [
      {
        protocol: "web+etherealengine",
        url: "/?deeplink=%s"
      }
    ]
  },
  useCredentials: true,
  // Use generateSW when building
  strategies: "generateSW",
  // Set mode to development or production depending on environment variable
  mode: process.env.APP_ENV === "development" ? "development" : "production",
  injectRegister: null,
  includeManifestIcons: true,
  devOptions: {
    // Enable dev options only during development
    enabled: process.env.APP_ENV === "development" ? true : false,
    // Navigate to index.html for all 404 errors during development
    navigateFallback: void 0,
    // Allowlist all paths for navigateFallback during development
    navigateFallbackAllowlist: [
      // allow everything
      new RegExp("^/.*$"),
      // allow @fs
      new RegExp("^/@fs/.*$")
    ]
  },
  workbox: {
    // don't wait for service worker to become active
    skipWaiting: true,
    // claim clients immediately
    clientsClaim: true,
    // show source maps
    sourcemap: process.env.APP_ENV === "development" ? false : true,
    // Set the path for the service worker file
    swDest: process.env.APP_ENV === "development" ? "public/service-worker.js" : "dist/service-worker.js",
    // Navigate to index.html for all 404 errors during production
    navigateFallback: null,
    // Allowlist all paths for navigateFallback during production
    navigateFallbackAllowlist: [
      // allow everything
      new RegExp("^/.*$")
    ],
    // Set the glob directory and patterns for the cache
    globDirectory: process.env.APP_ENV === "development" ? "./public" : "./dist",
    globPatterns: [
      // fonts
      "**/*.{woff2,woff,ttf,eot}",
      // images
      "**/*.{png,jpg,jpeg,gif,svg,ico}",
      // media
      "**/*.{mp3,mp4,webm}",
      // code
      "**/*.{js, css}",
      // docs
      "**/*.{txt,xml,json,pdf}",
      // 3d objects
      "**/*.{gltf,glb,bin,mtl}",
      // compressed
      "**/*.{br, gzip, zip,rar,7z}",
      // webassembly
      "**/*.{wasm}",
      // ktx2
      "**/*.{ktx2}"
    ],
    // Enable cleanup of outdated caches
    cleanupOutdatedCaches: true,
    // Set maximum cache size to 10 MB
    maximumFileSizeToCacheInBytes: 1e3 * 1e3 * 10,
    runtimeCaching: [
      // Cache static
      {
        urlPattern: ({ url }) => {
          return /\/static?.*/i.test(url.href);
        },
        handler: "CacheFirst",
        options: {
          cacheName: "static-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 * 30
            // <== 30 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      // Cache static resources
      {
        urlPattern: ({ url }) => {
          return /\/static-resources?.*/i.test(url.href);
        },
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 * 30
            // <== 30 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      // Cache sfx assets
      {
        urlPattern: ({ url }) => {
          return /\/sfx?.*/i.test(url.href);
        },
        handler: "CacheFirst",
        options: {
          cacheName: "sfx-assets-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 * 30
            // <== 30 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      // Cache local assets
      {
        urlPattern: ({ url }) => {
          return /\/assets?.*/i.test(url.href);
        },
        handler: "CacheFirst",
        options: {
          cacheName: "build-assets-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 * 30
            // <== 30 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      // Cache local fonts
      {
        urlPattern: ({ url }) => {
          return /\/fonts?.*/i.test(url.href);
        },
        handler: "CacheFirst",
        options: {
          cacheName: "fonts-assets-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 * 30
            // <== 30 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      // Cache local icons
      {
        urlPattern: ({ url }) => {
          return /\/icons?.*/.test(url.href);
        },
        handler: "CacheFirst",
        options: {
          cacheName: "icons-assets-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 * 30
            // <== 30 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      // Cache local static assets
      {
        urlPattern: ({ url }) => {
          return /\/static?.*/i.test(url.href);
        },
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 * 30
            // <== 30 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      // Cache google font requests
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365
            // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "gstatic-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365
            // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      // Cache all requests
      {
        urlPattern: /^https?:\/\/.*\..*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "all-content-cache",
          expiration: {
            maxEntries: 1e3,
            maxAgeSeconds: 24 * 60 * 60
            // <== 24 hours
          },
          cacheableResponse: {
            statuses: [0, 200]
          },
          networkTimeoutSeconds: 10
        }
      },
      // Cache everything else
      {
        urlPattern: /^\/*/,
        handler: "CacheFirst",
        options: {
          cacheName: "all-local-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 * 30
            // <== 30 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
});
var pwa_config_default = PWA;

// scripts/getClientSettings.ts
import knex from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/knex/knex.js";

// ../server-core/src/setting/client-setting/client-setting.resolvers.ts
import { resolve, virtual } from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/@feathersjs/schema/lib/index.js";
import { v4 } from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/uuid/wrapper.mjs";

// ../common/src/utils/datetime-sql.ts
var getDateTimeSql = async () => {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
};
var fromDateTimeSql = (date) => {
  let dateObj;
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  return dateObj.getFullYear() + "-" + ("00" + (dateObj.getMonth() + 1)).slice(-2) + "-" + ("00" + dateObj.getDate()).slice(-2) + "T" + ("00" + dateObj.getHours()).slice(-2) + ":" + ("00" + dateObj.getMinutes()).slice(-2) + ":" + ("00" + dateObj.getSeconds()).slice(-2) + ".000Z";
};

// ../server-core/src/setting/client-setting/client-setting.resolvers.ts
var clientDbToSchema = (rawData) => {
  let appSocialLinks = JSON.parse(rawData.appSocialLinks);
  if (typeof appSocialLinks === "string") {
    appSocialLinks = JSON.parse(appSocialLinks);
  }
  let themeSettings = JSON.parse(rawData.themeSettings);
  if (typeof themeSettings === "string") {
    themeSettings = JSON.parse(themeSettings);
  }
  let themeModes = JSON.parse(rawData.themeModes);
  if (typeof themeModes === "string") {
    themeModes = JSON.parse(themeModes);
  }
  if (typeof rawData.mediaSettings === "string")
    rawData.mediaSettings = JSON.parse(rawData.mediaSettings);
  return {
    ...rawData,
    appSocialLinks,
    themeSettings,
    themeModes
  };
};
var clientSettingResolver = resolve(
  {
    createdAt: virtual(async (clientSetting) => fromDateTimeSql(clientSetting.createdAt)),
    updatedAt: virtual(async (clientSetting) => fromDateTimeSql(clientSetting.updatedAt))
  },
  {
    // Convert the raw data into a new structure before running property resolvers
    converter: async (rawData, context) => {
      return clientDbToSchema(rawData);
    }
  }
);
var clientSettingExternalResolver = resolve({});
var clientSettingDataResolver = resolve(
  {
    id: async () => {
      return v4();
    },
    createdAt: getDateTimeSql,
    updatedAt: getDateTimeSql
  },
  {
    // Convert the raw data into a new structure before running property resolvers
    converter: async (rawData, context) => {
      return {
        ...rawData,
        appSocialLinks: JSON.stringify(rawData.appSocialLinks),
        themeSettings: JSON.stringify(rawData.themeSettings),
        themeModes: JSON.stringify(rawData.themeModes),
        mediaSettings: JSON.stringify(rawData.mediaSettings)
      };
    }
  }
);
var clientSettingPatchResolver = resolve(
  {
    updatedAt: getDateTimeSql
  },
  {
    // Convert the raw data into a new structure before running property resolvers
    converter: async (rawData, context) => {
      return {
        ...rawData,
        appSocialLinks: JSON.stringify(rawData.appSocialLinks),
        themeSettings: JSON.stringify(rawData.themeSettings),
        themeModes: JSON.stringify(rawData.themeModes),
        mediaSettings: JSON.stringify(rawData.mediaSettings)
      };
    }
  }
);
var clientSettingQueryResolver = resolve({});

// ../common/src/schemas/setting/client-setting.schema.ts
import { getValidator, querySyntax, Type } from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/@feathersjs/typebox/lib/index.js";

// ../common/src/schemas/validators.ts
import { addFormats, Ajv } from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/@feathersjs/schema/lib/index.js";
var formats = [
  "date-time",
  "time",
  "date",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri",
  "uri-reference",
  "uuid",
  "uri-template",
  "json-pointer",
  "relative-json-pointer",
  "regex"
];
var dataValidator = addFormats(new Ajv({}), formats);
var queryValidator = addFormats(
  new Ajv({
    coerceTypes: true
  }),
  formats
);

// ../common/src/schemas/setting/client-setting.schema.ts
var clientSettingPath = "client-setting";
var clientSocialLinkSchema = Type.Object(
  {
    link: Type.String(),
    icon: Type.String()
  },
  { $id: "ClientSocialLink", additionalProperties: false }
);
var audioSettingsSchema = Type.Object(
  {
    maxBitrate: Type.Number()
  },
  { $id: "AudioSettingsSchema", additionalProperties: false }
);
var videoSettingsSchema = Type.Object(
  {
    codec: Type.String(),
    maxResolution: Type.String(),
    lowResMaxBitrate: Type.Number(),
    midResMaxBitrate: Type.Number(),
    highResMaxBitrate: Type.Number()
  },
  { $id: "VideoSettingsSchema", additionalProperties: false }
);
var screenshareSettingsSchema = Type.Object(
  {
    codec: Type.String(),
    lowResMaxBitrate: Type.Number(),
    midResMaxBitrate: Type.Number(),
    highResMaxBitrate: Type.Number()
  },
  { $id: "ScreenshareSettingsSchema", additionalProperties: false }
);
var mediaSettingsSchema = Type.Object(
  {
    audio: Type.Ref(audioSettingsSchema),
    video: Type.Ref(videoSettingsSchema),
    screenshare: Type.Ref(screenshareSettingsSchema)
  },
  { $id: "MediaSettingsSchema", additionalProperties: false }
);
var clientThemeOptionsSchema = Type.Object(
  {
    textColor: Type.String(),
    navbarBackground: Type.String(),
    sidebarBackground: Type.String(),
    sidebarSelectedBackground: Type.String(),
    mainBackground: Type.String(),
    panelBackground: Type.String(),
    panelCards: Type.String(),
    panelCardHoverOutline: Type.String(),
    panelCardIcon: Type.String(),
    textHeading: Type.String(),
    textSubheading: Type.String(),
    textDescription: Type.String(),
    iconButtonColor: Type.String(),
    iconButtonHoverColor: Type.String(),
    iconButtonBackground: Type.String(),
    iconButtonSelectedBackground: Type.String(),
    buttonOutlined: Type.String(),
    buttonFilled: Type.String(),
    buttonGradientStart: Type.String(),
    buttonGradientEnd: Type.String(),
    buttonTextColor: Type.String(),
    scrollbarThumbXAxisStart: Type.String(),
    scrollbarThumbXAxisEnd: Type.String(),
    scrollbarThumbYAxisStart: Type.String(),
    scrollbarThumbYAxisEnd: Type.String(),
    scrollbarCorner: Type.String(),
    inputOutline: Type.String(),
    inputBackground: Type.String(),
    primaryHighlight: Type.String(),
    dropdownMenuBackground: Type.String(),
    dropdownMenuHoverBackground: Type.String(),
    dropdownMenuSelectedBackground: Type.String(),
    drawerBackground: Type.String(),
    popupBackground: Type.String(),
    tableHeaderBackground: Type.String(),
    tableCellBackground: Type.String(),
    tableFooterBackground: Type.String(),
    dockBackground: Type.String()
  },
  { $id: "ClientThemeOptions", additionalProperties: false }
);
var clientSettingSchema = Type.Object(
  {
    id: Type.String({
      format: "uuid"
    }),
    logo: Type.String(),
    title: Type.String(),
    shortTitle: Type.String(),
    startPath: Type.String(),
    url: Type.String(),
    releaseName: Type.String(),
    siteDescription: Type.String(),
    appleTouchIcon: Type.String(),
    favicon32px: Type.String(),
    favicon16px: Type.String(),
    icon192px: Type.String(),
    icon512px: Type.String(),
    webmanifestLink: Type.String(),
    swScriptLink: Type.String(),
    appBackground: Type.String(),
    appTitle: Type.String(),
    appSubtitle: Type.String(),
    appDescription: Type.String(),
    appSocialLinks: Type.Array(Type.Ref(clientSocialLinkSchema)),
    themeSettings: Type.Record(Type.String(), Type.Ref(clientThemeOptionsSchema)),
    themeModes: Type.Record(Type.String(), Type.String()),
    key8thWall: Type.String(),
    privacyPolicy: Type.String(),
    homepageLinkButtonEnabled: Type.Boolean(),
    homepageLinkButtonRedirect: Type.String(),
    homepageLinkButtonText: Type.String(),
    createdAt: Type.String({ format: "date-time" }),
    updatedAt: Type.String({ format: "date-time" }),
    mediaSettings: Type.Ref(mediaSettingsSchema)
  },
  { $id: "ClientSetting", additionalProperties: false }
);
var clientSettingDataSchema = Type.Pick(
  clientSettingSchema,
  [
    "logo",
    "title",
    "shortTitle",
    "startPath",
    "url",
    "releaseName",
    "siteDescription",
    "favicon32px",
    "favicon16px",
    "icon192px",
    "icon512px",
    "webmanifestLink",
    "swScriptLink",
    "appBackground",
    "appTitle",
    "appSubtitle",
    "appDescription",
    "appSocialLinks",
    "themeSettings",
    "themeModes",
    "key8thWall",
    "privacyPolicy",
    "homepageLinkButtonEnabled",
    "homepageLinkButtonRedirect",
    "homepageLinkButtonText",
    "mediaSettings"
  ],
  {
    $id: "ClientSettingData"
  }
);
var clientSettingPatchSchema = Type.Partial(clientSettingSchema, {
  $id: "ClientSettingPatch"
});
var clientSettingQueryProperties = Type.Pick(clientSettingSchema, [
  "id",
  "logo",
  "title",
  "shortTitle",
  "startPath",
  "url",
  "releaseName",
  "siteDescription",
  "favicon32px",
  "favicon16px",
  "icon192px",
  "icon512px",
  "webmanifestLink",
  "swScriptLink",
  "appBackground",
  "appTitle",
  "appSubtitle",
  "appDescription",
  // 'appSocialLinks', Commented out because: https://discord.com/channels/509848480760725514/1093914405546229840/1095101536121667694
  // 'themeSettings',
  // 'themeModes',
  "key8thWall",
  "privacyPolicy",
  "homepageLinkButtonEnabled",
  "homepageLinkButtonRedirect",
  "homepageLinkButtonText"
]);
var clientSettingQuerySchema = Type.Intersect(
  [
    querySyntax(clientSettingQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
);

// scripts/getClientSettings.ts
var getClientSetting = async () => {
  const knexClient = knex({
    client: "mysql",
    connection: {
      user: process.env.MYSQL_USER ?? "server",
      password: process.env.MYSQL_PASSWORD ?? "password",
      host: process.env.MYSQL_HOST ?? "127.0.0.1",
      port: parseInt(process.env.MYSQL_PORT || "3306"),
      database: process.env.MYSQL_DATABASE ?? "etherealengine",
      charset: "utf8mb4"
    }
  });
  const clientSetting = await knexClient.select().from(clientSettingPath).then(([dbClient]) => {
    const dbClientConfig = clientDbToSchema(dbClient) || {
      logo: "./logo.svg",
      title: "Ethereal Engine",
      url: "https://local.etherealengine.org",
      releaseName: "local",
      siteDescription: "Connected Worlds for Everyone",
      favicon32px: "/favicon-32x32.png",
      favicon16px: "/favicon-16x16.png",
      icon192px: "/android-chrome-192x192.png",
      icon512px: "/android-chrome-512x512.png"
    };
    if (dbClientConfig) {
      return dbClientConfig;
    }
  }).catch((e) => {
    console.warn("[vite.config]: Failed to read clientSetting");
    console.warn(e);
  });
  await knexClient.destroy();
  return clientSetting;
};

// scripts/getCoilSettings.ts
import knex2 from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/knex/knex.js";

// ../common/src/schemas/setting/coil-setting.schema.ts
import { getValidator as getValidator2, querySyntax as querySyntax2, Type as Type2 } from "file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/@feathersjs/typebox/lib/index.js";
var coilSettingPath = "coil-setting";
var coilSettingSchema = Type2.Object(
  {
    id: Type2.String({
      format: "uuid"
    }),
    paymentPointer: Type2.String(),
    clientId: Type2.String(),
    clientSecret: Type2.String(),
    createdAt: Type2.String({ format: "date-time" }),
    updatedAt: Type2.String({ format: "date-time" })
  },
  { $id: "CoilSetting", additionalProperties: false }
);
var coilSettingDataSchema = Type2.Pick(coilSettingSchema, ["paymentPointer", "clientId", "clientSecret"], {
  $id: "CoilSettingData"
});
var coilSettingPatchSchema = Type2.Partial(coilSettingSchema, {
  $id: "CoilSettingPatch"
});
var coilSettingQueryProperties = Type2.Pick(coilSettingSchema, [
  "id",
  "paymentPointer",
  "clientId",
  "clientSecret"
]);
var coilSettingQuerySchema = Type2.Intersect(
  [
    querySyntax2(coilSettingQueryProperties),
    // Add additional query properties here
    Type2.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
);

// scripts/getCoilSettings.ts
var getCoilSetting = async () => {
  const knexClient = knex2({
    client: "mysql",
    connection: {
      user: process.env.MYSQL_USER ?? "server",
      password: process.env.MYSQL_PASSWORD ?? "password",
      host: process.env.MYSQL_HOST ?? "127.0.0.1",
      port: parseInt(process.env.MYSQL_PORT || "3306"),
      database: process.env.MYSQL_DATABASE ?? "etherealengine",
      charset: "utf8mb4"
    }
  });
  const coilSetting = await knexClient.select().from(coilSettingPath).then(([dbCoil]) => {
    if (dbCoil) {
      return dbCoil;
    }
  }).catch((e) => {
    console.warn("[vite.config]: Failed to read coilSetting");
    console.warn(e);
  });
  await knexClient.destroy();
  return coilSetting;
};

// import("../projects/projects/**/*/vite.config.extension.ts") in vite.config.ts
var globImport_projects_projects_vite_config_extension_ts = __glob({});

// vite.config.ts
var __vite_injected_original_dirname = "/home/nazarii/Desktop/Ubiengine/etherealengine/packages/client";
var { isArray, mergeWith } = lodash;
var parseModuleName = (moduleName) => {
  if (moduleName.includes("medisoup")) {
    return `vendor_medisoup-client_${moduleName.toString().split("client/lib/")[1].split("/")[0].toString()}`;
  }
  if (moduleName.includes("@fortawesome")) {
    return `vendor_@fortawesome_${moduleName.toString().split("@fortawesome/")[1].split("/")[0].toString()}`;
  }
  if (moduleName.includes("apexcharts")) {
    return `vendor_apexcharts_${moduleName.toString().split("dist/")[1].split("/")[0].toString()}`;
  }
  if (moduleName.includes("@feathersjs")) {
    return `vendor_feathersjs_${moduleName.toString().split("@feathersjs/")[1].split("/")[0].toString()}`;
  }
  if (moduleName.includes("@reactflow")) {
    return `vendor_reactflow_${moduleName.toString().split("@reactflow/")[1].split("/")[0].toString()}`;
  }
  if (moduleName.includes("react-dom")) {
    return `vendor_react-dom_${moduleName.toString().split("react-dom/")[1].split("/")[0].toString()}`;
  }
  if (moduleName.includes("react-icons")) {
    return `vendor_react-icons_${moduleName.toString().split("react-icons/")[1].split("/")[0].toString()}`;
  }
  if (moduleName.includes("react-color")) {
    return `vendor_react-color_${moduleName.toString().split("react-color/")[1].split("/")[0].toString()}`;
  }
  if (moduleName.includes("@pixiv")) {
    if (moduleName.includes("@pixiv/three-vrm")) {
      return `vendor_@pixiv_three-vrm_${moduleName.toString().split("three-vrm")[1].split("/")[0].toString()}`;
    }
    return `vendor_@pixiv_${moduleName.toString().split("@pixiv/")[1].split("/")[0].toString()}`;
  }
  if (moduleName.includes("three")) {
    if (moduleName.includes("quarks/dist")) {
      return `vendor_three_quarks_${moduleName.toString().split("dist/")[1].split("/")[0].toString()}`;
    }
    if (moduleName.includes("three")) {
      return `vendor_three_build_${moduleName.toString().split("/")[1].split("/")[0].toString()}`;
    }
  }
  if (moduleName.includes("@mui")) {
    if (moduleName.includes("@mui/matererial")) {
      return `vendor_@mui_material_${moduleName.toString().split("@mui/material/")[1].split("/")[0].toString()}`;
    } else if (moduleName.includes("@mui/x-date-pickers")) {
      return `vendor_@mui_x-date-pickers_${moduleName.toString().split("@mui/x-date-pickers/")[1].split("/")[0].toString()}`;
    }
    return `vendor_@mui_${moduleName.toString().split("@mui/")[1].split("/")[0].toString()}`;
  }
  if (moduleName.includes("@dimforge")) {
    return `vendor_@dimforge_${moduleName.toString().split("rapier3d-compat/")[1].split("/")[0].toString()}`;
  }
  return `vendor_${moduleName.toString().split("node_modules/")[1].split("/")[0].toString()}`;
};
var merge = (src, dest) => mergeWith({}, src, dest, function(a, b) {
  if (isArray(a)) {
    return b.concat(a);
  }
});
import("file:///home/nazarii/Desktop/Ubiengine/etherealengine/node_modules/ts-node/dist/index.js").then((tsnode) => {
  tsnode.register({
    project: "./tsconfig.json"
  });
});
var getProjectConfigExtensions = async (config) => {
  const projects = fs.readdirSync(path.resolve(__vite_injected_original_dirname, "../projects/projects/"), { withFileTypes: true }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
  for (const project of projects) {
    const staticPath = path.resolve(__vite_injected_original_dirname, `../projects/projects/`, project, "vite.config.extension.ts");
    if (fs.existsSync(staticPath)) {
      try {
        const { default: viteConfigExtension } = await globImport_projects_projects_vite_config_extension_ts(`../projects/projects/${project}/vite.config.extension.ts`);
        if (typeof viteConfigExtension === "function") {
          const configExtension = await viteConfigExtension();
          config.plugins = [...config.plugins, ...configExtension.default.plugins];
          delete configExtension.default.plugins;
          config = merge(config, configExtension.default);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  return config;
};
function mediapipe_workaround() {
  return {
    name: "mediapipe_workaround",
    load(id) {
      const MEDIAPIPE_EXPORT_NAMES = {
        "pose.js": [
          "POSE_LANDMARKS",
          "POSE_CONNECTIONS",
          "POSE_LANDMARKS_LEFT",
          "POSE_LANDMARKS_RIGHT",
          "POSE_LANDMARKS_NEUTRAL",
          "Pose",
          "VERSION"
        ],
        "hands.js": ["VERSION", "HAND_CONNECTIONS", "Hands"],
        "camera_utils.js": ["Camera"],
        "drawing_utils.js": ["drawConnectors", "drawLandmarks", "lerp"],
        "control_utils.js": [
          "drawConnectors",
          "FPS",
          "ControlPanel",
          "StaticText",
          "Toggle",
          "SourcePicker",
          // 'InputImage', not working with this export. Is defined in index.d.ts
          // but is not defined in control_utils.js
          "InputImage",
          "Slider"
        ]
      };
      const fileName = path.basename(id);
      if (!(fileName in MEDIAPIPE_EXPORT_NAMES))
        return null;
      let code = fs.readFileSync(id, "utf-8");
      for (const name of MEDIAPIPE_EXPORT_NAMES[fileName]) {
        code += `exports.${name} = ${name};`;
      }
      return { code };
    }
  };
}
var deleteDirFilesUsingPattern = (pattern, dirPath) => {
  fs.readdir(dirPath, (err, fileNames) => {
    if (err)
      throw err;
    for (const name of fileNames) {
      if (pattern.test(name)) {
        fs.unlink(path.resolve(dirPath, name), (err2) => {
          if (err2)
            throw err2;
          console.log(`Deleted ${name}`);
        });
      }
    }
  });
};
var resetSWFiles = () => {
  deleteDirFilesUsingPattern(/webmanifest/, "./public/");
  deleteDirFilesUsingPattern(/service-/, "./public/");
  deleteDirFilesUsingPattern(/workbox-/, "./public/");
};
var vite_config_default = defineConfig(async () => {
  dotenv.config({
    path: packageRoot.path + "/.env.local"
  });
  const clientSetting = await getClientSetting();
  const coilSetting = await getCoilSetting();
  resetSWFiles();
  const isDevOrLocal = process.env.APP_ENV === "development" || process.env.VITE_LOCAL_BUILD === "true";
  let base = `https://${process.env["APP_HOST"] ? process.env["APP_HOST"] : process.env["VITE_APP_HOST"]}/`;
  if (process.env.SERVE_CLIENT_FROM_STORAGE_PROVIDER === "true") {
    if (process.env.STORAGE_PROVIDER === "s3") {
    } else if (process.env.STORAGE_PROVIDER === "local") {
      base = `https://${process.env.LOCAL_STORAGE_PROVIDER}/client/`;
    }
  }
  const define = {};
  for (const [key, value] of Object.entries(process.env)) {
    define[`globalThis.process.env.${key}`] = JSON.stringify(value);
  }
  const returned = {
    define,
    server: {
      proxy: {},
      cors: isDevOrLocal ? false : true,
      hmr: process.env.VITE_HMR === "true" ? {
        port: process.env["VITE_APP_PORT"],
        host: process.env["VITE_APP_HOST"],
        overlay: false
      } : false,
      host: process.env["VITE_APP_HOST"],
      port: process.env["VITE_APP_PORT"],
      headers: {
        "Origin-Agent-Cluster": "?1"
      },
      ...isDevOrLocal ? {
        https: {
          key: fs.readFileSync(path.join(packageRoot.path, "certs/key.pem")),
          cert: fs.readFileSync(path.join(packageRoot.path, "certs/cert.pem"))
        }
      } : {}
    },
    base,
    optimizeDeps: {
      entries: ["./src/main.tsx"],
      exclude: ["@etherealengine/volumetric"],
      include: ["@reactflow/core", "@reactflow/minimap", "@reactflow/controls", "@reactflow/background"],
      esbuildOptions: {
        target: "es2020"
      }
    },
    plugins: [
      svgr(),
      nodePolyfills(),
      mediapipe_workaround(),
      process.env.VITE_PWA_ENABLED === "true" ? pwa_config_default(clientSetting) : void 0,
      ViteEjsPlugin({
        ...manifest_default_default,
        title: clientSetting.title || "Ethereal Engine",
        description: clientSetting?.siteDescription || "Connected Worlds for Everyone",
        // short_name: clientSetting?.shortName || 'EE',
        // theme_color: clientSetting?.themeColor || '#ffffff',
        // background_color: clientSetting?.backgroundColor || '#000000',
        appleTouchIcon: clientSetting.appleTouchIcon || "/apple-touch-icon.png",
        favicon32px: clientSetting.favicon32px || "/favicon-32x32.png",
        favicon16px: clientSetting.favicon16px || "/favicon-16x16.png",
        icon192px: clientSetting.icon192px || "/android-chrome-192x192.png",
        icon512px: clientSetting.icon512px || "/android-chrome-512x512.png",
        webmanifestLink: clientSetting.webmanifestLink || "/manifest.webmanifest",
        swScriptLink: clientSetting.swScriptLink || process.env.VITE_PWA_ENABLED === "true" ? process.env.APP_ENV === "development" ? "dev-sw.js?dev-sw" : "service-worker.js" : "",
        paymentPointer: coilSetting?.paymentPointer || ""
      }),
      viteCompression({
        filter: /\.(js|mjs|json|css)$/i,
        algorithm: "brotliCompress",
        deleteOriginFile: true
      }),
      viteCommonjs({
        include: ["use-sync-external-store"]
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        "react-json-tree": "react-json-tree/lib/umd/react-json-tree"
      }
    },
    build: {
      target: "esnext",
      sourcemap: process.env.VITE_SOURCEMAPS === "true" ? true : false,
      minify: "terser",
      dynamicImportVarsOptions: {
        warnOnError: true
      },
      rollupOptions: {
        output: {
          dir: "dist",
          format: "es",
          // 'commonjs' | 'esm' | 'module' | 'systemjs'
          // ignore files under 1mb
          experimentalMinChunkSize: 1e6,
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return parseModuleName(id);
            }
          }
        }
      }
    }
  };
  return await getProjectConfigExtensions(returned);
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuZGVmYXVsdC5qc29uIiwgInB3YS5jb25maWcudHMiLCAic2NyaXB0cy9nZXRDbGllbnRTZXR0aW5ncy50cyIsICIuLi9zZXJ2ZXItY29yZS9zcmMvc2V0dGluZy9jbGllbnQtc2V0dGluZy9jbGllbnQtc2V0dGluZy5yZXNvbHZlcnMudHMiLCAiLi4vY29tbW9uL3NyYy91dGlscy9kYXRldGltZS1zcWwudHMiLCAiLi4vY29tbW9uL3NyYy9zY2hlbWFzL3NldHRpbmcvY2xpZW50LXNldHRpbmcuc2NoZW1hLnRzIiwgIi4uL2NvbW1vbi9zcmMvc2NoZW1hcy92YWxpZGF0b3JzLnRzIiwgInNjcmlwdHMvZ2V0Q29pbFNldHRpbmdzLnRzIiwgIi4uL2NvbW1vbi9zcmMvc2NoZW1hcy9zZXR0aW5nL2NvaWwtc2V0dGluZy5zY2hlbWEudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbmF6YXJpaS9EZXNrdG9wL1ViaWVuZ2luZS9ldGhlcmVhbGVuZ2luZS9wYWNrYWdlcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbmF6YXJpaS9EZXNrdG9wL1ViaWVuZ2luZS9ldGhlcmVhbGVuZ2luZS9wYWNrYWdlcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjsvKlxuQ1BBTC0xLjAgTGljZW5zZVxuXG5UaGUgY29udGVudHMgb2YgdGhpcyBmaWxlIGFyZSBzdWJqZWN0IHRvIHRoZSBDb21tb24gUHVibGljIEF0dHJpYnV0aW9uIExpY2Vuc2VcblZlcnNpb24gMS4wLiAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxud2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5odHRwczovL2dpdGh1Yi5jb20vRXRoZXJlYWxFbmdpbmUvZXRoZXJlYWxlbmdpbmUvYmxvYi9kZXYvTElDRU5TRS5cblRoZSBMaWNlbnNlIGlzIGJhc2VkIG9uIHRoZSBNb3ppbGxhIFB1YmxpYyBMaWNlbnNlIFZlcnNpb24gMS4xLCBidXQgU2VjdGlvbnMgMTRcbmFuZCAxNSBoYXZlIGJlZW4gYWRkZWQgdG8gY292ZXIgdXNlIG9mIHNvZnR3YXJlIG92ZXIgYSBjb21wdXRlciBuZXR3b3JrIGFuZFxucHJvdmlkZSBmb3IgbGltaXRlZCBhdHRyaWJ1dGlvbiBmb3IgdGhlIE9yaWdpbmFsIERldmVsb3Blci4gSW4gYWRkaXRpb24sXG5FeGhpYml0IEEgaGFzIGJlZW4gbW9kaWZpZWQgdG8gYmUgY29uc2lzdGVudCB3aXRoIEV4aGliaXQgQi5cblxuU29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbnNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyByaWdodHMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG5UaGUgT3JpZ2luYWwgQ29kZSBpcyBFdGhlcmVhbCBFbmdpbmUuXG5cblRoZSBPcmlnaW5hbCBEZXZlbG9wZXIgaXMgdGhlIEluaXRpYWwgRGV2ZWxvcGVyLiBUaGUgSW5pdGlhbCBEZXZlbG9wZXIgb2YgdGhlXG5PcmlnaW5hbCBDb2RlIGlzIHRoZSBFdGhlcmVhbCBFbmdpbmUgdGVhbS5cblxuQWxsIHBvcnRpb25zIG9mIHRoZSBjb2RlIHdyaXR0ZW4gYnkgdGhlIEV0aGVyZWFsIEVuZ2luZSB0ZWFtIGFyZSBDb3B5cmlnaHQgXHUwMEE5IDIwMjEtMjAyM1xuRXRoZXJlYWwgRW5naW5lLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuKi9cblxuaW1wb3J0IHsgdml0ZUNvbW1vbmpzIH0gZnJvbSAnQG9yaWdpbmpzL3ZpdGUtcGx1Z2luLWNvbW1vbmpzJ1xuaW1wb3J0IHBhY2thZ2VSb290IGZyb20gJ2FwcC1yb290LXBhdGgnXG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudidcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IFVzZXJDb25maWcsIGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xuaW1wb3J0IHsgVml0ZUVqc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWVqcydcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscydcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InXG5jb25zdCB7IGlzQXJyYXksIG1lcmdlV2l0aCB9ID0gbG9kYXNoXG5cbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL21hbmlmZXN0LmRlZmF1bHQuanNvbidcbmltcG9ydCBQV0EgZnJvbSAnLi9wd2EuY29uZmlnJ1xuaW1wb3J0IHsgZ2V0Q2xpZW50U2V0dGluZyB9IGZyb20gJy4vc2NyaXB0cy9nZXRDbGllbnRTZXR0aW5ncydcbmltcG9ydCB7IGdldENvaWxTZXR0aW5nIH0gZnJvbSAnLi9zY3JpcHRzL2dldENvaWxTZXR0aW5ncydcblxuY29uc3QgcGFyc2VNb2R1bGVOYW1lID0gKG1vZHVsZU5hbWU6IHN0cmluZykgPT4ge1xuICAvLyAvLyBjaHVuayBtZWRpc291cC1jbGllbnRcbiAgaWYgKG1vZHVsZU5hbWUuaW5jbHVkZXMoJ21lZGlzb3VwJykpIHtcbiAgICByZXR1cm4gYHZlbmRvcl9tZWRpc291cC1jbGllbnRfJHttb2R1bGVOYW1lLnRvU3RyaW5nKCkuc3BsaXQoJ2NsaWVudC9saWIvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpfWBcbiAgfVxuICAvLyBjaHVuayBAZm9ydGF3ZXNvbWVcbiAgaWYgKG1vZHVsZU5hbWUuaW5jbHVkZXMoJ0Bmb3J0YXdlc29tZScpKSB7XG4gICAgcmV0dXJuIGB2ZW5kb3JfQGZvcnRhd2Vzb21lXyR7bW9kdWxlTmFtZS50b1N0cmluZygpLnNwbGl0KCdAZm9ydGF3ZXNvbWUvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpfWBcbiAgfVxuICAvLyBjaHVuayBhcGV4Y2hhcnRzXG4gIGlmIChtb2R1bGVOYW1lLmluY2x1ZGVzKCdhcGV4Y2hhcnRzJykpIHtcbiAgICByZXR1cm4gYHZlbmRvcl9hcGV4Y2hhcnRzXyR7bW9kdWxlTmFtZS50b1N0cmluZygpLnNwbGl0KCdkaXN0LycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKX1gXG4gIH1cbiAgLy8gY2h1bmsgQGZlYXRoZXJzanNcbiAgaWYgKG1vZHVsZU5hbWUuaW5jbHVkZXMoJ0BmZWF0aGVyc2pzJykpIHtcbiAgICByZXR1cm4gYHZlbmRvcl9mZWF0aGVyc2pzXyR7bW9kdWxlTmFtZS50b1N0cmluZygpLnNwbGl0KCdAZmVhdGhlcnNqcy8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKCl9YFxuICB9XG5cbiAgLy8gY2h1bmsgQHJlYWN0Zmxvd1xuICBpZiAobW9kdWxlTmFtZS5pbmNsdWRlcygnQHJlYWN0ZmxvdycpKSB7XG4gICAgcmV0dXJuIGB2ZW5kb3JfcmVhY3RmbG93XyR7bW9kdWxlTmFtZS50b1N0cmluZygpLnNwbGl0KCdAcmVhY3RmbG93LycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKX1gXG4gIH1cbiAgLy8gY2h1bmsgcmVhY3QtZG9tXG4gIGlmIChtb2R1bGVOYW1lLmluY2x1ZGVzKCdyZWFjdC1kb20nKSkge1xuICAgIHJldHVybiBgdmVuZG9yX3JlYWN0LWRvbV8ke21vZHVsZU5hbWUudG9TdHJpbmcoKS5zcGxpdCgncmVhY3QtZG9tLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKX1gXG4gIH1cblxuICAvLyBjaHVuayByZWFjdC1pY29uc1xuICBpZiAobW9kdWxlTmFtZS5pbmNsdWRlcygncmVhY3QtaWNvbnMnKSkge1xuICAgIHJldHVybiBgdmVuZG9yX3JlYWN0LWljb25zXyR7bW9kdWxlTmFtZS50b1N0cmluZygpLnNwbGl0KCdyZWFjdC1pY29ucy8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKCl9YFxuICB9XG5cbiAgLy8gY2h1bmsgcmVhY3QtY29sb3JcbiAgaWYgKG1vZHVsZU5hbWUuaW5jbHVkZXMoJ3JlYWN0LWNvbG9yJykpIHtcbiAgICByZXR1cm4gYHZlbmRvcl9yZWFjdC1jb2xvcl8ke21vZHVsZU5hbWUudG9TdHJpbmcoKS5zcGxpdCgncmVhY3QtY29sb3IvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpfWBcbiAgfVxuICAvLyBjaHVuayBAcGl4aXYgdnJtXG4gIGlmIChtb2R1bGVOYW1lLmluY2x1ZGVzKCdAcGl4aXYnKSkge1xuICAgIGlmIChtb2R1bGVOYW1lLmluY2x1ZGVzKCdAcGl4aXYvdGhyZWUtdnJtJykpIHtcbiAgICAgIHJldHVybiBgdmVuZG9yX0BwaXhpdl90aHJlZS12cm1fJHttb2R1bGVOYW1lLnRvU3RyaW5nKCkuc3BsaXQoJ3RocmVlLXZybScpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKX1gXG4gICAgfVxuICAgIHJldHVybiBgdmVuZG9yX0BwaXhpdl8ke21vZHVsZU5hbWUudG9TdHJpbmcoKS5zcGxpdCgnQHBpeGl2LycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKX1gXG4gIH1cbiAgLy8gY2h1bmsgdGhyZWVcbiAgaWYgKG1vZHVsZU5hbWUuaW5jbHVkZXMoJ3RocmVlJykpIHtcbiAgICBpZiAobW9kdWxlTmFtZS5pbmNsdWRlcygncXVhcmtzL2Rpc3QnKSkge1xuICAgICAgcmV0dXJuIGB2ZW5kb3JfdGhyZWVfcXVhcmtzXyR7bW9kdWxlTmFtZS50b1N0cmluZygpLnNwbGl0KCdkaXN0LycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKX1gXG4gICAgfVxuICAgIGlmIChtb2R1bGVOYW1lLmluY2x1ZGVzKCd0aHJlZScpKSB7XG4gICAgICByZXR1cm4gYHZlbmRvcl90aHJlZV9idWlsZF8ke21vZHVsZU5hbWUudG9TdHJpbmcoKS5zcGxpdCgnLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKX1gXG4gICAgfVxuICB9XG4gIC8vIGNodW5rIG11aVxuICBpZiAobW9kdWxlTmFtZS5pbmNsdWRlcygnQG11aScpKSB7XG4gICAgaWYgKG1vZHVsZU5hbWUuaW5jbHVkZXMoJ0BtdWkvbWF0ZXJlcmlhbCcpKSB7XG4gICAgICByZXR1cm4gYHZlbmRvcl9AbXVpX21hdGVyaWFsXyR7bW9kdWxlTmFtZS50b1N0cmluZygpLnNwbGl0KCdAbXVpL21hdGVyaWFsLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKX1gXG4gICAgfSBlbHNlIGlmIChtb2R1bGVOYW1lLmluY2x1ZGVzKCdAbXVpL3gtZGF0ZS1waWNrZXJzJykpIHtcbiAgICAgIHJldHVybiBgdmVuZG9yX0BtdWlfeC1kYXRlLXBpY2tlcnNfJHttb2R1bGVOYW1lXG4gICAgICAgIC50b1N0cmluZygpXG4gICAgICAgIC5zcGxpdCgnQG11aS94LWRhdGUtcGlja2Vycy8nKVsxXVxuICAgICAgICAuc3BsaXQoJy8nKVswXVxuICAgICAgICAudG9TdHJpbmcoKX1gXG4gICAgfVxuICAgIHJldHVybiBgdmVuZG9yX0BtdWlfJHttb2R1bGVOYW1lLnRvU3RyaW5nKCkuc3BsaXQoJ0BtdWkvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpfWBcbiAgfVxuICAvLyBjaHVuayBAZGltZm9yZ2VcbiAgaWYgKG1vZHVsZU5hbWUuaW5jbHVkZXMoJ0BkaW1mb3JnZScpKSB7XG4gICAgcmV0dXJuIGB2ZW5kb3JfQGRpbWZvcmdlXyR7bW9kdWxlTmFtZS50b1N0cmluZygpLnNwbGl0KCdyYXBpZXIzZC1jb21wYXQvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpfWBcbiAgfVxuXG4gIC8vIENodW5rIGFsbCBvdGhlciBub2RlX21vZHVsZXNcbiAgcmV0dXJuIGB2ZW5kb3JfJHttb2R1bGVOYW1lLnRvU3RyaW5nKCkuc3BsaXQoJ25vZGVfbW9kdWxlcy8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKCl9YFxufVxuXG5jb25zdCBtZXJnZSA9IChzcmMsIGRlc3QpID0+XG4gIG1lcmdlV2l0aCh7fSwgc3JjLCBkZXN0LCBmdW5jdGlvbiAoYSwgYikge1xuICAgIGlmIChpc0FycmF5KGEpKSB7XG4gICAgICByZXR1cm4gYi5jb25jYXQoYSlcbiAgICB9XG4gIH0pXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG5pbXBvcnQoJ3RzLW5vZGUnKS50aGVuKCh0c25vZGUpID0+IHtcbiAgdHNub2RlLnJlZ2lzdGVyKHtcbiAgICBwcm9qZWN0OiAnLi90c2NvbmZpZy5qc29uJ1xuICB9KVxufSlcblxuY29uc3QgZ2V0UHJvamVjdENvbmZpZ0V4dGVuc2lvbnMgPSBhc3luYyAoY29uZmlnOiBVc2VyQ29uZmlnKSA9PiB7XG4gIGNvbnN0IHByb2plY3RzID0gZnNcbiAgICAucmVhZGRpclN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL3Byb2plY3RzL3Byb2plY3RzLycpLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSlcbiAgICAuZmlsdGVyKChkaXJlbnQpID0+IGRpcmVudC5pc0RpcmVjdG9yeSgpKVxuICAgIC5tYXAoKGRpcmVudCkgPT4gZGlyZW50Lm5hbWUpXG4gIGZvciAoY29uc3QgcHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgIGNvbnN0IHN0YXRpY1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBgLi4vcHJvamVjdHMvcHJvamVjdHMvYCwgcHJvamVjdCwgJ3ZpdGUuY29uZmlnLmV4dGVuc2lvbi50cycpXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoc3RhdGljUGF0aCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG4gICAgICAgIGNvbnN0IHsgZGVmYXVsdDogdml0ZUNvbmZpZ0V4dGVuc2lvbiB9ID0gYXdhaXQgaW1wb3J0KFxuICAgICAgICAgIGAuLi9wcm9qZWN0cy9wcm9qZWN0cy8ke3Byb2plY3R9L3ZpdGUuY29uZmlnLmV4dGVuc2lvbi50c2BcbiAgICAgICAgKVxuICAgICAgICBpZiAodHlwZW9mIHZpdGVDb25maWdFeHRlbnNpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjb25zdCBjb25maWdFeHRlbnNpb24gPSBhd2FpdCB2aXRlQ29uZmlnRXh0ZW5zaW9uKClcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgICAgICAgIGNvbmZpZy5wbHVnaW5zID0gWy4uLmNvbmZpZy5wbHVnaW5zISwgLi4uY29uZmlnRXh0ZW5zaW9uLmRlZmF1bHQucGx1Z2luc11cbiAgICAgICAgICBkZWxldGUgY29uZmlnRXh0ZW5zaW9uLmRlZmF1bHQucGx1Z2luc1xuICAgICAgICAgIGNvbmZpZyA9IG1lcmdlKGNvbmZpZywgY29uZmlnRXh0ZW5zaW9uLmRlZmF1bHQpXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29uZmlnIGFzIFVzZXJDb25maWdcbn1cblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9tZWRpYXBpcGUvaXNzdWVzLzQxMjBcbmZ1bmN0aW9uIG1lZGlhcGlwZV93b3JrYXJvdW5kKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdtZWRpYXBpcGVfd29ya2Fyb3VuZCcsXG4gICAgbG9hZChpZCkge1xuICAgICAgY29uc3QgTUVESUFQSVBFX0VYUE9SVF9OQU1FUyA9IHtcbiAgICAgICAgJ3Bvc2UuanMnOiBbXG4gICAgICAgICAgJ1BPU0VfTEFORE1BUktTJyxcbiAgICAgICAgICAnUE9TRV9DT05ORUNUSU9OUycsXG4gICAgICAgICAgJ1BPU0VfTEFORE1BUktTX0xFRlQnLFxuICAgICAgICAgICdQT1NFX0xBTkRNQVJLU19SSUdIVCcsXG4gICAgICAgICAgJ1BPU0VfTEFORE1BUktTX05FVVRSQUwnLFxuICAgICAgICAgICdQb3NlJyxcbiAgICAgICAgICAnVkVSU0lPTidcbiAgICAgICAgXSxcbiAgICAgICAgJ2hhbmRzLmpzJzogWydWRVJTSU9OJywgJ0hBTkRfQ09OTkVDVElPTlMnLCAnSGFuZHMnXSxcbiAgICAgICAgJ2NhbWVyYV91dGlscy5qcyc6IFsnQ2FtZXJhJ10sXG4gICAgICAgICdkcmF3aW5nX3V0aWxzLmpzJzogWydkcmF3Q29ubmVjdG9ycycsICdkcmF3TGFuZG1hcmtzJywgJ2xlcnAnXSxcbiAgICAgICAgJ2NvbnRyb2xfdXRpbHMuanMnOiBbXG4gICAgICAgICAgJ2RyYXdDb25uZWN0b3JzJyxcbiAgICAgICAgICAnRlBTJyxcbiAgICAgICAgICAnQ29udHJvbFBhbmVsJyxcbiAgICAgICAgICAnU3RhdGljVGV4dCcsXG4gICAgICAgICAgJ1RvZ2dsZScsXG4gICAgICAgICAgJ1NvdXJjZVBpY2tlcicsXG5cbiAgICAgICAgICAvLyAnSW5wdXRJbWFnZScsIG5vdCB3b3JraW5nIHdpdGggdGhpcyBleHBvcnQuIElzIGRlZmluZWQgaW4gaW5kZXguZC50c1xuICAgICAgICAgIC8vIGJ1dCBpcyBub3QgZGVmaW5lZCBpbiBjb250cm9sX3V0aWxzLmpzXG4gICAgICAgICAgJ0lucHV0SW1hZ2UnLFxuXG4gICAgICAgICAgJ1NsaWRlcidcbiAgICAgICAgXVxuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWxlTmFtZSA9IHBhdGguYmFzZW5hbWUoaWQpXG4gICAgICBpZiAoIShmaWxlTmFtZSBpbiBNRURJQVBJUEVfRVhQT1JUX05BTUVTKSkgcmV0dXJuIG51bGxcbiAgICAgIGxldCBjb2RlID0gZnMucmVhZEZpbGVTeW5jKGlkLCAndXRmLTgnKVxuICAgICAgZm9yIChjb25zdCBuYW1lIG9mIE1FRElBUElQRV9FWFBPUlRfTkFNRVNbZmlsZU5hbWVdKSB7XG4gICAgICAgIGNvZGUgKz0gYGV4cG9ydHMuJHtuYW1lfSA9ICR7bmFtZX07YFxuICAgICAgfVxuICAgICAgcmV0dXJuIHsgY29kZSB9XG4gICAgfVxuICB9XG59XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NDA3ODM0N1xuY29uc3QgZGVsZXRlRGlyRmlsZXNVc2luZ1BhdHRlcm4gPSAocGF0dGVybiwgZGlyUGF0aCkgPT4ge1xuICAvLyBnZXQgYWxsIGZpbGUgbmFtZXMgaW4gZGlyZWN0b3J5XG4gIGZzLnJlYWRkaXIoZGlyUGF0aCwgKGVyciwgZmlsZU5hbWVzKSA9PiB7XG4gICAgaWYgKGVycikgdGhyb3cgZXJyXG4gICAgLy8gaXRlcmF0ZSB0aHJvdWdoIHRoZSBmb3VuZCBmaWxlIG5hbWVzXG4gICAgZm9yIChjb25zdCBuYW1lIG9mIGZpbGVOYW1lcykge1xuICAgICAgLy8gaWYgZmlsZSBuYW1lIG1hdGNoZXMgdGhlIHBhdHRlcm5cbiAgICAgIGlmIChwYXR0ZXJuLnRlc3QobmFtZSkpIHtcbiAgICAgICAgLy8gdHJ5IHRvIHJlbW92ZSB0aGUgZmlsZSBhbmQgbG9nIHRoZSByZXN1bHRcbiAgICAgICAgZnMudW5saW5rKHBhdGgucmVzb2x2ZShkaXJQYXRoLCBuYW1lKSwgKGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVyclxuICAgICAgICAgIGNvbnNvbGUubG9nKGBEZWxldGVkICR7bmFtZX1gKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuY29uc3QgcmVzZXRTV0ZpbGVzID0gKCkgPT4ge1xuICAvLyBEZWxldGUgb2xkIG1hbmlmZXN0IGZpbGVzXG4gIGRlbGV0ZURpckZpbGVzVXNpbmdQYXR0ZXJuKC93ZWJtYW5pZmVzdC8sICcuL3B1YmxpYy8nKVxuICAvLyBEZWxldGUgb2xkIHNlcnZpY2Ugd29ya2VyIGZpbGVzXG4gIGRlbGV0ZURpckZpbGVzVXNpbmdQYXR0ZXJuKC9zZXJ2aWNlLS8sICcuL3B1YmxpYy8nKVxuICAvLyBEZWxldGUgb2xkIHdvcmtib3ggZmlsZXNcbiAgZGVsZXRlRGlyRmlsZXNVc2luZ1BhdHRlcm4oL3dvcmtib3gtLywgJy4vcHVibGljLycpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhhc3luYyAoKSA9PiB7XG4gIGRvdGVudi5jb25maWcoe1xuICAgIHBhdGg6IHBhY2thZ2VSb290LnBhdGggKyAnLy5lbnYubG9jYWwnXG4gIH0pXG4gIGNvbnN0IGNsaWVudFNldHRpbmcgPSBhd2FpdCBnZXRDbGllbnRTZXR0aW5nKClcbiAgY29uc3QgY29pbFNldHRpbmcgPSBhd2FpdCBnZXRDb2lsU2V0dGluZygpXG5cbiAgcmVzZXRTV0ZpbGVzKClcblxuICBjb25zdCBpc0Rldk9yTG9jYWwgPSBwcm9jZXNzLmVudi5BUFBfRU5WID09PSAnZGV2ZWxvcG1lbnQnIHx8IHByb2Nlc3MuZW52LlZJVEVfTE9DQUxfQlVJTEQgPT09ICd0cnVlJ1xuXG4gIGxldCBiYXNlID0gYGh0dHBzOi8vJHtwcm9jZXNzLmVudlsnQVBQX0hPU1QnXSA/IHByb2Nlc3MuZW52WydBUFBfSE9TVCddIDogcHJvY2Vzcy5lbnZbJ1ZJVEVfQVBQX0hPU1QnXX0vYFxuXG4gIGlmIChwcm9jZXNzLmVudi5TRVJWRV9DTElFTlRfRlJPTV9TVE9SQUdFX1BST1ZJREVSID09PSAndHJ1ZScpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuU1RPUkFHRV9QUk9WSURFUiA9PT0gJ3MzJykge1xuICAgICAgLy8gYmFzZSA9IGAke3BhdGguam9pbihjbGllbnRTZXR0aW5nLnVybCwgJ2NsaWVudCcsICcvJyl9YFxuICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuU1RPUkFHRV9QUk9WSURFUiA9PT0gJ2xvY2FsJykge1xuICAgICAgYmFzZSA9IGBodHRwczovLyR7cHJvY2Vzcy5lbnYuTE9DQUxfU1RPUkFHRV9QUk9WSURFUn0vY2xpZW50L2BcbiAgICB9XG4gIH1cblxuICBjb25zdCBkZWZpbmUgPSB7fVxuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwcm9jZXNzLmVudikpIHtcbiAgICBkZWZpbmVbYGdsb2JhbFRoaXMucHJvY2Vzcy5lbnYuJHtrZXl9YF0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSlcbiAgfVxuXG4gIGNvbnN0IHJldHVybmVkID0ge1xuICAgIGRlZmluZTogZGVmaW5lLFxuICAgIHNlcnZlcjoge1xuICAgICAgcHJveHk6IHt9LFxuICAgICAgY29yczogaXNEZXZPckxvY2FsID8gZmFsc2UgOiB0cnVlLFxuICAgICAgaG1yOlxuICAgICAgICBwcm9jZXNzLmVudi5WSVRFX0hNUiA9PT0gJ3RydWUnXG4gICAgICAgICAgPyB7XG4gICAgICAgICAgICAgIHBvcnQ6IHByb2Nlc3MuZW52WydWSVRFX0FQUF9QT1JUJ10sXG4gICAgICAgICAgICAgIGhvc3Q6IHByb2Nlc3MuZW52WydWSVRFX0FQUF9IT1NUJ10sXG4gICAgICAgICAgICAgIG92ZXJsYXk6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiBmYWxzZSxcbiAgICAgIGhvc3Q6IHByb2Nlc3MuZW52WydWSVRFX0FQUF9IT1NUJ10sXG4gICAgICBwb3J0OiBwcm9jZXNzLmVudlsnVklURV9BUFBfUE9SVCddLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnT3JpZ2luLUFnZW50LUNsdXN0ZXInOiAnPzEnXG4gICAgICB9LFxuICAgICAgLi4uKGlzRGV2T3JMb2NhbFxuICAgICAgICA/IHtcbiAgICAgICAgICAgIGh0dHBzOiB7XG4gICAgICAgICAgICAgIGtleTogZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihwYWNrYWdlUm9vdC5wYXRoLCAnY2VydHMva2V5LnBlbScpKSxcbiAgICAgICAgICAgICAgY2VydDogZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihwYWNrYWdlUm9vdC5wYXRoLCAnY2VydHMvY2VydC5wZW0nKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIDoge30pXG4gICAgfSxcbiAgICBiYXNlLFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZW50cmllczogWycuL3NyYy9tYWluLnRzeCddLFxuICAgICAgZXhjbHVkZTogWydAZXRoZXJlYWxlbmdpbmUvdm9sdW1ldHJpYyddLFxuICAgICAgaW5jbHVkZTogWydAcmVhY3RmbG93L2NvcmUnLCAnQHJlYWN0Zmxvdy9taW5pbWFwJywgJ0ByZWFjdGZsb3cvY29udHJvbHMnLCAnQHJlYWN0Zmxvdy9iYWNrZ3JvdW5kJ10sXG4gICAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgICB0YXJnZXQ6ICdlczIwMjAnXG4gICAgICB9XG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICBzdmdyKCksXG4gICAgICBub2RlUG9seWZpbGxzKCksXG4gICAgICBtZWRpYXBpcGVfd29ya2Fyb3VuZCgpLFxuICAgICAgcHJvY2Vzcy5lbnYuVklURV9QV0FfRU5BQkxFRCA9PT0gJ3RydWUnID8gUFdBKGNsaWVudFNldHRpbmcpIDogdW5kZWZpbmVkLFxuICAgICAgVml0ZUVqc1BsdWdpbih7XG4gICAgICAgIC4uLm1hbmlmZXN0LFxuICAgICAgICB0aXRsZTogY2xpZW50U2V0dGluZy50aXRsZSB8fCAnRXRoZXJlYWwgRW5naW5lJyxcbiAgICAgICAgZGVzY3JpcHRpb246IGNsaWVudFNldHRpbmc/LnNpdGVEZXNjcmlwdGlvbiB8fCAnQ29ubmVjdGVkIFdvcmxkcyBmb3IgRXZlcnlvbmUnLFxuICAgICAgICAvLyBzaG9ydF9uYW1lOiBjbGllbnRTZXR0aW5nPy5zaG9ydE5hbWUgfHwgJ0VFJyxcbiAgICAgICAgLy8gdGhlbWVfY29sb3I6IGNsaWVudFNldHRpbmc/LnRoZW1lQ29sb3IgfHwgJyNmZmZmZmYnLFxuICAgICAgICAvLyBiYWNrZ3JvdW5kX2NvbG9yOiBjbGllbnRTZXR0aW5nPy5iYWNrZ3JvdW5kQ29sb3IgfHwgJyMwMDAwMDAnLFxuICAgICAgICBhcHBsZVRvdWNoSWNvbjogY2xpZW50U2V0dGluZy5hcHBsZVRvdWNoSWNvbiB8fCAnL2FwcGxlLXRvdWNoLWljb24ucG5nJyxcbiAgICAgICAgZmF2aWNvbjMycHg6IGNsaWVudFNldHRpbmcuZmF2aWNvbjMycHggfHwgJy9mYXZpY29uLTMyeDMyLnBuZycsXG4gICAgICAgIGZhdmljb24xNnB4OiBjbGllbnRTZXR0aW5nLmZhdmljb24xNnB4IHx8ICcvZmF2aWNvbi0xNngxNi5wbmcnLFxuICAgICAgICBpY29uMTkycHg6IGNsaWVudFNldHRpbmcuaWNvbjE5MnB4IHx8ICcvYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmcnLFxuICAgICAgICBpY29uNTEycHg6IGNsaWVudFNldHRpbmcuaWNvbjUxMnB4IHx8ICcvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmcnLFxuICAgICAgICB3ZWJtYW5pZmVzdExpbms6IGNsaWVudFNldHRpbmcud2VibWFuaWZlc3RMaW5rIHx8ICcvbWFuaWZlc3Qud2VibWFuaWZlc3QnLFxuICAgICAgICBzd1NjcmlwdExpbms6XG4gICAgICAgICAgY2xpZW50U2V0dGluZy5zd1NjcmlwdExpbmsgfHwgcHJvY2Vzcy5lbnYuVklURV9QV0FfRU5BQkxFRCA9PT0gJ3RydWUnXG4gICAgICAgICAgICA/IHByb2Nlc3MuZW52LkFQUF9FTlYgPT09ICdkZXZlbG9wbWVudCdcbiAgICAgICAgICAgICAgPyAnZGV2LXN3LmpzP2Rldi1zdydcbiAgICAgICAgICAgICAgOiAnc2VydmljZS13b3JrZXIuanMnXG4gICAgICAgICAgICA6ICcnLFxuICAgICAgICBwYXltZW50UG9pbnRlcjogY29pbFNldHRpbmc/LnBheW1lbnRQb2ludGVyIHx8ICcnXG4gICAgICB9KSxcbiAgICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICAgIGZpbHRlcjogL1xcLihqc3xtanN8anNvbnxjc3MpJC9pLFxuICAgICAgICBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycsXG4gICAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IHRydWVcbiAgICAgIH0pLFxuICAgICAgdml0ZUNvbW1vbmpzKHtcbiAgICAgICAgaW5jbHVkZTogWyd1c2Utc3luYy1leHRlcm5hbC1zdG9yZSddXG4gICAgICB9KVxuICAgIF0uZmlsdGVyKEJvb2xlYW4pLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdyZWFjdC1qc29uLXRyZWUnOiAncmVhY3QtanNvbi10cmVlL2xpYi91bWQvcmVhY3QtanNvbi10cmVlJ1xuICAgICAgfVxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgICBzb3VyY2VtYXA6IHByb2Nlc3MuZW52LlZJVEVfU09VUkNFTUFQUyA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIGR5bmFtaWNJbXBvcnRWYXJzT3B0aW9uczoge1xuICAgICAgICB3YXJuT25FcnJvcjogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgZGlyOiAnZGlzdCcsXG4gICAgICAgICAgZm9ybWF0OiAnZXMnLCAvLyAnY29tbW9uanMnIHwgJ2VzbScgfCAnbW9kdWxlJyB8ICdzeXN0ZW1qcydcbiAgICAgICAgICAvLyBpZ25vcmUgZmlsZXMgdW5kZXIgMW1iXG4gICAgICAgICAgZXhwZXJpbWVudGFsTWluQ2h1bmtTaXplOiAxMDAwMDAwLFxuICAgICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XG4gICAgICAgICAgICAvLyBjaHVuayBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlTW9kdWxlTmFtZShpZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gYXMgVXNlckNvbmZpZ1xuXG4gIHJldHVybiBhd2FpdCBnZXRQcm9qZWN0Q29uZmlnRXh0ZW5zaW9ucyhyZXR1cm5lZClcbn0pXG4iLCAie1xuICBcIm5hbWVcIjogXCJFdGhlcmVhbCBFbmdpbmVcIixcbiAgXCJzdGFydF91cmxcIjpcIi9cIixcbiAgXCJpZFwiOiBcIkV0aGVyZWFsRW5naW5lXCIsXG4gIFwic2hvcnRfbmFtZVwiOiBcIkVFXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJDb25uZWN0ZWQgV29ybGRzIGZvciBFdmVyeW9uZVwiLFxuICBcInRoZW1lX2NvbG9yXCI6IFwiI2ZmZmZmZlwiLFxuICBcImJhY2tncm91bmRfY29sb3JcIjpcIiNmZmZmZmZcIixcbiAgXCJkaXNwbGF5XCI6XCJzdGFuZGFsb25lXCIsXG4gIFwiaWNvbnNcIjogW1xuICAgIHtcbiAgICAgIFwic3JjXCI6IFwiYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmdcIixcbiAgICAgIFwic2l6ZXNcIjogXCIxOTJ4MTkyXCIsXG4gICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJzcmNcIjogXCJhbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZ1wiLFxuICAgICAgXCJzaXplc1wiOiBcIjUxMng1MTJcIixcbiAgICAgIFwidHlwZVwiOiBcImltYWdlL3BuZ1wiXG4gICAgfSxcbiAgICB7XG4gICAgICBcInNyY1wiOiBcImFwcGxlLXRvdWNoLWljb24ucG5nXCIsXG4gICAgICBcInNpemVzXCI6IFwiMTgweDE4MFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2UvcG5nXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwic3JjXCI6IFwiZmF2aWNvbi0xNngxNi5wbmdcIixcbiAgICAgIFwic2l6ZXNcIjogXCIxNngxNlwiLFxuICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2UvcG5nXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwic3JjXCI6IFwiZmF2aWNvbi0zMngzMi5wbmdcIixcbiAgICAgIFwic2l6ZXNcIjogXCIzMngzMlwiLFxuICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2UvcG5nXCJcbiAgICB9LFxuICAgIHtcbiAgICAgIFwic3JjXCI6IFwibXN0aWxlLTE1MHgxNTAucG5nXCIsXG4gICAgICBcInNpemVzXCI6IFwiMTUweDE1MFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2UvcG5nXCJcbiAgICB9XG4gIF1cbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL25hemFyaWkvRGVza3RvcC9VYmllbmdpbmUvZXRoZXJlYWxlbmdpbmUvcGFja2FnZXMvY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL2NsaWVudC9wd2EuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL25hemFyaWkvRGVza3RvcC9VYmllbmdpbmUvZXRoZXJlYWxlbmdpbmUvcGFja2FnZXMvY2xpZW50L3B3YS5jb25maWcudHNcIjsvKlxuQ1BBTC0xLjAgTGljZW5zZVxuXG5UaGUgY29udGVudHMgb2YgdGhpcyBmaWxlIGFyZSBzdWJqZWN0IHRvIHRoZSBDb21tb24gUHVibGljIEF0dHJpYnV0aW9uIExpY2Vuc2VcblZlcnNpb24gMS4wLiAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxud2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5odHRwczovL2dpdGh1Yi5jb20vRXRoZXJlYWxFbmdpbmUvZXRoZXJlYWxlbmdpbmUvYmxvYi9kZXYvTElDRU5TRS5cblRoZSBMaWNlbnNlIGlzIGJhc2VkIG9uIHRoZSBNb3ppbGxhIFB1YmxpYyBMaWNlbnNlIFZlcnNpb24gMS4xLCBidXQgU2VjdGlvbnMgMTRcbmFuZCAxNSBoYXZlIGJlZW4gYWRkZWQgdG8gY292ZXIgdXNlIG9mIHNvZnR3YXJlIG92ZXIgYSBjb21wdXRlciBuZXR3b3JrIGFuZCBcbnByb3ZpZGUgZm9yIGxpbWl0ZWQgYXR0cmlidXRpb24gZm9yIHRoZSBPcmlnaW5hbCBEZXZlbG9wZXIuIEluIGFkZGl0aW9uLCBcbkV4aGliaXQgQSBoYXMgYmVlbiBtb2RpZmllZCB0byBiZSBjb25zaXN0ZW50IHdpdGggRXhoaWJpdCBCLlxuXG5Tb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgYmFzaXMsXG5XSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHJpZ2h0cyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cblRoZSBPcmlnaW5hbCBDb2RlIGlzIEV0aGVyZWFsIEVuZ2luZS5cblxuVGhlIE9yaWdpbmFsIERldmVsb3BlciBpcyB0aGUgSW5pdGlhbCBEZXZlbG9wZXIuIFRoZSBJbml0aWFsIERldmVsb3BlciBvZiB0aGVcbk9yaWdpbmFsIENvZGUgaXMgdGhlIEV0aGVyZWFsIEVuZ2luZSB0ZWFtLlxuXG5BbGwgcG9ydGlvbnMgb2YgdGhlIGNvZGUgd3JpdHRlbiBieSB0aGUgRXRoZXJlYWwgRW5naW5lIHRlYW0gYXJlIENvcHlyaWdodCBcdTAwQTkgMjAyMS0yMDIzIFxuRXRoZXJlYWwgRW5naW5lLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuKi9cblxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcblxuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vbWFuaWZlc3QuZGVmYXVsdC5qc29uJ1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFZpdGVQV0EgcGx1Z2luIGZvciBWaXRlLmpzLlxuICogQHBhcmFtIHtPYmplY3R9IGNsaWVudFNldHRpbmcgLSBBbiBvYmplY3QgY29udGFpbmluZyBjdXN0b20gc2V0dGluZ3MgZm9yIHRoZSBQV0EuXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xpZW50U2V0dGluZy50aXRsZSAtIFRoZSB0aXRsZSBvZiB0aGUgUFdBLlxuICogQHBhcmFtIHtzdHJpbmd9IGNsaWVudFNldHRpbmcuc2l0ZURlc2NyaXB0aW9uIC0gVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBQV0EuXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xpZW50U2V0dGluZy5zaG9ydE5hbWUgLSBUaGUgc2hvcnQgbmFtZSBvZiB0aGUgUFdBLlxuICogQHBhcmFtIHtzdHJpbmd9IGNsaWVudFNldHRpbmcudGhlbWVDb2xvciAtIFRoZSB0aGVtZSBjb2xvciBvZiB0aGUgUFdBLlxuICogQHBhcmFtIHtzdHJpbmd9IGNsaWVudFNldHRpbmcuYmFja2dyb3VuZENvbG9yIC0gVGhlIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIFBXQS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IC0gQSBWaXRlIHBsdWdpbiBvYmplY3QuXG4gKi9cbmNvbnN0IFBXQSA9IChjbGllbnRTZXR0aW5nKSA9PlxuICBWaXRlUFdBKHtcbiAgICBzcmNEaXI6ICdwdWJsaWMnLFxuICAgIGZpbGVuYW1lOiAnc2VydmljZS13b3JrZXIuanMnLFxuICAgIC8vIE1lcmdlIGN1c3RvbSBjbGllbnQgc2V0dGluZ3Mgd2l0aCBkZWZhdWx0IHZhbHVlcyBmcm9tIG1hbmlmZXN0LmRlZmF1bHQuanNvblxuICAgIG1hbmlmZXN0OiB7XG4gICAgICAuLi5tYW5pZmVzdCxcbiAgICAgIG5hbWU6IGNsaWVudFNldHRpbmc/LnRpdGxlIHx8ICdFdGhlcmVhbCBFbmdpbmUnLFxuICAgICAgZGVzY3JpcHRpb246IGNsaWVudFNldHRpbmc/LnNpdGVEZXNjcmlwdGlvbiB8fCAnQ29ubmVjdGVkIFdvcmxkcyBmb3IgRXZlcnlvbmUnLFxuICAgICAgc2hvcnRfbmFtZTogY2xpZW50U2V0dGluZz8uc2hvcnROYW1lIHx8ICdFRScsXG4gICAgICB0aGVtZV9jb2xvcjogY2xpZW50U2V0dGluZz8udGhlbWVDb2xvciB8fCAnI2ZmZmZmZicsXG4gICAgICBiYWNrZ3JvdW5kX2NvbG9yOiBjbGllbnRTZXR0aW5nPy5iYWNrZ3JvdW5kQ29sb3IgfHwgJyMwMDAwMDAnLFxuICAgICAgc3RhcnRfdXJsOlxuICAgICAgICBwcm9jZXNzLmVudi5BUFBfRU5WID09PSAnZGV2ZWxvcG1lbnQnIHx8IHByb2Nlc3MuZW52LlZJVEVfTE9DQUxfQlVJTEQgPT09ICd0cnVlJyA/ICcvJyA6IHByb2Nlc3MuZW52LkFQUF9VUkwsXG4gICAgICBzY29wZTogYC4vYCxcbiAgICAgIGlkOiBgRVRIRVJFQUxfRU5HSU5FYCxcbiAgICAgIHByb3RvY29sX2hhbmRsZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm90b2NvbDogJ3dlYitldGhlcmVhbGVuZ2luZScsXG4gICAgICAgICAgdXJsOiAnLz9kZWVwbGluaz0lcydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAgdXNlQ3JlZGVudGlhbHM6IHRydWUsXG4gICAgLy8gVXNlIGdlbmVyYXRlU1cgd2hlbiBidWlsZGluZ1xuICAgIHN0cmF0ZWdpZXM6ICdnZW5lcmF0ZVNXJyxcbiAgICAvLyBTZXQgbW9kZSB0byBkZXZlbG9wbWVudCBvciBwcm9kdWN0aW9uIGRlcGVuZGluZyBvbiBlbnZpcm9ubWVudCB2YXJpYWJsZVxuICAgIG1vZGU6IHByb2Nlc3MuZW52LkFQUF9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyAnZGV2ZWxvcG1lbnQnIDogJ3Byb2R1Y3Rpb24nLFxuICAgIGluamVjdFJlZ2lzdGVyOiBudWxsLFxuICAgIGluY2x1ZGVNYW5pZmVzdEljb25zOiB0cnVlLFxuICAgIGRldk9wdGlvbnM6IHtcbiAgICAgIC8vIEVuYWJsZSBkZXYgb3B0aW9ucyBvbmx5IGR1cmluZyBkZXZlbG9wbWVudFxuICAgICAgZW5hYmxlZDogcHJvY2Vzcy5lbnYuQVBQX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IHRydWUgOiBmYWxzZSxcbiAgICAgIC8vIE5hdmlnYXRlIHRvIGluZGV4Lmh0bWwgZm9yIGFsbCA0MDQgZXJyb3JzIGR1cmluZyBkZXZlbG9wbWVudFxuICAgICAgbmF2aWdhdGVGYWxsYmFjazogdW5kZWZpbmVkLFxuICAgICAgLy8gQWxsb3dsaXN0IGFsbCBwYXRocyBmb3IgbmF2aWdhdGVGYWxsYmFjayBkdXJpbmcgZGV2ZWxvcG1lbnRcbiAgICAgIG5hdmlnYXRlRmFsbGJhY2tBbGxvd2xpc3Q6IFtcbiAgICAgICAgLy8gYWxsb3cgZXZlcnl0aGluZ1xuICAgICAgICBuZXcgUmVnRXhwKCdeLy4qJCcpLFxuICAgICAgICAvLyBhbGxvdyBAZnNcbiAgICAgICAgbmV3IFJlZ0V4cCgnXi9AZnMvLiokJylcbiAgICAgIF1cbiAgICB9LFxuICAgIHdvcmtib3g6IHtcbiAgICAgIC8vIGRvbid0IHdhaXQgZm9yIHNlcnZpY2Ugd29ya2VyIHRvIGJlY29tZSBhY3RpdmVcbiAgICAgIHNraXBXYWl0aW5nOiB0cnVlLFxuICAgICAgLy8gY2xhaW0gY2xpZW50cyBpbW1lZGlhdGVseVxuICAgICAgY2xpZW50c0NsYWltOiB0cnVlLFxuICAgICAgLy8gc2hvdyBzb3VyY2UgbWFwc1xuICAgICAgc291cmNlbWFwOiBwcm9jZXNzLmVudi5BUFBfRU5WID09PSAnZGV2ZWxvcG1lbnQnID8gZmFsc2UgOiB0cnVlLFxuICAgICAgLy8gU2V0IHRoZSBwYXRoIGZvciB0aGUgc2VydmljZSB3b3JrZXIgZmlsZVxuICAgICAgc3dEZXN0OiBwcm9jZXNzLmVudi5BUFBfRU5WID09PSAnZGV2ZWxvcG1lbnQnID8gJ3B1YmxpYy9zZXJ2aWNlLXdvcmtlci5qcycgOiAnZGlzdC9zZXJ2aWNlLXdvcmtlci5qcycsXG4gICAgICAvLyBOYXZpZ2F0ZSB0byBpbmRleC5odG1sIGZvciBhbGwgNDA0IGVycm9ycyBkdXJpbmcgcHJvZHVjdGlvblxuICAgICAgbmF2aWdhdGVGYWxsYmFjazogbnVsbCxcbiAgICAgIC8vIEFsbG93bGlzdCBhbGwgcGF0aHMgZm9yIG5hdmlnYXRlRmFsbGJhY2sgZHVyaW5nIHByb2R1Y3Rpb25cbiAgICAgIG5hdmlnYXRlRmFsbGJhY2tBbGxvd2xpc3Q6IFtcbiAgICAgICAgLy8gYWxsb3cgZXZlcnl0aGluZ1xuICAgICAgICBuZXcgUmVnRXhwKCdeLy4qJCcpXG4gICAgICBdLFxuICAgICAgLy8gU2V0IHRoZSBnbG9iIGRpcmVjdG9yeSBhbmQgcGF0dGVybnMgZm9yIHRoZSBjYWNoZVxuICAgICAgZ2xvYkRpcmVjdG9yeTogcHJvY2Vzcy5lbnYuQVBQX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/ICcuL3B1YmxpYycgOiAnLi9kaXN0JyxcbiAgICAgIGdsb2JQYXR0ZXJuczogW1xuICAgICAgICAvLyBmb250c1xuICAgICAgICAnKiovKi57d29mZjIsd29mZix0dGYsZW90fScsXG4gICAgICAgIC8vIGltYWdlc1xuICAgICAgICAnKiovKi57cG5nLGpwZyxqcGVnLGdpZixzdmcsaWNvfScsXG4gICAgICAgIC8vIG1lZGlhXG4gICAgICAgICcqKi8qLnttcDMsbXA0LHdlYm19JyxcbiAgICAgICAgLy8gY29kZVxuICAgICAgICAnKiovKi57anMsIGNzc30nLFxuICAgICAgICAvLyBkb2NzXG4gICAgICAgICcqKi8qLnt0eHQseG1sLGpzb24scGRmfScsXG4gICAgICAgIC8vIDNkIG9iamVjdHNcbiAgICAgICAgJyoqLyoue2dsdGYsZ2xiLGJpbixtdGx9JyxcbiAgICAgICAgLy8gY29tcHJlc3NlZFxuICAgICAgICAnKiovKi57YnIsIGd6aXAsIHppcCxyYXIsN3p9JyxcbiAgICAgICAgLy8gd2ViYXNzZW1ibHlcbiAgICAgICAgJyoqLyoue3dhc219JyxcbiAgICAgICAgLy8ga3R4MlxuICAgICAgICAnKiovKi57a3R4Mn0nXG4gICAgICBdLFxuICAgICAgLy8gRW5hYmxlIGNsZWFudXAgb2Ygb3V0ZGF0ZWQgY2FjaGVzXG4gICAgICBjbGVhbnVwT3V0ZGF0ZWRDYWNoZXM6IHRydWUsXG4gICAgICAvLyBTZXQgbWF4aW11bSBjYWNoZSBzaXplIHRvIDEwIE1CXG4gICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMTAwMCAqIDEwMDAgKiAxMCxcbiAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgIC8vIENhY2hlIHN0YXRpY1xuICAgICAgICB7XG4gICAgICAgICAgdXJsUGF0dGVybjogKHsgdXJsIH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiAvXFwvc3RhdGljPy4qL2kudGVzdCh1cmwuaHJlZilcbiAgICAgICAgICB9LFxuICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjYWNoZU5hbWU6ICdzdGF0aWMtY2FjaGUnLFxuICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMDAsXG4gICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDI0ICogNjAgKiA2MCAqIDMwIC8vIDw9PSAzMCBkYXlzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyBDYWNoZSBzdGF0aWMgcmVzb3VyY2VzXG4gICAgICAgIHtcbiAgICAgICAgICB1cmxQYXR0ZXJuOiAoeyB1cmwgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIC9cXC9zdGF0aWMtcmVzb3VyY2VzPy4qL2kudGVzdCh1cmwuaHJlZilcbiAgICAgICAgICB9LFxuICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjYWNoZU5hbWU6ICdzdGF0aWMtYXNzZXRzLWNhY2hlJyxcbiAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgbWF4RW50cmllczogMTAwLFxuICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiAyNCAqIDYwICogNjAgKiAzMCAvLyA8PT0gMzAgZGF5c1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gQ2FjaGUgc2Z4IGFzc2V0c1xuICAgICAgICB7XG4gICAgICAgICAgdXJsUGF0dGVybjogKHsgdXJsIH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiAvXFwvc2Z4Py4qL2kudGVzdCh1cmwuaHJlZilcbiAgICAgICAgICB9LFxuICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjYWNoZU5hbWU6ICdzZngtYXNzZXRzLWNhY2hlJyxcbiAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgbWF4RW50cmllczogMTAwLFxuICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiAyNCAqIDYwICogNjAgKiAzMCAvLyA8PT0gMzAgZGF5c1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gQ2FjaGUgbG9jYWwgYXNzZXRzXG4gICAgICAgIHtcbiAgICAgICAgICB1cmxQYXR0ZXJuOiAoeyB1cmwgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIC9cXC9hc3NldHM/LiovaS50ZXN0KHVybC5ocmVmKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNhY2hlTmFtZTogJ2J1aWxkLWFzc2V0cy1jYWNoZScsXG4gICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwMCxcbiAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogMjQgKiA2MCAqIDYwICogMzAgLy8gPD09IDMwIGRheXNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIENhY2hlIGxvY2FsIGZvbnRzXG4gICAgICAgIHtcbiAgICAgICAgICB1cmxQYXR0ZXJuOiAoeyB1cmwgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIC9cXC9mb250cz8uKi9pLnRlc3QodXJsLmhyZWYpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgY2FjaGVOYW1lOiAnZm9udHMtYXNzZXRzLWNhY2hlJyxcbiAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgbWF4RW50cmllczogMTAwLFxuICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiAyNCAqIDYwICogNjAgKiAzMCAvLyA8PT0gMzAgZGF5c1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gQ2FjaGUgbG9jYWwgaWNvbnNcbiAgICAgICAge1xuICAgICAgICAgIHVybFBhdHRlcm46ICh7IHVybCB9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gL1xcL2ljb25zPy4qLy50ZXN0KHVybC5ocmVmKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNhY2hlTmFtZTogJ2ljb25zLWFzc2V0cy1jYWNoZScsXG4gICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwMCxcbiAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogMjQgKiA2MCAqIDYwICogMzAgLy8gPD09IDMwIGRheXNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIENhY2hlIGxvY2FsIHN0YXRpYyBhc3NldHNcbiAgICAgICAge1xuICAgICAgICAgIHVybFBhdHRlcm46ICh7IHVybCB9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gL1xcL3N0YXRpYz8uKi9pLnRlc3QodXJsLmhyZWYpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgY2FjaGVOYW1lOiAnc3RhdGljLWFzc2V0cy1jYWNoZScsXG4gICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwMCxcbiAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogMjQgKiA2MCAqIDYwICogMzAgLy8gPD09IDMwIGRheXNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIENhY2hlIGdvb2dsZSBmb250IHJlcXVlc3RzXG4gICAgICAgIHtcbiAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ZvbnRzXFwuZ29vZ2xlYXBpc1xcLmNvbVxcLy4qL2ksXG4gICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNhY2hlTmFtZTogJ2dvb2dsZS1mb250cy1jYWNoZScsXG4gICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwLFxuICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUgLy8gPD09IDM2NSBkYXlzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcbiAgICAgICAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9mb250c1xcLmdzdGF0aWNcXC5jb21cXC8uKi9pLFxuICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBjYWNoZU5hbWU6ICdnc3RhdGljLWZvbnRzLWNhY2hlJyxcbiAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgbWF4RW50cmllczogMTAsXG4gICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSAvLyA8PT0gMzY1IGRheXNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIENhY2hlIGFsbCByZXF1ZXN0c1xuICAgICAgICB7XG4gICAgICAgICAgdXJsUGF0dGVybjogL15odHRwcz86XFwvXFwvLipcXC4uKi9pLFxuICAgICAgICAgIGhhbmRsZXI6ICdOZXR3b3JrRmlyc3QnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNhY2hlTmFtZTogJ2FsbC1jb250ZW50LWNhY2hlJyxcbiAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgbWF4RW50cmllczogMTAwMCxcbiAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogMjQgKiA2MCAqIDYwIC8vIDw9PSAyNCBob3Vyc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5ldHdvcmtUaW1lb3V0U2Vjb25kczogMTBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8vIENhY2hlIGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgdXJsUGF0dGVybjogL15cXC8qLyxcbiAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgY2FjaGVOYW1lOiAnYWxsLWxvY2FsLWNhY2hlJyxcbiAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgbWF4RW50cmllczogMTAwLFxuICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiAyNCAqIDYwICogNjAgKiAzMCAvLyA8PT0gMzAgZGF5c1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfSlcblxuZXhwb3J0IGRlZmF1bHQgUFdBXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL25hemFyaWkvRGVza3RvcC9VYmllbmdpbmUvZXRoZXJlYWxlbmdpbmUvcGFja2FnZXMvY2xpZW50L3NjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL25hemFyaWkvRGVza3RvcC9VYmllbmdpbmUvZXRoZXJlYWxlbmdpbmUvcGFja2FnZXMvY2xpZW50L3NjcmlwdHMvZ2V0Q2xpZW50U2V0dGluZ3MudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbmF6YXJpaS9EZXNrdG9wL1ViaWVuZ2luZS9ldGhlcmVhbGVuZ2luZS9wYWNrYWdlcy9jbGllbnQvc2NyaXB0cy9nZXRDbGllbnRTZXR0aW5ncy50c1wiOy8qXG5DUEFMLTEuMCBMaWNlbnNlXG5cblRoZSBjb250ZW50cyBvZiB0aGlzIGZpbGUgYXJlIHN1YmplY3QgdG8gdGhlIENvbW1vbiBQdWJsaWMgQXR0cmlidXRpb24gTGljZW5zZVxuVmVyc2lvbiAxLjAuICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG53aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbmh0dHBzOi8vZ2l0aHViLmNvbS9FdGhlcmVhbEVuZ2luZS9ldGhlcmVhbGVuZ2luZS9ibG9iL2Rldi9MSUNFTlNFLlxuVGhlIExpY2Vuc2UgaXMgYmFzZWQgb24gdGhlIE1vemlsbGEgUHVibGljIExpY2Vuc2UgVmVyc2lvbiAxLjEsIGJ1dCBTZWN0aW9ucyAxNFxuYW5kIDE1IGhhdmUgYmVlbiBhZGRlZCB0byBjb3ZlciB1c2Ugb2Ygc29mdHdhcmUgb3ZlciBhIGNvbXB1dGVyIG5ldHdvcmsgYW5kIFxucHJvdmlkZSBmb3IgbGltaXRlZCBhdHRyaWJ1dGlvbiBmb3IgdGhlIE9yaWdpbmFsIERldmVsb3Blci4gSW4gYWRkaXRpb24sIFxuRXhoaWJpdCBBIGhhcyBiZWVuIG1vZGlmaWVkIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBFeGhpYml0IEIuXG5cblNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbldJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG5zcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcmlnaHRzIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuVGhlIE9yaWdpbmFsIENvZGUgaXMgRXRoZXJlYWwgRW5naW5lLlxuXG5UaGUgT3JpZ2luYWwgRGV2ZWxvcGVyIGlzIHRoZSBJbml0aWFsIERldmVsb3Blci4gVGhlIEluaXRpYWwgRGV2ZWxvcGVyIG9mIHRoZVxuT3JpZ2luYWwgQ29kZSBpcyB0aGUgRXRoZXJlYWwgRW5naW5lIHRlYW0uXG5cbkFsbCBwb3J0aW9ucyBvZiB0aGUgY29kZSB3cml0dGVuIGJ5IHRoZSBFdGhlcmVhbCBFbmdpbmUgdGVhbSBhcmUgQ29weXJpZ2h0IFx1MDBBOSAyMDIxLTIwMjMgXG5FdGhlcmVhbCBFbmdpbmUuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4qL1xuXG5pbXBvcnQga25leCBmcm9tICdrbmV4J1xuXG5pbXBvcnQgeyBjbGllbnREYlRvU2NoZW1hIH0gZnJvbSAnLi4vLi4vc2VydmVyLWNvcmUvc3JjL3NldHRpbmcvY2xpZW50LXNldHRpbmcvY2xpZW50LXNldHRpbmcucmVzb2x2ZXJzJ1xuXG5pbXBvcnQgeyBDbGllbnRTZXR0aW5nRGF0YWJhc2VUeXBlLCBjbGllbnRTZXR0aW5nUGF0aCB9IGZyb20gJy4uLy4uL2NvbW1vbi9zcmMvc2NoZW1hcy9zZXR0aW5nL2NsaWVudC1zZXR0aW5nLnNjaGVtYSdcblxuZXhwb3J0IGNvbnN0IGdldENsaWVudFNldHRpbmcgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGtuZXhDbGllbnQgPSBrbmV4KHtcbiAgICBjbGllbnQ6ICdteXNxbCcsXG4gICAgY29ubmVjdGlvbjoge1xuICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuTVlTUUxfVVNFUiA/PyAnc2VydmVyJyxcbiAgICAgIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5NWVNRTF9QQVNTV09SRCA/PyAncGFzc3dvcmQnLFxuICAgICAgaG9zdDogcHJvY2Vzcy5lbnYuTVlTUUxfSE9TVCA/PyAnMTI3LjAuMC4xJyxcbiAgICAgIHBvcnQ6IHBhcnNlSW50KHByb2Nlc3MuZW52Lk1ZU1FMX1BPUlQgfHwgJzMzMDYnKSxcbiAgICAgIGRhdGFiYXNlOiBwcm9jZXNzLmVudi5NWVNRTF9EQVRBQkFTRSA/PyAnZXRoZXJlYWxlbmdpbmUnLFxuICAgICAgY2hhcnNldDogJ3V0ZjhtYjQnXG4gICAgfVxuICB9KVxuXG4gIGNvbnN0IGNsaWVudFNldHRpbmcgPSBhd2FpdCBrbmV4Q2xpZW50XG4gICAgLnNlbGVjdCgpXG4gICAgLmZyb208Q2xpZW50U2V0dGluZ0RhdGFiYXNlVHlwZT4oY2xpZW50U2V0dGluZ1BhdGgpXG4gICAgLnRoZW4oKFtkYkNsaWVudF0pID0+IHtcbiAgICAgIGNvbnN0IGRiQ2xpZW50Q29uZmlnID0gY2xpZW50RGJUb1NjaGVtYShkYkNsaWVudCkgfHwge1xuICAgICAgICBsb2dvOiAnLi9sb2dvLnN2ZycsXG4gICAgICAgIHRpdGxlOiAnRXRoZXJlYWwgRW5naW5lJyxcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9sb2NhbC5ldGhlcmVhbGVuZ2luZS5vcmcnLFxuICAgICAgICByZWxlYXNlTmFtZTogJ2xvY2FsJyxcbiAgICAgICAgc2l0ZURlc2NyaXB0aW9uOiAnQ29ubmVjdGVkIFdvcmxkcyBmb3IgRXZlcnlvbmUnLFxuICAgICAgICBmYXZpY29uMzJweDogJy9mYXZpY29uLTMyeDMyLnBuZycsXG4gICAgICAgIGZhdmljb24xNnB4OiAnL2Zhdmljb24tMTZ4MTYucG5nJyxcbiAgICAgICAgaWNvbjE5MnB4OiAnL2FuZHJvaWQtY2hyb21lLTE5MngxOTIucG5nJyxcbiAgICAgICAgaWNvbjUxMnB4OiAnL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nJ1xuICAgICAgfVxuICAgICAgaWYgKGRiQ2xpZW50Q29uZmlnKSB7XG4gICAgICAgIHJldHVybiBkYkNsaWVudENvbmZpZ1xuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICBjb25zb2xlLndhcm4oJ1t2aXRlLmNvbmZpZ106IEZhaWxlZCB0byByZWFkIGNsaWVudFNldHRpbmcnKVxuICAgICAgY29uc29sZS53YXJuKGUpXG4gICAgfSlcblxuICBhd2FpdCBrbmV4Q2xpZW50LmRlc3Ryb3koKVxuXG4gIHJldHVybiBjbGllbnRTZXR0aW5nIVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL3NlcnZlci1jb3JlL3NyYy9zZXR0aW5nL2NsaWVudC1zZXR0aW5nXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL3NlcnZlci1jb3JlL3NyYy9zZXR0aW5nL2NsaWVudC1zZXR0aW5nL2NsaWVudC1zZXR0aW5nLnJlc29sdmVycy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL3NlcnZlci1jb3JlL3NyYy9zZXR0aW5nL2NsaWVudC1zZXR0aW5nL2NsaWVudC1zZXR0aW5nLnJlc29sdmVycy50c1wiOy8qXG5DUEFMLTEuMCBMaWNlbnNlXG5cblRoZSBjb250ZW50cyBvZiB0aGlzIGZpbGUgYXJlIHN1YmplY3QgdG8gdGhlIENvbW1vbiBQdWJsaWMgQXR0cmlidXRpb24gTGljZW5zZVxuVmVyc2lvbiAxLjAuICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG53aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbmh0dHBzOi8vZ2l0aHViLmNvbS9FdGhlcmVhbEVuZ2luZS9ldGhlcmVhbGVuZ2luZS9ibG9iL2Rldi9MSUNFTlNFLlxuVGhlIExpY2Vuc2UgaXMgYmFzZWQgb24gdGhlIE1vemlsbGEgUHVibGljIExpY2Vuc2UgVmVyc2lvbiAxLjEsIGJ1dCBTZWN0aW9ucyAxNFxuYW5kIDE1IGhhdmUgYmVlbiBhZGRlZCB0byBjb3ZlciB1c2Ugb2Ygc29mdHdhcmUgb3ZlciBhIGNvbXB1dGVyIG5ldHdvcmsgYW5kIFxucHJvdmlkZSBmb3IgbGltaXRlZCBhdHRyaWJ1dGlvbiBmb3IgdGhlIE9yaWdpbmFsIERldmVsb3Blci4gSW4gYWRkaXRpb24sIFxuRXhoaWJpdCBBIGhhcyBiZWVuIG1vZGlmaWVkIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBFeGhpYml0IEIuXG5cblNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbldJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG5zcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcmlnaHRzIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuVGhlIE9yaWdpbmFsIENvZGUgaXMgRXRoZXJlYWwgRW5naW5lLlxuXG5UaGUgT3JpZ2luYWwgRGV2ZWxvcGVyIGlzIHRoZSBJbml0aWFsIERldmVsb3Blci4gVGhlIEluaXRpYWwgRGV2ZWxvcGVyIG9mIHRoZVxuT3JpZ2luYWwgQ29kZSBpcyB0aGUgRXRoZXJlYWwgRW5naW5lIHRlYW0uXG5cbkFsbCBwb3J0aW9ucyBvZiB0aGUgY29kZSB3cml0dGVuIGJ5IHRoZSBFdGhlcmVhbCBFbmdpbmUgdGVhbSBhcmUgQ29weXJpZ2h0IFx1MDBBOSAyMDIxLTIwMjMgXG5FdGhlcmVhbCBFbmdpbmUuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4qL1xuXG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGlzIGZpbGUgc2VlIGh0dHBzOi8vZG92ZS5mZWF0aGVyc2pzLmNvbS9ndWlkZXMvY2xpL3NlcnZpY2Uuc2NoZW1hcy5odG1sXG5pbXBvcnQgeyByZXNvbHZlLCB2aXJ0dWFsIH0gZnJvbSAnQGZlYXRoZXJzanMvc2NoZW1hJ1xuaW1wb3J0IHsgdjQgfSBmcm9tICd1dWlkJ1xuXG5pbXBvcnQge1xuICBDbGllbnRTZXR0aW5nRGF0YWJhc2VUeXBlLFxuICBDbGllbnRTZXR0aW5nUXVlcnksXG4gIENsaWVudFNldHRpbmdUeXBlLFxuICBDbGllbnRTb2NpYWxMaW5rVHlwZSxcbiAgQ2xpZW50VGhlbWVPcHRpb25zVHlwZVxufSBmcm9tICdAZXRoZXJlYWxlbmdpbmUvY29tbW9uL3NyYy9zY2hlbWFzL3NldHRpbmcvY2xpZW50LXNldHRpbmcuc2NoZW1hJ1xuaW1wb3J0IHR5cGUgeyBIb29rQ29udGV4dCB9IGZyb20gJ0BldGhlcmVhbGVuZ2luZS9zZXJ2ZXItY29yZS9kZWNsYXJhdGlvbnMnXG5cbmltcG9ydCB7IGZyb21EYXRlVGltZVNxbCwgZ2V0RGF0ZVRpbWVTcWwgfSBmcm9tICcuLi8uLi8uLi8uLi9jb21tb24vc3JjL3V0aWxzL2RhdGV0aW1lLXNxbCdcblxuZXhwb3J0IGNvbnN0IGNsaWVudERiVG9TY2hlbWEgPSAocmF3RGF0YTogQ2xpZW50U2V0dGluZ0RhdGFiYXNlVHlwZSk6IENsaWVudFNldHRpbmdUeXBlID0+IHtcbiAgbGV0IGFwcFNvY2lhbExpbmtzID0gSlNPTi5wYXJzZShyYXdEYXRhLmFwcFNvY2lhbExpbmtzKSBhcyBDbGllbnRTb2NpYWxMaW5rVHlwZVtdXG5cbiAgLy8gVXN1YWxseSBhYm92ZSBKU09OLnBhcnNlIHNob3VsZCBiZSBlbm91Z2guIEJ1dCBzaW5jZSBvdXIgcHJlLWZlYXRoZXJzIDUgZGF0YVxuICAvLyB3YXMgc2VyaWFsaXplZCBtdWx0aXBsZSB0aW1lcywgdGhlcmVmb3JlIHdlIG5lZWQgdG8gcGFyc2UgaXQgdHdpY2UuXG4gIGlmICh0eXBlb2YgYXBwU29jaWFsTGlua3MgPT09ICdzdHJpbmcnKSB7XG4gICAgYXBwU29jaWFsTGlua3MgPSBKU09OLnBhcnNlKGFwcFNvY2lhbExpbmtzKVxuICB9XG5cbiAgbGV0IHRoZW1lU2V0dGluZ3MgPSBKU09OLnBhcnNlKHJhd0RhdGEudGhlbWVTZXR0aW5ncykgYXMgUmVjb3JkPHN0cmluZywgQ2xpZW50VGhlbWVPcHRpb25zVHlwZT5cblxuICAvLyBVc3VhbGx5IGFib3ZlIEpTT04ucGFyc2Ugc2hvdWxkIGJlIGVub3VnaC4gQnV0IHNpbmNlIG91ciBwcmUtZmVhdGhlcnMgNSBkYXRhXG4gIC8vIHdhcyBzZXJpYWxpemVkIG11bHRpcGxlIHRpbWVzLCB0aGVyZWZvcmUgd2UgbmVlZCB0byBwYXJzZSBpdCB0d2ljZS5cbiAgaWYgKHR5cGVvZiB0aGVtZVNldHRpbmdzID09PSAnc3RyaW5nJykge1xuICAgIHRoZW1lU2V0dGluZ3MgPSBKU09OLnBhcnNlKHRoZW1lU2V0dGluZ3MpXG4gIH1cblxuICBsZXQgdGhlbWVNb2RlcyA9IEpTT04ucGFyc2UocmF3RGF0YS50aGVtZU1vZGVzKSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XG5cbiAgLy8gVXN1YWxseSBhYm92ZSBKU09OLnBhcnNlIHNob3VsZCBiZSBlbm91Z2guIEJ1dCBzaW5jZSBvdXIgcHJlLWZlYXRoZXJzIDUgZGF0YVxuICAvLyB3YXMgc2VyaWFsaXplZCBtdWx0aXBsZSB0aW1lcywgdGhlcmVmb3JlIHdlIG5lZWQgdG8gcGFyc2UgaXQgdHdpY2UuXG4gIGlmICh0eXBlb2YgdGhlbWVNb2RlcyA9PT0gJ3N0cmluZycpIHtcbiAgICB0aGVtZU1vZGVzID0gSlNPTi5wYXJzZSh0aGVtZU1vZGVzKVxuICB9XG5cbiAgaWYgKHR5cGVvZiByYXdEYXRhLm1lZGlhU2V0dGluZ3MgPT09ICdzdHJpbmcnKSByYXdEYXRhLm1lZGlhU2V0dGluZ3MgPSBKU09OLnBhcnNlKHJhd0RhdGEubWVkaWFTZXR0aW5ncylcblxuICByZXR1cm4ge1xuICAgIC4uLnJhd0RhdGEsXG4gICAgYXBwU29jaWFsTGlua3MsXG4gICAgdGhlbWVTZXR0aW5ncyxcbiAgICB0aGVtZU1vZGVzXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNsaWVudFNldHRpbmdSZXNvbHZlciA9IHJlc29sdmU8Q2xpZW50U2V0dGluZ1R5cGUsIEhvb2tDb250ZXh0PihcbiAge1xuICAgIGNyZWF0ZWRBdDogdmlydHVhbChhc3luYyAoY2xpZW50U2V0dGluZykgPT4gZnJvbURhdGVUaW1lU3FsKGNsaWVudFNldHRpbmcuY3JlYXRlZEF0KSksXG4gICAgdXBkYXRlZEF0OiB2aXJ0dWFsKGFzeW5jIChjbGllbnRTZXR0aW5nKSA9PiBmcm9tRGF0ZVRpbWVTcWwoY2xpZW50U2V0dGluZy51cGRhdGVkQXQpKVxuICB9LFxuICB7XG4gICAgLy8gQ29udmVydCB0aGUgcmF3IGRhdGEgaW50byBhIG5ldyBzdHJ1Y3R1cmUgYmVmb3JlIHJ1bm5pbmcgcHJvcGVydHkgcmVzb2x2ZXJzXG4gICAgY29udmVydGVyOiBhc3luYyAocmF3RGF0YSwgY29udGV4dCkgPT4ge1xuICAgICAgcmV0dXJuIGNsaWVudERiVG9TY2hlbWEocmF3RGF0YSlcbiAgICB9XG4gIH1cbilcblxuZXhwb3J0IGNvbnN0IGNsaWVudFNldHRpbmdFeHRlcm5hbFJlc29sdmVyID0gcmVzb2x2ZTxDbGllbnRTZXR0aW5nVHlwZSwgSG9va0NvbnRleHQ+KHt9KVxuXG5leHBvcnQgY29uc3QgY2xpZW50U2V0dGluZ0RhdGFSZXNvbHZlciA9IHJlc29sdmU8Q2xpZW50U2V0dGluZ0RhdGFiYXNlVHlwZSwgSG9va0NvbnRleHQ+KFxuICB7XG4gICAgaWQ6IGFzeW5jICgpID0+IHtcbiAgICAgIHJldHVybiB2NCgpXG4gICAgfSxcbiAgICBjcmVhdGVkQXQ6IGdldERhdGVUaW1lU3FsLFxuICAgIHVwZGF0ZWRBdDogZ2V0RGF0ZVRpbWVTcWxcbiAgfSxcbiAge1xuICAgIC8vIENvbnZlcnQgdGhlIHJhdyBkYXRhIGludG8gYSBuZXcgc3RydWN0dXJlIGJlZm9yZSBydW5uaW5nIHByb3BlcnR5IHJlc29sdmVyc1xuICAgIGNvbnZlcnRlcjogYXN5bmMgKHJhd0RhdGEsIGNvbnRleHQpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnJhd0RhdGEsXG4gICAgICAgIGFwcFNvY2lhbExpbmtzOiBKU09OLnN0cmluZ2lmeShyYXdEYXRhLmFwcFNvY2lhbExpbmtzKSxcbiAgICAgICAgdGhlbWVTZXR0aW5nczogSlNPTi5zdHJpbmdpZnkocmF3RGF0YS50aGVtZVNldHRpbmdzKSxcbiAgICAgICAgdGhlbWVNb2RlczogSlNPTi5zdHJpbmdpZnkocmF3RGF0YS50aGVtZU1vZGVzKSxcbiAgICAgICAgbWVkaWFTZXR0aW5nczogSlNPTi5zdHJpbmdpZnkocmF3RGF0YS5tZWRpYVNldHRpbmdzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuKVxuXG5leHBvcnQgY29uc3QgY2xpZW50U2V0dGluZ1BhdGNoUmVzb2x2ZXIgPSByZXNvbHZlPENsaWVudFNldHRpbmdUeXBlLCBIb29rQ29udGV4dD4oXG4gIHtcbiAgICB1cGRhdGVkQXQ6IGdldERhdGVUaW1lU3FsXG4gIH0sXG4gIHtcbiAgICAvLyBDb252ZXJ0IHRoZSByYXcgZGF0YSBpbnRvIGEgbmV3IHN0cnVjdHVyZSBiZWZvcmUgcnVubmluZyBwcm9wZXJ0eSByZXNvbHZlcnNcbiAgICBjb252ZXJ0ZXI6IGFzeW5jIChyYXdEYXRhLCBjb250ZXh0KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5yYXdEYXRhLFxuICAgICAgICBhcHBTb2NpYWxMaW5rczogSlNPTi5zdHJpbmdpZnkocmF3RGF0YS5hcHBTb2NpYWxMaW5rcyksXG4gICAgICAgIHRoZW1lU2V0dGluZ3M6IEpTT04uc3RyaW5naWZ5KHJhd0RhdGEudGhlbWVTZXR0aW5ncyksXG4gICAgICAgIHRoZW1lTW9kZXM6IEpTT04uc3RyaW5naWZ5KHJhd0RhdGEudGhlbWVNb2RlcyksXG4gICAgICAgIG1lZGlhU2V0dGluZ3M6IEpTT04uc3RyaW5naWZ5KHJhd0RhdGEubWVkaWFTZXR0aW5ncylcbiAgICAgIH1cbiAgICB9XG4gIH1cbilcblxuZXhwb3J0IGNvbnN0IGNsaWVudFNldHRpbmdRdWVyeVJlc29sdmVyID0gcmVzb2x2ZTxDbGllbnRTZXR0aW5nUXVlcnksIEhvb2tDb250ZXh0Pih7fSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvbmF6YXJpaS9EZXNrdG9wL1ViaWVuZ2luZS9ldGhlcmVhbGVuZ2luZS9wYWNrYWdlcy9jb21tb24vc3JjL3V0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL2NvbW1vbi9zcmMvdXRpbHMvZGF0ZXRpbWUtc3FsLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL25hemFyaWkvRGVza3RvcC9VYmllbmdpbmUvZXRoZXJlYWxlbmdpbmUvcGFja2FnZXMvY29tbW9uL3NyYy91dGlscy9kYXRldGltZS1zcWwudHNcIjsvKlxuQ1BBTC0xLjAgTGljZW5zZVxuXG5UaGUgY29udGVudHMgb2YgdGhpcyBmaWxlIGFyZSBzdWJqZWN0IHRvIHRoZSBDb21tb24gUHVibGljIEF0dHJpYnV0aW9uIExpY2Vuc2VcblZlcnNpb24gMS4wLiAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxud2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5odHRwczovL2dpdGh1Yi5jb20vRXRoZXJlYWxFbmdpbmUvZXRoZXJlYWxlbmdpbmUvYmxvYi9kZXYvTElDRU5TRS5cblRoZSBMaWNlbnNlIGlzIGJhc2VkIG9uIHRoZSBNb3ppbGxhIFB1YmxpYyBMaWNlbnNlIFZlcnNpb24gMS4xLCBidXQgU2VjdGlvbnMgMTRcbmFuZCAxNSBoYXZlIGJlZW4gYWRkZWQgdG8gY292ZXIgdXNlIG9mIHNvZnR3YXJlIG92ZXIgYSBjb21wdXRlciBuZXR3b3JrIGFuZCBcbnByb3ZpZGUgZm9yIGxpbWl0ZWQgYXR0cmlidXRpb24gZm9yIHRoZSBPcmlnaW5hbCBEZXZlbG9wZXIuIEluIGFkZGl0aW9uLCBcbkV4aGliaXQgQSBoYXMgYmVlbiBtb2RpZmllZCB0byBiZSBjb25zaXN0ZW50IHdpdGggRXhoaWJpdCBCLlxuXG5Tb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgYmFzaXMsXG5XSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHJpZ2h0cyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cblRoZSBPcmlnaW5hbCBDb2RlIGlzIEV0aGVyZWFsIEVuZ2luZS5cblxuVGhlIE9yaWdpbmFsIERldmVsb3BlciBpcyB0aGUgSW5pdGlhbCBEZXZlbG9wZXIuIFRoZSBJbml0aWFsIERldmVsb3BlciBvZiB0aGVcbk9yaWdpbmFsIENvZGUgaXMgdGhlIEV0aGVyZWFsIEVuZ2luZSB0ZWFtLlxuXG5BbGwgcG9ydGlvbnMgb2YgdGhlIGNvZGUgd3JpdHRlbiBieSB0aGUgRXRoZXJlYWwgRW5naW5lIHRlYW0gYXJlIENvcHlyaWdodCBcdTAwQTkgMjAyMS0yMDIzIFxuRXRoZXJlYWwgRW5naW5lLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuKi9cblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzExMTUwNzI3XG5leHBvcnQgY29uc3QgZ2V0RGF0ZVRpbWVTcWwgPSBhc3luYyAoKSA9PiB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTkpLnJlcGxhY2UoJ1QnLCAnICcpXG59XG5cbmV4cG9ydCBjb25zdCB0b0RhdGVUaW1lU3FsID0gKGRhdGU6IERhdGUpID0+IHtcbiAgcmV0dXJuIGRhdGUudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxOSkucmVwbGFjZSgnVCcsICcgJylcbn1cblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzExMTUwNzI3XG5leHBvcnQgY29uc3QgZnJvbURhdGVUaW1lU3FsID0gKGRhdGU6IHN0cmluZykgPT4ge1xuICBsZXQgZGF0ZU9iajogRGF0ZVxuICBpZiAodHlwZW9mIGRhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgZGF0ZU9iaiA9IG5ldyBEYXRlKGRhdGUpXG4gIH0gZWxzZSB7XG4gICAgZGF0ZU9iaiA9IGRhdGVcbiAgfVxuICByZXR1cm4gKFxuICAgIGRhdGVPYmouZ2V0RnVsbFllYXIoKSArXG4gICAgJy0nICtcbiAgICAoJzAwJyArIChkYXRlT2JqLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpICtcbiAgICAnLScgK1xuICAgICgnMDAnICsgZGF0ZU9iai5nZXREYXRlKCkpLnNsaWNlKC0yKSArXG4gICAgJ1QnICtcbiAgICAoJzAwJyArIGRhdGVPYmouZ2V0SG91cnMoKSkuc2xpY2UoLTIpICtcbiAgICAnOicgK1xuICAgICgnMDAnICsgZGF0ZU9iai5nZXRNaW51dGVzKCkpLnNsaWNlKC0yKSArXG4gICAgJzonICtcbiAgICAoJzAwJyArIGRhdGVPYmouZ2V0U2Vjb25kcygpKS5zbGljZSgtMikgK1xuICAgICcuMDAwWidcbiAgKVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL2NvbW1vbi9zcmMvc2NoZW1hcy9zZXR0aW5nXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL2NvbW1vbi9zcmMvc2NoZW1hcy9zZXR0aW5nL2NsaWVudC1zZXR0aW5nLnNjaGVtYS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL2NvbW1vbi9zcmMvc2NoZW1hcy9zZXR0aW5nL2NsaWVudC1zZXR0aW5nLnNjaGVtYS50c1wiOy8qXG5DUEFMLTEuMCBMaWNlbnNlXG5cblRoZSBjb250ZW50cyBvZiB0aGlzIGZpbGUgYXJlIHN1YmplY3QgdG8gdGhlIENvbW1vbiBQdWJsaWMgQXR0cmlidXRpb24gTGljZW5zZVxuVmVyc2lvbiAxLjAuICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlXG53aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbmh0dHBzOi8vZ2l0aHViLmNvbS9FdGhlcmVhbEVuZ2luZS9ldGhlcmVhbGVuZ2luZS9ibG9iL2Rldi9MSUNFTlNFLlxuVGhlIExpY2Vuc2UgaXMgYmFzZWQgb24gdGhlIE1vemlsbGEgUHVibGljIExpY2Vuc2UgVmVyc2lvbiAxLjEsIGJ1dCBTZWN0aW9ucyAxNFxuYW5kIDE1IGhhdmUgYmVlbiBhZGRlZCB0byBjb3ZlciB1c2Ugb2Ygc29mdHdhcmUgb3ZlciBhIGNvbXB1dGVyIG5ldHdvcmsgYW5kIFxucHJvdmlkZSBmb3IgbGltaXRlZCBhdHRyaWJ1dGlvbiBmb3IgdGhlIE9yaWdpbmFsIERldmVsb3Blci4gSW4gYWRkaXRpb24sIFxuRXhoaWJpdCBBIGhhcyBiZWVuIG1vZGlmaWVkIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBFeGhpYml0IEIuXG5cblNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBiYXNpcyxcbldJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG5zcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcmlnaHRzIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuVGhlIE9yaWdpbmFsIENvZGUgaXMgRXRoZXJlYWwgRW5naW5lLlxuXG5UaGUgT3JpZ2luYWwgRGV2ZWxvcGVyIGlzIHRoZSBJbml0aWFsIERldmVsb3Blci4gVGhlIEluaXRpYWwgRGV2ZWxvcGVyIG9mIHRoZVxuT3JpZ2luYWwgQ29kZSBpcyB0aGUgRXRoZXJlYWwgRW5naW5lIHRlYW0uXG5cbkFsbCBwb3J0aW9ucyBvZiB0aGUgY29kZSB3cml0dGVuIGJ5IHRoZSBFdGhlcmVhbCBFbmdpbmUgdGVhbSBhcmUgQ29weXJpZ2h0IFx1MDBBOSAyMDIxLTIwMjMgXG5FdGhlcmVhbCBFbmdpbmUuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4qL1xuXG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGlzIGZpbGUgc2VlIGh0dHBzOi8vZG92ZS5mZWF0aGVyc2pzLmNvbS9ndWlkZXMvY2xpL3NlcnZpY2Uuc2NoZW1hcy5odG1sXG5pbXBvcnQgdHlwZSB7IFN0YXRpYyB9IGZyb20gJ0BmZWF0aGVyc2pzL3R5cGVib3gnXG5pbXBvcnQgeyBnZXRWYWxpZGF0b3IsIHF1ZXJ5U3ludGF4LCBUeXBlIH0gZnJvbSAnQGZlYXRoZXJzanMvdHlwZWJveCdcbmltcG9ydCB7IGRhdGFWYWxpZGF0b3IsIHF1ZXJ5VmFsaWRhdG9yIH0gZnJvbSAnLi4vdmFsaWRhdG9ycydcblxuZXhwb3J0IGNvbnN0IGNsaWVudFNldHRpbmdQYXRoID0gJ2NsaWVudC1zZXR0aW5nJ1xuXG5leHBvcnQgY29uc3QgY2xpZW50U2V0dGluZ01ldGhvZHMgPSBbJ2ZpbmQnLCAnZ2V0JywgJ3BhdGNoJ10gYXMgY29uc3RcblxuZXhwb3J0IGNvbnN0IGNsaWVudFNvY2lhbExpbmtTY2hlbWEgPSBUeXBlLk9iamVjdChcbiAge1xuICAgIGxpbms6IFR5cGUuU3RyaW5nKCksXG4gICAgaWNvbjogVHlwZS5TdHJpbmcoKVxuICB9LFxuICB7ICRpZDogJ0NsaWVudFNvY2lhbExpbmsnLCBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UgfVxuKVxuZXhwb3J0IGludGVyZmFjZSBDbGllbnRTb2NpYWxMaW5rVHlwZSBleHRlbmRzIFN0YXRpYzx0eXBlb2YgY2xpZW50U29jaWFsTGlua1NjaGVtYT4ge31cblxuZXhwb3J0IGNvbnN0IGF1ZGlvU2V0dGluZ3NTY2hlbWEgPSBUeXBlLk9iamVjdChcbiAge1xuICAgIG1heEJpdHJhdGU6IFR5cGUuTnVtYmVyKClcbiAgfSxcbiAgeyAkaWQ6ICdBdWRpb1NldHRpbmdzU2NoZW1hJywgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlIH1cbilcblxuZXhwb3J0IGludGVyZmFjZSBBdWRpb1NldHRpbmdzVHlwZSBleHRlbmRzIFN0YXRpYzx0eXBlb2YgYXVkaW9TZXR0aW5nc1NjaGVtYT4ge31cblxuZXhwb3J0IGNvbnN0IHZpZGVvU2V0dGluZ3NTY2hlbWEgPSBUeXBlLk9iamVjdChcbiAge1xuICAgIGNvZGVjOiBUeXBlLlN0cmluZygpLFxuICAgIG1heFJlc29sdXRpb246IFR5cGUuU3RyaW5nKCksXG4gICAgbG93UmVzTWF4Qml0cmF0ZTogVHlwZS5OdW1iZXIoKSxcbiAgICBtaWRSZXNNYXhCaXRyYXRlOiBUeXBlLk51bWJlcigpLFxuICAgIGhpZ2hSZXNNYXhCaXRyYXRlOiBUeXBlLk51bWJlcigpXG4gIH0sXG4gIHsgJGlkOiAnVmlkZW9TZXR0aW5nc1NjaGVtYScsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSB9XG4pXG5cbmV4cG9ydCBjb25zdCBzY3JlZW5zaGFyZVNldHRpbmdzU2NoZW1hID0gVHlwZS5PYmplY3QoXG4gIHtcbiAgICBjb2RlYzogVHlwZS5TdHJpbmcoKSxcbiAgICBsb3dSZXNNYXhCaXRyYXRlOiBUeXBlLk51bWJlcigpLFxuICAgIG1pZFJlc01heEJpdHJhdGU6IFR5cGUuTnVtYmVyKCksXG4gICAgaGlnaFJlc01heEJpdHJhdGU6IFR5cGUuTnVtYmVyKClcbiAgfSxcbiAgeyAkaWQ6ICdTY3JlZW5zaGFyZVNldHRpbmdzU2NoZW1hJywgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlIH1cbilcblxuZXhwb3J0IGludGVyZmFjZSBWaWRlb1NldHRpbmdzVHlwZSBleHRlbmRzIFN0YXRpYzx0eXBlb2YgdmlkZW9TZXR0aW5nc1NjaGVtYT4ge31cblxuZXhwb3J0IGNvbnN0IG1lZGlhU2V0dGluZ3NTY2hlbWEgPSBUeXBlLk9iamVjdChcbiAge1xuICAgIGF1ZGlvOiBUeXBlLlJlZihhdWRpb1NldHRpbmdzU2NoZW1hKSxcbiAgICB2aWRlbzogVHlwZS5SZWYodmlkZW9TZXR0aW5nc1NjaGVtYSksXG4gICAgc2NyZWVuc2hhcmU6IFR5cGUuUmVmKHNjcmVlbnNoYXJlU2V0dGluZ3NTY2hlbWEpXG4gIH0sXG4gIHsgJGlkOiAnTWVkaWFTZXR0aW5nc1NjaGVtYScsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSB9XG4pXG5cbmV4cG9ydCBpbnRlcmZhY2UgTWVkaWFTZXR0aW5nc1R5cGUgZXh0ZW5kcyBTdGF0aWM8dHlwZW9mIG1lZGlhU2V0dGluZ3NTY2hlbWE+IHt9XG5cbmV4cG9ydCBjb25zdCBjbGllbnRUaGVtZU9wdGlvbnNTY2hlbWEgPSBUeXBlLk9iamVjdChcbiAge1xuICAgIHRleHRDb2xvcjogVHlwZS5TdHJpbmcoKSxcbiAgICBuYXZiYXJCYWNrZ3JvdW5kOiBUeXBlLlN0cmluZygpLFxuICAgIHNpZGViYXJCYWNrZ3JvdW5kOiBUeXBlLlN0cmluZygpLFxuICAgIHNpZGViYXJTZWxlY3RlZEJhY2tncm91bmQ6IFR5cGUuU3RyaW5nKCksXG4gICAgbWFpbkJhY2tncm91bmQ6IFR5cGUuU3RyaW5nKCksXG4gICAgcGFuZWxCYWNrZ3JvdW5kOiBUeXBlLlN0cmluZygpLFxuICAgIHBhbmVsQ2FyZHM6IFR5cGUuU3RyaW5nKCksXG4gICAgcGFuZWxDYXJkSG92ZXJPdXRsaW5lOiBUeXBlLlN0cmluZygpLFxuICAgIHBhbmVsQ2FyZEljb246IFR5cGUuU3RyaW5nKCksXG4gICAgdGV4dEhlYWRpbmc6IFR5cGUuU3RyaW5nKCksXG4gICAgdGV4dFN1YmhlYWRpbmc6IFR5cGUuU3RyaW5nKCksXG4gICAgdGV4dERlc2NyaXB0aW9uOiBUeXBlLlN0cmluZygpLFxuICAgIGljb25CdXR0b25Db2xvcjogVHlwZS5TdHJpbmcoKSxcbiAgICBpY29uQnV0dG9uSG92ZXJDb2xvcjogVHlwZS5TdHJpbmcoKSxcbiAgICBpY29uQnV0dG9uQmFja2dyb3VuZDogVHlwZS5TdHJpbmcoKSxcbiAgICBpY29uQnV0dG9uU2VsZWN0ZWRCYWNrZ3JvdW5kOiBUeXBlLlN0cmluZygpLFxuICAgIGJ1dHRvbk91dGxpbmVkOiBUeXBlLlN0cmluZygpLFxuICAgIGJ1dHRvbkZpbGxlZDogVHlwZS5TdHJpbmcoKSxcbiAgICBidXR0b25HcmFkaWVudFN0YXJ0OiBUeXBlLlN0cmluZygpLFxuICAgIGJ1dHRvbkdyYWRpZW50RW5kOiBUeXBlLlN0cmluZygpLFxuICAgIGJ1dHRvblRleHRDb2xvcjogVHlwZS5TdHJpbmcoKSxcbiAgICBzY3JvbGxiYXJUaHVtYlhBeGlzU3RhcnQ6IFR5cGUuU3RyaW5nKCksXG4gICAgc2Nyb2xsYmFyVGh1bWJYQXhpc0VuZDogVHlwZS5TdHJpbmcoKSxcbiAgICBzY3JvbGxiYXJUaHVtYllBeGlzU3RhcnQ6IFR5cGUuU3RyaW5nKCksXG4gICAgc2Nyb2xsYmFyVGh1bWJZQXhpc0VuZDogVHlwZS5TdHJpbmcoKSxcbiAgICBzY3JvbGxiYXJDb3JuZXI6IFR5cGUuU3RyaW5nKCksXG4gICAgaW5wdXRPdXRsaW5lOiBUeXBlLlN0cmluZygpLFxuICAgIGlucHV0QmFja2dyb3VuZDogVHlwZS5TdHJpbmcoKSxcbiAgICBwcmltYXJ5SGlnaGxpZ2h0OiBUeXBlLlN0cmluZygpLFxuICAgIGRyb3Bkb3duTWVudUJhY2tncm91bmQ6IFR5cGUuU3RyaW5nKCksXG4gICAgZHJvcGRvd25NZW51SG92ZXJCYWNrZ3JvdW5kOiBUeXBlLlN0cmluZygpLFxuICAgIGRyb3Bkb3duTWVudVNlbGVjdGVkQmFja2dyb3VuZDogVHlwZS5TdHJpbmcoKSxcbiAgICBkcmF3ZXJCYWNrZ3JvdW5kOiBUeXBlLlN0cmluZygpLFxuICAgIHBvcHVwQmFja2dyb3VuZDogVHlwZS5TdHJpbmcoKSxcbiAgICB0YWJsZUhlYWRlckJhY2tncm91bmQ6IFR5cGUuU3RyaW5nKCksXG4gICAgdGFibGVDZWxsQmFja2dyb3VuZDogVHlwZS5TdHJpbmcoKSxcbiAgICB0YWJsZUZvb3RlckJhY2tncm91bmQ6IFR5cGUuU3RyaW5nKCksXG4gICAgZG9ja0JhY2tncm91bmQ6IFR5cGUuU3RyaW5nKClcbiAgfSxcbiAgeyAkaWQ6ICdDbGllbnRUaGVtZU9wdGlvbnMnLCBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UgfVxuKVxuZXhwb3J0IGludGVyZmFjZSBDbGllbnRUaGVtZU9wdGlvbnNUeXBlIGV4dGVuZHMgU3RhdGljPHR5cGVvZiBjbGllbnRUaGVtZU9wdGlvbnNTY2hlbWE+IHt9XG5cbi8vIE1haW4gZGF0YSBtb2RlbCBzY2hlbWFcbmV4cG9ydCBjb25zdCBjbGllbnRTZXR0aW5nU2NoZW1hID0gVHlwZS5PYmplY3QoXG4gIHtcbiAgICBpZDogVHlwZS5TdHJpbmcoe1xuICAgICAgZm9ybWF0OiAndXVpZCdcbiAgICB9KSxcbiAgICBsb2dvOiBUeXBlLlN0cmluZygpLFxuICAgIHRpdGxlOiBUeXBlLlN0cmluZygpLFxuICAgIHNob3J0VGl0bGU6IFR5cGUuU3RyaW5nKCksXG4gICAgc3RhcnRQYXRoOiBUeXBlLlN0cmluZygpLFxuICAgIHVybDogVHlwZS5TdHJpbmcoKSxcbiAgICByZWxlYXNlTmFtZTogVHlwZS5TdHJpbmcoKSxcbiAgICBzaXRlRGVzY3JpcHRpb246IFR5cGUuU3RyaW5nKCksXG4gICAgYXBwbGVUb3VjaEljb246IFR5cGUuU3RyaW5nKCksXG4gICAgZmF2aWNvbjMycHg6IFR5cGUuU3RyaW5nKCksXG4gICAgZmF2aWNvbjE2cHg6IFR5cGUuU3RyaW5nKCksXG4gICAgaWNvbjE5MnB4OiBUeXBlLlN0cmluZygpLFxuICAgIGljb241MTJweDogVHlwZS5TdHJpbmcoKSxcbiAgICB3ZWJtYW5pZmVzdExpbms6IFR5cGUuU3RyaW5nKCksXG4gICAgc3dTY3JpcHRMaW5rOiBUeXBlLlN0cmluZygpLFxuICAgIGFwcEJhY2tncm91bmQ6IFR5cGUuU3RyaW5nKCksXG4gICAgYXBwVGl0bGU6IFR5cGUuU3RyaW5nKCksXG4gICAgYXBwU3VidGl0bGU6IFR5cGUuU3RyaW5nKCksXG4gICAgYXBwRGVzY3JpcHRpb246IFR5cGUuU3RyaW5nKCksXG4gICAgYXBwU29jaWFsTGlua3M6IFR5cGUuQXJyYXkoVHlwZS5SZWYoY2xpZW50U29jaWFsTGlua1NjaGVtYSkpLFxuICAgIHRoZW1lU2V0dGluZ3M6IFR5cGUuUmVjb3JkKFR5cGUuU3RyaW5nKCksIFR5cGUuUmVmKGNsaWVudFRoZW1lT3B0aW9uc1NjaGVtYSkpLFxuICAgIHRoZW1lTW9kZXM6IFR5cGUuUmVjb3JkKFR5cGUuU3RyaW5nKCksIFR5cGUuU3RyaW5nKCkpLFxuICAgIGtleTh0aFdhbGw6IFR5cGUuU3RyaW5nKCksXG4gICAgcHJpdmFjeVBvbGljeTogVHlwZS5TdHJpbmcoKSxcbiAgICBob21lcGFnZUxpbmtCdXR0b25FbmFibGVkOiBUeXBlLkJvb2xlYW4oKSxcbiAgICBob21lcGFnZUxpbmtCdXR0b25SZWRpcmVjdDogVHlwZS5TdHJpbmcoKSxcbiAgICBob21lcGFnZUxpbmtCdXR0b25UZXh0OiBUeXBlLlN0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogVHlwZS5TdHJpbmcoeyBmb3JtYXQ6ICdkYXRlLXRpbWUnIH0pLFxuICAgIHVwZGF0ZWRBdDogVHlwZS5TdHJpbmcoeyBmb3JtYXQ6ICdkYXRlLXRpbWUnIH0pLFxuICAgIG1lZGlhU2V0dGluZ3M6IFR5cGUuUmVmKG1lZGlhU2V0dGluZ3NTY2hlbWEpXG4gIH0sXG4gIHsgJGlkOiAnQ2xpZW50U2V0dGluZycsIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSB9XG4pXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudFNldHRpbmdUeXBlIGV4dGVuZHMgU3RhdGljPHR5cGVvZiBjbGllbnRTZXR0aW5nU2NoZW1hPiB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudFNldHRpbmdEYXRhYmFzZVR5cGVcbiAgZXh0ZW5kcyBPbWl0PENsaWVudFNldHRpbmdUeXBlLCAnYXBwU29jaWFsTGlua3MnIHwgJ3RoZW1lU2V0dGluZ3MnIHwgJ3RoZW1lTW9kZXMnPiB7XG4gIGFwcFNvY2lhbExpbmtzOiBzdHJpbmdcbiAgdGhlbWVTZXR0aW5nczogc3RyaW5nXG4gIHRoZW1lTW9kZXM6IHN0cmluZ1xufVxuXG4vLyBTY2hlbWEgZm9yIGNyZWF0aW5nIG5ldyBlbnRyaWVzXG5leHBvcnQgY29uc3QgY2xpZW50U2V0dGluZ0RhdGFTY2hlbWEgPSBUeXBlLlBpY2soXG4gIGNsaWVudFNldHRpbmdTY2hlbWEsXG4gIFtcbiAgICAnbG9nbycsXG4gICAgJ3RpdGxlJyxcbiAgICAnc2hvcnRUaXRsZScsXG4gICAgJ3N0YXJ0UGF0aCcsXG4gICAgJ3VybCcsXG4gICAgJ3JlbGVhc2VOYW1lJyxcbiAgICAnc2l0ZURlc2NyaXB0aW9uJyxcbiAgICAnZmF2aWNvbjMycHgnLFxuICAgICdmYXZpY29uMTZweCcsXG4gICAgJ2ljb24xOTJweCcsXG4gICAgJ2ljb241MTJweCcsXG4gICAgJ3dlYm1hbmlmZXN0TGluaycsXG4gICAgJ3N3U2NyaXB0TGluaycsXG4gICAgJ2FwcEJhY2tncm91bmQnLFxuICAgICdhcHBUaXRsZScsXG4gICAgJ2FwcFN1YnRpdGxlJyxcbiAgICAnYXBwRGVzY3JpcHRpb24nLFxuICAgICdhcHBTb2NpYWxMaW5rcycsXG4gICAgJ3RoZW1lU2V0dGluZ3MnLFxuICAgICd0aGVtZU1vZGVzJyxcbiAgICAna2V5OHRoV2FsbCcsXG4gICAgJ3ByaXZhY3lQb2xpY3knLFxuICAgICdob21lcGFnZUxpbmtCdXR0b25FbmFibGVkJyxcbiAgICAnaG9tZXBhZ2VMaW5rQnV0dG9uUmVkaXJlY3QnLFxuICAgICdob21lcGFnZUxpbmtCdXR0b25UZXh0JyxcbiAgICAnbWVkaWFTZXR0aW5ncydcbiAgXSxcbiAge1xuICAgICRpZDogJ0NsaWVudFNldHRpbmdEYXRhJ1xuICB9XG4pXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudFNldHRpbmdEYXRhIGV4dGVuZHMgU3RhdGljPHR5cGVvZiBjbGllbnRTZXR0aW5nRGF0YVNjaGVtYT4ge31cblxuLy8gU2NoZW1hIGZvciB1cGRhdGluZyBleGlzdGluZyBlbnRyaWVzXG5leHBvcnQgY29uc3QgY2xpZW50U2V0dGluZ1BhdGNoU2NoZW1hID0gVHlwZS5QYXJ0aWFsKGNsaWVudFNldHRpbmdTY2hlbWEsIHtcbiAgJGlkOiAnQ2xpZW50U2V0dGluZ1BhdGNoJ1xufSlcbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50U2V0dGluZ1BhdGNoIGV4dGVuZHMgU3RhdGljPHR5cGVvZiBjbGllbnRTZXR0aW5nUGF0Y2hTY2hlbWE+IHt9XG5cbi8vIFNjaGVtYSBmb3IgYWxsb3dlZCBxdWVyeSBwcm9wZXJ0aWVzXG5leHBvcnQgY29uc3QgY2xpZW50U2V0dGluZ1F1ZXJ5UHJvcGVydGllcyA9IFR5cGUuUGljayhjbGllbnRTZXR0aW5nU2NoZW1hLCBbXG4gICdpZCcsXG4gICdsb2dvJyxcbiAgJ3RpdGxlJyxcbiAgJ3Nob3J0VGl0bGUnLFxuICAnc3RhcnRQYXRoJyxcbiAgJ3VybCcsXG4gICdyZWxlYXNlTmFtZScsXG4gICdzaXRlRGVzY3JpcHRpb24nLFxuICAnZmF2aWNvbjMycHgnLFxuICAnZmF2aWNvbjE2cHgnLFxuICAnaWNvbjE5MnB4JyxcbiAgJ2ljb241MTJweCcsXG4gICd3ZWJtYW5pZmVzdExpbmsnLFxuICAnc3dTY3JpcHRMaW5rJyxcbiAgJ2FwcEJhY2tncm91bmQnLFxuICAnYXBwVGl0bGUnLFxuICAnYXBwU3VidGl0bGUnLFxuICAnYXBwRGVzY3JpcHRpb24nLFxuICAvLyAnYXBwU29jaWFsTGlua3MnLCBDb21tZW50ZWQgb3V0IGJlY2F1c2U6IGh0dHBzOi8vZGlzY29yZC5jb20vY2hhbm5lbHMvNTA5ODQ4NDgwNzYwNzI1NTE0LzEwOTM5MTQ0MDU1NDYyMjk4NDAvMTA5NTEwMTUzNjEyMTY2NzY5NFxuICAvLyAndGhlbWVTZXR0aW5ncycsXG4gIC8vICd0aGVtZU1vZGVzJyxcbiAgJ2tleTh0aFdhbGwnLFxuICAncHJpdmFjeVBvbGljeScsXG4gICdob21lcGFnZUxpbmtCdXR0b25FbmFibGVkJyxcbiAgJ2hvbWVwYWdlTGlua0J1dHRvblJlZGlyZWN0JyxcbiAgJ2hvbWVwYWdlTGlua0J1dHRvblRleHQnXG5dKVxuZXhwb3J0IGNvbnN0IGNsaWVudFNldHRpbmdRdWVyeVNjaGVtYSA9IFR5cGUuSW50ZXJzZWN0KFxuICBbXG4gICAgcXVlcnlTeW50YXgoY2xpZW50U2V0dGluZ1F1ZXJ5UHJvcGVydGllcyksXG4gICAgLy8gQWRkIGFkZGl0aW9uYWwgcXVlcnkgcHJvcGVydGllcyBoZXJlXG4gICAgVHlwZS5PYmplY3Qoe30sIHsgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlIH0pXG4gIF0sXG4gIHsgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlIH1cbilcbmV4cG9ydCBpbnRlcmZhY2UgQ2xpZW50U2V0dGluZ1F1ZXJ5IGV4dGVuZHMgU3RhdGljPHR5cGVvZiBjbGllbnRTZXR0aW5nUXVlcnlTY2hlbWE+IHt9XG5cbmV4cG9ydCBjb25zdCBhdWRpb1NldHRpbmdzVmFsaWRhdG9yID0gLyogQF9fUFVSRV9fICovIGdldFZhbGlkYXRvcihhdWRpb1NldHRpbmdzU2NoZW1hLCBkYXRhVmFsaWRhdG9yKVxuZXhwb3J0IGNvbnN0IHZpZGVvU2V0dGluZ3NWYWxpZGF0b3IgPSAvKiBAX19QVVJFX18gKi8gZ2V0VmFsaWRhdG9yKHZpZGVvU2V0dGluZ3NTY2hlbWEsIGRhdGFWYWxpZGF0b3IpXG5leHBvcnQgY29uc3Qgc2NyZWVuc2hhcmVTZXR0aW5nc1ZhbGlkYXRvciA9IC8qIEBfX1BVUkVfXyAqLyBnZXRWYWxpZGF0b3Ioc2NyZWVuc2hhcmVTZXR0aW5nc1NjaGVtYSwgZGF0YVZhbGlkYXRvcilcbmV4cG9ydCBjb25zdCBtZWRpYVNldHRpbmdzVmFsaWRhdG9yID0gLyogQF9fUFVSRV9fICovIGdldFZhbGlkYXRvcihtZWRpYVNldHRpbmdzU2NoZW1hLCBkYXRhVmFsaWRhdG9yKVxuZXhwb3J0IGNvbnN0IGNsaWVudFNvY2lhbExpbmtWYWxpZGF0b3IgPSAvKiBAX19QVVJFX18gKi8gZ2V0VmFsaWRhdG9yKGNsaWVudFNvY2lhbExpbmtTY2hlbWEsIGRhdGFWYWxpZGF0b3IpXG5leHBvcnQgY29uc3QgY2xpZW50VGhlbWVPcHRpb25zVmFsaWRhdG9yID0gLyogQF9fUFVSRV9fICovIGdldFZhbGlkYXRvcihjbGllbnRUaGVtZU9wdGlvbnNTY2hlbWEsIGRhdGFWYWxpZGF0b3IpXG5leHBvcnQgY29uc3QgY2xpZW50U2V0dGluZ1ZhbGlkYXRvciA9IC8qIEBfX1BVUkVfXyAqLyBnZXRWYWxpZGF0b3IoY2xpZW50U2V0dGluZ1NjaGVtYSwgZGF0YVZhbGlkYXRvcilcbmV4cG9ydCBjb25zdCBjbGllbnRTZXR0aW5nRGF0YVZhbGlkYXRvciA9IC8qIEBfX1BVUkVfXyAqLyBnZXRWYWxpZGF0b3IoY2xpZW50U2V0dGluZ0RhdGFTY2hlbWEsIGRhdGFWYWxpZGF0b3IpXG5leHBvcnQgY29uc3QgY2xpZW50U2V0dGluZ1BhdGNoVmFsaWRhdG9yID0gLyogQF9fUFVSRV9fICovIGdldFZhbGlkYXRvcihjbGllbnRTZXR0aW5nUGF0Y2hTY2hlbWEsIGRhdGFWYWxpZGF0b3IpXG5leHBvcnQgY29uc3QgY2xpZW50U2V0dGluZ1F1ZXJ5VmFsaWRhdG9yID0gLyogQF9fUFVSRV9fICovIGdldFZhbGlkYXRvcihjbGllbnRTZXR0aW5nUXVlcnlTY2hlbWEsIHF1ZXJ5VmFsaWRhdG9yKVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL2NvbW1vbi9zcmMvc2NoZW1hc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbmF6YXJpaS9EZXNrdG9wL1ViaWVuZ2luZS9ldGhlcmVhbGVuZ2luZS9wYWNrYWdlcy9jb21tb24vc3JjL3NjaGVtYXMvdmFsaWRhdG9ycy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL2NvbW1vbi9zcmMvc2NoZW1hcy92YWxpZGF0b3JzLnRzXCI7LypcbkNQQUwtMS4wIExpY2Vuc2VcblxuVGhlIGNvbnRlbnRzIG9mIHRoaXMgZmlsZSBhcmUgc3ViamVjdCB0byB0aGUgQ29tbW9uIFB1YmxpYyBBdHRyaWJ1dGlvbiBMaWNlbnNlXG5WZXJzaW9uIDEuMC4gKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbndpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuaHR0cHM6Ly9naXRodWIuY29tL0V0aGVyZWFsRW5naW5lL2V0aGVyZWFsZW5naW5lL2Jsb2IvZGV2L0xJQ0VOU0UuXG5UaGUgTGljZW5zZSBpcyBiYXNlZCBvbiB0aGUgTW96aWxsYSBQdWJsaWMgTGljZW5zZSBWZXJzaW9uIDEuMSwgYnV0IFNlY3Rpb25zIDE0XG5hbmQgMTUgaGF2ZSBiZWVuIGFkZGVkIHRvIGNvdmVyIHVzZSBvZiBzb2Z0d2FyZSBvdmVyIGEgY29tcHV0ZXIgbmV0d29yayBhbmQgXG5wcm92aWRlIGZvciBsaW1pdGVkIGF0dHJpYnV0aW9uIGZvciB0aGUgT3JpZ2luYWwgRGV2ZWxvcGVyLiBJbiBhZGRpdGlvbiwgXG5FeGhpYml0IEEgaGFzIGJlZW4gbW9kaWZpZWQgdG8gYmUgY29uc2lzdGVudCB3aXRoIEV4aGliaXQgQi5cblxuU29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbnNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyByaWdodHMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG5UaGUgT3JpZ2luYWwgQ29kZSBpcyBFdGhlcmVhbCBFbmdpbmUuXG5cblRoZSBPcmlnaW5hbCBEZXZlbG9wZXIgaXMgdGhlIEluaXRpYWwgRGV2ZWxvcGVyLiBUaGUgSW5pdGlhbCBEZXZlbG9wZXIgb2YgdGhlXG5PcmlnaW5hbCBDb2RlIGlzIHRoZSBFdGhlcmVhbCBFbmdpbmUgdGVhbS5cblxuQWxsIHBvcnRpb25zIG9mIHRoZSBjb2RlIHdyaXR0ZW4gYnkgdGhlIEV0aGVyZWFsIEVuZ2luZSB0ZWFtIGFyZSBDb3B5cmlnaHQgXHUwMEE5IDIwMjEtMjAyMyBcbkV0aGVyZWFsIEVuZ2luZS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiovXG5cbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoaXMgZmlsZSBzZWUgaHR0cHM6Ly9kb3ZlLmZlYXRoZXJzanMuY29tL2d1aWRlcy9jbGkvdmFsaWRhdG9ycy5odG1sXG5pbXBvcnQgdHlwZSB7IEZvcm1hdHNQbHVnaW5PcHRpb25zIH0gZnJvbSAnQGZlYXRoZXJzanMvc2NoZW1hJ1xuaW1wb3J0IHsgYWRkRm9ybWF0cywgQWp2IH0gZnJvbSAnQGZlYXRoZXJzanMvc2NoZW1hJ1xuXG5jb25zdCBmb3JtYXRzOiBGb3JtYXRzUGx1Z2luT3B0aW9ucyA9IFtcbiAgJ2RhdGUtdGltZScsXG4gICd0aW1lJyxcbiAgJ2RhdGUnLFxuICAnZW1haWwnLFxuICAnaG9zdG5hbWUnLFxuICAnaXB2NCcsXG4gICdpcHY2JyxcbiAgJ3VyaScsXG4gICd1cmktcmVmZXJlbmNlJyxcbiAgJ3V1aWQnLFxuICAndXJpLXRlbXBsYXRlJyxcbiAgJ2pzb24tcG9pbnRlcicsXG4gICdyZWxhdGl2ZS1qc29uLXBvaW50ZXInLFxuICAncmVnZXgnXG5dXG5cbmV4cG9ydCBjb25zdCBkYXRhVmFsaWRhdG9yOiBBanYgPSBhZGRGb3JtYXRzKG5ldyBBanYoe30pLCBmb3JtYXRzKVxuXG5leHBvcnQgY29uc3QgcXVlcnlWYWxpZGF0b3I6IEFqdiA9IGFkZEZvcm1hdHMoXG4gIG5ldyBBanYoe1xuICAgIGNvZXJjZVR5cGVzOiB0cnVlXG4gIH0pLFxuICBmb3JtYXRzXG4pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL25hemFyaWkvRGVza3RvcC9VYmllbmdpbmUvZXRoZXJlYWxlbmdpbmUvcGFja2FnZXMvY2xpZW50L3NjcmlwdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL25hemFyaWkvRGVza3RvcC9VYmllbmdpbmUvZXRoZXJlYWxlbmdpbmUvcGFja2FnZXMvY2xpZW50L3NjcmlwdHMvZ2V0Q29pbFNldHRpbmdzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL25hemFyaWkvRGVza3RvcC9VYmllbmdpbmUvZXRoZXJlYWxlbmdpbmUvcGFja2FnZXMvY2xpZW50L3NjcmlwdHMvZ2V0Q29pbFNldHRpbmdzLnRzXCI7LypcbkNQQUwtMS4wIExpY2Vuc2VcblxuVGhlIGNvbnRlbnRzIG9mIHRoaXMgZmlsZSBhcmUgc3ViamVjdCB0byB0aGUgQ29tbW9uIFB1YmxpYyBBdHRyaWJ1dGlvbiBMaWNlbnNlXG5WZXJzaW9uIDEuMC4gKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbndpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuaHR0cHM6Ly9naXRodWIuY29tL0V0aGVyZWFsRW5naW5lL2V0aGVyZWFsZW5naW5lL2Jsb2IvZGV2L0xJQ0VOU0UuXG5UaGUgTGljZW5zZSBpcyBiYXNlZCBvbiB0aGUgTW96aWxsYSBQdWJsaWMgTGljZW5zZSBWZXJzaW9uIDEuMSwgYnV0IFNlY3Rpb25zIDE0XG5hbmQgMTUgaGF2ZSBiZWVuIGFkZGVkIHRvIGNvdmVyIHVzZSBvZiBzb2Z0d2FyZSBvdmVyIGEgY29tcHV0ZXIgbmV0d29yayBhbmQgXG5wcm92aWRlIGZvciBsaW1pdGVkIGF0dHJpYnV0aW9uIGZvciB0aGUgT3JpZ2luYWwgRGV2ZWxvcGVyLiBJbiBhZGRpdGlvbiwgXG5FeGhpYml0IEEgaGFzIGJlZW4gbW9kaWZpZWQgdG8gYmUgY29uc2lzdGVudCB3aXRoIEV4aGliaXQgQi5cblxuU29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbnNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyByaWdodHMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG5UaGUgT3JpZ2luYWwgQ29kZSBpcyBFdGhlcmVhbCBFbmdpbmUuXG5cblRoZSBPcmlnaW5hbCBEZXZlbG9wZXIgaXMgdGhlIEluaXRpYWwgRGV2ZWxvcGVyLiBUaGUgSW5pdGlhbCBEZXZlbG9wZXIgb2YgdGhlXG5PcmlnaW5hbCBDb2RlIGlzIHRoZSBFdGhlcmVhbCBFbmdpbmUgdGVhbS5cblxuQWxsIHBvcnRpb25zIG9mIHRoZSBjb2RlIHdyaXR0ZW4gYnkgdGhlIEV0aGVyZWFsIEVuZ2luZSB0ZWFtIGFyZSBDb3B5cmlnaHQgXHUwMEE5IDIwMjEtMjAyMyBcbkV0aGVyZWFsIEVuZ2luZS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiovXG5cbmltcG9ydCBrbmV4IGZyb20gJ2tuZXgnXG5pbXBvcnQgeyBjb2lsU2V0dGluZ1BhdGgsIENvaWxTZXR0aW5nVHlwZSB9IGZyb20gJy4uLy4uL2NvbW1vbi9zcmMvc2NoZW1hcy9zZXR0aW5nL2NvaWwtc2V0dGluZy5zY2hlbWEnXG5cbmV4cG9ydCBjb25zdCBnZXRDb2lsU2V0dGluZyA9IGFzeW5jICgpID0+IHtcbiAgY29uc3Qga25leENsaWVudCA9IGtuZXgoe1xuICAgIGNsaWVudDogJ215c3FsJyxcbiAgICBjb25uZWN0aW9uOiB7XG4gICAgICB1c2VyOiBwcm9jZXNzLmVudi5NWVNRTF9VU0VSID8/ICdzZXJ2ZXInLFxuICAgICAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52Lk1ZU1FMX1BBU1NXT1JEID8/ICdwYXNzd29yZCcsXG4gICAgICBob3N0OiBwcm9jZXNzLmVudi5NWVNRTF9IT1NUID8/ICcxMjcuMC4wLjEnLFxuICAgICAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuTVlTUUxfUE9SVCB8fCAnMzMwNicpLFxuICAgICAgZGF0YWJhc2U6IHByb2Nlc3MuZW52Lk1ZU1FMX0RBVEFCQVNFID8/ICdldGhlcmVhbGVuZ2luZScsXG4gICAgICBjaGFyc2V0OiAndXRmOG1iNCdcbiAgICB9XG4gIH0pXG5cbiAgY29uc3QgY29pbFNldHRpbmcgPSBhd2FpdCBrbmV4Q2xpZW50XG4gICAgLnNlbGVjdCgpXG4gICAgLmZyb208Q29pbFNldHRpbmdUeXBlPihjb2lsU2V0dGluZ1BhdGgpXG4gICAgLnRoZW4oKFtkYkNvaWxdKSA9PiB7XG4gICAgICBpZiAoZGJDb2lsKSB7XG4gICAgICAgIHJldHVybiBkYkNvaWxcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgY29uc29sZS53YXJuKCdbdml0ZS5jb25maWddOiBGYWlsZWQgdG8gcmVhZCBjb2lsU2V0dGluZycpXG4gICAgICBjb25zb2xlLndhcm4oZSlcbiAgICB9KVxuXG4gIGF3YWl0IGtuZXhDbGllbnQuZGVzdHJveSgpXG5cbiAgcmV0dXJuIGNvaWxTZXR0aW5nIVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL2NvbW1vbi9zcmMvc2NoZW1hcy9zZXR0aW5nXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9uYXphcmlpL0Rlc2t0b3AvVWJpZW5naW5lL2V0aGVyZWFsZW5naW5lL3BhY2thZ2VzL2NvbW1vbi9zcmMvc2NoZW1hcy9zZXR0aW5nL2NvaWwtc2V0dGluZy5zY2hlbWEudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbmF6YXJpaS9EZXNrdG9wL1ViaWVuZ2luZS9ldGhlcmVhbGVuZ2luZS9wYWNrYWdlcy9jb21tb24vc3JjL3NjaGVtYXMvc2V0dGluZy9jb2lsLXNldHRpbmcuc2NoZW1hLnRzXCI7LypcbkNQQUwtMS4wIExpY2Vuc2VcblxuVGhlIGNvbnRlbnRzIG9mIHRoaXMgZmlsZSBhcmUgc3ViamVjdCB0byB0aGUgQ29tbW9uIFB1YmxpYyBBdHRyaWJ1dGlvbiBMaWNlbnNlXG5WZXJzaW9uIDEuMC4gKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2VcbndpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuaHR0cHM6Ly9naXRodWIuY29tL0V0aGVyZWFsRW5naW5lL2V0aGVyZWFsZW5naW5lL2Jsb2IvZGV2L0xJQ0VOU0UuXG5UaGUgTGljZW5zZSBpcyBiYXNlZCBvbiB0aGUgTW96aWxsYSBQdWJsaWMgTGljZW5zZSBWZXJzaW9uIDEuMSwgYnV0IFNlY3Rpb25zIDE0XG5hbmQgMTUgaGF2ZSBiZWVuIGFkZGVkIHRvIGNvdmVyIHVzZSBvZiBzb2Z0d2FyZSBvdmVyIGEgY29tcHV0ZXIgbmV0d29yayBhbmQgXG5wcm92aWRlIGZvciBsaW1pdGVkIGF0dHJpYnV0aW9uIGZvciB0aGUgT3JpZ2luYWwgRGV2ZWxvcGVyLiBJbiBhZGRpdGlvbiwgXG5FeGhpYml0IEEgaGFzIGJlZW4gbW9kaWZpZWQgdG8gYmUgY29uc2lzdGVudCB3aXRoIEV4aGliaXQgQi5cblxuU29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIGJhc2lzLFxuV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbnNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyByaWdodHMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG5UaGUgT3JpZ2luYWwgQ29kZSBpcyBFdGhlcmVhbCBFbmdpbmUuXG5cblRoZSBPcmlnaW5hbCBEZXZlbG9wZXIgaXMgdGhlIEluaXRpYWwgRGV2ZWxvcGVyLiBUaGUgSW5pdGlhbCBEZXZlbG9wZXIgb2YgdGhlXG5PcmlnaW5hbCBDb2RlIGlzIHRoZSBFdGhlcmVhbCBFbmdpbmUgdGVhbS5cblxuQWxsIHBvcnRpb25zIG9mIHRoZSBjb2RlIHdyaXR0ZW4gYnkgdGhlIEV0aGVyZWFsIEVuZ2luZSB0ZWFtIGFyZSBDb3B5cmlnaHQgXHUwMEE5IDIwMjEtMjAyMyBcbkV0aGVyZWFsIEVuZ2luZS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiovXG5cbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoaXMgZmlsZSBzZWUgaHR0cHM6Ly9kb3ZlLmZlYXRoZXJzanMuY29tL2d1aWRlcy9jbGkvc2VydmljZS5zY2hlbWFzLmh0bWxcbmltcG9ydCB0eXBlIHsgU3RhdGljIH0gZnJvbSAnQGZlYXRoZXJzanMvdHlwZWJveCdcbmltcG9ydCB7IGdldFZhbGlkYXRvciwgcXVlcnlTeW50YXgsIFR5cGUgfSBmcm9tICdAZmVhdGhlcnNqcy90eXBlYm94J1xuaW1wb3J0IHsgZGF0YVZhbGlkYXRvciwgcXVlcnlWYWxpZGF0b3IgfSBmcm9tICcuLi92YWxpZGF0b3JzJ1xuXG5leHBvcnQgY29uc3QgY29pbFNldHRpbmdQYXRoID0gJ2NvaWwtc2V0dGluZydcblxuZXhwb3J0IGNvbnN0IGNvaWxTZXR0aW5nTWV0aG9kcyA9IFsnZmluZCcsICdnZXQnLCAnY3JlYXRlJywgJ3BhdGNoJywgJ3JlbW92ZSddIGFzIGNvbnN0XG5cbi8vIE1haW4gZGF0YSBtb2RlbCBzY2hlbWFcbmV4cG9ydCBjb25zdCBjb2lsU2V0dGluZ1NjaGVtYSA9IFR5cGUuT2JqZWN0KFxuICB7XG4gICAgaWQ6IFR5cGUuU3RyaW5nKHtcbiAgICAgIGZvcm1hdDogJ3V1aWQnXG4gICAgfSksXG4gICAgcGF5bWVudFBvaW50ZXI6IFR5cGUuU3RyaW5nKCksXG4gICAgY2xpZW50SWQ6IFR5cGUuU3RyaW5nKCksXG4gICAgY2xpZW50U2VjcmV0OiBUeXBlLlN0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogVHlwZS5TdHJpbmcoeyBmb3JtYXQ6ICdkYXRlLXRpbWUnIH0pLFxuICAgIHVwZGF0ZWRBdDogVHlwZS5TdHJpbmcoeyBmb3JtYXQ6ICdkYXRlLXRpbWUnIH0pXG4gIH0sXG4gIHsgJGlkOiAnQ29pbFNldHRpbmcnLCBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UgfVxuKVxuZXhwb3J0IGludGVyZmFjZSBDb2lsU2V0dGluZ1R5cGUgZXh0ZW5kcyBTdGF0aWM8dHlwZW9mIGNvaWxTZXR0aW5nU2NoZW1hPiB7fVxuXG4vLyBTY2hlbWEgZm9yIGNyZWF0aW5nIG5ldyBlbnRyaWVzXG5leHBvcnQgY29uc3QgY29pbFNldHRpbmdEYXRhU2NoZW1hID0gVHlwZS5QaWNrKGNvaWxTZXR0aW5nU2NoZW1hLCBbJ3BheW1lbnRQb2ludGVyJywgJ2NsaWVudElkJywgJ2NsaWVudFNlY3JldCddLCB7XG4gICRpZDogJ0NvaWxTZXR0aW5nRGF0YSdcbn0pXG5leHBvcnQgaW50ZXJmYWNlIENvaWxTZXR0aW5nRGF0YSBleHRlbmRzIFN0YXRpYzx0eXBlb2YgY29pbFNldHRpbmdEYXRhU2NoZW1hPiB7fVxuXG4vLyBTY2hlbWEgZm9yIHVwZGF0aW5nIGV4aXN0aW5nIGVudHJpZXNcbmV4cG9ydCBjb25zdCBjb2lsU2V0dGluZ1BhdGNoU2NoZW1hID0gVHlwZS5QYXJ0aWFsKGNvaWxTZXR0aW5nU2NoZW1hLCB7XG4gICRpZDogJ0NvaWxTZXR0aW5nUGF0Y2gnXG59KVxuZXhwb3J0IGludGVyZmFjZSBDb2lsU2V0dGluZ1BhdGNoIGV4dGVuZHMgU3RhdGljPHR5cGVvZiBjb2lsU2V0dGluZ1BhdGNoU2NoZW1hPiB7fVxuXG4vLyBTY2hlbWEgZm9yIGFsbG93ZWQgcXVlcnkgcHJvcGVydGllc1xuZXhwb3J0IGNvbnN0IGNvaWxTZXR0aW5nUXVlcnlQcm9wZXJ0aWVzID0gVHlwZS5QaWNrKGNvaWxTZXR0aW5nU2NoZW1hLCBbXG4gICdpZCcsXG4gICdwYXltZW50UG9pbnRlcicsXG4gICdjbGllbnRJZCcsXG4gICdjbGllbnRTZWNyZXQnXG5dKVxuZXhwb3J0IGNvbnN0IGNvaWxTZXR0aW5nUXVlcnlTY2hlbWEgPSBUeXBlLkludGVyc2VjdChcbiAgW1xuICAgIHF1ZXJ5U3ludGF4KGNvaWxTZXR0aW5nUXVlcnlQcm9wZXJ0aWVzKSxcbiAgICAvLyBBZGQgYWRkaXRpb25hbCBxdWVyeSBwcm9wZXJ0aWVzIGhlcmVcbiAgICBUeXBlLk9iamVjdCh7fSwgeyBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UgfSlcbiAgXSxcbiAgeyBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UgfVxuKVxuZXhwb3J0IGludGVyZmFjZSBDb2lsU2V0dGluZ1F1ZXJ5IGV4dGVuZHMgU3RhdGljPHR5cGVvZiBjb2lsU2V0dGluZ1F1ZXJ5U2NoZW1hPiB7fVxuXG5leHBvcnQgY29uc3QgY29pbFNldHRpbmdWYWxpZGF0b3IgPSAvKiBAX19QVVJFX18gKi8gZ2V0VmFsaWRhdG9yKGNvaWxTZXR0aW5nU2NoZW1hLCBkYXRhVmFsaWRhdG9yKVxuZXhwb3J0IGNvbnN0IGNvaWxTZXR0aW5nRGF0YVZhbGlkYXRvciA9IC8qIEBfX1BVUkVfXyAqLyBnZXRWYWxpZGF0b3IoY29pbFNldHRpbmdEYXRhU2NoZW1hLCBkYXRhVmFsaWRhdG9yKVxuZXhwb3J0IGNvbnN0IGNvaWxTZXR0aW5nUGF0Y2hWYWxpZGF0b3IgPSAvKiBAX19QVVJFX18gKi8gZ2V0VmFsaWRhdG9yKGNvaWxTZXR0aW5nUGF0Y2hTY2hlbWEsIGRhdGFWYWxpZGF0b3IpXG5leHBvcnQgY29uc3QgY29pbFNldHRpbmdRdWVyeVZhbGlkYXRvciA9IC8qIEBfX1BVUkVfXyAqLyBnZXRWYWxpZGF0b3IoY29pbFNldHRpbmdRdWVyeVNjaGVtYSwgcXVlcnlWYWxpZGF0b3IpXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7OztBQXlCQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxZQUFZO0FBQ25CLE9BQU8sVUFBVTtBQUNqQixTQUFxQixvQkFBb0I7QUFDekMsT0FBTyxxQkFBcUI7QUFDNUIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxVQUFVOzs7QUNuQ2pCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixXQUFZO0FBQUEsRUFDWixJQUFNO0FBQUEsRUFDTixZQUFjO0FBQUEsRUFDZCxhQUFlO0FBQUEsRUFDZixhQUFlO0FBQUEsRUFDZixrQkFBbUI7QUFBQSxFQUNuQixTQUFVO0FBQUEsRUFDVixPQUFTO0FBQUEsSUFDUDtBQUFBLE1BQ0UsS0FBTztBQUFBLE1BQ1AsT0FBUztBQUFBLE1BQ1QsTUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBO0FBQUEsTUFDRSxLQUFPO0FBQUEsTUFDUCxPQUFTO0FBQUEsTUFDVCxN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QWEsa0JBQWtCO0FBQUEsTUFDakQsQ0FBQztBQUFBLE1BQ0QsZ0JBQWdCO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixXQUFXO0FBQUEsUUFDWCxrQkFBa0I7QUFBQSxNQUNwQixDQUFDO0FBQUEsTUFDRCxhQUFhO0FBQUEsUUFDWCxTQUFTLENBQUMseUJBQXlCO0FBQUEsTUFDckMsQ0FBQztBQUFBLElBQ0gsRUFBRSxPQUFPLE9BQU87QUFBQSxJQUNoQixTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxtQkFBbUI7QUFBQSxNQUNyQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxNQUNSLFdBQVcsUUFBUSxJQUFJLG9CQUFvQixTQUFTLE9BQU87QUFBQSxNQUMzRCxRQUFRO0FBQUEsTUFDUiwwQkFBMEI7QUFBQSxRQUN4QixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0EsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sS0FBSztBQUFBLFVBQ0wsUUFBUTtBQUFBO0FBQUE7QUFBQSxVQUVSLDBCQUEwQjtBQUFBLFVBQzFCLGNBQWMsQ0FBQyxPQUFPO0FBRXBCLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IscUJBQU8sZ0JBQWdCLEVBQUU7QUFBQSxZQUMzQjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUEsU0FBTyxNQUFNLDJCQUEyQixRQUFRO0FBQ2xELENBQUM7IiwKICAibmFtZXMiOiBbImtuZXgiLCAiZ2V0VmFsaWRhdG9yIiwgInF1ZXJ5U3ludGF4IiwgIlR5cGUiLCAiVHlwZSIsICJxdWVyeVN5bnRheCIsICJrbmV4IiwgImVyciJdCn0K
