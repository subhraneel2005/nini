import type { WebFetchInput, WebFetchOutput } from "../../types/tool-types";
import * as cheerio from "cheerio"

async function webFetch({ url }: WebFetchInput): Promise<WebFetchOutput> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      console.log("url error: ", errorText);
      
      return {
        success: false,
        error: errorText,
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style, nav, footer, header").remove();

    const cleanedText = $("main").text() || $("article").text() || $("body").text();

    console.log("url success response: ", cleanedText);

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

webFetch({
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
})
