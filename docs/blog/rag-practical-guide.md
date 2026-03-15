---
title: RAG 实战：构建智能知识库问答系统
date: 2026-03-15
tags: [AI, RAG, LLM, 向量数据库]
category: 技术
---

# RAG 实战：构建智能知识库问答系统

RAG（Retrieval-Augmented Generation，检索增强生成）是当前 AI 应用最热门的技术之一。它解决了 LLM 知识截止和幻觉问题，让 AI 能够基于你的私有数据回答问题。本文将带你实战构建一个 RAG 系统。

## 什么是 RAG？

RAG = 检索 + 生成

```
用户问题 → 检索相关文档 → 拼接到 Prompt → LLM 生成回答
```

**核心优势：**
- 知识实时更新：不需要重新训练模型
- 减少幻觉：基于真实数据回答
- 领域定制：针对特定业务场景
- 数据隐私：数据不离开你的控制

## 核心组件

### 1. 文档加载器

支持多种格式：
- 文本文件（txt, md, csv）
- 文档（PDF, Word, PowerPoint）
- 网页
- 数据库

```python
from langchain.document_loaders import (
    TextLoader,
    PDFLoader,
    WebBaseLoader,
    NotionDBLoader
)

# 加载文本
loader = TextLoader("docs/intro.md")
docs = loader.load()

# 加载 PDF
pdf_loader = PDFLoader("docs/manual.pdf")
pdf_docs = pdf_loader.load()

# 加载网页
web_loader = WebBaseLoader("https://example.com")
web_docs = web_loader.load()
```

### 2. 文档分割器

将长文档切分为小块：

```python
from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    MarkdownTextSplitter
)

# 按字符分割
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

splits = splitter.split_documents(docs)
```

### 3. 嵌入模型

将文本转换为向量：

```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings import HuggingFaceEmbeddings

# OpenAI Embeddings（需要 API key）
embeddings = OpenAIEmbeddings()

# 开源 Embeddings（本地运行）
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
```

### 4. 向量数据库

存储和检索向量：

**选择：**
- Chroma：简单易用，本地运行
- Pinecone：托管服务，性能好
- Qdrant：开源，功能强大
- Weaviate：混合搜索
- FAISS：Meta 开源，高性能

```python
from langchain.vectorstores import Chroma

# 创建向量库
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 检索
results = vectorstore.similarity_search(
    "如何部署 RAG 系统？",
    k=3  # 返回前 3 个结果
)
```

## 实战项目：企业知识库问答

### 系统架构

```
用户界面
  ↓
RAG 应用
  ↓
向量数据库 (Chroma)
  ↓
LLM (GPT-4o / Claude 3.5)
```

### 代码实现

#### 1. 初始化项目

```bash
mkdir rag-knowledge-base
cd rag-knowledge-base

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install langchain chromadb openai tiktoken
```

#### 2. 配置

```python
# config.py
import os
from dotenv import load_dotenv

load_dotenv()

# LLM 配置
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# 嵌入配置
EMBEDDING_MODEL = "text-embedding-3-small"

# 向量库配置
CHROMA_PERSIST_DIR = "./chroma_db"
CHROMA_COLLECTION_NAME = "knowledge_base"

# RAG 配置
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
TOP_K = 3
```

#### 3. 文档处理

```python
# document_processor.py
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

class DocumentProcessor:
    def __init__(self, config):
        self.config = config
        self.embeddings = OpenAIEmbeddings(
            model=config.EMBEDDING_MODEL
        )
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.CHUNK_SIZE,
            chunk_overlap=config.CHUNK_OVERLAP
        )

    def process_documents(self, documents):
        """分割文档"""
        return self.splitter.split_documents(documents)

    def create_vectorstore(self, documents, persist=True):
        """创建向量存储"""
        splits = self.process_documents(documents)

        vectorstore = Chroma.from_documents(
            documents=splits,
            embedding=self.embeddings,
            persist_directory=self.config.CHROMA_PERSIST_DIR if persist else None,
            collection_name=self.config.CHROMA_COLLECTION_NAME
        )

        return vectorstore
```

#### 4. RAG 查询

