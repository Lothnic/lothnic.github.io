---
title: "FloatChat: Scaling RAG for Oceanographic Data"
date: "2025-01-15"
tag: "RAG / LLM"
category: "llm"
excerpt: "How we processed 580+ NetCDF files with a RAG architecture for natural language-to-SQL query generation."
---

## Overview

FloatChat is a Retrieval-Augmented Generation system designed to make oceanographic data accessible through natural language queries. The system processes over 580 NetCDF files containing Argo float measurements.

## Architecture

The system consists of three main components:

1. **Data Ingestion Layer**: Parses NetCDF files and extracts metadata
2. **Vector Store**: Embeddings stored in ChromaDB for semantic search
3. **Query Engine**: LLM-powered SQL generation from natural language

## Technical Challenges

### Handling Large NetCDF Files

NetCDF files can be massive. We implemented chunked reading:

```python
import xarray as xr

def process_netcdf(filepath, chunk_size=1000):
    ds = xr.open_dataset(filepath, chunks={'time': chunk_size})
    for chunk in ds.groupby_bins('time', chunk_size):
        yield process_chunk(chunk)
```

### Semantic Search Optimization

We fine-tuned our embedding model on oceanographic terminology to improve retrieval accuracy by 40%.

## Results

- **Query Response Time**: < 2 seconds average
- **Accuracy**: 92% on test queries
- **Data Coverage**: 580+ NetCDF files, 10M+ measurements
