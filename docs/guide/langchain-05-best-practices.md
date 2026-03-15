---
title: "LangChain 高级技巧与最佳实践"
date: 2026-03-15
tags: [LangChain, AI, LLM, 最佳实践]
category: 教程
---

# LangChain 高级技巧与最佳实践

本文总结 LangChain 的高级技巧、性能优化和最佳实践，帮助你构建更强大的 LLM 应用。

## 1. 性能优化

### 1.1 并发处理

使用 `RunnableParallel` 提高并发性能：

```python
from langchain_core.runnables import RunnableParallel
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# 并行执行多个任务
parallel_chain = RunnableParallel({
    "summary": summarize_prompt | llm,
    "translation": translate_prompt | llm,
    "sentiment": sentiment_prompt | llm
})

# 一次调用，并行执行
result = parallel_chain.invoke({"text": "今天天气不错"})

# 比顺序调用快 3 倍
```

### 1.2 批处理

使用 `batch()` 方法减少 API 调用：

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# 批处理
questions = [
    "什么是 Python？",
    "什么是 JavaScript？",
    "什么是 AI？"
]

# 一次调用，处理多个输入
responses = llm.batch(questions)

print(f"处理了 {len(responses)} 个问题")
```

### 1.3 流式处理

使用 `stream()` 提高响应速度：

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# 流式输出
for chunk in llm.stream("讲一个很长的故事"):
    print(chunk.content, end="", flush=True)

# 用户可以实时看到输出，而不是等待全部完成
```

### 1.4 缓存机制

使用缓存减少重复计算：

```python
from langchain.cache import InMemoryCache
from langchain_openai import ChatOpenAI

# 创建缓存
cache = InMemoryCache()

# 绑定缓存到 LLM
llm = ChatOpenAI(
    model="gpt-4o-mini",
    cache=cache
)

# 第一次调用
response1 = llm.invoke("什么是 Python？")

# 第二次调用相同内容（从缓存返回）
response2 = llm.invoke("什么是 Python？")

print(response1 == response2)  # True
```

## 2. 高级链式组合

### 2.1 条件路由

使用 `RunnableBranch` 根据条件选择不同的链：

```python
from langchain_core.runnables import RunnableBranch
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

# 定义不同的链
math_chain = (
    ChatPromptTemplate.from_template("计算: {input}")
    | llm
)

translate_chain = (
    ChatPromptTemplate.from_template("翻译成英文: {input}")
    | llm
)

# 条件路由
def route_math_or_translate(input: str):
    """判断是数学计算还是翻译"""
    import re
    if re.search(r'\d+[\+\-\*\/]\d+', input):
        return "math"
    else:
        return "translate"

branch = RunnableBranch(
    (lambda x: x["route"] == "math", math_chain),
    (lambda x: x["route"] == "translate", translate_chain),
)

# 组合链
chain = (
    {
        "route": lambda x: route_math_or_translate(x["input"]),
        "input": lambda x: x["input"]
    }
    | branch
)

# 使用
result = chain.invoke({"input": "1 + 1 = ?"})
# 使用 math_chain

result = chain.invoke({"input": "你好"})
# 使用 translate_chain
```

### 2.2 路由映射

使用 `RunnableRouter` 根据输入类型选择处理器：

```python
from langchain_core.runnables import RunnableRouter

# 定义不同的链
code_chain = (code_prompt | llm)
text_chain = (text_prompt | llm)

# 路由
router = RunnableRouter(
    {
        "code": code_chain,
        "text": text_chain
    }
)

# 分类器
def classify_input(input: str) -> str:
    """分类输入"""
    if '<code>' in input or '```' in input:
        return "code"
    else:
        return "text"

# 组合
chain = (
    {
        "input": lambda x: x,
        "route": classify_input
    }
    | router
)
```

### 2.3 循环链

使用 `RunnableLoop` 实现循环逻辑：

```python
from langchain_core.runnables import RunnableLambda

