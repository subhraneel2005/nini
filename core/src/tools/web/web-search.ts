import { tool } from "ai";
import { exa } from "../../config/exa";
import { WebSearchInputSchema, type WebSearchInput } from "../../types/tool-types";

async function webSearch({ searchQuery }: WebSearchInput) {
  try {
    const results = await exa.search(searchQuery ,{
        contents:{
            highlights:{
                maxCharacters: 4000
            },
        }
    })

    return results
  } catch (error) {
    console.error("error at webSearch", error)
  }
}

export const webSearchTool = tool({
    description: "Use this tool to search anything on the web using a search query. Then Summarize the results you got and response with them.",
    inputSchema: WebSearchInputSchema,
    execute: webSearch
})
