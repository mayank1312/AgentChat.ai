/**
 * Agent Tools System
 * Provides real tools to agents: web search, calculator, calendar, etc.
 */

"use server";

export interface ToolResult {
  success: boolean;
  result: string;
  error?: string;
}

/**
 * Calculator tool - Perform mathematical operations
 */
export async function toolCalculator(expression: string): Promise<ToolResult> {
  try {
    // Simple safe calculator using Function
    // In production, use a dedicated expression parser
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, "");

    // Prevent code injection
    if (sanitized.length === 0 || sanitized.length > 200) {
      throw new Error("Invalid expression");
    }

    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${sanitized}`)();

    return {
      success: true,
      result: `${expression} = ${result}`,
    };
  } catch (err) {
    return {
      success: false,
      result: "",
      error: `Calculation error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Web search tool - Search the web for information
 * Uses a simple API (you can replace with your preferred service)
 */
export async function toolWebSearch(query: string): Promise<ToolResult> {
  try {
    if (!query || query.length === 0) {
      throw new Error("Search query cannot be empty");
    }

    // TODO: Implement with real search API
    // Options: SerpAPI, Bing Search API, Google Custom Search, DuckDuckGo
    // For now, return placeholder

    console.log(`🔍 Web search query: ${query}`);

    // This would be replaced with actual API call
    return {
      success: true,
      result: `[Web search for "${query}" would return results here - configure search API]`,
    };
  } catch (err) {
    return {
      success: false,
      result: "",
      error: `Search failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Calendar tool - Get calendar information
 */
export async function toolCalendar(action: "today" | "tomorrow" | "week"): Promise<ToolResult> {
  try {
    const now = new Date();
    const date = new Date(now.getTime());

    switch (action) {
      case "today":
        return {
          success: true,
          result: `Today is ${date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
        };

      case "tomorrow":
        date.setDate(date.getDate() + 1);
        return {
          success: true,
          result: `Tomorrow is ${date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
        };

      case "week":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return {
          success: true,
          result: `Current week: ${weekStart.toLocaleDateString()} to ${weekEnd.toLocaleDateString()}`,
        };

      default:
        throw new Error("Invalid calendar action");
    }
  } catch (err) {
    return {
      success: false,
      result: "",
      error: `Calendar error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Execute any tool by name
 */
export async function executeTool(
  toolName: string,
  parameters: Record<string, string>
): Promise<ToolResult> {
  console.log(`🔧 Executing tool: ${toolName}`, parameters);

  try {
    switch (toolName.toLowerCase()) {
      case "calculator":
        return await toolCalculator(parameters.expression || "");

      case "websearch":
      case "web_search":
        return await toolWebSearch(parameters.query || "");

      case "calendar":
        return await toolCalendar(
          (parameters.action as "today" | "tomorrow" | "week") || "today"
        );

      default:
        return {
          success: false,
          result: "",
          error: `Unknown tool: ${toolName}`,
        };
    }
  } catch (err) {
    return {
      success: false,
      result: "",
      error: `Tool execution failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * List available tools for agent
 */
export async function getAvailableTools() {
  return [
    {
      name: "calculator",
      description: "Perform mathematical calculations",
      parameters: { expression: "string (e.g., '2 + 2' or '10 * 5')" },
    },
    {
      name: "websearch",
      description: "Search the web for current information",
      parameters: { query: "string (what to search for)" },
    },
    {
      name: "calendar",
      description: "Get calendar information",
      parameters: { action: "string ('today', 'tomorrow', or 'week')" },
    },
  ];
}
