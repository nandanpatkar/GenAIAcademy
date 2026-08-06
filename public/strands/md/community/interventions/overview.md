An **intervention handler** is a composable control layer that intercepts agent lifecycle events and returns typed decisions — proceed, deny, guide, confirm, or transform. Handlers are registered via the `interventions` option in agent configuration and evaluated in order, with short-circuiting on deny or guide actions. See [Interventions](lc:user-guide/concepts/agents/interventions) for the full concept and built-in handlers.

The SDK ships reference handlers like [Cedar Authorization](lc:user-guide/concepts/agents/interventions/cedar-authorization), [Steering](lc:user-guide/concepts/agents/interventions/steering), and [Human-in-the-Loop](lc:user-guide/concepts/agents/interventions/human-in-the-loop). The packages below are **community-built** intervention handlers you can install and attach to an agent.

> [!NOTE] Community maintained
>
> These packages are maintained by their authors, not the Strands team. Review packages before using them in production. Quality and support may vary.

## Browse the catalog

See the [Interventions section of the community catalog](lc:community/community-packages#interventions) for the current list, with language support and links to each package.

## Add your intervention handler

Built an `InterventionHandler`? See the [Get Featured guide](lc:community/get-featured) to list it here, and the [Extensions guide](lc:contribute/contributing/extensions) for how to build and publish a package.
