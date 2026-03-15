---
title: "LangChain 核心概念详解"
date: 2026-03-15
tags: [LangChain, AI, LLM, 教程]
category: 教程
---

# LangChain 核心概念详解

本文深入探讨 LangChain 的核心概念，理解这些概念是掌握 LangChain 的关键。

## 1. Runnable Interface

`Runnable` 是 LangChain 中最重要的接口，几乎所有的组件都实现了这个接口。

### 基本用法

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# 所有组件都实现了 Runnable 接口
llm = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("回答: {question}")

# 统一的调用方式
response = llm.invoke("你好")
result = prompt.invoke({"question": "什么是 AI？"})

print(f"LLM: {response}")
print(f"Prompt: {result}")
```

### 流式输出

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# 流式输出
for chunk in llm.stream("讲个笑话"):
    print(chunk.content, end="", flush=True)
```

### 批处理

```python
# 一次处理多个输入
questions = [
    "什么是 Python？",
    "什么是 JavaScript？",
    "什么是 AI？"
]

responses = llm.batch(questions)

for question, response in zip(questions, responses):
    print(f"Q: {question}")
    print(f"A: {response.content}\n")
```

## 2. 链式组合

使用 `|` 操作符可以将多个组件串联起来：

### 简单链

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 创建链
chain = (
    ChatPromptTemplate.from_template("翻译成中文: {text}")
    | ChatOpenAI(model="gpt-4o-mini")
    | StrOutputParser()
)

# 运行
result = chain.invoke({"text": "Hello, how are you?"})
print(result)  # 你好，你好吗？
```

### 复杂链

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 提取关键信息
extractor = (
    ChatPromptTemplate.from_template(
        "从以下文本中提取关键信息：\n\n{text}\n\n用 JSON 格式返回"
    )
    | ChatOpenAI(model="gpt-4o-mini")
    | StrOutputParser()
)

# 总结
summarizer = (
    ChatPromptTemplate.from_template("总结以下内容：\n\n{content}")
    | ChatOpenAI(model="gpt-4o-mini")
    | StrOutputParser()
)

# 组合链
chain = extractor | summarizer

result = chain.invoke({
    "text": "今天天气很好，我决定去公园散步。路上遇到了一只可爱的狗。"
})

print(result)
```

## 3. LangChain Expression Language (LCEL)

LCEL 是一种声明式方式来构建链，更灵活和可读。

### 可组合性

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")

# 定义可重用的组件
translator = (
    ChatPromptTemplate.from_template("翻译成{lang}: {text}")
    | llm
    | StrOutputParser()
)

# 动态使用
chinese = translator.invoke({"lang": "中文", "text": "Hello"})
english = translator.invoke({"lang": "英文", "text": "你好"})
```

### 并行处理

```python
from langchain_core.runnables import RunnableParallel

# 并行运行多个任务
parallel_chain = RunnableParallel({
    "summary": summarizer,
    "translation": translator
})

results = parallel_chain.invoke({
    "text": "今天天气不错",
    "lang": "英文"
})

print(results)
# {'summary': '...', 'translation': 'Today the weather is nice'}
```

## 4. 记忆管理

记忆是维持对话状态的关键。

### 对话窗口记忆

```python
from langchain_core.chat_history import (
    InMemoryChatMessageHistory,
    BaseChatMessageHistory
)
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

# 创建记忆
history = InMemoryChatMessageHistory()

# 获取历史
def get_history(session_id: str) -> BaseChatMessageHistory:
    return history

# 使用记忆
from langchain.chains import create_history_aware_retrieval_chain

llm = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template(
    "对话历史:\n{history}\n\n当前问题:\n{question}"
)

# 这里的实际实现会更复杂，这里展示概念
```

### 会话摘要记忆

```python
from langchain_core.chat_history import (
    ConversationBufferMemory,
    ConversationSummaryMemory
)

# 缓冲记忆 - 保存所有消息
buffer_memory = ConversationBufferMemory(
    return_messages=True,
    max_token_limit=1000
)

