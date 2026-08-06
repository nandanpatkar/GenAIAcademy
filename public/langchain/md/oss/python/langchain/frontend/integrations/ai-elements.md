[AI Elements](https://elements.ai-sdk.dev/) is a composable, shadcn/ui-based component library purpose-built for AI chat interfaces. Components like `Conversation`, `Message`, `Tool`, `Reasoning`, and `PromptInput` are designed to drop directly into any React project and wire to `stream.messages` with minimal glue code.


> [!TIP]
>
> Clone and run the [full AI Elements example](https://github.com/langchain-ai/langgraphjs/tree/main/examples/ai-elements) to see tool call rendering, reasoning display, streaming messages, and more in a working project.


## How it works

1. **Install components as source files:** AI Elements ships via a CLI that adds components directly to your project (shadcn/ui registry style)
2. **Map messages to components:** iterate `stream.messages`, render `HumanMessage` instances as user bubbles and `AIMessage` instances as assistant responses
3. **Compose richer UIs:** wrap tool calls in `<Tool>`, reasoning in `<Reasoning>`, and everything in `<Conversation>` for scroll management

## Installation

Install AI Elements components via the CLI. They're added as editable source files into your project:

```bash
npm install @langchain/react
npx ai-elements@latest add conversation message prompt-input tool reasoning suggestion
```

## Wiring useStream

Render AI Elements components directly from `stream.messages`. Each LangChain `BaseMessage` maps to a component:

```tsx

  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";

  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";

function getReasoningText(msg: AIMessage) {
  return msg.contentBlocks.find((block) => block.type === "reasoning")?.reasoning ?? "";
}

function getTextContent(msg: AIMessage) {
  return msg.text;
}

function getToolCalls(msg: AIMessage) {
  return (msg.tool_calls ?? []).map((tc) => ({
    id: tc.id,
    name: tc.name,
    args: tc.args,
    state: "input-available" as const,
  }));
}

export function Chat() {
  const stream = useStream({
    apiUrl: "http://localhost:2024",
    assistantId: "ai_elements",
  });

  return (
    
      <Conversation className="flex-1">
        <ConversationContent>
          {stream.messages.map((msg, i) => {
            if (HumanMessage.isInstance(msg)) {
              return (
                <Message key={i} from="user">
                  <MessageContent>{msg.text}</MessageContent>
                </Message>
              );
            }
            if (AIMessage.isInstance(msg)) {
              return (
                
                  {/* Reasoning block (shows when model emits thinking tokens) */}
                  <Reasoning>
                    
                    <ReasoningContent>{getReasoningText(msg)}</ReasoningContent>
                  </Reasoning>

                  {/* Inline tool calls with input/output display */}
                  {getToolCalls(msg).map((tc) => (
                    <Tool key={tc.id} defaultOpen>
                      
                      <ToolContent>
                        
                        {tc.output && (
                          
                        )}
                      </ToolContent>
                    </Tool>
                  ))}

                  {/* Streamed text response */}
                  <Message from="assistant">
                    <MessageContent>
                      <MessageResponse>{getTextContent(msg)}</MessageResponse>
                    </MessageContent>
                  </Message>
                
              );
            }
          })}
        </ConversationContent>
        
      </Conversation>

      <PromptInput
        onSubmit={({ text }) =>
          stream.submit({ messages: [{ type: "human", content: text }] })
        }
      >
        <PromptInputBody>
          
        </PromptInputBody>
        <PromptInputFooter>
          
        </PromptInputFooter>
      </PromptInput>
    
  );
}
```

## Best practices

- **Edit source files freely:** components ship in your project, not as an external package dependency, so you can change anything without forking
- **Use `MessageResponse` for streaming:** it handles streamed partial tokens correctly; avoid rendering raw message content directly during streaming
- **Wrap in `Conversation`:** the `Conversation` component manages scroll behaviour so new messages auto-scroll into view
- **Gate on `isInstance`:** use `HumanMessage.isInstance(msg)` and `AIMessage.isInstance(msg)` rather than checking `msg.getType()` for proper TypeScript narrowing