def iterative_refinement(initial_query: str, max_iterations: int = 3):
    """迭代优化查询"""

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    def iteration_step(state):
        current_query = state.get("query", initial_query)
        iteration = state.get("iteration", 0)

        # 运行查询
        response = llm.invoke(current_query)

        # 检查是否需要改进
        if "改进" in response.content or "优化" in response.content:
            # 提取改进建议
            improvement = extract_improvement(response.content)

            return {
                "query": f"{current_query} {improvement}",
                "iteration": iteration + 1
            }
        else:
            return {
                "result": response.content,
                "done": True
            }

    # 创建循环
    loop = RunnableLambda(iteration_step)

    result = loop.invoke({"query": initial_query})

    return result.get("result")
```

## 3. 错误处理和重试

### 3.1 错误处理

```python
from langchain_core.runnables import RunnableLambda
from tenacity import retry, stop_after_attempt, wait_exponential

def safe_invoke(chain, input_data, max_retries: int = 3):
    """安全调用链，带重试机制"""

    @retry(
        stop=stop_after_attempt(max_retries),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        reraise=True
    )
    def _invoke():
        try:
            return chain.invoke(input_data)
        except Exception as e:
            print(f"错误: {e}, 重试中...")
            raise

    return _invoke()

# 使用
try:
    result = safe_invoke(my_chain, {"text": "test"})
    print(result)
except Exception as e:
    print(f"最终失败: {e}")
```

### 3.2 降级处理

```python
def create_chain_with_fallback():
    """创建带降级的链"""

    primary_llm = ChatOpenAI(model="gpt-4o")
    fallback_llm = ChatOpenAI(model="gpt-4o-mini")

    # 主链
    primary_chain = primary_prompt | primary_llm

    # 降级链
    fallback_chain = fallback_prompt | fallback_llm

    # 组合：主链失败则使用降级链
    def run_with_fallback(input_data):
        try:
            return primary_chain.invoke(input_data)
        except Exception as e:
            print(f"主链失败: {e}, 使用降级链")
            return fallback_chain.invoke(input_data)

    return RunnableLambda(run_with_fallback)
```

## 4. 成本优化

### 4.1 Token 使用监控

```python
from langchain_core.callbacks import get_openai_callback

def run_with_tracking(chain, input_data):
    """运行链并跟踪成本"""

    with get_openai_callback() as cb:
        result = chain.invoke(input_data)

        print("=" * 50)
        print("Token 使用统计:")
        print(f"  总 Tokens: {cb.total_tokens}")
        print(f"  提示 Tokens: {cb.prompt_tokens}")
        print(f"  完成 Tokens: {cb.completion_tokens}")
        print(f"  成本: ${cb.total_cost:.4f}")
        print("=" * 50)

    return result

# 使用
result = run_with_tracking(my_chain, {"text": "test"})
```

### 4.2 模型选择策略

```python
def smart_model_selection(query_length: int):
    """根据查询长度智能选择模型"""

    if query_length < 100:
        # 短查询，使用快速模型
        return "gpt-4o-mini"
    elif query_length < 1000:
        # 中等查询，使用平衡模型
        return "gpt-4o"
    else:
        # 长查询，使用强大模型
        return "gpt-4o-turbo"

# 使用
llm = ChatOpenAI(model=smart_model_selection(len(query)))
```

### 4.3 上下文优化

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

def optimized_context_splitter(max_context_length: int = 4000):
    """优化的上下文分割器"""

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=max_context_length - 500,  # 预留 500 tokens 给回答
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", "。", "！", "？", "，"]
    )

    return text_splitter
```

## 5. 安全和隐私

### 5.1 输入验证

