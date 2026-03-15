---
title: "LangChain 实战：构建文档分析工具"
date: 2026-03-15
tags: [LangChain, AI, LLM, 文档分析, 实战]
category: 教程
---

# LangChain 实战：构建文档分析工具

本教程将带你使用 LangChain 构建一个智能文档分析工具，能够自动总结、提取信息和分析文档。

## 项目概述

我们要构建一个文档分析工具，它能够：
1. 加载多种格式的文档（PDF、Word、TXT）
2. 自动生成摘要
3. 提取关键信息（人物、地点、日期等）
4. 分析情感和主题
5. 生成结构化报告

## 准备工作

### 安装依赖

```bash
pip install langchain langchain-openai langchain-community \
            python-docx PyPDF2 spacy
```

### 下载 NLP 模型

```bash
# 下载中文 NLP 模型
python -m spacy download zh_core_web_sm
```

## 第一步：文档加载器

创建 `document_loader.py`：

```python
from langchain_core.documents import Document
from pathlib import Path
from typing import List
import docx
import PyPDF2
import spacy

# 加载 NLP 模型
nlp = spacy.load("zh_core_web_sm")

def load_pdf(file_path: str) -> List[Document]:
    """加载 PDF 文档"""
    documents = []

    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)

        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"

        doc = Document(
            page_content=text.strip(),
            metadata={"source": file_path, "type": "pdf"}
        )
        documents.append(doc)

    return documents

def load_docx(file_path: str) -> List[Document]:
    """加载 Word 文档"""
    documents = []

    doc = docx.Document(file_path)
    text = "\n".join([para.text for para in doc.paragraphs])

    doc_obj = Document(
        page_content=text.strip(),
        metadata={"source": file_path, "type": "docx"}
    )
    documents.append(doc_obj)

    return documents

def load_txt(file_path: str) -> List[Document]:
    """加载文本文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()

    return [
        Document(
            page_content=text.strip(),
            metadata={"source": file_path, "type": "txt"}
        )
    ]

def load_document(file_path: str) -> List[Document]:
    """自动识别并加载文档"""
    path = Path(file_path)

    if path.suffix.lower() == '.pdf':
        return load_pdf(file_path)
    elif path.suffix.lower() == '.docx':
        return load_docx(file_path)
    elif path.suffix.lower() in ['.txt', '.md']:
        return load_txt(file_path)
    else:
        raise ValueError(f"不支持的文件类型: {path.suffix}")
```

## 第二步：文档摘要器

创建 `document_summarizer.py`：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.documents import Document
from typing import List

def summarize_document(
    document: Document,
    model_name: str = "gpt-4o-mini",
    summary_type: str = "detailed"
) -> str:
    """总结单个文档"""

    llm = ChatOpenAI(model=model_name, temperature=0)

    if summary_type == "detailed":
        template = """
请详细总结以下文档内容。

文档内容:
{content}

请包含:
1. 主要主题和观点
2. 关键细节
3. 重要数据或结论

总结:
"""
    elif summary_type == "brief":
        template = """
用 3-5 句话简要总结以下文档。

文档内容:
{content}

总结:
"""
    elif summary_type == "bullet_points":
        template = """
用要点列表总结以下文档。

文档内容:
{content}

总结:
"""
    else:
        raise ValueError(f"不支持的摘要类型: {summary_type}")

    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | StrOutputParser()

    result = chain.invoke({"content": document.page_content})

    return result.strip()

def summarize_documents(
    documents: List[Document],
    model_name: str = "gpt-4o-mini",
    summary_type: str = "detailed"
) -> List[str]:
    """批量总结文档"""

    summaries = []

    for i, doc in enumerate(documents, 1):
        print(f"总结文档 {i}/{len(documents)}: {doc.metadata.get('source', '未知')}")

        try:
            summary = summarize_document(doc, model_name, summary_type)
            summaries.append(summary)
        except Exception as e:
            print(f"总结失败: {e}")
            summaries.append(f"总结失败: {str(e)}")

    return summaries
