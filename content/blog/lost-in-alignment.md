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

Let us first stop calling this "word alignment" for a moment. This term comes with a baggage of expectations. It is not. It is just a **DICTIONARY EXTRACTION** problem.

So you have two texts in different languages. You suspect they're translations of each other. You need to know: which word in Language A corresponds to which word in Language B?

For high-resource pairs like English-French, this is a solved problem in the sense that we have enough data to hide the absurdity. But for low-resource languages—like Kangri, with its 2 million speakers and pre-digital corpus that is not represented digitally laughs at you. It demands hundreds of thousands of sentence pairs to converge. You have ten thousand. You're not building a statistical model; you're performing a interlanguage dictionary extraction miracle.

Even neural machine translation hasn't killed the need for explicit alignment. Attention mechanisms give us soft alignments, sure, but try extracting a bilingual dictionary from attention weights. It's like leaving that to the gods of attention.

For terminology constraints, attention supervision, and actual interpretability, you still need sparse, discrete word pairs. You need to know that "cat" = "बिल्ली," not that token 47 has a 0.23 attention weight to token 92. Althought the working is kind of similar as we are finding similarity between words in different languages using their embeddings in the same space.

## The "Embeddings as an Oracle" Insight

```
Oracle is defined as a source of information or a person who has a lot of knowledge about a subject.
```

Here is the conceptual idea this is the basis of this work: 

- **Traditional Approach**: Use parallel data to learn that words are related.
- **Our Approach**: Query pretrained embeddings that already know which words are related.

<!-- dropdown -->

<details>
  <summary>If you want to understand what are embeddings</summary>

  While traditional models like GIZA++ require massive amounts of parallel data to "learn" alignments from scratch,
  modern **multilingual embeddings** (like LaBSE) already know the semantic relationships between languages.
  We are simply querying that existing knowledge.

</details>



Now we can think of the traditional approach as a person moving to france and learning the language by living in a french neighborhood for 5 years and then trying to create a dictionary by learning the language, whereas our approach is like having a bilingual person who already did the hard work. 

Here models like LaBSE and mBERT are our bilingual/multilingual friends, they have already mapped over 100 languages into a shared vector space where similar or *semantic equivalent* words literally point in the same direction.

Instead of learning alignment from parallel data, we query alignment from multilingual embeddings that already encode cross-lingual semantics.
The parallel text isn't the teacher anymore—it's just the question we're asking the oracle.

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
