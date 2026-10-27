import FlowFigure from "./FlowFigure";
import { ContextBudget, LoraRank, MemoryWindow, ModelCascade, ReactLoop, TokenSampler } from "./widgets/genai";
import { AnnIndex, Chunker, RerankFusion, SemanticCache, ShardSizing, VectorSpace } from "./widgets/retrieval";
import {
  AutoscaleTarget, BackoffJitter, CircuitBreaker, KinesisShards, LatencyStream, PromptCache,
  QueueBuffer, ThroughputCapacity,
} from "./widgets/performance";
import { DomainWeights, Route53Routing, TrafficShift, WafRate } from "./widgets/delivery";
import { ConfidenceGate, DataQuality, DynamoPartitions, LfFilter, PiiRedact, S3Lifecycle } from "./widgets/data";
import { AlarmEval, DriftMonitor, EvalScorer, FairnessSlices, TraceWaterfall } from "./widgets/quality";
import { GuardrailLab, IamEval } from "./widgets/safety";

/* Every figure a lesson can embed, by the name its ```figure fence uses.
 * scripts/build_aws_genai.py reads the quoted keys below to refuse a lesson
 * that names a figure missing from this map, so keep one key per line. */
const REGISTRY = {
  "flow": FlowFigure,
  "token-sampler": TokenSampler,
  "context-budget": ContextBudget,
  "lora-rank": LoraRank,
  "model-cascade": ModelCascade,
  "memory-window": MemoryWindow,
  "react-loop": ReactLoop,
  "vector-space": VectorSpace,
  "chunker": Chunker,
  "rerank-fusion": RerankFusion,
  "ann-index": AnnIndex,
  "shard-sizing": ShardSizing,
  "semantic-cache": SemanticCache,
  "latency-stream": LatencyStream,
  "prompt-cache": PromptCache,
  "throughput-capacity": ThroughputCapacity,
  "backoff-jitter": BackoffJitter,
  "circuit-breaker": CircuitBreaker,
  "queue-buffer": QueueBuffer,
  "kinesis-shards": KinesisShards,
  "autoscale-target": AutoscaleTarget,
  "traffic-shift": TrafficShift,
  "route53-routing": Route53Routing,
  "waf-rate": WafRate,
  "domain-weights": DomainWeights,
  "data-quality": DataQuality,
  "pii-redact": PiiRedact,
  "dynamo-partitions": DynamoPartitions,
  "s3-lifecycle": S3Lifecycle,
  "lf-filter": LfFilter,
  "confidence-gate": ConfidenceGate,
  "drift-monitor": DriftMonitor,
  "eval-scorer": EvalScorer,
  "fairness-slices": FairnessSlices,
  "alarm-eval": AlarmEval,
  "trace-waterfall": TraceWaterfall,
  "iam-eval": IamEval,
  "guardrail-lab": GuardrailLab,
};

export default REGISTRY;