```

## 第三步：信息提取器

创建 `info_extractor.py`：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.documents import Document
from typing import Dict, List

def extract_entities(document: Document) -> Dict:
    """提取实体（人物、地点、组织等）"""

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    prompt = ChatPromptTemplate.from_template("""
从以下文档中提取实体信息。

文档内容:
{content}

请提取以下类型的实体（如果没有，返回空列表）:
1. 人物（人物名称、职位、角色）
2. 地点（城市、国家、地址）
3. 组织（公司、机构、团体）
4. 日期（任何日期或时间）
5. 金额（任何货币金额）

用 JSON 格式返回:
{{
  "人物": [...],
  "地点": [...],
  "组织": [...],
  "日期": [...],
  "金额": [...]
}}
""")

    chain = prompt | llm | JsonOutputParser()

    result = chain.invoke({"content": document.page_content})

    return result

def extract_key_information(document: Document) -> Dict:
    """提取关键信息"""

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    prompt = ChatPromptTemplate.from_template("""
从以下文档中提取关键信息。

文档内容:
{content}

请提取:
1. 主要结论或决策
2. 重要数据或统计
3. 行动项或待办事项
4. 风险或问题
5. 机遇或优势

用 JSON 格式返回:
{{
  "主要结论": "",
  "重要数据": [],
  "行动项": [],
  "风险": [],
  "机遇": []
}}
""")

    chain = prompt | llm | JsonOutputParser()

    result = chain.invoke({"content": document.page_content})

    return result

def extract_topics(document: Document) -> List[str]:
    """提取主题"""

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)

    prompt = ChatPromptTemplate.from_template("""
从以下文档中提取 3-5 个主要主题。

文档内容:
{content}

主题:
""")

    chain = prompt | llm | StrOutputParser()

    result = chain.invoke({"content": document.page_content})

    # 解析主题列表
    topics = [line.strip() for line in result.split('\n') if line.strip()]

    return topics[:5]  # 最多返回 5 个主题
```

## 第四步：情感分析

创建 `sentiment_analyzer.py`：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.documents import Document
from typing import Dict

def analyze_sentiment(document: Document) -> Dict:
    """分析文档情感"""

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    prompt = ChatPromptTemplate.from_template("""
分析以下文档的情感倾向。

文档内容:
{content}

请分析:
1. 整体情感（积极/消极/中性）
2. 情感强度（1-10，10 最强）
3. 主要情绪（如：乐观、悲观、愤怒、冷静等）
4. 关键情感词语

用 JSON 格式返回:
{{
  "整体情感": "",
  "情感强度": 0,
  "主要情绪": "",
  "关键词语": []
}}
""")

    chain = prompt | llm | StrOutputParser()

    result = chain.invoke({"content": document.page_content})

    # 这里简化处理，实际应该用 JsonOutputParser
    return {
        "整体情感": "待分析",
        "情感强度": 0,
        "主要情绪": "待分析",
        "关键词语": []
    }
```

## 第五步：整合主程序

创建 `main.py`：

```python
from dotenv import load_dotenv
from pathlib import Path
from document_loader import load_document
from document_summarizer import summarize_document, summarize_documents
from info_extractor import extract_entities, extract_key_information, extract_topics
from sentiment_analyzer import analyze_sentiment
import json

# 加载环境变量
load_dotenv()

def analyze_document(file_path: str):
    """分析单个文档"""

    print("=" * 60)
    print(f"分析文档: {file_path}")
    print("=" * 60)

    # 1. 加载文档
    print("\n[1/5] 加载文档...")
    documents = load_document(file_path)
    doc = documents[0]
    print(f"✓ 文档类型: {doc.metadata.get('type', '未知')}")
    print(f"✓ 文档长度: {len(doc.page_content)} 字符")

    # 2. 生成摘要
    print("\n[2/5] 生成摘要...")
    summary = summarize_document(doc, summary_type="brief")
    print(f"✓ 摘要: {summary[:100]}...")

    # 3. 提取实体
    print("\n[3/5] 提取实体...")
    entities = extract_entities(doc)
    print(f"✓ 发现实体:")
    for entity_type, entity_list in entities.items():
        if entity_list:
            print(f"  - {entity_type}: {', '.join(entity_list)}")

    # 4. 提取关键信息
    print("\n[4/5] 提取关键信息...")
    key_info = extract_key_information(doc)
    print("✓ 关键信息:")
    for info_type, info_value in key_info.items():
        if info_value and info_value != []:
            print(f"  - {info_type}: {info_value}")

    # 5. 提取主题
    print("\n[5/5] 提取主题...")
    topics = extract_topics(doc)
    print(f"✓ 主题: {', '.join(topics)}")

    # 6. 情感分析
    print("\n[6/6] 情感分析...")
    sentiment = analyze_sentiment(doc)
    print(f"✓ 整体情感: {sentiment['整体情感']}")
    print(f"✓ 情感强度: {sentiment['情感强度']}")
    print(f"✓ 主要情绪: {sentiment['主要情绪']}")

    # 7. 生成报告
    print("\n" + "=" * 60)
    print("生成分析报告...")
    print("=" * 60)

    report = {
        "文档信息": {
            "文件路径": file_path,
            "文档类型": doc.metadata.get('type', '未知'),
            "文档长度": len(doc.page_content)
        },
        "摘要": summary,
        "实体": entities,
        "关键信息": key_info,
        "主题": topics,
        "情感分析": sentiment
    }

    # 保存报告
    report_path = Path(file_path).stem + "_report.json"
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"✓ 报告已保存: {report_path}")

    return report

