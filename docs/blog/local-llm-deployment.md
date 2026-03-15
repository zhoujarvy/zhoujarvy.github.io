---
title: 本地 LLM 部署完全指南
date: 2026-03-15
tags: [AI, LLM, 本地部署, 部署]
category: 技术
---

# 本地 LLM 部署完全指南

本地部署大语言模型（LLM）越来越流行。优势包括：数据隐私、无 API 费用、离线可用、可定制。本文将详细介绍如何在本地部署和优化 LLM。

## 为什么选择本地部署？

### 优势
- **数据隐私**：数据不离开你的设备
- **零 API 费用**：一次部署，无限使用
- **离线可用**：不依赖网络
- **完全控制**：可自定义、微调、量化
- **延迟低**：本地推理，响应快速

### 劣势
- **硬件要求**：需要较好的 GPU
- **模型大小**：本地存储占用
- **推理速度**：可能不如云端服务

## 硬件要求

### 最低配置
- CPU: 8 核以上
- 内存: 16GB
- 存储: 50GB SSD
- GPU: 可选（CPU 推理会很慢）

### 推荐配置
- CPU: 16 核以上
- 内存: 32GB+
- 存储: 100GB+ NVMe SSD
- GPU: NVIDIA RTX 3060+ (12GB+ VRAM)

### 高端配置
- CPU: 32 核以上
- 内存: 64GB+
- 存储: 200GB+ NVMe SSD
- GPU: NVIDIA RTX 4090 (24GB VRAM)

## 模型选择

### 轻量级（适合 CPU / 小 GPU）

| 模型 | 参数 | 推荐用途 |
|------|------|----------|
| Llama-3.2-3B | 3B | 对话、简单任务 |
| Phi-3-mini | 3.8B | 通用、推理 |
| Qwen-2.5-3B | 3B | 中英双语 |

### 中等规模（需要 GPU）

| 模型 | 参数 | 推荐用途 |
|------|------|----------|
| Llama-3.1-8B | 8B | 通用对话 |
| Qwen-2.5-7B | 7B | 中英、代码 |
| Mistral-7B | 7B | 通用、指令跟随 |
| Gemma-2-9B | 9B | 多任务 |

### 大规模（需要大显存）

| 模型 | 参数 | 推荐用途 |
|------|------|----------|
| Llama-3.1-70B | 70B | 高质量生成 |
| Qwen-2.5-72B | 72B | 中英、复杂任务 |
| Mixtral-8x7B | 47B | MoE 架构 |

## 部署框架

### 1. Ollama（最简单）

**特点：**
- 一键安装
- 命令行友好
- 自动量化
- 支持多种模型

**安装：**

```bash
# macOS / Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# 从 ollama.ai 下载安装包
```

**使用：**

```bash
# 拉取模型
ollama pull llama3.2

# 运行聊天
ollama run llama3.2

# API 服务（默认端口 11434）
ollama serve
```

**API 调用：**

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

**Python 集成：**

```python
import ollama

response = ollama.chat(model='llama3.2', messages=[
  {
    'role': 'user',
    'content': 'Why is the sky blue?',
  },
])

print(response['message']['content'])
```

### 2. vLLM（高性能）

**特点：**
- 高吞吐量
- PagedAttention
- 适合生产环境
- 支持多种模型

**安装：**

```bash
pip install vllm
```

**启动服务：**

```bash
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2.5-7B-Instruct \
  --host 0.0.0.0 \
  --port 8000
```

**API 调用：**

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="token-not-required"
)

response = client.chat.completions.create(
    model="Qwen/Qwen2.5-7B-Instruct",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)
```

### 3. Text Generation WebUI（图形界面）

**特点：**
- Web UI
- 支持多种后端
- 可自定义
- 适合交互式使用

**安装：**

```bash
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**启动：**

```bash
python server.py --model Qwen/Qwen2.5-7B-Instruct
```

### 4. LocalAI（OpenAI 兼容）

**特点：**
- OpenAI API 兼容
- 支持多种模型
- 易于集成
- 适合替代 OpenAI

**安装：**

```bash
# Docker
docker run -p 8080:8080 \
  -v /path/to/models:/models \
  localai/localai:latest

# 或下载二进制文件
wget https://github.com/mudler/LocalAI/releases/download/v2.x.x/localai-linux
chmod +x localai-linux
```

**配置：**

```yaml
# models/qwen.yaml
name: qwen
backend: llama-cpp
parameters:
  model: qwen-7b-instruct.Q4_K_M.gguf
  context_size: 4096
```

## 量化技术

量化是减少模型大小、提高推理速度的关键技术。

### 常用量化精度

| 精度 | 大小 | 质量 | 速度 |
|------|------|------|------|
| FP16 | 100% | 最好 | 慢 |
| Q8_0 | 60% | 很好 | 较快 |
| Q6_K | 50% | 好 | 快 |
| Q4_K_M | 35% | 可接受 | 很快 |
| Q3_K_S | 25% | 较差 | 最快 |

### 使用 llama.cpp 量化