```python
from langchain_core.runnables import RunnableLambda

def validate_input(chain):
    """输入验证包装器"""

    def wrapper(input_data):
        # 验证输入
        if isinstance(input_data, str):
            if len(input_data) > 10000:
                raise ValueError("输入过长（最多 10000 字符）")
            if input_data.strip() == "":
                raise ValueError("输入不能为空")
        elif isinstance(input_data, dict):
            # 验证必需字段
            required_fields = ["text"]
            for field in required_fields:
                if field not in input_data:
                    raise ValueError(f"缺少必需字段: {field}")

        # 验证通过，调用原始链
        return chain.invoke(input_data)

    return RunnableLambda(wrapper)
```

### 5.2 输出过滤

```python
from langchain_core.runnables import RunnablePassthrough

def filter_sensitive_output(chain):
    """过滤敏感信息"""

    def wrapper(input_data):
        result = chain.invoke(input_data)

        # 过滤敏感信息
        sensitive_patterns = [
            r'\d{3}-\d{2}-\d{4}',  # 电话号码
            r'\d{6}',  # 身份证
            r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'  # 邮箱
        ]

        import re
        for pattern in sensitive_patterns:
            result = re.sub(pattern, '[已过滤]', result)

        return result

    return RunnableLambda(wrapper)
```

### 5.3 PI III 处理

```python
def anonymize_text(text: str) -> str:
    """匿名化个人身份信息"""

    llm = ChatOpenAI(model="gpt-4o-mini")

    prompt = ChatPromptTemplate.from_template("""
匿名化以下文本中的个人身份信息（姓名、地址、电话等）。

原文:
{text}

匿名化后:
""")

    chain = prompt | llm | StrOutputParser()

    result = chain.invoke({"text": text})

    return result
```

## 6. 可观测性

### 6.1 日志记录

```python
from langchain_core.callbacks import BaseCallbackHandler

class DetailedCallbackHandler(BaseCallbackHandler):
    """详细的回调处理器"""

    def on_llm_start(self, serialized, prompts, **kwargs):
        print(f"[LLM 开始] 模型: {serialized.get('model')}")
        print(f"[LLM 开始] 提示: {prompts[0][:100]}...")

    def on_llm_end(self, response, **kwargs):
        print(f"[LLM 结束] 结果: {response.generations[0][0][:100]}...")

    def on_llm_new_token(self, token, **kwargs):
        print(f"[LLM Token] {token}", end="", flush=True)

    def on_chain_start(self, serialized, inputs, **kwargs):
        print(f"[链开始] 输入: {inputs}")

    def on_chain_end(self, outputs, **kwargs):
        print(f"[链结束] 输出: {outputs}")

# 使用
handler = DetailedCallbackHandler()

llm = ChatOpenAI(
    model="gpt-4o-mini",
    callbacks=[handler]
)
```

### 6.2 指标收集

```python
from langchain_core.callbacks import get_openai_callback
from collections import defaultdict
import time

class MetricsCollector:
    """指标收集器"""

    def __init__(self):
        self.metrics = defaultdict(list)

    def collect(self, chain, input_data, label: str):
        """收集指标"""

        start_time = time.time()

        with get_openai_callback() as cb:
            try:
                result = chain.invoke(input_data)

                end_time = time.time()
                duration = end_time - start_time

                self.metrics[label].append({
                    "tokens": cb.total_tokens,
                    "cost": cb.total_cost,
                    "duration": duration,
                    "success": True
                })

                return result

            except Exception as e:
                end_time = time.time()
                duration = end_time - start_time

                self.metrics[label].append({
                    "tokens": 0,
                    "cost": 0,
                    "duration": duration,
                    "success": False,
                    "error": str(e)
                })
                raise

    def summary(self):
        """生成摘要"""
        summary = {}

        for label, data in self.metrics.items():
            success_rate = sum(1 for d in data if d['success']) / len(data)
            avg_duration = sum(d['duration'] for d in data) / len(data)
            total_cost = sum(d['cost'] for d in data)

            summary[label] = {
                "调用次数": len(data),
                "成功率": f"{success_rate:.2%}",
                "平均耗时": f"{avg_duration:.2f}s",
                "总成本": f"${total_cost:.4f}"
            }

        return summary

# 使用
collector = MetricsCollector()

# 多次调用
for i in range(5):
    collector.collect(my_chain, {"text": f"test {i}"}, f"调用 {i+1}")

# 查看摘要
summary = collector.summary()
print(summary)
```

