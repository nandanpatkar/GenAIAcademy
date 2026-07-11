var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-OI7eWs/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/regions.ts
var REGIONS = [
  { code: "us-east-1", name: "US East (N. Virginia)" },
  { code: "us-east-2", name: "US East (Ohio)" },
  { code: "us-west-1", name: "US West (N. California)" },
  { code: "us-west-2", name: "US West (Oregon)" },
  { code: "ca-central-1", name: "Canada (Central)" },
  { code: "eu-west-1", name: "EU (Ireland)" },
  { code: "eu-west-2", name: "EU (London)" },
  { code: "eu-west-3", name: "EU (Paris)" },
  { code: "eu-central-1", name: "EU (Frankfurt)" },
  { code: "eu-central-2", name: "Europe (Zurich)" },
  { code: "eu-north-1", name: "EU (Stockholm)" },
  { code: "eu-south-1", name: "EU (Milan)" },
  { code: "eu-south-2", name: "Europe (Spain)" },
  { code: "ap-east-1", name: "Asia Pacific (Hong Kong)" },
  { code: "ap-south-1", name: "Asia Pacific (Mumbai)" },
  { code: "ap-south-2", name: "Asia Pacific (Hyderabad)" },
  { code: "ap-northeast-1", name: "Asia Pacific (Tokyo)" },
  { code: "ap-northeast-2", name: "Asia Pacific (Seoul)" },
  { code: "ap-northeast-3", name: "Asia Pacific (Osaka)" },
  { code: "ap-southeast-1", name: "Asia Pacific (Singapore)" },
  { code: "ap-southeast-2", name: "Asia Pacific (Sydney)" },
  { code: "ap-southeast-3", name: "Asia Pacific (Jakarta)" },
  { code: "ap-southeast-4", name: "Asia Pacific (Melbourne)" },
  { code: "me-south-1", name: "Middle East (Bahrain)" },
  { code: "me-central-1", name: "Middle East (UAE)" },
  { code: "sa-east-1", name: "South America (Sao Paulo)" },
  { code: "af-south-1", name: "Africa (Cape Town)" }
];
var WEEKLY_INTERVAL_MS = 7 * 24 * 60 * 60 * 1e3;
var FAILURE_COOLDOWN_MS = 30 * 60 * 1e3;

// node_modules/aws4fetch/dist/aws4fetch.esm.mjs
var encoder = new TextEncoder();
var HOST_SERVICES = {
  appstream2: "appstream",
  cloudhsmv2: "cloudhsm",
  email: "ses",
  marketplace: "aws-marketplace",
  mobile: "AWSMobileHubService",
  pinpoint: "mobiletargeting",
  queue: "sqs",
  "git-codecommit": "codecommit",
  "mturk-requester-sandbox": "mturk-requester",
  "personalize-runtime": "personalize"
};
var UNSIGNABLE_HEADERS = /* @__PURE__ */ new Set([
  "authorization",
  "content-type",
  "content-length",
  "user-agent",
  "presigned-expires",
  "expect",
  "x-amzn-trace-id",
  "range",
  "connection"
]);
var AwsClient = class {
  constructor({ accessKeyId, secretAccessKey, sessionToken, service, region, cache, retries, initRetryMs }) {
    if (accessKeyId == null)
      throw new TypeError("accessKeyId is a required option");
    if (secretAccessKey == null)
      throw new TypeError("secretAccessKey is a required option");
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.sessionToken = sessionToken;
    this.service = service;
    this.region = region;
    this.cache = cache || /* @__PURE__ */ new Map();
    this.retries = retries != null ? retries : 10;
    this.initRetryMs = initRetryMs || 50;
  }
  async sign(input, init) {
    if (input instanceof Request) {
      const { method, url, headers, body } = input;
      init = Object.assign({ method, url, headers }, init);
      if (init.body == null && headers.has("Content-Type")) {
        init.body = body != null && headers.has("X-Amz-Content-Sha256") ? body : await input.clone().arrayBuffer();
      }
      input = url;
    }
    const signer = new AwsV4Signer(Object.assign({ url: input.toString() }, init, this, init && init.aws));
    const signed = Object.assign({}, init, await signer.sign());
    delete signed.aws;
    try {
      return new Request(signed.url.toString(), signed);
    } catch (e) {
      if (e instanceof TypeError) {
        return new Request(signed.url.toString(), Object.assign({ duplex: "half" }, signed));
      }
      throw e;
    }
  }
  async fetch(input, init) {
    for (let i = 0; i <= this.retries; i++) {
      const fetched = fetch(await this.sign(input, init));
      if (i === this.retries) {
        return fetched;
      }
      const res = await fetched;
      if (res.status < 500 && res.status !== 429) {
        return res;
      }
      await new Promise((resolve) => setTimeout(resolve, Math.random() * this.initRetryMs * Math.pow(2, i)));
    }
    throw new Error("An unknown error occurred, ensure retries is not negative");
  }
};
__name(AwsClient, "AwsClient");
var AwsV4Signer = class {
  constructor({ method, url, headers, body, accessKeyId, secretAccessKey, sessionToken, service, region, cache, datetime, signQuery, appendSessionToken, allHeaders, singleEncode }) {
    if (url == null)
      throw new TypeError("url is a required option");
    if (accessKeyId == null)
      throw new TypeError("accessKeyId is a required option");
    if (secretAccessKey == null)
      throw new TypeError("secretAccessKey is a required option");
    this.method = method || (body ? "POST" : "GET");
    this.url = new URL(url);
    this.headers = new Headers(headers || {});
    this.body = body;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.sessionToken = sessionToken;
    let guessedService, guessedRegion;
    if (!service || !region) {
      [guessedService, guessedRegion] = guessServiceRegion(this.url, this.headers);
    }
    this.service = service || guessedService || "";
    this.region = region || guessedRegion || "us-east-1";
    this.cache = cache || /* @__PURE__ */ new Map();
    this.datetime = datetime || (/* @__PURE__ */ new Date()).toISOString().replace(/[:-]|\.\d{3}/g, "");
    this.signQuery = signQuery;
    this.appendSessionToken = appendSessionToken || this.service === "iotdevicegateway";
    this.headers.delete("Host");
    if (this.service === "s3" && !this.signQuery && !this.headers.has("X-Amz-Content-Sha256")) {
      this.headers.set("X-Amz-Content-Sha256", "UNSIGNED-PAYLOAD");
    }
    const params = this.signQuery ? this.url.searchParams : this.headers;
    params.set("X-Amz-Date", this.datetime);
    if (this.sessionToken && !this.appendSessionToken) {
      params.set("X-Amz-Security-Token", this.sessionToken);
    }
    this.signableHeaders = ["host", ...this.headers.keys()].filter((header) => allHeaders || !UNSIGNABLE_HEADERS.has(header)).sort();
    this.signedHeaders = this.signableHeaders.join(";");
    this.canonicalHeaders = this.signableHeaders.map((header) => header + ":" + (header === "host" ? this.url.host : (this.headers.get(header) || "").replace(/\s+/g, " "))).join("\n");
    this.credentialString = [this.datetime.slice(0, 8), this.region, this.service, "aws4_request"].join("/");
    if (this.signQuery) {
      if (this.service === "s3" && !params.has("X-Amz-Expires")) {
        params.set("X-Amz-Expires", "86400");
      }
      params.set("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
      params.set("X-Amz-Credential", this.accessKeyId + "/" + this.credentialString);
      params.set("X-Amz-SignedHeaders", this.signedHeaders);
    }
    if (this.service === "s3") {
      try {
        this.encodedPath = decodeURIComponent(this.url.pathname.replace(/\+/g, " "));
      } catch (e) {
        this.encodedPath = this.url.pathname;
      }
    } else {
      this.encodedPath = this.url.pathname.replace(/\/+/g, "/");
    }
    if (!singleEncode) {
      this.encodedPath = encodeURIComponent(this.encodedPath).replace(/%2F/g, "/");
    }
    this.encodedPath = encodeRfc3986(this.encodedPath);
    const seenKeys = /* @__PURE__ */ new Set();
    this.encodedSearch = [...this.url.searchParams].filter(([k]) => {
      if (!k)
        return false;
      if (this.service === "s3") {
        if (seenKeys.has(k))
          return false;
        seenKeys.add(k);
      }
      return true;
    }).map((pair) => pair.map((p) => encodeRfc3986(encodeURIComponent(p)))).sort(([k1, v1], [k2, v2]) => k1 < k2 ? -1 : k1 > k2 ? 1 : v1 < v2 ? -1 : v1 > v2 ? 1 : 0).map((pair) => pair.join("=")).join("&");
  }
  async sign() {
    if (this.signQuery) {
      this.url.searchParams.set("X-Amz-Signature", await this.signature());
      if (this.sessionToken && this.appendSessionToken) {
        this.url.searchParams.set("X-Amz-Security-Token", this.sessionToken);
      }
    } else {
      this.headers.set("Authorization", await this.authHeader());
    }
    return {
      method: this.method,
      url: this.url,
      headers: this.headers,
      body: this.body
    };
  }
  async authHeader() {
    return [
      "AWS4-HMAC-SHA256 Credential=" + this.accessKeyId + "/" + this.credentialString,
      "SignedHeaders=" + this.signedHeaders,
      "Signature=" + await this.signature()
    ].join(", ");
  }
  async signature() {
    const date = this.datetime.slice(0, 8);
    const cacheKey = [this.secretAccessKey, date, this.region, this.service].join();
    let kCredentials = this.cache.get(cacheKey);
    if (!kCredentials) {
      const kDate = await hmac("AWS4" + this.secretAccessKey, date);
      const kRegion = await hmac(kDate, this.region);
      const kService = await hmac(kRegion, this.service);
      kCredentials = await hmac(kService, "aws4_request");
      this.cache.set(cacheKey, kCredentials);
    }
    return buf2hex(await hmac(kCredentials, await this.stringToSign()));
  }
  async stringToSign() {
    return [
      "AWS4-HMAC-SHA256",
      this.datetime,
      this.credentialString,
      buf2hex(await hash(await this.canonicalString()))
    ].join("\n");
  }
  async canonicalString() {
    return [
      this.method.toUpperCase(),
      this.encodedPath,
      this.encodedSearch,
      this.canonicalHeaders + "\n",
      this.signedHeaders,
      await this.hexBodyHash()
    ].join("\n");
  }
  async hexBodyHash() {
    let hashHeader = this.headers.get("X-Amz-Content-Sha256") || (this.service === "s3" && this.signQuery ? "UNSIGNED-PAYLOAD" : null);
    if (hashHeader == null) {
      if (this.body && typeof this.body !== "string" && !("byteLength" in this.body)) {
        throw new Error("body must be a string, ArrayBuffer or ArrayBufferView, unless you include the X-Amz-Content-Sha256 header");
      }
      hashHeader = buf2hex(await hash(this.body || ""));
    }
    return hashHeader;
  }
};
__name(AwsV4Signer, "AwsV4Signer");
async function hmac(key, string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    typeof key === "string" ? encoder.encode(key) : key,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(string));
}
__name(hmac, "hmac");
async function hash(content) {
  return crypto.subtle.digest("SHA-256", typeof content === "string" ? encoder.encode(content) : content);
}
__name(hash, "hash");
var HEX_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
function buf2hex(arrayBuffer) {
  const buffer = new Uint8Array(arrayBuffer);
  let out = "";
  for (let idx = 0; idx < buffer.length; idx++) {
    const n = buffer[idx];
    out += HEX_CHARS[n >>> 4 & 15];
    out += HEX_CHARS[n & 15];
  }
  return out;
}
__name(buf2hex, "buf2hex");
function encodeRfc3986(urlEncodedStr) {
  return urlEncodedStr.replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}
