#!/usr/bin/env python3
"""
build_av_topics.py — emit public/data/av-topics.json, the topic tree that the
Explore Concepts galaxy renders alongside the learning paths.

Reads the year indexes that build_av_archive.py already wrote (public/data/
av-<year>.json) rather than the 8 GB corpus, so it runs in under a second and
can be re-run on its own. build_av_archive.py calls build() at the end of its
run, so the two stay in sync without a second corpus pass.

Why a curated taxonomy instead of "top N categories": the corpus carries 198
category labels, and the most frequent ones are not topics at all — `Beginner`
(4,104), `Advanced` (1,609) and `Listicle` (658) are difficulty and format
facets. Ranking by count alone would fill the galaxy with those. CLUSTERS below
lists only the labels that name a subject, grouped into the constellations the
galaxy draws at depth 1. Anything unlisted is deliberately absent.

Output (~90 KB):

    {"version":1, "generated":..., "total":8632,
     "clusters":[{"id","label","color","n",
                  "topics":[{"id","label","n","y",
                             "posts":[{"s":slug,"t":title}]}]}]}

`y` is the year holding the most posts for that topic — the year the blog page
opens on when a topic node is clicked.
"""
import argparse
import glob
import json
import os
import re
import time
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(os.path.dirname(HERE), "public", "data")

#: Depth-1 constellations, in draw order. Members are the exact humanized
#: labels emitted by build_av_archive.humanize(); within a cluster they are
#: ordered by post count at build time, not by their order here. A label
#: appearing in two clusters is kept by the first one that claims it.
CLUSTERS = [
    ("genai", "Generative AI", "#a78bfa", [
        "Generative AI", "LLMs", "Large Language Models", "Generative AI Application",
        "ChatGPT", "AI Agent", "AI Tools", "Chatbot", "RAG", "Prompt Engineering",
        "Conversational AI", "Langchain", "Diffusion Models", "Stable Diffusion",
        "Vector Database", "Foundation Models", "Supertools", "Meta AI", "Midjourney",
        "Autogpt", "Bard", "Llmops", "RLHF", "Reinforcement Learning From Human Feedback",
    ]),
    ("ml", "Machine Learning", "#4ade80", [
        "Machine Learning", "Classification", "Algorithm", "Supervised", "Regression",
        "Unsupervised", "Model Deployment", "Time Series", "Time Series Forecasting",
        "Clustering", "Reinforcement Learning", "Recommendation", "Automl",
        "Semi Supervised", "Bias And Variance", "Ranking", "Core ML",
    ]),
    ("dl", "Deep Learning & Vision", "#22d3ee", [
        "Deep Learning", "Computer Vision", "Image", "Image Analysis", "Object Detection",
        "PyTorch", "Autoencoder", "Opencv", "GANS", "Attention Models", "Pose Estimation",
        "Image Gradient",
    ]),
    ("nlp", "Language & Speech", "#f472b6", [
        "NLP", "Text", "Sentiment Analysis", "BERT", "Word Embeddings", "Transformers",
        "Transformer Models", "Transformer Package", "Topic Modeling", "Sequence Modeling",
        "Audio", "Audio Processing", "Sound Processing",
    ]),
    ("data_eng", "Data Engineering", "#fbbf24", [
        "Data Engineering", "Big Data", "Database", "SQL", "Cloud Computing", "AWS",
        "Spark", "MLOps", "Data Warehouse", "Azure", "Hadoop", "NoSQL", "Docker",
        "Mongodb", "Kubernetes", "Airflow", "Pig", "Azureml", "Linux", "Command Line",
    ]),
    ("analytics", "Analytics & BI", "#fb923c", [
        "Data Visualization", "Business Analytics", "Data Exploration", "Data Analysis",
        "Business Intelligence", "Excel", "Tableau", "Power BI", "Qlikview", "Data Mining",
        "Web Analytics", "Structured Thinking", "Digital Marketing", "Knime", "D3 Js",
        "Infographics", "Infographic",
    ]),
    ("programming", "Programming", "#60a5fa", [
        "Python", "R", "Programming", "Libraries", "GitHub", "Streamlit", "SAS",
        "Julia", "JavaScript", "Swift", "C", "Datetime",
    ]),
    ("maths", "Maths & Statistics", "#2dd4bf", [
        "Statistics", "Maths", "Probability", "Graphs Networks", "Graph Theory",
    ]),
    ("career", "Career & Interviews", "#fb7185", [
        "Interview Questions", "Career", "Interviews", "Learning Path", "Job Roles",
        "Profile Building", "Courses", "Books", "Skilltest", "Kaggle", "Research Paper",
        "Leadership", "Consulting",
    ]),
    # Deliberately last: `Artificial Intelligence` and `Data Science` are broad
    # enough to swallow posts that a narrower cluster describes better, and the
    # assignment below breaks ties by cluster order.
    ("applied", "AI & Applications", "#c084fc", [
        "Artificial Intelligence", "Data Science", "Blockchain", "Healthcare",
        "Education", "Technology", "Cyber Security", "Web 3", "IoT", "Robotics",
        "Automobiles", "Banking", "Cryptocurrency", "Stock Trading", "Retail",
        "E Commerce", "Telecom", "Agriculture", "Sports", "Entertainment",
    ]),
]

MAX_TOPICS_PER_CLUSTER = 8   # keeps the depth-2 ring readable
MIN_TOPIC_POSTS = 25         # below this a topic is noise, not a constellation
MAX_POSTS_PER_TOPIC = 6      # ~430 article nodes total, toggleable in the galaxy


