---
title: "LangChain 实战：构建问答系统"
date: 2026-03-15
tags: [LangChain, AI, LLM, RAG, 实战]
category: 教程
---

# LangChain 实战：构建问答系统

本教程将带你从零开始，使用 LangChain 构建一个完整的问答系统（Q&A）。

## 项目概述

我们要构建一个智能问答系统，它能够：
1. 接受用户问题
2. 从知识库中检索相关文档
3. 使用 LLM 生成准确的回答
4. 支持多种文档格式

## 准备工作

### 安装依赖

```bash
pip install langchain langchain-openai langchain-community \
            langchain-chroma python-dotenv
```

### 环境变量

创建 `.env` 文件：

```bash
# OpenAI API
OPENAI_API_KEY=sk-proj-xxx

# 或使用本地模型
# OPENAI_BASE_URL=http://localhost:11434/v1
```

## 第一步：创建文档加载器

创建 `document_loader.py`：

```python
from langchain_core.documents import Document
from pathlib import Path
import json

def load_text_files(directory: str) -> list[Document]:
    """加载文本文件"""
    documents = []

    for file_path in Path(directory).rglob("*.txt"):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        doc = Document(
            page_content=content,
            metadata={"source": str(file_path)}
        )
        documents.append(doc)

    return documents

def load_json_files(directory: str) -> list[Document]:
    """加载 JSON 文件"""
    documents = []

    for file_path in Path(directory).rglob("*.json"):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 假设 JSON 有 'content' 字段
        if isinstance(data, list):
            for item in data:
                if 'content' in item:
                    doc = Document(
                        page_content=item['content'],
                        metadata={"source": str(file_path)}
                    )
                    documents.append(doc)
        elif isinstance(data, dict) and 'content' in data:
            doc = Document(
                page_content=data['content'],
                metadata={"source": str(file_path)}
            )
            documents.append(doc)

    return documents
```

## 第二步：文档分块

创建 `document_chunker.py`：

```python
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List

def split_documents(
    documents: List[Document],
    chunk_size: int = 1000,
    chunk_overlap: int = 200
) -> List[Document]:
    """分割文档为小块"""

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", "。", "！", "？", "，", "、", " "]
    )

    chunks = text_splitter.split_documents(documents)

    print(f"分割前: {len(documents)} 个文档")
    print(f"分割后: {len(chunks)} 个块")

    return chunks
```

## 第三步：创建向量存储

创建 `vector_store.py`：

```python
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from typing import List, Optional
import os

def create_vectorstore(
    documents: List[Document],
    persist_directory: str = "./chroma_db",
    embedding_model: str = "text-embedding-3-small"
):
    """创建向量存储"""

    print("创建嵌入模型...")
    embeddings = OpenAIEmbeddings(
        model=embedding_model,
        chunk_size=1000
    )

    print("创建向量存储...")
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=persist_directory
    )

    print(f"向量存储已保存到: {persist_directory}")

    return vectorstore

def load_vectorstore(
    persist_directory: str = "./chroma_db",
    embedding_model: str = "text-embedding-3-small"
):
    """加载已有的向量存储"""

    embeddings = OpenAIEmbeddings(
        model=embedding_model,
        chunk_size=1000
    )

    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings
    )

    return vectorstore
```

## 第四步：创建问答链

创建 `qa_chain.py`：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

def create_qa_chain(retriever, model_name: str = "gpt-4o-mini"):
    """创建问答链"""

    # 创建 LLM
    llm = ChatOpenAI(model=model_name, temperature=0)

    # 提示模板
    template = """
你是一个专业的问答助手。请根据以下上下文信息回答用户的问题。

上下文信息:
{context}

用户问题: {question}

要求:
1. 只使用上下文中的信息回答
2. 如果上下文中没有答案，请明确说明"我无法从提供的信息中找到答案"
3. 回答要准确、简洁、有条理
4. 使用中文回答

回答:
"""

    prompt = ChatPromptTemplate.from_template(template)

    # 创建检索链
    combine_docs_chain = create_stuff_documents_chain(
        llm=llm,
        prompt=prompt,
        document_prompt=ChatPromptTemplate.from_template("{page_content}"),
        document_variable_name="context",
    )

    retrieval_chain = create_retrieval_chain(
        retriever=retriever,
        combine_docs_chain=combine_docs_chain
    )

    return retrieval_chain
```

## 第五步：整合所有组件

创建 `main.py`：

```python
import os
from dotenv import load_dotenv

from document_loader import load_text_files
from document_chunker import split_documents
from vector_store import create_vectorstore, load_vectorstore
from qa_chain import create_qa_chain

# 加载环境变量
load_dotenv()

# 配置
DATA_DIR = "./data/knowledge_base"
VECTOR_DB_DIR = "./chroma_db"
MODEL_NAME = "gpt-4o-mini"

