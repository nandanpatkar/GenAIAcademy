## When To Use

- Use for dedicated network connectivity from on-premises to AWS.
- Use when predictable bandwidth, private connectivity, or hybrid data transfer is required.
- Use public, private, or transit virtual interfaces depending on the target.

## Core Concepts

- Connections terminate at Direct Connect locations.
- Virtual interfaces provide access to public AWS services, VPCs, or transit gateways.
- BGP and VLAN tagging are required.

## AWS Services And Features

- AWS Direct Connect
- Amazon VPC
- Amazon S3
- Transit Gateway

## Implementation Patterns

- On-prem data center -> Direct Connect -> VPC/private VIF -> private ML data transfer.
- On-prem data source -> public VIF -> public AWS services such as S3 without internet provider path.

## Tradeoffs And Pitfalls

- Direct Connect is not encrypted by default at layer 3; add VPN/MACsec where needed.
- Setup lead time and partner/location availability matter.
- Use Site-to-Site VPN when dedicated connectivity is unnecessary.

## Decision Triggers

- Dedicated private physical connection points to Direct Connect.
- Encrypted tunnel over internet points to Site-to-Site VPN.

## Related Notes

```ex-cards
[{"title": "Define a training job with VPC configuration", "href": "ex:10-security-identity-and-compliance/vpc", "body": ""}, {"title": "Private ML Networking", "href": "ex:10-security-identity-and-compliance/private-ml-networking", "body": ""}, {"title": "S3", "href": "ex:02-data-ingestion-and-storage/s3", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html", "href": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html"}, {"title": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html", "href": "https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01-domain4.html"}]
```
