export interface Project {
  slug: string;
  number: string;
  title: string;
  techStack: string;
  description: string;
  image: string;
  summary: string;
  lessons: string[];
  nextSteps: string[];
}

export const projects: Project[] = [
  {
    slug: "vllmini",
    number: "1",
    title: "vLLMini",
    techStack: "Python / PyTorch / CUDA",
    description:
      "A lightweight LLM inference engine built from scratch in PyTorch. Supports Llama, Qwen, and Mistral models with 4-bit NF4 quantization (bitsandbytes), FlashAttention-2, and stateless sampling.",
    image: "/images/desktop/feature-connect.webp",
    summary:
      "A minimal inference stack for understanding how modern LLM serving systems handle model loading, quantization, attention, and token sampling.",
    lessons: [
      "How KV cache layout affects generation speed and memory pressure.",
      "Why quantization choices are a systems tradeoff, not just a model-quality setting.",
      "How much complexity hides behind a clean sampling API.",
    ],
    nextSteps: [
      "Write a deeper note on paged attention and cache allocation.",
      "Add benchmarks across batch size, context length, and quantization mode.",
    ],
  },
  {
    slug: "conflux",
    number: "2",
    title: "Conflux",
    techStack: "FastAPI / Next.js / ML",
    description:
      "A civic-tech AI platform that transforms multilingual citizen reports from public feeds and APIs into geospatially-aware infrastructure proposals using sentence embeddings, HDBSCAN, and LLM agents.",
    image: "/images/desktop/feature-memory.webp",
    summary:
      "A civic intelligence workflow for turning noisy multilingual public reports into clustered, location-aware infrastructure proposals.",
    lessons: [
      "How clustering quality depends on data normalization before embeddings.",
      "Why civic AI tools need explainable outputs more than flashy automation.",
      "How geospatial context changes the shape of ranking and summarization.",
    ],
    nextSteps: [
      "Document the report ingestion and clustering pipeline.",
      "Add examples of proposal generation from real issue clusters.",
    ],
  },
  {
    slug: "vectoralign",
    number: "3",
    title: "VectorAlign",
    techStack: "Python / PyTorch / NLP",
    description:
      "A high-precision word-matching engine for low-resource translation. Uses multilingual sentence and token embeddings to perform mutual-consent token alignment and extract bilingual dictionaries.",
    image: "/images/desktop/feature-automation.webp",
    summary:
      "A low-resource translation support tool focused on extracting reliable bilingual alignments from multilingual embedding spaces.",
    lessons: [
      "Why mutual-consent matching improves precision for noisy token alignments.",
      "How embedding models behave differently across low-resource language pairs.",
      "Where dictionary extraction breaks down without domain-specific examples.",
    ],
    nextSteps: [
      "Write up the alignment scoring method.",
      "Add visual examples of successful and failed token matches.",
    ],
  },
  {
    slug: "floatchat",
    number: "4",
    title: "FloatChat",
    techStack: "LangChain / FastAPI / RAG",
    description:
      "AI-powered data platform for oceanographic NetCDF datasets. Leverages a RAG architecture to support natural language-to-SQL query generation across 580+ NetCDF profiles.",
    image: "/images/desktop/feature-tasks.webp",
    summary:
      "A natural-language interface for exploring structured oceanographic data without manually writing SQL or parsing NetCDF metadata.",
    lessons: [
      "Why scientific datasets need careful schema grounding before LLM query generation.",
      "How retrieval context can reduce invalid SQL in domain-specific tools.",
      "Where user trust depends on showing the generated query and data path.",
    ],
    nextSteps: [
      "Document the RAG-to-SQL flow.",
      "Add screenshots and examples from representative NetCDF profiles.",
    ],
  },
  {
    slug: "lingo",
    number: "5",
    title: "LINGO",
    techStack: "PyTorch / OpenNMT / Modal",
    description:
      "The first installable Kangri-Hindi machine translation package for Argos Translate. Trained a 6-layer Transformer from scratch on 26,779 parallel pairs and deployed using CTranslate2.",
    image: "/images/desktop/feature-browse.webp",
    summary:
      "A focused machine translation project for Kangri-Hindi that moves from dataset preparation through training and installable deployment.",
    lessons: [
      "How data cleaning matters more than architecture changes for small parallel corpora.",
      "Why deployment format affects whether an MT model is actually usable.",
      "Where evaluation becomes difficult for regional and low-resource languages.",
    ],
    nextSteps: [
      "Write a training-data and evaluation breakdown.",
      "Add examples comparing model output before and after cleanup.",
    ],
  },
  {
    slug: "deltavision",
    number: "6",
    title: "DeltaVision",
    techStack: "Python / OpenCV / PyTorch",
    description:
      "An AI-powered visual inspection system with 90% faster quality analysis. Combines a convolutional feature extractor with a ConvLSTM temporal module and Streamlit feedback loop.",
    image: "/images/desktop/feature-sandbox.webp",
    summary:
      "A visual inspection prototype combining computer vision, temporal modeling, and a fast feedback UI for quality analysis.",
    lessons: [
      "How temporal context improves defect detection compared with frame-only checks.",
      "Why inspection systems need human feedback loops for ambiguous cases.",
      "How preprocessing choices affect both speed and false positive rates.",
    ],
    nextSteps: [
      "Document the ConvLSTM pipeline.",
      "Add before-and-after examples for defect classifications.",
    ],
  },
];
