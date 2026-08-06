A **memory store** is the backend that holds an agent’s long-term knowledge. The [`MemoryManager`](lc:user-guide/concepts/memory/overview) orchestrates one or more stores to recall, inject, and extract memories across sessions. Any backend that implements the `MemoryStore` interface can plug in: see [Custom Stores](lc:user-guide/concepts/memory/overview#custom-stores) for the contract.

The SDK ships reference stores like the [Bedrock Knowledge Base store](lc:user-guide/concepts/memory/bedrock-knowledge-base). The packages below go further: they are **community-built** memory stores you can install and attach to an agent, backed by vector databases, managed services, and other stores the SDK does not vend itself.

> [!NOTE] Community maintained
>
> These packages are maintained by their authors, not the Strands team. Review packages before using them in production. Quality and support may vary.

## Browse the catalog

See the [Memory stores section of the community catalog](lc:community/community-packages#memory-stores) for the current list, with language support and links to each package.

## Add your memory store

Built a `MemoryStore` implementation? See the [Get Featured guide](lc:community/get-featured) to list it here, and the [Extensions guide](lc:contribute/contributing/extensions) for how to build and publish a package.