__name(encodeRfc3986, "encodeRfc3986");
function guessServiceRegion(url, headers) {
  const { hostname, pathname } = url;
  if (hostname.endsWith(".on.aws")) {
    const match2 = hostname.match(/^[^.]{1,63}\.lambda-url\.([^.]{1,63})\.on\.aws$/);
    return match2 != null ? ["lambda", match2[1] || ""] : ["", ""];
  }
  if (hostname.endsWith(".r2.cloudflarestorage.com")) {
    return ["s3", "auto"];
  }
  if (hostname.endsWith(".backblazeb2.com")) {
    const match2 = hostname.match(/^(?:[^.]{1,63}\.)?s3\.([^.]{1,63})\.backblazeb2\.com$/);
    return match2 != null ? ["s3", match2[1] || ""] : ["", ""];
  }
  const match = hostname.replace("dualstack.", "").match(/([^.]{1,63})\.(?:([^.]{0,63})\.)?amazonaws\.com(?:\.cn)?$/);
  let service = match && match[1] || "";
  let region = match && match[2];
  if (region === "us-gov") {
    region = "us-gov-west-1";
  } else if (region === "s3" || region === "s3-accelerate") {
    region = "us-east-1";
    service = "s3";
  } else if (service === "iot") {
    if (hostname.startsWith("iot.")) {
      service = "execute-api";
    } else if (hostname.startsWith("data.jobs.iot.")) {
      service = "iot-jobs-data";
    } else {
      service = pathname === "/mqtt" ? "iotdevicegateway" : "iotdata";
    }
  } else if (service === "autoscaling") {
    const targetPrefix = (headers.get("X-Amz-Target") || "").split(".")[0];
    if (targetPrefix === "AnyScaleFrontendService") {
      service = "application-autoscaling";
    } else if (targetPrefix === "AnyScaleScalingPlannerFrontendService") {
      service = "autoscaling-plans";
    }
  } else if (region == null && service.startsWith("s3-")) {
    region = service.slice(3).replace(/^fips-|^external-1/, "");
    service = "s3";
  } else if (service.endsWith("-fips")) {
    service = service.slice(0, -5);
  } else if (region && /-\d$/.test(service) && !/-\d$/.test(region)) {
    [service, region] = [region, service];
  }
  return [HOST_SERVICES[service] || service, region || ""];
}
__name(guessServiceRegion, "guessServiceRegion");