# 摘要记忆 - 自动总结历史
summary_memory = ConversationSummaryMemory(
    llm=ChatOpenAI(model="gpt-4o-mini"),
    max_token_limit=500
)
```

## 5. 工具调用（Tool Calling）

工具调用让 LLM 能够执行外部操作。

### 内置工具

```python
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

# 自定义工具
@tool
def calculator(expression: str) -> str:
    """计算数学表达式"""
    try:
        result = eval(expression)
        return f"结果: {result}"
    except Exception as e:
        return f"错误: {str(e)}"

# 绑定工具到 LLM
llm = ChatOpenAI(model="gpt-4o").bind_tools([calculator])

# 使用工具
response = llm.invoke("计算 123 + 456")
print(response)
```

### 结构化输出

```python
from langchain_core.output_parsers import JsonOutputParser
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# 强制 JSON 输出
chain = (
    ChatPromptTemplate.from_template(
        "用 JSON 格式返回以下信息：\n{text}"
    )
    | llm
    | JsonOutputParser()
)

result = chain.invoke({"text": "Python 是一种编程语言"})

print(result)
# {'language': 'Python', 'type': '编程语言', 'description': '...'}
```

## 6. 检索增强生成（RAG）

RAG 是 LangChain 最常用的功能之一。

### 基本流程

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate

# 1. 创建文档
documents = [
    Document(page_content="LangChain 是一个 LLM 应用框架"),
    Document(page_content="Python 是一种编程语言"),
    Document(page_content="AI 是人工智能的简称")
]

# 2. 创建嵌入模型和向量库
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(documents, embeddings)

# 3. 检索器
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

# 4. 创建 RAG 链
llm = ChatOpenAI(model="gpt-4o-mini")

template = """
根据以下上下文回答问题：

上下文:
{context}

问题: {question}
"""

prompt = ChatPromptTemplate.from_template(template)

# 5. 使用
from langchain_core.runnables import RunnablePassthrough

rag_chain = (
    {
        "context": retriever | (lambda docs: "\n\n".join([d.page_content for d in docs])),
        "question": RunnablePassthrough()
    }
    | prompt
    | llm
)

result = rag_chain.invoke({"question": "什么是 LangChain？"})
print(result)
```

## 最佳实践

### 1. 错误处理

```python
from langchain_core.runnables import RunnableLambda

def safe_invoke(chain, input_data):
    try:
        return chain.invoke(input_data)
    except Exception as e:
        return f"错误: {str(e)}"

result = safe_invoke(my_chain, {"text": "test"})
```

### 2. 日志记录

```python
from langchain_core.callbacks import BaseCallbackHandler

class LoggingHandler(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):
        print(f"开始: {prompts}")

    def on_llm_end(self, response, **kwargs):
        print(f"结束: {response}")

llm = ChatOpenAI(
    model="gpt-4o-mini",
    callbacks=[LoggingHandler()]
)
```

### 3. 成本监控

```python
from langchain_core.callbacks import get_openai_callback

with get_openai_callback() as cb:
    result = llm.invoke("你好")
    print(f"Token 使用: {cb.total_tokens}")
    print(f"成本: ${cb.total_cost}")
```

## 总结

LangChain 的核心概念：

1. **Runnable Interface** - 统一的组件接口
2. **链式组合** - 用 `|` 操作符串联组件
3. **记忆管理** - 维持对话状态
4. **工具调用** - 让 LLM 执行外部操作
5. **RAG** - 检索增强生成

掌握这些概念后，你就可以构建复杂的 LLM 应用了。

## 下一步

在下一篇文章中，我们将实战构建一个问答系统。

## 参考资源

- [LangChain Expression Language](https://python.langchain.com/docs/concepts/#langchain-expression-language-lcel)
- [Runnable Interface](https://python.langchain.com/docs/concepts/#runnable-interface)
- [Memory](https://python.langchain.com/docs/concepts/#memory)