```bash
# 1. 克隆 llama.cpp
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# 2. 编译
make

# 3. 下载模型（例如 Qwen-7B）
python download-gguf-model.py Qwen/Qwen2.5-7B-Instruct

# 4. 量化（从 FP16 到 Q4_K_M）
./quantize qwen-7b-f16.gguf qwen-7b-q4_k_m.gguf Q4_K_M

# 5. 运行
./main -m qwen-7b-q4_k_m.gguf \
  -p "Hello, how are you?" \
  -n 256 \
  --color
```

## 性能优化

### 1. 模型量化

选择合适的量化级别：
- GPU 显存 >= 12GB: Q4_K_M 或 Q5_K_M
- GPU 显存 < 12GB: Q3_K_S 或 Q4_K_S
- CPU 推理: Q3_K_S 或更低

### 2. 批处理

```python
# vLLM 支持批处理
from vllm import LLM, SamplingParams

llm = LLM(
    model="Qwen/Qwen2.5-7B-Instruct",
    tensor_parallel_size=1  # GPU 数量
)

prompts = [
    "Hello, my name is",
    "The capital of France is",
    "The future of AI is"
]

sampling_params = SamplingParams(temperature=0.7, max_tokens=100)

outputs = llm.generate(prompts, sampling_params)
```

### 3. KV Cache 缓存

```python
# vLLM 自动管理 KV Cache
llm = LLM(
    model="Qwen/Qwen2.5-7B-Instruct",
    gpu_memory_utilization=0.9,  # GPU 内存利用率
    max_model_len=4096,  # 最大上下文长度
    disable_log_stats=True  # 禁用日志统计
)
```

### 4. Flash Attention

```python
pip install flash-attn

# vLLM 会自动使用 Flash Attention
llm = LLM(
    model="Qwen/Qwen2.5-7B-Instruct",
    enforce_eager=False  # 使用 CUDA graph
)
```

## 多模态模型

### LLaVA（视觉 + 语言）

```bash
ollama pull llava
ollama run llava "这张图片里是什么？"
```

### Qwen-VL（多模态）

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="token-not-required"
)

response = client.chat.completions.create(
    model="Qwen/Qwen-VL-Chat",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "描述这张图片"},
                {"type": "image_url", "image_url": "url/to/image.jpg"}
            ]
        }
    ]
)
```

## 微调本地模型

### LoRA 微调

```python
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

# 加载基础模型
model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B-Instruct",
    device_map="auto"
)

# LoRA 配置
lora_config = LoraConfig(
    r=8,  # LoRA 秩
    lora_alpha=16,
    lora_dropout=0.1,
    target_modules=["q_proj", "v_proj"],
    task_type="CAUSAL_LM"
)

# 应用 LoRA
model = get_peft_model(model, lora_config)

# 训练（略）
```

## 部署最佳实践

### 1. 容器化

```dockerfile
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

WORKDIR /app

# 安装依赖
RUN pip install vllm torch

# 复制模型
COPY models /models

# 暴露端口
EXPOSE 8000

# 启动服务
CMD ["python", "-m", "vllm.entrypoints.openai.api_server", \
     "--model", "/models/Qwen2.5-7B-Instruct", \
     "--host", "0.0.0.0", "--port", "8000"]
```

### 2. 负载均衡

```bash
# 使用 Nginx
upstream vllm_backend {
    server localhost:8000;
    server localhost:8001;
    server localhost:8002;
}

server {
    listen 80;
    location / {
        proxy_pass http://vllm_backend;
    }
}
```

### 3. 监控

```python
from prometheus_client import start_http_server, Counter

request_counter = Counter('llm_requests', 'Total requests')

start_http_server(8001)

# 每次请求
request_counter.inc()
```

## 常见问题

### Q: CPU 推理太慢怎么办？

A:
1. 使用量化模型（Q3_K_S 或更低）
2. 减少上下文长度
3. 使用更小的模型（3B）

### Q: GPU 显存不足？

A:
1. 量化模型（Q4_K_M 或更低）
2. 减少 `max_model_len`
3. 使用更小的模型

### Q: 如何选择模型？

A:
- 对话：Llama-3.1-8B, Qwen-2.5-7B
- 代码：Qwen-2.5-7B, CodeLlama
- 中文：Qwen-2.5 系列, Yi 系列
- 低资源：Phi-3-mini, Llama-3.2-3B

### Q: 如何加速推理？

A:
1. 使用 vLLM 而不是 llama.cpp（如果有 GPU）
2. 量化模型
3. 批处理
4. KV Cache

## 学习资源

- [Ollama 官方文档](https://ollama.ai/docs)
- [vLLM 文档](https://vllm.readthedocs.io)
- [llama.cpp GitHub](https://github.com/ggerganov/llama.cpp)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers)

## 总结

本地部署 LLM 不再遥不可及。选择合适的模型和框架，你就可以在自己的机器上运行强大的 AI 助手。

建议从 **Ollama** 开始，它最简单易用。如果有性能需求，再考虑 **vLLM**。

Happy coding! 🚀
