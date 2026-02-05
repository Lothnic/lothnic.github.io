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

This is not a breakthrough. It's a spiritual implementation of [SimAlign](https://github.com/cisnlp/simalign) by [Jalili Sabet et al., CIS LMU Munich](https://arxiv.org/abs/2004.08728), with batching and memory management added because I got tired of watching my GPU sitting idle while the CPU is going berserk and—to add icing on the cake—it also took way longer than it should have.

## The Dictionary Extraction Problem

Let us first stop calling this "word alignment" for a moment. That term comes with baggage—statistical MT, IBM Models, GIZA++ screaming about memory leaks at 3 AM. Instead, let's call it what it actually is: **The Dictionary Extraction Problem**.

So you have two texts in different languages. You suspect they're translations of each other. You need to know: which word in Language A corresponds to which word in Language B?

For high-resource pairs like English-French, this is a "solved problem" in the sense that we have enough data to hide the absurdity. But for low-resource languages—like Kangri, with its 2 million speakers and pre-digital corpus that barely exists in Unicode—GIZA++ laughs at you. It demands hundreds of thousands of sentence pairs to converge. You have ten thousand. You're not building a statistical model; you're performing linguistic alchemy: turning 10,000 sentences into a bilingual dictionary through sheer computational will.

Even neural machine translation hasn't killed the need for explicit alignment. Attention mechanisms give us soft alignments, sure, but try extracting a bilingual dictionary from attention weights. It's like reading tea leaves, if the tea leaves were 512-dimensional and constantly shifting. For terminology constraints, attention supervision, and actual interpretability, you still need sparse, discrete word pairs. You need to know that "cat" = "बिल्ली," not that token 47 has a 0.23 attention weight to token 92.

## The "Embeddings as an Oracle" Insight

> **Oracle** (noun): A source of information or a person who has a lot of knowledge about a subject.

Here is the conceptual inversion that changes everything:

- **Traditional approach:** Use parallel data to *learn* that words are related.
- **Our approach:** Query pre-trained embeddings that *already* know words are related.

<details>
  <summary><b>What are embeddings?</b> <i>(Click for more info)</i></summary>
  
  To understand embeddings we need to understand tokenization first.
  
  Unlike humans, computers only understand numbers—so we need to convert strings or words into numbers. This process is called **tokenization**.
  
  There are several methods of tokenization, but that is not the point of this discussion. 
  
  Usually we convert these sentences and words into arrays of numbers or *tensors*, which can be represented in a higher dimensional space as vectors or points in the embedding space.
  
  Imagine you have a dictionary, but instead of words, it contains **vectors** (long lists of numbers).
  
  If two words are semantically similar (like "cat" and "dog"), their vectors will be mathematically close in this space.
  If they are unrelated (like "cat" and "democracy"), their vectors will be far apart.
  
  **Multilingual embeddings** (like LaBSE) are special because they map words from **different languages** into the same vector space.
  This means "cat" (English) and "बिल्ली" (Hindi) will be very close together if the model understands they mean the same thing.

</details>

<br>

We can think of the traditional approach as a person moving to France and learning the language by living in a French neighborhood for 5 years, then trying to create a dictionary. Our approach is like having a bilingual friend who already did the hard work.

Models like LaBSE and mBERT are our bilingual (or multilingual) friends. They've already mapped over 100 languages into a shared vector space where similar or *semantically equivalent* words literally point in the same direction.

Instead of learning alignment from parallel data, we query alignment from multilingual embeddings that already encode cross-lingual semantics.

The parallel text isn't the teacher anymore—it's just the question we're asking the oracle.

## Technical Deep Dive: The Bouncer and The Dance Floor

VectorAlign operates on two levels, which I think of as security at a badly-lit nightclub.

### Sentence Level (The Bouncer)

We extract `pooler_output`—the sentence embedding—and check if these two sentences are even speaking the same semantic language. We compute cosine similarity; if it's below 0.5, we reject them at the door.

This matters because low-resource corpora are messy. Your "parallel" Hindi-Kangri text might be 20% misaligned due to OCR errors, verse numbering mismatches, or the fact that one file is the Book of Matthew and the other is a footnote about wheat cultivation. The bouncer prevents us from computing expensive token alignments for noise.

### Token Level (The Dance Floor)

If the bouncer lets them in, we extract `last_hidden_state` and let the tokens mingle. Here's where we get clever. Instead of computing cosine similarity in nested Python loops (computational hell), we L2-normalize the vectors and perform a single matrix multiplication:

```python
# When vectors are L2-normalized: dot product == cosine similarity
src_norm = F.normalize(src_tokens, dim=-1)  # [seq_len, 768]
tgt_norm = F.normalize(tgt_tokens, dim=-1)  # [seq_len, 768]

# One BLAS operation replaces O(n²) Python loops
sim_matrix = torch.matmul(src_norm, tgt_norm.T)  # [src_len, tgt_len]
```

