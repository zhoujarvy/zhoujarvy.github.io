---
title: "LangChain 入门教程"
date: 2026-03-15
tags: [LangChain, AI, LLM, 教程]
category: 教程
---

# LangChain 入门教程

LangChain 是一个用于开发由语言模型驱动的应用程序的强大框架。本文将带你从零开始学习 LangChain。

## 什么是 LangChain？

LangChain 是一个开源框架，专门用于构建基于大语言模型（LLM）的应用程序。它提供了模块化的组件，让你可以轻松地组合和定制各种 LLM 功能。

### 核心特点

- **模块化设计**: 每个组件都可以独立使用和组合
- **链式调用**: 将多个组件串联起来形成复杂的处理流程
- **记忆管理**: 自动处理对话历史和上下文
- **工具调用**: 让 LLM 能够调用外部工具和 API
- **数据集成**: 轻松集成各种数据源（向量数据库、数据库等）

## 快速开始

### 安装

```bash
# 使用 pip 安装
pip install langchain langchain-openai langchain-community

# 或使用 conda
conda install -c conda-forge langchain
```

### Hello World

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

# 初始化模型
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7
)

# 发送消息
message = HumanMessage(content="你好，介绍一下你自己")
response = llm.invoke([message])

print(response.content)
```

## 核心组件

### 1. 语言模型（LLMs）

LangChain 支持多种 LLM 提供商：

```python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI

# OpenAI
openai_llm = ChatOpenAI(model="gpt-4o")

# Anthropic
anthropic_llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")

# Google
google_llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
```

### 2. 提示模板（Prompt Templates）

提示模板让你可以结构化和参数化你的提示词：

```python
from langchain_core.prompts import ChatPromptTemplate

# 定义模板
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个{role}助手。"),
    ("user", "{input}")
])

# 填充模板
formatted_prompt = prompt.invoke({
    "role": "编程",
    "input": "如何学习 Python？"
})

print(formatted_prompt)
```

### 3. 链（Chains）

链是将多个组件串联起来的核心概念：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 创建链
llm = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("用简单的话解释{topic}")
chain = prompt | llm | StrOutputParser()

# 运行链
result = chain.invoke({"topic": "量子计算"})
print(result)
```

### 4. 记忆（Memory）

记忆组件用于存储和检索对话历史：

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.chat_history import (
    InMemoryChatMessageHistory,
    BaseChatMessageHistory
)

# 创建记忆
history = InMemoryChatMessageHistory()

# 添加消息
history.add_message(HumanMessage(content="我叫小明"))
history.add_message(SystemMessage(content="你好小明！"))

# 获取历史
messages = history.messages
print([msg.content for msg in messages])
```

## 实战示例：简单问答系统

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 创建提示模板
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个有帮助的助手。"),
    ("user", "{question}")
])

# 创建链
llm = ChatOpenAI(model="gpt-4o-mini")
chain = prompt | llm | StrOutputParser()

# 问答循环
while True:
    question = input("\n你的问题（输入 'quit' 退出）: ")
    if question.lower() == 'quit':
        break

    result = chain.invoke({"question": question})
    print(f"助手: {result}")
```

## 下一步

现在你已经了解了 LangChain 的基础概念。在下一篇文章中，我们将深入学习 LangChain 的核心概念和工作原理。

## 参考资源

- [LangChain 官方文档](https://python.langchain.com)
- [LangChain GitHub](https://github.com/langchain-ai/langchain)
- [LangChain 示例](https://github.com/langchain-ai/langchain/tree/master/cookbook)
