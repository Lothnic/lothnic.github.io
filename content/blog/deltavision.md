---
title: "DeltaVision: Visual Difference Engine with ConvLSTM"
date: "2025-02-02"
tag: "CV / PYTORCH"
category: "cv"
excerpt: "Implementing a convolutional feature extractor with a temporal module for high-speed industrial inspection."
---

## The Problem

Industrial inspection systems need to detect minute defects at high speed. Traditional image differencing fails when:

- Lighting conditions vary
- Camera position shifts slightly
- Products have natural variation

## Our Solution: DeltaVision

We built a ConvLSTM-based system that learns what "normal" looks like over time, making it robust to environmental changes.

## Architecture

```
Input Frames → ResNet18 Encoder → ConvLSTM → Anomaly Decoder → Difference Map
```

### Feature Extraction

We use a pre-trained ResNet18 as our backbone, extracting features at multiple scales:

```python
class FeatureExtractor(nn.Module):
    def __init__(self):
        super().__init__()
        resnet = models.resnet18(pretrained=True)
        self.layer1 = nn.Sequential(*list(resnet.children())[:5])
        self.layer2 = nn.Sequential(*list(resnet.children())[5:6])
        
    def forward(self, x):
        f1 = self.layer1(x)
        f2 = self.layer2(f1)
        return f1, f2
```

### Temporal Modeling

The ConvLSTM cell maintains a hidden state that captures temporal patterns:

```python
class ConvLSTMCell(nn.Module):
    def __init__(self, input_dim, hidden_dim, kernel_size):
        super().__init__()
        self.hidden_dim = hidden_dim
        padding = kernel_size // 2
        
        self.conv = nn.Conv2d(
            input_dim + hidden_dim, 
            4 * hidden_dim, 
            kernel_size, 
            padding=padding
        )
```

## Results

| Metric | Traditional | DeltaVision |
|--------|-------------|-------------|
| Precision | 78% | 94% |
| Recall | 82% | 91% |
| FPS | 30 | 45 |

## Deployment

The model runs on edge devices using TensorRT optimization, achieving 45 FPS on an NVIDIA Jetson Xavier.