For a 20×20 token matrix, this turns 400 Python function calls into one GPU kernel. When you're processing the entire Hindi Bible to extract a Kangri dictionary, that matters.

### Mutual Consent Alignment

Early word alignment used forward argmax: for each source token, find the best target match. This is the algorithmic equivalent of unrequited love—Hindi says "I choose you," but Kangri might be looking elsewhere.

Instead, we use bidirectional argmax intersection. We compute best matches both ways—source-to-target and target-to-source. A link only survives if both directions agree it's optimal.

```python
# Forward: each source token picks its best target
forward = [(i, torch.argmax(sim_matrix[i]).item()) for i in range(src_len)]

# Backward: each target token picks its best source  
backward = [(torch.argmax(sim_matrix[:, j]).item(), j) for j in range(tgt_len)]

# Intersection: only mutual consent survives
alignment = set(forward) & set(backward)
```

This produces fewer but happier marriages—ideal for dictionary construction where one confident alignment ("playing", "खेलना") beats ten hallucinated ones.

## Subword Archaeology: Reassembling Humpty Dumpty

Transformers don't see words; they see WordPiece confetti. "Playing" becomes ["play", "##ing"]. When we extract alignments at the token level, we're looking at fragments.

This requires subword archaeology: we strip the ## prefixes and merge contiguous tokens that align to the same target word.

```
Raw alignment:  [("play", "खेल"), ("##ing", "खेल"), ("field", "मैदान")]
After merge:    [("playing", "खेल"), ("field", "मैदान")]
```

We're doing forensic linguistics on the tokenizer's crime scene, trying to prove that these scattered pieces were once a single word. It's messy, empirically adequate, and slightly depressing if you care about morphology.

## Fighting PyTorch's Memory Greed
The algorithm is elegant; the implementation is guerilla warfare against PyTorch's memory allocator.

Without <mark>torch.no_grad()</mark>, PyTorch builds a computation graph for backpropagation. For inference, this is like renting a warehouse to store air. We disable gradients, immediately <mark>.detach().cpu()</mark> embeddings after extraction, and call torch.cuda.empty_cache() between batches.

The L2-normalization trick is our math hacker moment: by normalizing vectors before multiplication, we turn cosine similarity into a dot product, letting cuBLAS do the heavy lifting.

And we batch aggressively. GPUs are like buses—inefficient when empty, terrifying when full. We process 64 sentence pairs at once on a 12GB card, because the alternative is watching nvidia-smi show 2GB utilization while your CPU sobs in a corner.

## The Low-Resource Superpower
This is where embedding-based alignment becomes existential for languages like Kangri.

Traditional alignment requires parallel data to learn translation equivalents. It's a chicken-and-egg problem: you need aligned data to train the aligner, but you need the aligner to build the dictionary that lets you bootstrap aligned data.

We break the cycle. We use LaBSE, which learned Hindi semantics from millions of sentences, and ask it to transfer that knowledge to Kangri via our small parallel corpus. The embeddings are the universal donor; the parallel text is just the IV tube.

The result is a virtuous cycle: 85% precision alignments → seed dictionary → better MT system → more parallel data → better alignments. It's the linguistic equivalent of turning a lemonade stand into a franchise using only YouTube tutorials.

## Results: Where the Rubber Meets the Corpus

On 500 held-out Hindi-Kangri sentence pairs (religious texts, the only game in town):


| System | Precision | Recall | Time |
|--------|-----------|--------|------|
| GIZA++ | 71% | 58% | 4 hours |
| VectorAlign | 85% | 62% | 8 minutes |

The 14-point precision gain comes from mutual consent alignment—we simply refuse to hallucinate. The recall gap is the cost of that precision, and for dictionary induction, it's worth it.

The failure mode: Both systems struggle with Kangri postpositions. Hindi "में" (in) maps to Kangri "ऊँ" or "अंदर" depending on context, but the embedding space collapses these. This isn't an alignment problem; it's a representation ceiling. When your language has 2 million speakers, even the oracles have gaps in their knowledge.

## Conclusion
Word alignment isn't dead; it's just no longer a machine learning problem. For high-resource pairs, neural MT made alignment irrelevant. For low-resource pairs like Hindi-Kangri, it remains the only way to build dictionaries from scratch.

The shift from training IBM models to querying LaBSE represents a broader trend in NLP: the move from learning representations to leveraging them. We spent a decade teaching machines what words mean. Now we spend our time asking the right questions of machines that already know.
VectorAlign is one such question. The answer is 85% accurate and takes eight minutes.

### Installation for the impatient

```bash
pip install vectoralign
```