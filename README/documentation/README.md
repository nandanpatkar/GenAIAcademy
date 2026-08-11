# GenAI Academy documentation

This folder contains the maintained implementation, deployment, setup, and troubleshooting documentation created for GenAI Academy.

## ApiBeam documentation

| Document | Use it for |
| --- | --- |
| [ApiBeam overview and local setup](./API_BEAM.md) | Understanding ApiBeam, running it locally, and configuring Atlas. |
| [New laptop setup](./API_BEAM_NEW_LAPTOP_SETUP.md) | Connecting a different laptop to the deployed Oracle relay. |
| [Oracle relay troubleshooting](./API_BEAM_RELAY_TROUBLESHOOTING.md) | Recovering from timeouts, `502`, WebSocket errors, or a slow VM. |
| [Oracle + Vercel implementation plan](./API_BEAM_ORACLE_VERCEL_IMPLEMENTATION_PLAN.md) | The detailed security, deployment, scaling, and public-release plan. |

## Source-code documentation kept in place

The root `README.md` and the `README.md` files inside independently bundled projects remain beside their code. They are entrypoints required by GitHub, package tooling, or the vendored project itself. The ApiBeam operational documents above are centralized here.
