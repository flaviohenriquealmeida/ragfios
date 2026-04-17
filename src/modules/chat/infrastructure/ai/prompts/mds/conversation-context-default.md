### CONVERSATION CONTEXT

#### 1. CONVERSATION MEMORY (Authoritative Facts)
{{conversationSummary}}
*Instructions: Treat these as persistent facts. Use them for personalization and identity.*

#### 2. RECENT HISTORY (Immediate Intent)
{{conversationHistory}}
*Instructions: Use for continuity. If the user introduces new facts here (like a name), prioritize them over the summary above.*

#### 3. RETRIEVED DOCUMENTS (Knowledge Base)
{{ragContext}}

---

### CURRENT QUERY
{{lastUserMessage}}