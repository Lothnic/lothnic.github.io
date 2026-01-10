---
title: "Lost in Alignment: Building a Word-Matching Engine"
date: "2024-12-24"
tag: "NLP / ALIGNMENT"
category: "nlp"
excerpt: "Identifying correspondences between words in different languages: A technical deep dive into word alignment for NMT."
---

## Introduction

Word alignment is the task of identifying which words in a source sentence correspond to which words in a target sentence. While modern Transformers handle this implicitly through attention, explicit alignment is still crucial for tasks like terminology constraint enforcement and dictionary extraction.

## The Architecture

Our approach utilizes a 6-layer Transformer trained on parallel corpora. We extract alignment by analyzing the cross-attention weights between the encoder and decoder. By averaging attention heads and applying a threshold, we can produce high-quality sparse alignment matrices.

## Implementation Details

The system was built using `OpenNMT-py` and optimized with `CTranslate2` for inference. We used `SentencePiece` for subword tokenization, which significantly improved alignment quality for morphologically rich languages like Kangri.

### Key Components

1. **Tokenization Pipeline**: SentencePiece with BPE
2. **Model Architecture**: 6-layer Transformer with 8 attention heads
3. **Training Data**: 100k+ parallel sentences
4. **Inference**: CTranslate2 for 3x speedup

## Results

The alignment system achieved 85% precision on our test set, outperforming statistical methods like GIZA++ by a significant margin.

```python
from alignment import WordAligner

aligner = WordAligner("model.pt")
source = "The cat sat on the mat"
target = "बिल्ली चटाई पर बैठी"

alignments = aligner.align(source, target)
print(alignments)
# [(0, 0), (1, 0), (2, 3), (4, 2), (5, 1)]
```

## Conclusion

Explicit word alignment remains valuable even in the age of attention-based models. Our system provides interpretable, sparse alignments that can be used for downstream NLP tasks.