```python
# rag_query.py
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate

class RAGQuery:
    def __init__(self, config, vectorstore):
        self.config = config
        self.vectorstore = vectorstore

        self.llm = ChatOpenAI(
            model=config.LLM_MODEL,
            temperature=0.3
        )

        self._setup_chain()

    def _setup_chain(self):
        """设置 RAG 链"""
        prompt = PromptTemplate(
            template="""你是一个专业的知识库助手。
根据以下检索到的文档回答问题。如果文档中没有答案，就说"我没有找到相关信息"。

文档：
{context}

问题：{question}

回答：""",
            input_variables=["context", "question"]
        )

        self.chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(
                search_kwargs={"k": self.config.TOP_K}
            ),
            return_source_documents=True,
            chain_type_kwargs={"prompt": prompt}
        )

    def query(self, question):
        """查询"""
        result = self.chain({"query": question})

        return {
            "answer": result["result"],
            "sources": [
                doc.metadata.get("source", "unknown")
                for doc in result["source_documents"]
            ]
        }
```

#### 5. 主应用

```python
# app.py
from document_processor import DocumentProcessor
from rag_query import RAGQuery
from langchain.document_loaders import TextLoader
import config

def main():
    print("📚 企业知识库问答系统")

    # 加载文档
    print("\n📖 加载文档...")
    loader = TextLoader("docs/company_rules.md")
    docs = loader.load()

    # 处理文档
    print("🔨 处理文档...")
    processor = DocumentProcessor(config)
    vectorstore = processor.create_vectorstore(docs)

    # 初始化查询
    print("✅ 初始化查询系统...")
    rag = RAGQuery(config, vectorstore)

    # 交互循环
    while True:
        question = input("\n❓ 请输入问题（或 'quit' 退出）: ")

        if question.lower() == "quit":
            break

        # 查询
        result = rag.query(question)

        print(f"\n💡 回答: {result['answer']}")
        print(f"📄 来源: {', '.join(result['sources'])}")

if __name__ == "__main__":
    main()
```

## 优化技巧

### 1. 改进检索质量

```python
# 混合检索（向量 + 关键词）
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={
        "k": 5,
        "score_threshold": 0.7
    }
)
```

### 2. 重排序（Rerank）

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereRerank

compressor = CohereRerank(top_n=3)
retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever()
)
```

### 3. 查询扩展

```python
# 生成多个相关查询
related_queries = generate_queries(question)
all_results = []

for q in [question] + related_queries:
    results = vectorstore.similarity_search(q, k=2)
    all_results.extend(results)

# 去重
unique_results = remove_duplicates(all_results)
```

### 4. 缓存

```python
from langchain.cache import RedisCache
from langchain.globals import set_llm_cache

# Redis 缓存
set_llm_cache(RedisCache(redis_url="redis://localhost:6379"))
```

## 部署选项

### 1. 本地部署

```bash
# 使用 Streamlit
pip install streamlit
streamlit run app.py

# 使用 Gradio
pip install gradio
python app.py
```

### 2. 云部署

- **Vercel + Vercel AI SDK**
- **FastAPI + Docker**
- **AWS / GCP / Azure**

### 3. 微服务

将 RAG 组件分离：
- 文档处理服务
- 向量检索服务
- LLM 推理服务

## 成本优化

1. **选择合适的 Embedding 模型**
   - OpenAI: `text-embedding-3-small`（便宜）
   - 开源: `sentence-transformers/all-MiniLM-L6-v2`

2. **缓存常见问题**
   - Redis / SQLite

3. **批量处理**
   - 批量嵌入，减少 API 调用

4. **混合检索**
   - 向量检索 + BM25（关键词）

## 扩展功能

1. **多模态 RAG**
   - 图像检索
   - 音频检索

2. **实时更新**
   - 自动监控文档变化
   - 增量更新向量库

3. **用户反馈**
   - 收集用户反馈
   - 微调检索策略

## 学习资源

- [LangChain RAG 教程](https://langchain.com/docs/use_cases/question_answering)
- [LlamaIndex 文档](https://docs.llamaindex.ai)
- [ChromaDB 文档](https://docs.trychroma.com)

## 总结

RAG 是构建企业级 AI 应用的核心技术。通过本文，你应该能够：

1. 理解 RAG 的核心概念
2. 搭建一个基本的 RAG 系统
3. 优化检索和生成质量
4. 部署到生产环境

下一步，你可以：
- 添加更多文档源
- 实现实时更新
- 构建用户友好的界面

有问题欢迎讨论！ 🚀