def main():
    print("=" * 50)
    print("LangChain 问答系统")
    print("=" * 50)

    # 检查向量数据库是否存在
    if os.path.exists(VECTOR_DB_DIR):
        print("\n加载已有的向量数据库...")
        vectorstore = load_vectorstore(VECTOR_DB_DIR)
    else:
        print("\n处理文档并创建向量数据库...")

        # 1. 加载文档
        documents = load_text_files(DATA_DIR)
        print(f"加载了 {len(documents)} 个文档")

        # 2. 分割文档
        chunks = split_documents(documents)

        # 3. 创建向量存储
        vectorstore = create_vectorstore(chunks, VECTOR_DB_DIR)

    # 4. 创建问答链
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}  # 返回最相关的 3 个文档
    )
    qa_chain = create_qa_chain(retriever, MODEL_NAME)

    # 5. 交互式问答
    print("\n" + "=" * 50)
    print("问答系统已就绪！")
    print("=" * 50)
    print("\n输入你的问题（输入 'quit' 退出）:\n")

    while True:
        question = input("你: ").strip()

        if question.lower() in ['quit', 'exit', '退出']:
            print("\n再见！")
            break

        if not question:
            continue

        try:
            # 提问
            result = qa_chain.invoke({"query": question})

            print(f"\n助手: {result['answer']}")

            # 显示参考文档
            if 'source_documents' in result:
                sources = [doc.metadata.get('source', '未知')
                          for doc in result['source_documents']]
                print(f"\n参考文档:")
                for i, source in enumerate(sources, 1):
                    print(f"  {i}. {source}")

        except Exception as e:
            print(f"\n错误: {str(e)}")

if __name__ == "__main__":
    main()
```

## 使用示例

### 准备知识库

创建 `data/knowledge_base/` 目录，添加一些文档：

```bash
mkdir -p data/knowledge_base
```

在目录中添加 `.txt` 文件，例如：

```text
# python_intro.txt
Python 是一种高级编程语言，由 Guido van Rossum 于 1991 年创建。
它以简洁、易读的语法而闻名，广泛应用于 Web 开发、
数据分析、人工智能和科学计算。

# langchain_intro.txt
LangChain 是一个用于开发由语言模型驱动的应用程序的开源框架。
它提供模块化的组件，支持链式调用、记忆管理、
工具调用和检索增强生成（RAG）。

# ai_intro.txt
人工智能（AI）是计算机科学的一个分支，
致力于创建能够执行通常需要人类智能的任务的系统。
现代 AI 主要依赖于机器学习和深度学习技术。
```

### 运行系统

```bash
# 首次运行（会创建向量数据库）
python main.py

# 后续运行（加载已有的向量数据库）
python main.py
```

## 优化技巧

### 1. 提高检索质量

```python
# 使用混合检索（向量 + 关键词）
retriever = vectorstore.as_retriever(
    search_type="mmr",  # Maximal Marginal Relevance
    search_kwargs={"k": 5, "fetch_k": 10}
)
```

### 2. 添加相关性分数过滤

```python
# 只使用相关性高的文档
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={
        "score_threshold": 0.7,
        "k": 3
    }
)
```

### 3. 添加引用来源

```python
# 显示回答的来源
result = qa_chain.invoke({"query": question})

print(f"回答: {result['answer']}")
print("\n来源:")
for doc in result['source_documents']:
    print(f"- {doc.metadata['source']}")
```

## 扩展功能

### 添加文档类型支持

```python
# 支持 PDF
from langchain_community.document_loaders import PyPDFLoader

def load_pdfs(directory: str):
    documents = []
    for file_path in Path(directory).rglob("*.pdf"):
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        documents.extend(docs)
    return documents
```

### 支持实时更新

```python
# 当新文档添加时，增量更新向量库
def add_documents(vectorstore, new_documents):
    """增量添加文档"""
    vectorstore.add_documents(new_documents)
    vectorstore.persist()  # 保存到磁盘
```

## 完整项目结构

```
qa-system/
├── main.py                 # 主程序
├── document_loader.py      # 文档加载
├── document_chunker.py     # 文档分割
├── vector_store.py         # 向量存储
├── qa_chain.py            # 问答链
├── data/
│   └── knowledge_base/    # 知识库文档
│       ├── python_intro.txt
│       ├── langchain_intro.txt
│       └── ai_intro.txt
├── chroma_db/            # 向量数据库（自动生成）
├── .env                  # 环境变量
└── requirements.txt        # 依赖列表
```

## 总结

通过本教程，你学会了：

1. **文档加载** - 支持多种格式
2. **文档分割** - 将长文档分块
3. **向量存储** - 使用 Chroma 存储和检索
4. **检索链** - 构建问答系统
5. **优化技巧** - 提高检索质量

这个问答系统可以作为基础，进一步扩展为：
- Web 界面
- 多语言支持
- 实时文档更新
- 多模态检索（图像、视频）

## 下一步

在下一篇文章中，我们将构建一个文档分析工具。

## 参考资源

- [LangChain RAG 教程](https://python.langchain.com/docs/tutorials/rag/)
- [ChromaDB 文档](https://docs.trychroma.com)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
