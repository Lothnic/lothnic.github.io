---
title: "Lost in Alignment: Building a Word-Matching Engine"
date: "2024-12-24"
tag: "NLP / ALIGNMENT"
category: "nlp"
excerpt: "Identifying correspondences between words in different languages: A technical deep dive into word alignment for NMT."
---

## Introduction

In 2019, training an IBM Model 4 alignment system required 72 hours, 4 million parallel sentences, and approximately one graduate student's will to live. Last week, I aligned Hindi and Kangri on my laptop in 8 minutes using a Python script I wrote while I was also going insane waiting for another model to finish training.

The script is ~250 lines. It uses zero training data. It outperforms the 72-hour model.

This is not because I'm a genius but because I do have a lot of free time. It's because we've been solving the wrong problem for this whole time.

### Note on Intellectual Debt

This is not a breakthrough. It's a spiritual implementation of SimAlign by CIS, LMU Munich, with batching and memory management added because I got tired of watching my GPU 
sitting idle while the CPU is going berserk and to add icing on the cake, it also took way longer than it should have. 

## The Dictionary Extraction Problem

Let us first stop calling this "word alignment" for a moment. This term comes with a baggage of expectations. It is not. It is just a **dictionary extraction** problem.

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
