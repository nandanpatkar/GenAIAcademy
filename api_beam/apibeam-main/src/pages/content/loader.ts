(function () {
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const response = await originalFetch(...args);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/event-stream")) {
      return response;
    }

    // Clone the response so page continues to work
    const clone = response.clone();
    const reader = clone.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    let fullAssistantMessage = "";
    const imageUrls = new Set<string>();

    const isLikelyImageUrl = (value: string, key = "") => {
      if (/^blob:/i.test(value)) return /\b(image|thumbnail|preview|asset)\b/i.test(key);
      if (!/^https?:\/\//i.test(value)) return false;
      return /\b(image|thumbnail|preview|asset)\b/i.test(key)
        || /\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i.test(value)
        || /(?:oaiusercontent|oaidalleapiprod|images\.openai|\/estuary\/content)/i.test(value);
    };

    const collectImageUrls = (value: unknown, key = "", depth = 0) => {
      if (depth > 8 || value == null) return;
      if (typeof value === "string") {
        if (isLikelyImageUrl(value, key)) imageUrls.add(value);
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item) => collectImageUrls(item, key, depth + 1));
        return;
      }
      if (typeof value === "object") {
        Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
          collectImageUrls(childValue, childKey, depth + 1);
        });
      }
    };

    const collectRenderedAssistantImages = () => {
      // ChatGPT has used several conversation-turn structures. Prefer the
      // latest assistant turn, but fall back to the page's large images: UI
      // icons are small, while generated images are normally 1024px wide.
      const turns = Array.from(document.querySelectorAll(
        '[data-message-author-role="assistant"], article[data-turn="assistant"], article[data-testid*="conversation-turn"]'
      ));
      const latestTurn = turns.at(-1);
      const scan = (root: ParentNode) => Array.from(root.querySelectorAll("img")).forEach((node) => {
        const image = node as HTMLImageElement;
        const width = image.naturalWidth || image.width || image.clientWidth;
        if (width < 128) return;

        const sources = [
          image.currentSrc,
          image.src,
          image.getAttribute("src"),
          image.closest("a[href]")?.getAttribute("href"),
          ...Array.from(image.querySelectorAll("source[srcset]")).flatMap((source) => source.getAttribute("srcset")?.split(",") || []),
        ];
        sources.forEach((source) => {
          const url = source?.trim().split(/\s+/)[0] || "";
          if (isLikelyImageUrl(url, "image")) imageUrls.add(url);
        });
      });

      if (latestTurn) scan(latestTurn);
      // Some ChatGPT builds do not mark an image-only answer as an assistant
      // turn. Fall back only when its turn produced no usable image URL.
      if (imageUrls.size === 0) scan(document);
    };

    const waitForRenderedImages = async () => {
      // Image-generation completion may precede the actual <img> insertion.
      // A short bounded wait makes this reliable without slowing normal chats.
      for (let attempt = 0; attempt < 6 && imageUrls.size === 0; attempt += 1) {
        collectRenderedAssistantImages();
        if (imageUrls.size > 0) break;
        await new Promise((resolve) => window.setTimeout(resolve, 300));
      }
    };

    const imageToInlineDataUrl = async (url: string) => {
      // ChatGPT's image URL is authenticated to chatgpt.com. Fetch it while
      // running in that signed-in tab, then send a compact image payload that
      // Atlas can display without access to ChatGPT's session cookies.
      const imageResponse = await fetch(url, { credentials: "include", cache: "no-store" });
      if (!imageResponse.ok) throw new Error(`Image request failed: ${imageResponse.status}`);

      const blob = await imageResponse.blob();
      if (!blob.type.startsWith("image/")) throw new Error("ChatGPT returned a non-image asset");

      const objectUrl = URL.createObjectURL(blob);
      try {
        const image = new Image();
        image.decoding = "async";
        image.src = objectUrl;
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Could not decode generated image"));
        });

        const originalWidth = image.naturalWidth || image.width;
        const originalHeight = image.naturalHeight || image.height;
        if (!originalWidth || !originalHeight) throw new Error("Generated image has no dimensions");

        // Keep Socket.IO payloads comfortably below its default message limit
        // while preserving a useful, sharp preview in the Atlas conversation.
        for (const [maxDimension, quality] of [[768, 0.82], [640, 0.78], [512, 0.72]]) {
          const scale = Math.min(1, maxDimension / Math.max(originalWidth, originalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(originalWidth * scale));
          canvas.height = Math.max(1, Math.round(originalHeight * scale));
          const context = canvas.getContext("2d", { alpha: false });
          if (!context) continue;
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          if (dataUrl.length <= 800000 || maxDimension === 512) return dataUrl;
        }
      } finally {
        URL.revokeObjectURL(objectUrl);
      }

      throw new Error("Could not prepare generated image");
    };
    async function readStream() {
      while (true) {
        if (reader === undefined) return response;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by double newline
        const parts = buffer.split(/\r?\n\r?\n/);
        buffer = parts.pop() as string;

        for (let part of parts) {
          part = part.trim();
          if (!part) continue;

          // Split lines within this event
          const lines = part.split(/\r?\n/);

          let eventName = null;
          let dataLines = [];

          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventName = line.substring("event:".length).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.substring("data:".length).trim());
            }
          }

          const dataStr = dataLines.join("\n");

          // Handle different event types
          if (eventName === "delta" || eventName === "delta_encoding") {
            // Try parse JSON
            try {
              const obj = JSON.parse(dataStr);

              if (eventName === "delta") {
                collectImageUrls(obj);
                // In your sample, deltas have "v": array of patches
                if (Array.isArray(obj.v)) {
                  for (const patch of obj.v) {
                    // Look for patches that append to the message content
                    if (patch.p && patch.o === "append" && patch.v) {
                      // e.g., v: {"p": "/message/content/parts/0", "o":"append", "v":" text"}
                      // Check if path matches content parts
                      if (patch.p.includes("/message/content/parts")) {
                        fullAssistantMessage += patch.v;
                      }
                    }
                  }
                }else if(typeof obj.v === "string"){
                  fullAssistantMessage += obj.v;
                }
              } else if (eventName === "delta_encoding") {
                // encoding event, you may ignore or store token if needed
                // dataStr is probably a string like "v1", so just ignore
              }
            } catch (err) {
              console.warn("Could not parse SSE data JSON:", dataStr, err);
              // fallback: append raw data
              fullAssistantMessage += dataStr;
            }
          } else if (eventName === null) {
            // No explicit event: maybe just data lines with JSON
            try {
              const obj = JSON.parse(dataStr);

              // Try to detect final message / complete content
              // Based on your sample: server_ste_metadata, message_marker, message_stream_complete
              if (obj.type === "message_stream_complete") {
                // when this arrives, stream is done
              }
            } catch (err) {
              // Not JSON — skip or log
            }
          }
        }
      }

      function extractAndParseJson(str: string, fallback: unknown = null) {
        if (typeof str !== "string") return fallback;

        // Use a regex to match a JSON block
        const jsonMatch = str.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return fallback;

        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.warn("Failed to parse JSON:", e);
          return fallback;
        }
      }
      // Atlas accepts normal Markdown, whereas older ApiBeam prompts expected
      // a JSON object. Never discard a successful provider reply merely
      // because it is not JSON; the relay can safely return a JSON string.
      const message = fullAssistantMessage.trim();
      // Generated-image URLs can arrive in stream metadata or only in the
      // rendered ChatGPT turn. Check both paths; text-only replies remain
      // exactly as they were before this addition.
      collectRenderedAssistantImages();
      if (imageUrls.size === 0 && /finished_successfully|image[_ -]?gen|generated image/i.test(message)) {
        await waitForRenderedImages();
      }
      const images = await Promise.all(Array.from(imageUrls).slice(0, 1).map(async (url, index) => {
        try {
          return { url: await imageToInlineDataUrl(url), alt: `Generated image ${index + 1}` };
        } catch (error) {
          // Keep the original URL as a best-effort fallback. It may still be
          // usable when the ChatGPT asset is public or signed.
          console.warn("Could not inline generated image:", error);
          return { url, alt: `Generated image ${index + 1}` };
        }
      }));
      const parsed = extractAndParseJson(message, message || null);
      const data = parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? { ...parsed as Record<string, unknown>, images }
        : { content: parsed || "", images };
      window.postMessage(
        { data },
        "*"
      );
    }
    readStream().catch((err) => console.error("SSE read error:", err));
    return response;
  };
})();