## 7. 测试策略

### 7.1 单元测试

```python
import pytest
from langchain_openai import ChatOpenAI

def test_llm_invoke():
    """测试 LLM 调用"""

    llm = ChatOpenAI(model="gpt-4o-mini")

    response = llm.invoke("测试")

    assert response.content is not None
    assert len(response.content) > 0

def test_chain_flow():
    """测试链式调用"""

    chain = prompt_template | llm | StrOutputParser()

    result = chain.invoke({"text": "test"})

    assert "结果" in result

# 运行测试
pytest test_my_app.py -v
```

### 7.2 集成测试

```python
from langchain_openai import ChatOpenAI

def test_integration():
    """集成测试"""

    llm = ChatOpenAI(model="gpt-4o-mini")

    # 测试真实场景
    scenarios = [
        "总结这段文本",
        "翻译成英文",
        "提取实体"
    ]

    for scenario in scenarios:
        try:
            response = llm.invoke(scenario)
            print(f"✓ 场景: {scenario}")
            print(f"  结果: {response.content[:50]}...")
        except Exception as e:
            print(f"✗ 场景: {scenario}")
            print(f"  错误: {e}")
            raise
```

## 8. 部署最佳实践

### 8.1 环境变量管理

```bash
# .env.example
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langchain_api_key
```

### 8.2 配置管理

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class AppConfig:
    """应用配置"""

    # LLM 配置
    llm_model: str = "gpt-4o-mini"
    llm_temperature: float = 0.7
    llm_max_tokens: int = 2000

    # 向量数据库配置
    vector_db_path: str = "./chroma_db"
    embedding_model: str = "text-embedding-3-small"

    # RAG 配置
    retrieval_k: int = 3
    retrieval_score_threshold: float = 0.7

    # 缓存配置
    enable_cache: bool = True
    cache_ttl: int = 3600  # 秒

    @classmethod
    def from_env(cls):
        """从环境变量加载配置"""
        import os
        from dotenv import load_dotenv

        load_dotenv()

        return cls(
            llm_model=os.getenv("LLM_MODEL", cls.llm_model),
            llm_temperature=float(os.getenv("LLM_TEMPERATURE", str(cls.llm_temperature))),
            llm_max_tokens=int(os.getenv("LLM_MAX_TOKENS", str(cls.llm_max_tokens))),
            # ... 其他配置
        )

# 使用
config = AppConfig.from_env()
```

### 8.3 Docker 部署

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 设置环境变量
ENV PYTHONUNBUFFERED=1
ENV LANGCHAIN_TRACING_V2=true

# 运行应用
CMD ["python", "main.py"]
```

## 总结

LangChain 最佳实践总结：

### 性能优化
1. 使用并发和批处理
2. 实现缓存机制
3. 选择合适的模型

### 稳定性
1. 错误处理和重试
2. 降级策略
3. 输入验证

### 可观测性
1. 详细的日志记录
2. 指标收集
3. 成本追踪

### 安全性
1. 输入过滤
2. 输出匿名化
3. 敏感信息保护

### 测试
1. 单元测试
2. 集成测试
3. 场景测试

### 部署
1. 环境变量管理
2. 配置文件
3. Docker 容器化

## 参考资源

- [LangChain 生产指南](https://python.langchain.com/docs/concepts/#production)
- [LangChain 性能优化](https://python.langchain.com/docs/concepts/#optimization)
- [LangChain 调试](https://python.langchain.com/docs/troubleshooting/)