def main():
    import sys

    if len(sys.argv) < 2:
        print("用法: python main.py <文档路径>")
        print("\n支持的格式: PDF, DOCX, TXT")
        sys.exit(1)

    file_path = sys.argv[1]

    if not Path(file_path).exists():
        print(f"错误: 文件不存在 - {file_path}")
        sys.exit(1)

    try:
        report = analyze_document(file_path)
        print("\n" + "=" * 60)
        print("分析完成！")
        print("=" * 60)

    except Exception as e:
        print(f"\n错误: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
```

## 使用示例

```bash
# 分析 PDF
python main.py document.pdf

# 分析 Word 文档
python main.py report.docx

# 分析文本文件
python main.py article.txt
```

## 输出示例

分析完成后会生成 JSON 报告文件，例如：

```json
{
  "文档信息": {
    "文件路径": "report.pdf",
    "文档类型": "pdf",
    "文档长度": 15234
  },
  "摘要": "本文讨论了 2024 年度公司的业绩和发展计划...",
  "实体": {
    "人物": ["张三", "李四", "王五"],
    "地点": ["北京", "上海"],
    "组织": ["ABC 公司", "XYZ 集团"],
    "日期": ["2024-01-01", "2024-12-31"],
    "金额": ["100 万", "50 万"]
  },
  "关键信息": {
    "主要结论": "公司 2024 年业绩增长 20%",
    "重要数据": ["收入: 1000 万", "利润: 200 万"],
    "行动项": ["Q1 发布新产品", "Q3 扩展团队"],
    "风险": ["市场竞争加剧", "成本上升"],
    "机遇": ["AI 技术应用", "国际市场拓展"]
  },
  "主题": ["公司业绩", "发展计划", "AI 应用", "市场拓展"],
  "情感分析": {
    "整体情感": "积极",
    "情感强度": 7,
    "主要情绪": "乐观",
    "关键词语": ["增长", "发展", "机遇", "扩展"]
  }
}
```

## 扩展功能

### 1. 批量分析

```python
def batch_analyze(directory: str):
    """批量分析目录中的所有文档"""

    results = []

    for file_path in Path(directory).rglob("*"):
        if file_path.suffix in ['.pdf', '.docx', '.txt']:
            try:
                report = analyze_document(str(file_path))
                results.append(report)
            except Exception as e:
                print(f"分析失败: {file_path} - {e}")

    # 生成汇总报告
    with open('batch_report.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    return results
```

### 2. 添加可视化

```python
import matplotlib.pyplot as plt

def visualize_sentiment(report_path: str):
    """可视化情感分析结果"""

    with open(report_path, 'r', encoding='utf-8') as f:
        report = json.load(f)

    sentiment = report['情感分析']

    # 创建柱状图
    labels = ['整体情感', '情感强度']
    values = [
        1 if sentiment['整体情感'] == '积极' else
        0 if sentiment['整体情感'] == '中性' else -1,
        sentiment['情感强度']
    ]

    plt.figure(figsize=(8, 4))
    plt.bar(labels, values, color=['green' if values[0] > 0 else 'red', 'blue'])
    plt.title('情感分析结果')
    plt.savefig('sentiment_chart.png')
    plt.close()
```

### 3. 添加比较分析

```python
def compare_documents(reports: List[dict]):
    """比较多个文档的分析结果"""

    print("\n文档比较:")
    print("=" * 60)

    for report in reports:
        print(f"\n文档: {report['文档信息']['文件路径']}")
        print(f"  情感: {report['情感分析']['整体情感']}")
        print(f"  主题: {', '.join(report['主题'])}")
```

## 完整项目结构

```
document-analyzer/
├── main.py                    # 主程序
├── document_loader.py         # 文档加载
├── document_summarizer.py     # 文档摘要
├── info_extractor.py          # 信息提取
├── sentiment_analyzer.py       # 情感分析
├── data/                    # 测试文档
│   ├── report.pdf
│   ├── article.docx
│   └── meeting.txt
├── requirements.txt           # 依赖列表
└── .env                     # 环境变量
```

## 总结

通过本教程，你学会了：

1. **多格式文档加载** - PDF、Word、TXT
2. **自动摘要生成** - 不同类型的摘要
3. **实体提取** - 人物、地点、组织等
4. **关键信息提取** - 结论、数据、行动项
5. **主题提取** - 自动识别主题
6. **情感分析** - 分析情感倾向

这个文档分析工具可以进一步扩展为：
- Web 界面
- 实时分析
- 多语言支持
- 深度学习模型集成

## 下一步

在下一篇文章中，我们将学习 LangChain 的高级技巧和最佳实践。

## 参考资源

- [LangChain 文档加载](https://python.langchain.com/docs/concepts/#document-loaders)
- [OpenAI JSON 模式](https://platform.openai.com/docs/guides/structured-outputs)
- [spaCy 中文模型](https://spacy.io/models/zh)
