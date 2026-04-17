[CONTEXT_DATA]
QUERY: {{rewrittenQuery}}

[ITEMS_TO_RANK]
{{chunks}}

[COMMAND]
Rank the {{chunksLengh}} items above by relevance.
Output format: [{"id": <id>, "relevanceScore": <0-10>}]
JSON: