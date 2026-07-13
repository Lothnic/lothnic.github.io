export interface Post {
  slug: string;
  title: string;
  date: string;
  year: string;
  category: string;
  excerpt: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: "vllmini_architecture",
    title: "vllmini: Building a Minimalist PagedAttention and KV Cache Engine",
    date: "2026-01-10",
    year: "2026",
    category: "systems",
    excerpt: "Developing a clean C++/CUDA library for token generation, covering page tables, virtual memory metaphors for GPU allocation, and block size tradeoffs.",
    content: `Memory bandwidth is the primary bottleneck during LLM inference. In the generation phase, the model retrieves the Key-Value (KV) cache of all past tokens at every step to calculate attention weights.

In typical setups, memory allocation for this KV cache is pre-allocated statically for the maximum sequence length, leading to severe fragmentation (known as *internal fragmentation*). **vllmini** is a lightweight engine designed to solve this by bringing virtual memory ideas directly to GPU memory management.

### PagedAttention Metaphor

Rather than allocating contiguous physical memory, vllmini splits the KV cache of a sequence into fixed-size blocks. These blocks are mapped to non-contiguous physical pages on the GPU using a page table:

\`\`\`
Logical Space:  [Block 0] -> [Block 1] -> [Block 2]
                     |            |            |
                     v            v            v
Physical Pages:  [Page 14]    [Page 89]    [Page 3]
\`\`\`

At execution time, the custom CUDA kernel lookup resolves the logical token offset into the physical page offsets on the fly.

### The CUDA Block Kernel

In vllmini, the custom kernel reads from the page table using a 3D lookup (Batch ID, Head ID, Block Offset):

\`\`\`cuda
__global__ void paged_attention_kernel(
    float* __restrict__ out,
    const float* __restrict__ q,
    const float* __restrict__ k_cache,
    const float* __restrict__ v_cache,
    const int* __restrict__ block_tables,
    const int* __restrict__ context_lens,
    const int block_size,
    const int num_heads,
    const int head_size
) {
    // Tiled execution logic for fetching K/V elements from non-contiguous pages
    int tid = threadIdx.x;
    int head_idx = blockIdx.y;
    int batch_idx = blockIdx.x;
    
    // Resolve page locations and compute dot product attention scores...
}
\`\`\`

By decoupling logical memory from physical allocation, vllmini achieves near-zero memory waste, allowing batch sizes to scale up to 4x on resource-constrained devices.
`
  }
];
