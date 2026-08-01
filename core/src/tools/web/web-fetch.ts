import { tool } from "ai";
import { WebFetchInputSchema, WebFetchOutputSchema, type WebFetchInput, type WebFetchOutput } from "../../types/tool-types";
import * as cheerio from "cheerio"

async function webFetch({ url }: WebFetchInput): Promise<WebFetchOutput> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      
      return {
        success: false,
        error: errorText,
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style, nav, footer, header").remove();

    const cleanedText = $("main").text() || $("article").text() || $("body").text();

    return {
      success: true,
      response: cleanedText,
    };
  } catch (error) {
    console.error("error at web fetch", error);
    return {
      success: false,
      error: "internal error at web fetch",
    };
  }
}

// webFetch({
//     url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
// })

export const webfetchTool = tool({
    description: "Accepts a valid url and fetches it to get some reponse back from the web. Only accepts HTTP/HTTPS protocol URLs.",
    inputSchema: WebFetchInputSchema,
    outputSchema: WebFetchOutputSchema,
    execute: webFetch
})