def slugify(label):
    return re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")


def build(data_dir=DATA):
    """
    Read the year indexes and write both topic files. Returns (sample, full).

    av-topics.json      the tree plus MAX_POSTS_PER_TOPIC samples, always loaded
    av-topics-all.json  every article, fetched only when "ALL" is switched on
    """
    owner = {}          # label -> cluster index, first cluster to claim it wins
    for order, (_cluster_id, _label, _color, members) in enumerate(CLUSTERS):
        for member in members:
            owner.setdefault(member, order)

    # label -> {"n": count, "years": Counter}
    stats = defaultdict(lambda: {"n": 0, "years": Counter()})
    # (slug, title, [mapped labels]) for every post, in no particular order
    catalog = []
    total = 0

    for path in sorted(glob.glob(os.path.join(data_dir, "av-2*.json"))):
        with open(path, encoding="utf-8") as fh:
            year_data = json.load(fh)
        labels = year_data.get("categories", [])
        year = str(year_data.get("y", ""))
        posts = year_data.get("posts", [])
        total += len(posts)
        for post in posts:
            mapped = []
            for index in post.get("c", []):
                if index >= len(labels):
                    continue
                label = labels[index]
                if label not in owner:
                    continue
                mapped.append(label)
                stats[label]["n"] += 1
                stats[label]["years"][year] += 1
            catalog.append((post["s"], post["t"], mapped))

    # Which topics become nodes. Everything downstream is keyed off this set, so
    # both files describe exactly the same tree.
    chosen = {}         # label -> (cluster_id, order)
    clusters = []
    for order, (cluster_id, cluster_label, color, members) in enumerate(CLUSTERS):
        picked = sorted(
            ((label, stats[label]) for label in members
             if label in stats and stats[label]["n"] >= MIN_TOPIC_POSTS),
            key=lambda item: item[1]["n"],
            reverse=True,
        )[:MAX_TOPICS_PER_CLUSTER]
        if not picked:
            continue
        for label, _bucket in picked:
            chosen[label] = (cluster_id, order)
        clusters.append({
            "id": cluster_id,
            "label": cluster_label,
            "color": color,
            "n": sum(bucket["n"] for _label, bucket in picked),
            "topics": [
                {"id": slugify(label), "label": label, "n": bucket["n"],
                 "y": bucket["years"].most_common(1)[0][0], "posts": []}
                for label, bucket in picked
            ],
        })

    # Each article hangs off exactly one topic, or the tree would carry 21,635
    # nodes for 8,632 posts. The rarest matching topic wins: the most specific
    # label is the most informative place to find a post, and it keeps the broad
    # topics from swallowing everything (no topic ends up above ~370 articles).
    # Ties go to the earlier cluster, then to the alphabetically earlier label,
    # so the assignment is stable across rebuilds.
    def rank(label):
        return (stats[label]["n"], chosen[label][1], label)

    by_topic = defaultdict(list)
    unassigned = 0
    for slug, title, mapped in catalog:
        candidates = [label for label in mapped if label in chosen]
        if not candidates:
            unassigned += 1
            continue
        by_topic[min(candidates, key=rank)].append((slug, title))

    generated = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    full_clusters = []
    for cluster in clusters:
        full_topics = []
        for topic in cluster["topics"]:
            # Slugs start with `YYYY-MM-`, so a plain reverse sort is newest first.
            newest = sorted(by_topic.get(topic["label"], []), reverse=True)
            topic["posts"] = [{"s": slug, "t": title}
                              for slug, title in newest[:MAX_POSTS_PER_TOPIC]]
            topic["all"] = len(newest)
            full_topics.append({"id": topic["id"],
                                "posts": [[slug, title] for slug, title in newest]})
        full_clusters.append({"id": cluster["id"], "topics": full_topics})

    sample = {"version": 1, "generated": generated, "total": total,
              "assigned": total - unassigned, "clusters": clusters}
    full = {"version": 1, "generated": generated, "total": total,
            "assigned": total - unassigned, "clusters": full_clusters}

    os.makedirs(data_dir, exist_ok=True)
    for name, payload in (("av-topics.json", sample), ("av-topics-all.json", full)):
        with open(os.path.join(data_dir, name), "w", encoding="utf-8") as fh:
            json.dump(payload, fh, separators=(",", ":"), ensure_ascii=False)
    return sample, full


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default=DATA)
    args = ap.parse_args()

    sample, full = build(args.data)
    topics = sum(len(c["topics"]) for c in sample["clusters"])
    base = len(sample["clusters"]) + topics

    for name, payload, articles in (
        ("av-topics.json", sample,
         sum(len(t["posts"]) for c in sample["clusters"] for t in c["topics"])),
        ("av-topics-all.json", full,
         sum(len(t["posts"]) for c in full["clusters"] for t in c["topics"])),
    ):
        size = os.path.getsize(os.path.join(args.data, name))
        print(f"{name:20s} {len(payload['clusters'])} clusters, {topics} topics, "
              f"{articles} articles -> {base + articles} galaxy nodes, {size / 1024:.0f} KB")

    missed = sample["total"] - sample["assigned"]
    print(f"\n{sample['assigned']}/{sample['total']} posts placed "
          f"({100 * sample['assigned'] / sample['total']:.1f}%); {missed} carry no "
          f"subject category and are reachable only from the blog page")
    for cluster in sample["clusters"]:
        names = ", ".join(f"{t['label']} ({t['all']})" for t in cluster["topics"])
        print(f"  {cluster['label']}: {names}")


if __name__ == "__main__":
    main()
