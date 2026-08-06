Structured output lets you get type-safe, validated responses from language models. Instead of raw text that you need to parse manually, you define the exact structure you want and receive a validated object.

Each language uses its own schema library for defining output structures. See the tabs below for language-specific examples.

## Basic Structured Output

Define a schema and pass it to the agent. The agent returns a validated object matching your schema.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom pydantic import BaseModel\nfrom strands import Agent\n\nclass PersonInfo(BaseModel):\n    name: str\n    age: int\n    occupation: str\n\nagent = Agent()\nresult = agent(\n    \"John Smith is a 30-year-old software engineer\",\n    structured_output_model=PersonInfo\n)\n\nprint(f\"Name: {result.structured_output.name}\")      # \"John Smith\"\nprint(f\"Age: {result.structured_output.age}\")        # 30\nprint(f\"Job: {result.structured_output.occupation}\") # \"software engineer\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { z } from 'zod'\n\nconst PersonInfo = z.object({\n  name: z.string().describe('Name of the person'),\n  age: z.number().describe('Age of the person'),\n  occupation: z.string().describe('Occupation of the person'),\n})\n\ntype PersonInfo = z.infer<typeof PersonInfo>\n\nconst basicAgent = new Agent()\nconst basicResult = await basicAgent.invoke('John Smith is a 30-year-old software engineer', {\n  structuredOutputSchema: PersonInfo,\n})\n\nconst person = basicResult.structuredOutput as PersonInfo\nconsole.log(`Name: ${person.name}`) // \"John Smith\"\nconsole.log(`Age: ${person.age}`) // 30\nconsole.log(`Job: ${person.occupation}`) // \"software engineer\"\n```"
 }
]
```

## Complex Nested Schemas

Schemas can be nested to represent complex data structures:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom typing import List, Optional\nfrom pydantic import BaseModel, Field\nfrom strands import Agent\n\nclass Address(BaseModel):\n    street: str\n    city: str\n    country: str\n    postal_code: Optional[str] = None\n\nclass Contact(BaseModel):\n    email: Optional[str] = None\n    phone: Optional[str] = None\n\nclass Person(BaseModel):\n    name: str = Field(description=\"Full name of the person\")\n    age: int = Field(description=\"Age in years\")\n    address: Address = Field(description=\"Home address\")\n    contacts: List[Contact] = Field(default_factory=list, description=\"Contact methods\")\n    skills: List[str] = Field(default_factory=list, description=\"Professional skills\")\n\nagent = Agent()\nresult = agent(\n    \"Extract info: Jane Doe, a systems admin, 28, lives at 123 Main St, New York, USA. Email: jane@example.com\",\n    structured_output_model=Person\n)\n\nprint(f\"Name: {result.structured_output.name}\")\nprint(f\"Age: {result.structured_output.age}\")\nprint(f\"Street: {result.structured_output.address.street}\")\nprint(f\"City: {result.structured_output.address.city}\")\nprint(f\"Email: {result.structured_output.contacts[0].email}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { z } from 'zod'\n\nconst Address = z.object({\n  street: z.string(),\n  city: z.string(),\n  country: z.string(),\n  postalCode: z.string().optional(),\n})\n\nconst Contact = z.object({\n  email: z.string().optional(),\n  phone: z.string().optional(),\n})\n\nconst Person = z.object({\n  name: z.string().describe('Full name of the person'),\n  age: z.number().describe('Age in years'),\n  address: Address.describe('Home address'),\n  contacts: z.array(Contact).describe('Contact methods'),\n  skills: z.array(z.string()).describe('Professional skills'),\n})\n\ntype Person = z.infer<typeof Person>\n\nconst agent = new Agent()\nconst result = await agent.invoke(\n  'Extract info: Jane Doe, a systems admin, 28, lives at 123 Main St, New York, USA. Email: jane@example.com',\n  { structuredOutputSchema: Person },\n)\n\nconst person = result.structuredOutput as Person\nconsole.log(`Name: ${person.name}`) // \"Jane Doe\"\nconsole.log(`Age: ${person.age}`) // 28\nconsole.log(`Street: ${person.address.street}`) // \"123 Main St\"\nconsole.log(`City: ${person.address.city}`) // \"New York\"\nconsole.log(`Email: ${person.contacts[0].email}`) // \"jane@example.com\"\n```"
 }
]
```

## How It Works

1.  Define a schema using your language’s schema library
2.  Pass the schema to the agent when invoking it
3.  Access the validated output from the result

The agent converts your schema into a tool specification that guides the language model to produce correctly formatted responses, then validates the output automatically.

## Learn More

For more details, see the [Structured Output documentation](lc:user-guide/concepts/agents/structured-output).