// src/fetcher.ts
var RATE_LIMIT_DELAY_MS = 200;
var THROTTLE_BACKOFF_MS = 3e3;
var PRICING_ENDPOINT = "https://api.pricing.us-east-1.amazonaws.com/";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
__name(sleep, "sleep");
function extractMaxPrice(raw) {
  try {
    const parsed = JSON.parse(raw);
    const onDemand = parsed.terms?.OnDemand;
    if (!onDemand)
      return null;
    const offer = Object.values(onDemand)[0];
    const dimensions = offer?.priceDimensions ?? {};
    let max = -1;
    for (const dim of Object.values(dimensions)) {
      const v = parseFloat(dim?.pricePerUnit?.USD ?? "-1");
      if (v > max)
        max = v;
    }
    return max >= 0 ? max : null;
  } catch {
    return null;
  }
}
__name(extractMaxPrice, "extractMaxPrice");
function extractMatchingPrice(result, predicate) {
  if (!result.PriceList?.length)
    return null;
  const match = result.PriceList.find((raw) => {
    try {
      return predicate(JSON.parse(raw));
    } catch {
      return false;
    }
  }) ?? result.PriceList[0];
  return extractMaxPrice(match);
}
__name(extractMatchingPrice, "extractMatchingPrice");
var PricingFetcher = class {
  aws;
  callCount = 0;
  constructor(accessKeyId, secretAccessKey) {
    this.aws = new AwsClient({
      accessKeyId,
      secretAccessKey,
      service: "pricing",
      region: "us-east-1"
    });
  }
  // ── Low-level query ──────────────────────────────────────────────────────
  async query(serviceCode, filters, predicate, maxResults = 25) {
    await sleep(RATE_LIMIT_DELAY_MS);
    this.callCount++;
    const body = JSON.stringify({ ServiceCode: serviceCode, Filters: filters, MaxResults: maxResults });
    const attempt = /* @__PURE__ */ __name(async () => {
      const resp = await this.aws.fetch(PRICING_ENDPOINT, {
        method: "POST",
        headers: {
          "X-Amz-Target": "AWSPriceListService.GetProducts",
          "Content-Type": "application/x-amz-json-1.1"
        },
        body
      });
      if (resp.status === 429 || resp.status === 400) {
        const text = await resp.text();
        if (text.includes("ThrottlingException") || text.includes("Rate exceeded")) {
          console.warn(`[Fetcher] Throttled on call #${this.callCount} (${serviceCode}). Backing off ${THROTTLE_BACKOFF_MS}ms...`);
          await sleep(THROTTLE_BACKOFF_MS);
          return attempt();
        }
        console.warn(`[Fetcher] HTTP ${resp.status} for ${serviceCode}:`, text.slice(0, 200));
        return null;
      }
      if (!resp.ok) {
        console.warn(`[Fetcher] HTTP ${resp.status} for ${serviceCode}`);
        return null;
      }
      const result = await resp.json();
      if (!result.PriceList?.length)
        return null;
      if (predicate)
        return extractMatchingPrice(result, predicate);
      return extractMaxPrice(result.PriceList[0]);
    }, "attempt");
    try {
      return await attempt();
    } catch (e) {
      console.warn(`[Fetcher] Network error for ${serviceCode}:`, e?.message ?? e);
      return null;
    }
  }
  // ────────────────────────────────────────────────────────────────────────
  // EC2
  // ────────────────────────────────────────────────────────────────────────
  ec2Instance(regionName, instanceType) {
    return this.query("AmazonEC2", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "instanceType", Value: instanceType },
      { Type: "TERM_MATCH", Field: "operatingSystem", Value: "Linux" },
      { Type: "TERM_MATCH", Field: "tenancy", Value: "Shared" },
      { Type: "TERM_MATCH", Field: "preInstalledSw", Value: "NA" },
      { Type: "TERM_MATCH", Field: "capacitystatus", Value: "Used" }
    ]);
  }
  ec2EbsGp2(regionName) {
    return this.query("AmazonEC2", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Storage" },
      { Type: "TERM_MATCH", Field: "volumeType", Value: "General Purpose" },
      { Type: "TERM_MATCH", Field: "storageMedia", Value: "SSD-backed" }
    ]);
  }
  ec2EbsGp3(regionName) {
    return this.query("AmazonEC2", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Storage" },
      { Type: "TERM_MATCH", Field: "volumeApiName", Value: "gp3" }
    ]);
  }
  ec2EbsIo2(regionName) {
    return this.query("AmazonEC2", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Storage" },
      { Type: "TERM_MATCH", Field: "volumeApiName", Value: "io2" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // RDS
  // ────────────────────────────────────────────────────────────────────────
  rdsInstance(regionName, instanceType, engine = "MySQL") {
    return this.query("AmazonRDS", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "instanceType", Value: instanceType },
      { Type: "TERM_MATCH", Field: "databaseEngine", Value: engine },
      { Type: "TERM_MATCH", Field: "deploymentOption", Value: "Single-AZ" },
      { Type: "TERM_MATCH", Field: "licenseModel", Value: "No license required" }
    ]);
  }
  rdsStorageGp2(regionName) {
    return this.query("AmazonRDS", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Database Storage" },
      { Type: "TERM_MATCH", Field: "volumeType", Value: "General Purpose (SSD)" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // Aurora
  // ────────────────────────────────────────────────────────────────────────
  auroraInstance(regionName, instanceType) {
    return this.query("AmazonRDS", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "instanceType", Value: instanceType },
      { Type: "TERM_MATCH", Field: "databaseEngine", Value: "Aurora MySQL" },
      { Type: "TERM_MATCH", Field: "deploymentOption", Value: "Single-AZ" }
    ]);
  }
  auroraServerlessAcu(regionName) {
    return this.query("AmazonRDS", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Serverless" },
      { Type: "TERM_MATCH", Field: "databaseEngine", Value: "Aurora MySQL" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // ElastiCache
  // ────────────────────────────────────────────────────────────────────────
  elastiCacheInstance(regionName, instanceType) {
    return this.query("AmazonElastiCache", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "instanceType", Value: instanceType },
      { Type: "TERM_MATCH", Field: "cacheEngine", Value: "Redis" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // ECS Fargate
  // ────────────────────────────────────────────────────────────────────────
  ecsFargateCpu(regionName) {
    return this.query("AmazonECS", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Compute" },
      { Type: "TERM_MATCH", Field: "cputype", Value: "perCPU" }
    ], (p) => {
      const a = p.product?.attributes ?? {};
      return a.cpuArchitecture !== "ARM" && a.operatingSystem !== "Windows";
    });
  }
  ecsFargateMemory(regionName) {
    return this.query("AmazonECS", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Compute" },
      { Type: "TERM_MATCH", Field: "memorytype", Value: "perGB" }
    ], (p) => {
      const a = p.product?.attributes ?? {};
      return a.cpuArchitecture !== "ARM" && a.operatingSystem !== "Windows";
    });
  }
  ecsFargateArmCpu(regionName) {
    return this.query("AmazonECS", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Compute" },
      { Type: "TERM_MATCH", Field: "cputype", Value: "perCPU" }
    ], (p) => {
      const a = p.product?.attributes ?? {};
      return a.cpuArchitecture === "ARM" && a.operatingSystem !== "Windows";
    });
  }
  ecsFargateArmMemory(regionName) {
    return this.query("AmazonECS", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Compute" },
      { Type: "TERM_MATCH", Field: "memorytype", Value: "perGB" }
    ], (p) => {
      const a = p.product?.attributes ?? {};
      return a.cpuArchitecture === "ARM" && a.operatingSystem !== "Windows";
    });
  }
  ecsFargateEphemeral(regionName) {
    return this.query("AmazonECS", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Compute" },
      { Type: "TERM_MATCH", Field: "storagetype", Value: "default" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // Lambda
  // ────────────────────────────────────────────────────────────────────────
  lambdaRequests(regionName) {
    return this.query("AWSLambda", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Serverless" },
      { Type: "TERM_MATCH", Field: "group", Value: "AWS-Lambda-Requests" }
    ]);
  }
  lambdaDurationX86(regionName) {
    return this.query("AWSLambda", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Serverless" },
      { Type: "TERM_MATCH", Field: "group", Value: "AWS-Lambda-Duration" }
    ], (p) => {
      const arch = p.product?.attributes?.cpuArchitecture ?? "";
      return arch !== "ARM64";
    });
  }
  // ────────────────────────────────────────────────────────────────────────
  // S3
  // ────────────────────────────────────────────────────────────────────────
  s3Storage(regionName, volumeType) {
    return this.query("AmazonS3", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Storage" },
      { Type: "TERM_MATCH", Field: "volumeType", Value: volumeType }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // ELB
  // ────────────────────────────────────────────────────────────────────────
  elbHourly(regionName) {
    return this.query("AWSELB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Load Balancer-Application" },
      { Type: "TERM_MATCH", Field: "operation", Value: "LoadBalancing:Application" },
      { Type: "TERM_MATCH", Field: "locationType", Value: "AWS Region" },
      { Type: "TERM_MATCH", Field: "groupDescription", Value: "LoadBalancer hourly usage by Application Load Balancer" }
    ]);
  }
  elbLcu(regionName) {
    return this.query("AWSELB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Load Balancer-Application" },
      { Type: "TERM_MATCH", Field: "operation", Value: "LoadBalancing:Application" },
      { Type: "TERM_MATCH", Field: "locationType", Value: "AWS Region" },
      { Type: "TERM_MATCH", Field: "groupDescription", Value: "Used Application Load Balancer capacity units-hr" }
    ]);
  }
  nlbHourly(regionName) {
    return this.query("AWSELB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Load Balancer-Network" },
      { Type: "TERM_MATCH", Field: "operation", Value: "LoadBalancing:Network" },
      { Type: "TERM_MATCH", Field: "locationType", Value: "AWS Region" },
      { Type: "TERM_MATCH", Field: "groupDescription", Value: "LoadBalancer hourly usage by Network Load Balancer" }
    ]);
  }
  nlbLcu(regionName) {
    return this.query("AWSELB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Load Balancer-Network" },
      { Type: "TERM_MATCH", Field: "operation", Value: "LoadBalancing:Network" },
      { Type: "TERM_MATCH", Field: "locationType", Value: "AWS Region" },
      { Type: "TERM_MATCH", Field: "groupDescription", Value: "Used Network Load Balancer capacity units-hr" }
    ]);
  }
  clbHourly(regionName) {
    return this.query("AWSELB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Load Balancer" },
      { Type: "TERM_MATCH", Field: "operation", Value: "LoadBalancing" },
      { Type: "TERM_MATCH", Field: "locationType", Value: "AWS Region" },
      { Type: "TERM_MATCH", Field: "groupDescription", Value: "LoadBalancer hourly usage" }
    ]);
  }
  clbDataGB(regionName) {
    return this.query("AWSELB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Load Balancer" },
      { Type: "TERM_MATCH", Field: "operation", Value: "LoadBalancing" },
      { Type: "TERM_MATCH", Field: "locationType", Value: "AWS Region" },
      { Type: "TERM_MATCH", Field: "groupDescription", Value: "Data processed by Classic Load Balancer" }
    ]);
  }
  gwlbHourly(regionName) {
    return this.query("AWSELB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Load Balancer-Gateway" },
      { Type: "TERM_MATCH", Field: "operation", Value: "LoadBalancing:Gateway" },
      { Type: "TERM_MATCH", Field: "locationType", Value: "AWS Region" },
      { Type: "TERM_MATCH", Field: "groupDescription", Value: "LoadBalancer hourly usage by Gateway Load Balancer" }
    ]);
  }
  gwlbLcu(regionName) {
    return this.query("AWSELB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Load Balancer-Gateway" },
      { Type: "TERM_MATCH", Field: "operation", Value: "LoadBalancing:Gateway" },
      { Type: "TERM_MATCH", Field: "locationType", Value: "AWS Region" },
      { Type: "TERM_MATCH", Field: "groupDescription", Value: "Used Gateway Load Balancer capacity units-hr" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // NAT Gateway
  // ────────────────────────────────────────────────────────────────────────
  natGatewayHourly(regionName) {
    return this.query("AmazonEC2", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "NAT Gateway" },
      { Type: "TERM_MATCH", Field: "operation", Value: "NatGateway" },
      { Type: "TERM_MATCH", Field: "groupDescription", Value: "Hourly charge for NAT Gateways" }
    ]);
  }
  natGatewayData(regionName) {
    return this.query("AmazonEC2", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "NAT Gateway" },
      { Type: "TERM_MATCH", Field: "operation", Value: "NatGateway" },
      { Type: "TERM_MATCH", Field: "groupDescription", Value: "Charge for per GB data processed by NatGateways" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // DynamoDB
  // ────────────────────────────────────────────────────────────────────────
  dynamoDbRead(regionName) {
    return this.query("AmazonDynamoDB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "group", Value: "DDB-ReadUnits" }
    ]);
  }
  dynamoDbWrite(regionName) {
    return this.query("AmazonDynamoDB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "group", Value: "DDB-WriteUnits" }
    ]);
  }
  dynamoDbStorage(regionName) {
    return this.query("AmazonDynamoDB", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Database Storage" },
      { Type: "TERM_MATCH", Field: "volumeType", Value: "Amazon DynamoDB - Indexed DataStore" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // OpenSearch
  // ────────────────────────────────────────────────────────────────────────
  openSearchInstance(regionName, instanceType) {
    return this.query("AmazonES", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "instanceType", Value: instanceType }
    ]);
  }
  openSearchStorage(regionName) {
    return this.query("AmazonES", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Amazon OpenSearch Service Volume" },
      { Type: "TERM_MATCH", Field: "storageMedia", Value: "GP2" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // Redshift
  // ────────────────────────────────────────────────────────────────────────
  redshiftInstance(regionName, instanceType) {
    return this.query("AmazonRedshift", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "instanceType", Value: instanceType },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Compute Instance" }
    ]);
  }
  redshiftServerless(regionName) {
    return this.query("AmazonRedshift", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Serverless" },
      { Type: "TERM_MATCH", Field: "operation", Value: "RunServerlessCompute:001" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // EMR
  // ────────────────────────────────────────────────────────────────────────
  async emrInstance(regionName, instanceType) {
    const res = await this.query("ElasticMapReduce", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "instanceType", Value: instanceType }
    ]);
    if (res === null && instanceType === "m5.large") {
      const xlargePrice = await this.emrInstance(regionName, "m5.xlarge");
      return xlargePrice !== null ? xlargePrice * 0.5 : null;
    }
    return res;
  }
  // ────────────────────────────────────────────────────────────────────────
  // MSK
  // ────────────────────────────────────────────────────────────────────────
  mskInstance(regionName, instanceType) {
    const family = instanceType.replace("kafka.", "");
    return this.query("AmazonMSK", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "computeFamily", Value: family },
      { Type: "TERM_MATCH", Field: "group", Value: "Broker" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // Amazon MQ
  // ────────────────────────────────────────────────────────────────────────
  mqInstance(regionName, instanceType) {
    const type = instanceType.replace("mq.", "");
    return this.query("AmazonMQ", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "instanceType", Value: type },
      { Type: "TERM_MATCH", Field: "deploymentOption", Value: "Single-AZ" },
      { Type: "TERM_MATCH", Field: "brokerEngine", Value: "ActiveMQ" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // Route 53 (global — no location filter)
  // ────────────────────────────────────────────────────────────────────────
  route53Zone() {
    return this.query("AmazonRoute53", [
      { Type: "TERM_MATCH", Field: "productFamily", Value: "DNS Zone" },
      { Type: "TERM_MATCH", Field: "usagetype", Value: "HostedZone" }
    ]);
  }
  route53Queries() {
    return this.query("AmazonRoute53", [
      { Type: "TERM_MATCH", Field: "productFamily", Value: "DNS Query" },
      { Type: "TERM_MATCH", Field: "routingType", Value: "Standard" },
      { Type: "TERM_MATCH", Field: "routingTarget", Value: "External" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // Glue
  // ────────────────────────────────────────────────────────────────────────
  glueDpu(regionName) {
    return this.query("AWSGlue", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "group", Value: "ETL Job run" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // Kinesis Data Streams
  // ────────────────────────────────────────────────────────────────────────
  kinesisShardHour(regionName) {
    return this.query("AmazonKinesis", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "group", Value: "Provisioned shard hour" }
    ]);
  }
  kinesisPutUnits(regionName) {
    return this.query("AmazonKinesis", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "group", Value: "Payload Units" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // EFS
  // ────────────────────────────────────────────────────────────────────────
  efsStorage(regionName, storageClass) {
    const mappedClass = storageClass === "Standard" ? "General Purpose" : "Infrequent Access";
    return this.query("AmazonEFS", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "storageClass", Value: mappedClass }
    ], (p) => {
      const usageType = p.product?.attributes?.usagetype || "";
      return usageType.includes("TimedStorage");
    });
  }
  // ────────────────────────────────────────────────────────────────────────
  // CloudFront (per-region pricing for data transfer out)
  // ────────────────────────────────────────────────────────────────────────
  cloudfrontDtOut(regionName) {
    return this.query("AmazonCloudFront", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "Data Transfer" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // API Gateway
  // ────────────────────────────────────────────────────────────────────────
  apiGatewayRest(regionName) {
    return this.query("AmazonApiGateway", [
      { Type: "TERM_MATCH", Field: "location", Value: regionName },
      { Type: "TERM_MATCH", Field: "productFamily", Value: "API Calls" }
    ]);
  }
  // ────────────────────────────────────────────────────────────────────────
  // Data Transfer Out (Internet Egress)
  // ────────────────────────────────────────────────────────────────────────
  /**
   * Fetches the standard internet egress price per GB for a given region.
   * Uses AWSDataTransfer service with fromLocation = region name, toLocation = External.
   * Falls back to a region-group estimate if the API returns null.
   */
  async dataTransferOut(regionName) {
    const price = await this.query("AWSDataTransfer", [
      { Type: "TERM_MATCH", Field: "fromLocation", Value: regionName },
      { Type: "TERM_MATCH", Field: "toLocation", Value: "External" },
      { Type: "TERM_MATCH", Field: "transferType", Value: "AWS Outbound" }
    ], (p) => {
      const dim = Object.values(p.terms?.OnDemand ?? {});
      if (!dim.length)
        return false;
      const dims = Object.values(dim[0]?.priceDimensions ?? {});
      return dims.some((d) => parseFloat(d.pricePerUnit?.USD) > 0);
    });
    if (price !== null)
      return price;
    if (regionName.startsWith("South America"))
      return 0.15;
    if (regionName.startsWith("Asia Pacific") || regionName.startsWith("Middle East") || regionName.startsWith("Africa"))
      return 0.11;
    return 0.09;
  }
};
__name(PricingFetcher, "PricingFetcher");

// src/schema-builder.ts
var BASELINE_SERVICES = {
  client: { dataTransferGB: 0.09 },
  route53: { zoneMonthly: 0.5, standardM: 0.4 },
  cloudfront: { dtOut: { "us-eu": 0.085, "ap": 0.12, "sa": 0.16, "au": 0.114, "me-af": 0.11 }, requestsM: { "us-eu": 1, "ap": 1.2, "sa": 1.6, "au": 1.2, "me-af": 1.2 }, wafBase: 5, wafRequestM: 0.6 },
  apiGateway: {
    requestsM: {
      http: {
        tier1: 1,
        tier2: 0.9
      },
      rest: {
        tier1: 3.5,
        tier2: 2.8,
        tier3: 2.38,
        tier4: 1.51
      },
      websocket: {
        tier1: 1,
        tier2: 0.8
      }
    },
    cacheRates: {
      "0": 0,
      "0.5": 14.6,
      "1.6": 27.74,
      "6.1": 146,
      "13.5": 182.5,
      "28.4": 365,
      "58.2": 730,
      "118.0": 1343.2,
      "237.0": 2555
    },
    wsConnectionMinuteM: 0.25
  },
  elb: {
    types: {
      alb: { hourly: 0.0225, lcuHour: 8e-3 },
      nlb: { hourly: 0.0225, lcuHour: 6e-3 },
      clb: { hourly: 0.025, dataGB: 8e-3 },
      gwlb: { hourly: 0.0125, lcuHour: 4e-3 }
    }
  },
  vpc: { endpointHourly: 0.01, endpointGB: 0.01, publicIpv4Hourly: 5e-3 },
  ec2: {
    familyRatesLarge: { t3: 0.0832, m5: 0.096, m6g: 0.077, c5: 0.085, c6g: 0.068, r5: 0.126, r6g: 0.1008 },
    sizeMultipliers: { nano: 0.0625, micro: 0.125, small: 0.25, medium: 0.5, large: 1, xlarge: 2, "2xlarge": 4, "4xlarge": 8, "8xlarge": 16, "12xlarge": 24, "16xlarge": 32, "24xlarge": 48, "metal": 96 },
    purchaseDiscounts: { "on-demand": 0, "spot": 0.7, "reserved-1yr": 0.4, "reserved-3yr": 0.6 },
    ebsRates: { gp2: 0.1, gp3: 0.08, io2: 0.125 },
    dataTransferGB: 0.09,
    windowsMultiplier: 1.45
  },
  ecs: { cpuHour: 0.04048, memHour: 4445e-6, armCpuHour: 0.03238, armMemHour: 356e-5, ephemeralGBHour: 111e-6, spotDiscount: 0.7, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, logsGB: 0.5, windowsCpuPremium: 0.046, windowsMemPremium: 4e-3, publicIpHour: 5e-3, instances: { "t3.medium": 0.0416, "m5.large": 0.096, "m6g.large": 0.077 }, ebsGBMonth: 0.08, reservedDiscount: 0.4 },
  autoScalingGroup: {
    familyRatesLarge: { t3: 0.0832, m5: 0.096, m6g: 0.077, c5: 0.085, c6g: 0.068, r5: 0.126, r6g: 0.1008 },
    sizeMultipliers: { nano: 0.0625, micro: 0.125, small: 0.25, medium: 0.5, large: 1, xlarge: 2, "2xlarge": 4, "4xlarge": 8, "8xlarge": 16, "12xlarge": 24, "16xlarge": 32, "24xlarge": 48, metal: 96 },
    purchaseDiscounts: { "on-demand": 0, spot: 0.7, "reserved-1yr": 0.4, "reserved-3yr": 0.6 },
    ebsRates: { gp2: 0.1, gp3: 0.08, io2: 0.125 },
    dataTransferGB: 0.09,
    windowsMultiplier: 1.45
  },
  lambda: { requestM: 0.2, gbSec_x86: 166667e-10, gbSec_arm: 133334e-10, ephemeralGB_Sec: 309e-10, provConcurrency_x86: 0.015, provConcurrency_arm: 0.012 },
  sqs: { standard: 0.4, fifo: 0.5 },
  sns: { publish: 0.5, http: 0.6, email: 20 },
  s3: { storage: { standard: 0.023, intelligent: 0.023, sia: 0.0125, glacier: 36e-4 }, puts: { standard: 5, intelligent: 5, sia: 10, glacier: 30 }, gets: { standard: 0.4, intelligent: 0.4, sia: 1, glacier: 10 }, dataTransferGB: 0.09 },
  rds: { engines: { mysql: 1, postgresql: 1.05, mariadb: 1, "sqlserver-ex": 1.2, "oracle-se2": 1.8 }, instances: { "db.t3.medium": 0.068, "db.m5.large": 0.171, "db.r5.large": 0.24, "db.r6g.large": 0.216 }, multiAzMultiplier: 2, storage: { gp2: 0.115, gp3: 0.115, io1: 0.125 }, backupGB: 0.095 },
  elastiCache: { instances: { "cache.t3.micro": 0.016, "cache.t3.medium": 0.068, "cache.m5.large": 0.156, "cache.r6g.large": 0.211 }, tieringPremium: 1.15 },
  dynamoDb: { std: { readM: 0.25, writeM: 1.25, storageGB: 0.25, wcuHr: 65e-5, rcuHr: 13e-5 }, ia: { readM: 0.3125, writeM: 1.5625, storageGB: 0.1, wcuHr: 8125e-7, rcuHr: 1625e-7 }, globalMultiplier: 1.5 },
  iam: {},
  cloudWatch: { metricRate: 0.3, logsGB: 0.5, dashboard: 3, alarmMonth: 0.1, logsStorageGB: 0.03 },
  stepFunctions: { standardM: 25, expressReq: 1, expressGBsec: 16.67 },
  natGateway: { hourly: 0.045, dataGB: 0.045 },
  securityGroup: {},
  batch: { cpuHour: 0.04048, memHour: 4445e-6, armCpuHour: 0.03238, armMemHour: 356e-5, spotDiscount: 0.7, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, logsGB: 0.5 },
  eks: { clusterHourlyStandard: 0.1, clusterHourlyExtended: 0.6, cpuHour: 0.04048, memHour: 4445e-6, armCpuHour: 0.03238, armMemHour: 356e-5, ephemeralGBHour: 111e-6, spotDiscount: 0.7, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, natHourly: 0.045, natDataGB: 0.045, logsGB: 0.5, instances: { "t3.medium": 0.0416, "t3.large": 0.0832, "m5.large": 0.096, "m5.xlarge": 0.192, "m6g.large": 0.077 }, ebsGBMonth: 0.08, reservedDiscount: 0.4, containerInsightsPerNode: 2.5 },
  aurora: { serverlessAcuHour: 0.12, instances: { "db.t3.medium": 0.082, "db.r5.large": 0.29, "db.r6g.large": 0.26 }, storageGB: 0.1, ioRequestPerM: 0.2 },
  eventBridge: { eventM: 1 },
  kinesis: { shardHour: 0.015, putM: 0.014, retentionGB: 0.023 },
  msk: { instances: { "kafka.t3.small": 0.0466, "kafka.m5.large": 0.21 }, storageGB: 0.1 },
  cognito: { freeTier: 5e4, ratePerUser: 55e-4 },
  waf: { aclMonth: 5, ruleMonth: 1, reqM: 0.6 },
  efs: { storage: { standard: 0.3, ia: 0.016 }, throughputMBps: 6 },
  athena: { perTB: 5 },
  secretsManager: { secretMonth: 0.4, callM: 5 },
  transitGateway: { attachmentHourly: 0.05, dataGB: 0.02 },
  directConnect: { portRates: { "1g": 0.3, "10g": 2.25, "100g": 22.5 }, dataTransferGB: 0.02 },
  globalAccelerator: { hourly: 0.025, dataGB: 0.015 },
  xray: { recordM: 5, scanM: 0.5 },
  openSearch: { instances: { "t3.medium": 0.073, "m6g.large": 0.129, "r6g.large": 0.167 }, storageGB: 0.122 },
  redshift: { instances: { "ra3.xlplus": 1.086, "ra3.4xlarge": 3.26 }, rpuHour: 0.375, storageTB: 24.576 },
  glue: { dpuHour: 0.44 },
  emr: { instances: { "m5.large": 0.12, "m5.xlarge": 0.24, "r5.xlarge": 0.31 } },
  kinesisFirehose: { ingestGB: 0.029, convertGB: 0.018 },
  mq: { instances: { "mq.t3.micro": 0.034, "mq.m5.large": 0.288 }, storageGB: 0.3 },
  kms: { keyMonth: 1, reqM: 3 },
  shield: { advancedMonth: 3e3 },
  organizations: {},
  codePipeline: { pipelineMonth: 1 },
  codeBuild: { rates: { "general1.small": 5e-3, "general1.medium": 0.01, "general1.large": 0.02, "gpu1.large": 0.95 } },
  codeDeploy: { updateRate: 0.02 },
  bedrock: { inM: { "claude-haiku": 0.25, "claude-sonnet": 3, "claude-opus": 15, "llama-70b": 0.99, "titan": 0.15 }, outM: { "claude-haiku": 1.25, "claude-sonnet": 15, "claude-opus": 75, "llama-70b": 1.2, "titan": 0.2 } },
  sageMaker: { instances: { "ml.t3.medium": 0.056, "ml.m5.large": 0.134, "ml.m5.xlarge": 0.269, "ml.p3.2xlarge": 4.284 }, trainingHourly: 1.5, serverlessGBsec: 2e-5, serverlessReqM: 0.2 },
  appSync: { reqM: 4, dtGB: 0.09 },
  iotCore: { msgM: 1, ruleM: 0.15 },
  rekognition: { imageM: 1e3 },
  textract: { pageM: 1500, pageRates: { detect: 1500, tables: 15e3, forms: 5e4, formsTables: 65e3 } },
  mediaConvert: { minHD: 0.017 },
  cloudTrail: { eventM: 1 },
  backup: { warmGB: 0.05, coldGB: 0.01 },
  appRunner: { cpuHour: 0.064, memHour: 7e-3 },
  elasticBeanstalk: {
    familyRatesLarge: { t3: 0.0832, m5: 0.096, m6g: 0.077, c5: 0.085, c6g: 0.068, r5: 0.126, r6g: 0.1008 },
    sizeMultipliers: { nano: 0.0625, micro: 0.125, small: 0.25, medium: 0.5, large: 1, xlarge: 2, "2xlarge": 4, "4xlarge": 8, "8xlarge": 16, "12xlarge": 24, "16xlarge": 32, "24xlarge": 48, metal: 96 },
    purchaseDiscounts: { "on-demand": 0, spot: 0.7, "reserved-1yr": 0.4, "reserved-3yr": 0.6 },
    ebsRates: { gp2: 0.1, gp3: 0.08, io2: 0.125 },
    dataTransferGB: 0.09,
    windowsMultiplier: 1.45
  },
  fsx: { windowsSingle: 0.13, windowsMulti: 0.23, lustreSingle: 0.14, lustreMulti: 0.14, ontapSingle: 0.13, ontapMulti: 0.26, throughputRate: 1.18 },
  certificateManager: {},
  systemsManager: { instHour: 695e-5, callM: 5 },
  ecr: { storageGB: 0.1, dataTransferGB: 0.09 },
  privateLink: { endpointHourly: 0.01, dataGB: 0.01 }
};
function round(n, decimals = 10) {
  if (n === null)
    return null;
  return parseFloat(n.toFixed(decimals));
}
__name(round, "round");
async function buildPricingFile(region, fetcher) {
  const svc = JSON.parse(JSON.stringify(BASELINE_SERVICES));
  console.log(`[Builder] Starting pricing build for ${region.code} (${region.name})...`);
  const loc = region.name;
  const r53Zone = await fetcher.route53Zone();
  const r53QueriesRaw = await fetcher.route53Queries();
  if (r53Zone !== null)
    svc.route53.zoneMonthly = round(r53Zone, 2);
  if (r53QueriesRaw !== null)
    svc.route53.standardM = round(r53QueriesRaw * 1e6, 2);
  const albHr = await fetcher.elbHourly(loc);
  const albLcu = await fetcher.elbLcu(loc);
  if (albHr !== null)
    svc.elb.types.alb.hourly = round(albHr, 4);
  if (albLcu !== null)
    svc.elb.types.alb.lcuHour = round(albLcu, 4);
  const nlbHr = await fetcher.nlbHourly(loc);
  const nlbLcu = await fetcher.nlbLcu(loc);
  if (nlbHr !== null)
    svc.elb.types.nlb.hourly = round(nlbHr, 4);
  if (nlbLcu !== null)
    svc.elb.types.nlb.lcuHour = round(nlbLcu, 4);
  const clbHr = await fetcher.clbHourly(loc);
  const clbData = await fetcher.clbDataGB(loc);
  if (clbHr !== null)
    svc.elb.types.clb.hourly = round(clbHr, 4);
  if (clbData !== null)
    svc.elb.types.clb.dataGB = round(clbData, 4);
  const gwlbHr = await fetcher.gwlbHourly(loc);
  const gwlbLcu = await fetcher.gwlbLcu(loc);
  if (gwlbHr !== null)
    svc.elb.types.gwlb.hourly = round(gwlbHr, 4);
  if (gwlbLcu !== null)
    svc.elb.types.gwlb.lcuHour = round(gwlbLcu, 4);
  if (albHr !== null) {
    svc.ecs.elbHourly = round(albHr, 4);
    svc.eks.elbHourly = round(albHr, 4);
  }
  const natHr = await fetcher.natGatewayHourly(loc);
  const natData = await fetcher.natGatewayData(loc);
  if (natHr !== null) {
    svc.natGateway.hourly = round(natHr, 4);
    svc.eks.natHourly = svc.natGateway.hourly;
  }
  if (natData !== null) {
    svc.natGateway.dataGB = round(natData, 4);
    svc.eks.natDataGB = svc.natGateway.dataGB;
  }
  const egressRate = await fetcher.dataTransferOut(loc);
  if (egressRate !== null) {
    const r = round(egressRate, 4);
    svc.client.dataTransferGB = r;
    svc.ec2.dataTransferGB = r;
    svc.s3.dataTransferGB = r;
    svc.ecs.dataTransferGB = r;
    svc.eks.dataTransferGB = r;
    svc.batch.dataTransferGB = r;
    svc.autoScalingGroup.dataTransferGB = r;
    svc.elasticBeanstalk.dataTransferGB = r;
  }
  const families = ["t3", "m5", "m6g", "c5", "c6g", "r5", "r6g"];
  const instanceMap = {
    t3: "t3.large",
    m5: "m5.large",
    m6g: "m6g.large",
    c5: "c5.large",
    c6g: "c6g.large",
    r5: "r5.large",
    r6g: "r6g.large"
  };
  for (const fam of families) {
    const price = await fetcher.ec2Instance(loc, instanceMap[fam]);
    if (price !== null) {
      svc.ec2.familyRatesLarge[fam] = round(price, 6);
      svc.autoScalingGroup.familyRatesLarge[fam] = round(price, 6);
      svc.elasticBeanstalk.familyRatesLarge[fam] = round(price, 6);
      if (fam === "t3") {
        svc.eks.instances["t3.large"] = round(price, 6);
        svc.ecs.instances["t3.medium"] = round(price * 0.5, 6);
      }
      if (fam === "m5") {
        svc.eks.instances["m5.large"] = round(price, 6);
        svc.eks.instances["m5.xlarge"] = round(price * 2, 6);
        svc.ecs.instances["m5.large"] = round(price, 6);
      }
      if (fam === "m6g") {
        svc.eks.instances["m6g.large"] = round(price, 6);
        svc.ecs.instances["m6g.large"] = round(price, 6);
      }
    }
  }
  const ebsGp2 = await fetcher.ec2EbsGp2(loc);
  const ebsGp3 = await fetcher.ec2EbsGp3(loc);
  const ebsIo2 = await fetcher.ec2EbsIo2(loc);
  if (ebsGp2 !== null)
    svc.ec2.ebsRates.gp2 = round(ebsGp2, 4);
  if (ebsGp3 !== null)
    svc.ec2.ebsRates.gp3 = round(ebsGp3, 4);
  else if (ebsGp2 !== null)
    svc.ec2.ebsRates.gp3 = round(ebsGp2 * 0.8, 4);
  if (ebsIo2 !== null)
    svc.ec2.ebsRates.io2 = round(ebsIo2, 4);
  svc.autoScalingGroup.ebsRates = { ...svc.ec2.ebsRates };
  svc.elasticBeanstalk.ebsRates = { ...svc.ec2.ebsRates };
  svc.ecs.ebsGBMonth = svc.ec2.ebsRates.gp3;
  svc.eks.ebsGBMonth = svc.ec2.ebsRates.gp3;
  const cpuX86 = await fetcher.ecsFargateCpu(loc);
  const memX86 = await fetcher.ecsFargateMemory(loc);
  const cpuArm = await fetcher.ecsFargateArmCpu(loc);
  const memArm = await fetcher.ecsFargateArmMemory(loc);
  const eph = await fetcher.ecsFargateEphemeral(loc);
  if (cpuX86 !== null) {
    svc.ecs.cpuHour = round(cpuX86, 6);
    svc.eks.cpuHour = svc.ecs.cpuHour;
    svc.batch.cpuHour = svc.ecs.cpuHour;
  }
  if (memX86 !== null) {
    svc.ecs.memHour = round(memX86, 6);
    svc.eks.memHour = svc.ecs.memHour;
    svc.batch.memHour = svc.ecs.memHour;
  }
  if (cpuArm !== null) {
    svc.ecs.armCpuHour = round(cpuArm, 6);
    svc.eks.armCpuHour = svc.ecs.armCpuHour;
    svc.batch.armCpuHour = svc.ecs.armCpuHour;
  }
  if (memArm !== null) {
    svc.ecs.armMemHour = round(memArm, 6);
    svc.eks.armMemHour = svc.ecs.armMemHour;
    svc.batch.armMemHour = svc.ecs.armMemHour;
  }
  if (eph !== null) {
    svc.ecs.ephemeralGBHour = round(eph, 8);
    svc.eks.ephemeralGBHour = svc.ecs.ephemeralGBHour;
  }
  const lambdaReqRaw = await fetcher.lambdaRequests(loc);
  const lambdaDurX86 = await fetcher.lambdaDurationX86(loc);
  if (lambdaReqRaw !== null)
    svc.lambda.requestM = round(lambdaReqRaw * 1e6, 4);
  if (lambdaDurX86 !== null) {
    svc.lambda.gbSec_x86 = round(lambdaDurX86, 10);
    svc.lambda.gbSec_arm = round(lambdaDurX86 * 0.8, 10);
  }
  const s3Std = await fetcher.s3Storage(loc, "Standard");
  const s3Ia = await fetcher.s3Storage(loc, "Standard - Infrequent Access");
  const s3Glacier = await fetcher.s3Storage(loc, "Amazon Glacier");
  if (s3Std !== null) {
    svc.s3.storage.standard = round(s3Std, 4);
    svc.s3.storage.intelligent = svc.s3.storage.standard;
  }
  if (s3Ia !== null)
    svc.s3.storage.sia = round(s3Ia, 4);
  if (s3Glacier !== null)
    svc.s3.storage.glacier = round(s3Glacier, 4);
  const rdsT3Med = await fetcher.rdsInstance(loc, "db.t3.medium");
  const rdsM5Lg = await fetcher.rdsInstance(loc, "db.m5.large");
  const rdsR5Lg = await fetcher.rdsInstance(loc, "db.r5.large");
  const rdsR6gLg = await fetcher.rdsInstance(loc, "db.r6g.large");
  const rdsGp2 = await fetcher.rdsStorageGp2(loc);
  if (rdsT3Med !== null)
    svc.rds.instances["db.t3.medium"] = round(rdsT3Med, 4);
  if (rdsM5Lg !== null)
    svc.rds.instances["db.m5.large"] = round(rdsM5Lg, 4);
  if (rdsR5Lg !== null)
    svc.rds.instances["db.r5.large"] = round(rdsR5Lg, 4);
  if (rdsR6gLg !== null)
    svc.rds.instances["db.r6g.large"] = round(rdsR6gLg, 4);
  if (rdsGp2 !== null) {
    svc.rds.storage.gp2 = round(rdsGp2, 4);
    svc.rds.storage.gp3 = svc.rds.storage.gp2;
  }
  const aurAcu = await fetcher.auroraServerlessAcu(loc);
  const aurT3Med = await fetcher.auroraInstance(loc, "db.t3.medium");
  const aurR5Lg = await fetcher.auroraInstance(loc, "db.r5.large");
  const aurR6gLg = await fetcher.auroraInstance(loc, "db.r6g.large");
  if (aurAcu !== null)
    svc.aurora.serverlessAcuHour = round(aurAcu, 4);
  if (aurT3Med !== null)
    svc.aurora.instances["db.t3.medium"] = round(aurT3Med, 4);
  if (aurR5Lg !== null)
    svc.aurora.instances["db.r5.large"] = round(aurR5Lg, 4);
  if (aurR6gLg !== null)
    svc.aurora.instances["db.r6g.large"] = round(aurR6gLg, 4);
  const ecT3Micro = await fetcher.elastiCacheInstance(loc, "cache.t3.micro");
  const ecT3Med = await fetcher.elastiCacheInstance(loc, "cache.t3.medium");
  const ecM5Lg = await fetcher.elastiCacheInstance(loc, "cache.m5.large");
  const ecR6gLg = await fetcher.elastiCacheInstance(loc, "cache.r6g.large");
  if (ecT3Micro !== null)
    svc.elastiCache.instances["cache.t3.micro"] = round(ecT3Micro, 4);
  if (ecT3Med !== null)
    svc.elastiCache.instances["cache.t3.medium"] = round(ecT3Med, 4);
  if (ecM5Lg !== null)
    svc.elastiCache.instances["cache.m5.large"] = round(ecM5Lg, 4);
  if (ecR6gLg !== null)
    svc.elastiCache.instances["cache.r6g.large"] = round(ecR6gLg, 4);
  const ddbReadRaw = await fetcher.dynamoDbRead(loc);
  const ddbWriteRaw = await fetcher.dynamoDbWrite(loc);
  const ddbStorage = await fetcher.dynamoDbStorage(loc);
  if (ddbReadRaw !== null) {
    const readM = round(ddbReadRaw * 1e6, 4);
    svc.dynamoDb.std.readM = readM;
    svc.dynamoDb.ia.readM = round(readM * 1.25, 4);
  }
  if (ddbWriteRaw !== null) {
    const writeM = round(ddbWriteRaw * 1e6, 4);
    svc.dynamoDb.std.writeM = writeM;
    svc.dynamoDb.ia.writeM = round(writeM * 1.25, 4);
  }
  if (ddbStorage !== null) {
    svc.dynamoDb.std.storageGB = round(ddbStorage, 4);
    svc.dynamoDb.ia.storageGB = round(ddbStorage * 0.4, 4);
  }
  const osT3Med = await fetcher.openSearchInstance(loc, "t3.medium.search");
  const osM6gLg = await fetcher.openSearchInstance(loc, "m6g.large.search");
  const osR6gLg = await fetcher.openSearchInstance(loc, "r6g.large.search");
  const osStorage = await fetcher.openSearchStorage(loc);
  if (osT3Med !== null)
    svc.openSearch.instances["t3.medium"] = round(osT3Med, 4);
  if (osM6gLg !== null)
    svc.openSearch.instances["m6g.large"] = round(osM6gLg, 4);
  if (osR6gLg !== null)
    svc.openSearch.instances["r6g.large"] = round(osR6gLg, 4);
  if (osStorage !== null)
    svc.openSearch.storageGB = round(osStorage, 4);
  const rsXlplus = await fetcher.redshiftInstance(loc, "ra3.xlplus");
  const rs4xlarge = await fetcher.redshiftInstance(loc, "ra3.4xlarge");
  const rsRpu = await fetcher.redshiftServerless(loc);
  if (rsXlplus !== null)
    svc.redshift.instances["ra3.xlplus"] = round(rsXlplus, 4);
  if (rs4xlarge !== null)
    svc.redshift.instances["ra3.4xlarge"] = round(rs4xlarge, 4);
  if (rsRpu !== null)
    svc.redshift.rpuHour = round(rsRpu, 4);
  const emrM5Lg = await fetcher.emrInstance(loc, "m5.large");
  const emrM5Xl = await fetcher.emrInstance(loc, "m5.xlarge");
  const emrR5Xl = await fetcher.emrInstance(loc, "r5.xlarge");
  if (emrM5Lg !== null)
    svc.emr.instances["m5.large"] = round(emrM5Lg, 4);
  if (emrM5Xl !== null)
    svc.emr.instances["m5.xlarge"] = round(emrM5Xl, 4);
  if (emrR5Xl !== null)
    svc.emr.instances["r5.xlarge"] = round(emrR5Xl, 4);
  const mskT3Sm = await fetcher.mskInstance(loc, "kafka.t3.small");
  const mskM5Lg = await fetcher.mskInstance(loc, "kafka.m5.large");
  if (mskT3Sm !== null)
    svc.msk.instances["kafka.t3.small"] = round(mskT3Sm, 4);
  if (mskM5Lg !== null)
    svc.msk.instances["kafka.m5.large"] = round(mskM5Lg, 4);
  const mqT3Micro = await fetcher.mqInstance(loc, "mq.t3.micro");
  const mqM5Lg = await fetcher.mqInstance(loc, "mq.m5.large");
  if (mqT3Micro !== null)
    svc.mq.instances["mq.t3.micro"] = round(mqT3Micro, 4);
  if (mqM5Lg !== null)
    svc.mq.instances["mq.m5.large"] = round(mqM5Lg, 4);
  const glueDpu = await fetcher.glueDpu(loc);
  if (glueDpu !== null)
    svc.glue.dpuHour = round(glueDpu, 4);
  const kinShard = await fetcher.kinesisShardHour(loc);
  const kinPutRaw = await fetcher.kinesisPutUnits(loc);
  if (kinShard !== null)
    svc.kinesis.shardHour = round(kinShard, 4);
  if (kinPutRaw !== null)
    svc.kinesis.putM = round(kinPutRaw * 1e6, 4);
  const efsStd = await fetcher.efsStorage(loc, "Standard");
  const efsIa = await fetcher.efsStorage(loc, "Standard - Infrequent Access");
  if (efsStd !== null)
    svc.efs.storage.standard = round(efsStd, 4);
  if (efsIa !== null)
    svc.efs.storage.ia = round(efsIa, 4);
  const apiGwPrice = await fetcher.apiGatewayRest(loc);
  if (apiGwPrice !== null) {
    const ratio = apiGwPrice / 3.5;
    svc.apiGateway.requestsM.rest.tier1 = round(3.5 * ratio, 4);
    svc.apiGateway.requestsM.rest.tier2 = round(2.8 * ratio, 4);
    svc.apiGateway.requestsM.rest.tier3 = round(2.38 * ratio, 4);
    svc.apiGateway.requestsM.rest.tier4 = round(1.51 * ratio, 4);
    svc.apiGateway.requestsM.http.tier1 = round(1 * ratio, 4);
    svc.apiGateway.requestsM.http.tier2 = round(0.9 * ratio, 4);
    svc.apiGateway.requestsM.websocket.tier1 = round(1 * ratio, 4);
    svc.apiGateway.requestsM.websocket.tier2 = round(0.8 * ratio, 4);
    for (const size of Object.keys(svc.apiGateway.cacheRates)) {
      svc.apiGateway.cacheRates[size] = round(BASELINE_SERVICES.apiGateway.cacheRates[size] * ratio, 2);
    }
    svc.apiGateway.wsConnectionMinuteM = round(BASELINE_SERVICES.apiGateway.wsConnectionMinuteM * ratio, 4);
  }
  console.log(`[Builder] Completed pricing build for ${region.code}. Total API calls made: (see fetcher count).`);
  return svc;
}
__name(buildPricingFile, "buildPricingFile");

// src/stats.ts
var GH_OWNER = "000Sushant";
var GH_REPO = "system-design-simulator";
var GH_API = "https://api.github.com";
var CF_GRAPHQL = "https://api.cloudflare.com/client/v4/graphql";
var KEY_PUBLIC = "stats:public";
var KEY_CLONES = "stats:clones";
var KEY_VISITORS = "stats:visitors";
var KEY_COUNTRIES = "stats:countries";
var KEY_LASTRUN = "stats:lastRun";
var REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1e3;
var LOOKBACK_DAYS = 30;
var EMPTY_STATS = {
  stars: 0,
  forks: 0,
  clones: 0,
  visitors: 0,
  countries: 0,
  topCountries: [],
  updatedAt: null
};
async function readDayMap(env, key) {
  const raw = await env.AWS_PRICING_KV.get(key);
  return raw ? JSON.parse(raw) : { byDay: {} };
}
__name(readDayMap, "readDayMap");
function sumDays(m) {
  return Object.values(m.byDay).reduce((a, b) => a + (b || 0), 0);
}
__name(sumDays, "sumDays");
function ghHeaders(env) {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "sr-architect-stats",
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };
}
__name(ghHeaders, "ghHeaders");
async function fetchRepoMeta(env) {
  const res = await fetch(`${GH_API}/repos/${GH_OWNER}/${GH_REPO}`, { headers: ghHeaders(env) });
  if (!res.ok)
    throw new Error(`GitHub repo meta ${res.status}`);
  const data = await res.json();
  return { stars: data.stargazers_count ?? 0, forks: data.forks_count ?? 0 };
}
__name(fetchRepoMeta, "fetchRepoMeta");
async function fetchClonesDays(env) {
  const res = await fetch(`${GH_API}/repos/${GH_OWNER}/${GH_REPO}/traffic/clones`, {
    headers: ghHeaders(env)
  });
  if (!res.ok)
    throw new Error(`GitHub clones ${res.status}`);
  const data = await res.json();
  const days = {};
  for (const d of data.clones ?? []) {
    days[String(d.timestamp).slice(0, 10)] = d.count ?? 0;
  }
  return days;
}
__name(fetchClonesDays, "fetchClonesDays");
async function fetchCloudflare(env) {
  const since = new Date(Date.now() - LOOKBACK_DAYS * 864e5).toISOString().slice(0, 10);
  const query = `
    query Stats($zoneTag: String!, $since: String!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequests1dGroups(limit: 60, filter: { date_geq: $since }, orderBy: [date_ASC]) {
            dimensions { date }
            uniq { uniques }
            sum { countryMap { clientCountryName requests } }
          }
        }
      }
    }`;
  const res = await fetch(CF_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables: { zoneTag: env.CF_ZONE_TAG, since } })
  });
  if (!res.ok)
    throw new Error(`Cloudflare GraphQL ${res.status}`);
  const data = await res.json();
  if (data.errors?.length)
    throw new Error(`Cloudflare GraphQL: ${JSON.stringify(data.errors)}`);
  const groups = data.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];
  const days = {};
  const windowCountries = {};
  for (const g of groups) {
    days[g.dimensions.date] = g.uniq?.uniques ?? 0;
    for (const c of g.sum?.countryMap ?? []) {
      const code = c.clientCountryName;
      if (!code || code === "XX")
        continue;
      windowCountries[code] = (windowCountries[code] ?? 0) + (c.requests ?? 0);
    }
  }
  return { days, windowCountries };
}
__name(fetchCloudflare, "fetchCloudflare");
function isConfigured(env) {
  return Boolean(env.GITHUB_TOKEN && env.CF_API_TOKEN && env.CF_ZONE_TAG);
}
__name(isConfigured, "isConfigured");
async function refreshStats(env) {
  const [meta, cloneDays, cf] = await Promise.all([
    fetchRepoMeta(env),
    fetchClonesDays(env),
    fetchCloudflare(env)
  ]);
  const clones = await readDayMap(env, KEY_CLONES);
  for (const [date, count] of Object.entries(cloneDays))
    clones.byDay[date] = count;
  await env.AWS_PRICING_KV.put(KEY_CLONES, JSON.stringify(clones));
  const visitors = await readDayMap(env, KEY_VISITORS);
  for (const [date, count] of Object.entries(cf.days))
    visitors.byDay[date] = count;
  await env.AWS_PRICING_KV.put(KEY_VISITORS, JSON.stringify(visitors));
  const rawCountries = await env.AWS_PRICING_KV.get(KEY_COUNTRIES);
  const known = new Set(rawCountries ? JSON.parse(rawCountries) : []);
  for (const code of Object.keys(cf.windowCountries))
    known.add(code);
  await env.AWS_PRICING_KV.put(KEY_COUNTRIES, JSON.stringify([...known]));
  const topCountries = Object.entries(cf.windowCountries).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([code, requests]) => ({ code, requests }));
  const stats = {
    stars: meta.stars,
    forks: meta.forks,
    clones: sumDays(clones),
    visitors: sumDays(visitors),
    countries: known.size,
    topCountries,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  await env.AWS_PRICING_KV.put(KEY_PUBLIC, JSON.stringify(stats));
  await env.AWS_PRICING_KV.put(KEY_LASTRUN, String(Date.now()));
  return stats;
}
__name(refreshStats, "refreshStats");
async function maybeRefreshStats(env) {
  if (!isConfigured(env))
    return;
  const last = Number(await env.AWS_PRICING_KV.get(KEY_LASTRUN)) || 0;
  if (Date.now() - last < REFRESH_INTERVAL_MS)
    return;
  try {
    await refreshStats(env);
    console.log("[stats] refreshed");
  } catch (err) {
    console.error("[stats] refresh failed:", err);
  }
}
__name(maybeRefreshStats, "maybeRefreshStats");
async function getPublicStats(env) {
  const raw = await env.AWS_PRICING_KV.get(KEY_PUBLIC);
  if (raw)
    return JSON.parse(raw);
  if (isConfigured(env)) {
    try {
      return await refreshStats(env);
    } catch (err) {
      console.error("[stats] cold refresh failed:", err);
    }
  }
  return EMPTY_STATS;
}
__name(getPublicStats, "getPublicStats");

// src/index.ts
var KV_PROGRESS_KEY = "worker:progress";
var KV_PRICING_PREFIX = "pricing:";
async function getProgress(env) {
  const raw = await env.AWS_PRICING_KV.get(KV_PROGRESS_KEY);
  if (!raw) {
    return { status: "idle", currentIndex: 0, startedAt: 0 };
  }
  return JSON.parse(raw);
}
__name(getProgress, "getProgress");
async function saveProgress(env, progress) {
  await env.AWS_PRICING_KV.put(KV_PROGRESS_KEY, JSON.stringify(progress));
}
__name(saveProgress, "saveProgress");
async function processOneRegion(env) {
  const progress = await getProgress(env);
  if (progress.status === "failed" && progress.cooldownUntil && Date.now() < progress.cooldownUntil) {
    const waitMin = Math.round((progress.cooldownUntil - Date.now()) / 6e4);
    console.log(`[Worker] \u23F3 In failure cooldown for ~${waitMin} more minute(s). Skipping.`);
    return;
  }
  if (progress.status === "idle") {
    const timeSinceLast = Date.now() - (progress.startedAt || 0);
    if (timeSinceLast < WEEKLY_INTERVAL_MS) {
      const hoursLeft = Math.round((WEEKLY_INTERVAL_MS - timeSinceLast) / 36e5);
      console.log(`[Worker] \u2705 Weekly run not due yet (~${hoursLeft}h remaining). Skipping.`);
      return;
    }
    console.log(`[Worker] \u{1F680} Starting new weekly pricing generation run for ${REGIONS.length} regions...`);
    await saveProgress(env, { status: "running", currentIndex: 0, startedAt: Date.now(), completedCount: 0 });
    return processOneRegion(env);
  }
  if (progress.currentIndex >= REGIONS.length) {
    console.log(`[Worker] \u{1F389} Weekly run complete! Processed all ${REGIONS.length} regions.`);
    await saveProgress(env, { ...progress, status: "idle" });
    return;
  }
  const region = REGIONS[progress.currentIndex];
  console.log(`[Worker] \u{1F30D} Processing region ${progress.currentIndex + 1}/${REGIONS.length}: ${region.code} (${region.name})`);
  try {
    const fetcher = new PricingFetcher(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY);
    const services = await buildPricingFile(region, fetcher);
    const pricingFile = {
      regionCode: region.code,
      regionName: region.name,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      services
    };
    await env.AWS_PRICING_KV.put(
      `${KV_PRICING_PREFIX}${region.code}`,
      JSON.stringify(pricingFile),
      { expirationTtl: 8 * 24 * 60 * 60 }
      // 8 days TTL (auto-expire stale data)
    );
    console.log(`[Worker] \u2705 Saved pricing for ${region.code} to KV.`);
    await saveProgress(env, {
      ...progress,
      status: "running",
      currentIndex: progress.currentIndex + 1,
      lastCompletedRegion: region.code,
      completedCount: (progress.completedCount ?? 0) + 1,
      lastError: void 0,
      cooldownUntil: void 0
    });
  } catch (err) {
    const errorMsg = err?.message ?? String(err);
    console.error(`[Worker] \u274C Failed to process ${region.code}:`, errorMsg);
    await saveProgress(env, {
      ...progress,
      status: "failed",
      lastError: errorMsg,
      cooldownUntil: Date.now() + FAILURE_COOLDOWN_MS
    });
  }
}
__name(processOneRegion, "processOneRegion");
var src_default = {
  /**
   * Cron handler — fires every 5 minutes.
   * Each invocation processes ONE region and updates KV state.
   * Resume is automatic: the next invocation picks up from where the last left off.
   */
  async scheduled(_event, env, ctx) {
    console.log("[Worker] \u23F0 Cron triggered at", (/* @__PURE__ */ new Date()).toISOString());
    ctx.waitUntil(processOneRegion(env));
    ctx.waitUntil(maybeRefreshStats(env));
  },
  /**
   * HTTP handler for manual control and monitoring.
   *
   *   GET  /status           — current progress state
   *   POST /trigger          — force-start processing the next region immediately
   *   POST /reset            — reset to idle (useful for testing or forcing a re-run)
   *   GET  /pricing/{region} — fetch a generated pricing file from KV
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (path === "/status" && request.method === "GET") {
      const progress = await getProgress(env);
      const remaining = REGIONS.length - progress.currentIndex;
      return json({
        ...progress,
        totalRegions: REGIONS.length,
        remainingRegions: remaining,
        nextRegion: REGIONS[progress.currentIndex]?.code ?? "none"
      });
    }
    if (path === "/trigger" && request.method === "POST") {
      ctx.waitUntil(processOneRegion(env));
      const progress = await getProgress(env);
      return json({ message: "Processing triggered", nextRegion: REGIONS[progress.currentIndex]?.code }, 202);
    }
    if (path === "/reset" && request.method === "POST") {
      await saveProgress(env, { status: "idle", currentIndex: 0, startedAt: 0 });
      return json({ message: "Progress reset to idle. Weekly run will start on next cron trigger." });
    }
    if (path === "/start" && request.method === "POST") {
      await saveProgress(env, { status: "running", currentIndex: 0, startedAt: Date.now(), completedCount: 0 });
      ctx.waitUntil(processOneRegion(env));
      return json({ message: `Weekly run force-started. Processing ${REGIONS[0]?.code}...` }, 202);
    }
    const pricingMatch = path.match(/^\/pricing\/([a-z0-9-]+)$/);
    if (pricingMatch && request.method === "GET") {
      const regionCode = pricingMatch[1];
      const raw = await env.AWS_PRICING_KV.get(`${KV_PRICING_PREFIX}${regionCode}`);
      if (!raw) {
        return json({ unsupportedRegion: true, regionCode }, 404);
      }
      return new Response(raw, { headers: { "Content-Type": "application/json", "X-Cache": "KV" } });
    }
    if (path === "/stats" && request.method === "GET") {
      const stats = await getPublicStats(env);
      return json(stats, 200, { ...CORS, "Cache-Control": "public, max-age=3600" });
    }
    if (path === "/votes" && request.method === "GET") {
      const rows = await env.DB.prepare(
        "SELECT challenge_id, up, down FROM challenge_votes"
      ).all();
      const tally = {};
      for (const r of rows.results) {
        tally[r.challenge_id] = { up: r.up, down: r.down };
      }
      return json(tally, 200, CORS);
    }
    if (path === "/votes" && request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON body." }, 400, CORS);
      }
      const id = (body.challengeId ?? "").trim();
      const up = clampDelta(body.upDelta);
      const down = clampDelta(body.downDelta);
      if (!/^[a-z0-9-]{1,64}$/.test(id)) {
        return json({ error: "Invalid challengeId." }, 400, CORS);
      }
      if (up === 0 && down === 0) {
        return json({ error: "Empty vote." }, 400, CORS);
      }
      await env.DB.prepare(
        `INSERT INTO challenge_votes (challenge_id, up, down)
         VALUES (?, MAX(0, ?), MAX(0, ?))
         ON CONFLICT(challenge_id) DO UPDATE SET
           up = MAX(0, up + ?), down = MAX(0, down + ?)`
      ).bind(id, up, down, up, down).run();
      const row = await env.DB.prepare(
        "SELECT up, down FROM challenge_votes WHERE challenge_id = ?"
      ).bind(id).first();
      return json({ challengeId: id, up: row?.up ?? 0, down: row?.down ?? 0 }, 200, CORS);
    }
    return json({
      name: "AWS Pricing Generator Worker",
      version: "1.0.0",
      regions: REGIONS.length,
      routes: [
        "GET  /status",
        "POST /trigger",
        "POST /reset",
        "POST /start",
        "GET  /pricing/{regionCode}",
        "GET  /stats",
        "GET  /votes",
        "POST /votes"
      ]
    });
  }
};
var CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
function clampDelta(value) {
  if (value === 1 || value === -1)
    return value;
  return 0;
}
__name(clampDelta, "clampDelta");
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders }
  });
}
__name(json, "json");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-OI7eWs/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-OI7eWs/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*! Bundled license information:

aws4fetch/dist/aws4fetch.esm.mjs:
  (**
   * @license MIT <https://opensource.org/licenses/MIT>
   * @copyright Michael Hart 2024
   *)
*/
//# sourceMappingURL=index.js.map
