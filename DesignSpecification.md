## VLA SOTA Benchmark Leaderboard 网站架构设计说明

### 一、总体设计目标

本网站旨在系统性整理并展示近两至三年来 **Vision-Language-Action（VLA）模型**在主流机器人操作 benchmark（Libero、CALVIN、Meta-World）上的评测结果，提供一个**以 benchmark 为核心、以可比性和可溯源性为原则**的公开榜单平台。网站重点服务于研究人员对不同 VLA 方法性能的横向对比与趋势分析，而非重新定义或重跑评测标准。

### 二、整体页面架构概览

网站采用 **“主页 → Benchmark 榜单页 / 模型信息页 → 模型详情页”** 的层级结构，核心页面包括：

* Home（主页）
* Benchmarks（Benchmark 榜单页）
  * Libero Leaderboard
  * CALVIN Leaderboard
  * Meta-World Leaderboard
* Methodology（评测方法与规则说明页）
* About / Contribute（项目信息与贡献方式）

### 三、各页面功能说明

#### 1. Home（主页）

**功能定位：**

* 作为网站的入口与概览页，说明网站的研究目标与使用方式
* 引导用户快速进入具体 benchmark 榜单

**主要内容：**

* 网站定位与范围说明（VLA + 机器人操作 + 官方 benchmark）
* 三个 benchmark 的入口卡片（Libero / CALVIN / Meta-World）
  * 每个卡片展示当前收录模型数量、使用的主评测指标
  * 每个卡片展示这个benchmark评分最高的5个模型
* 可选展示整体趋势概览（如不同年份模型数量或成绩变化）

**链接关系：**

* 主页直接链接到三个 Benchmark 榜单页
* 导航栏可访问 Benchamarks 与 Methodology 页面

#### 2. Benchmark Leaderboard 页面（Libero / CALVIN / Meta-World）

**功能定位：**

* 网站的核心页面
* 以**单一 benchmark 为单位**展示各 VLA 模型的评测结果与排名

**主要内容：**

* Benchmark 简要介绍（任务特点、评测协议、常用指标）
* 榜单主表（Leaderboard Table）：
  * 模型名称、时间
  * 主排序指标（如 Success Rate）
  * 论文与代码链接
* 每一行是一个VLA模型，点击可以从这一行下面展开一个折叠微页面，展示了各分项目的数据和数据来源。

**设计原则：**

* 榜单排序仅依据一个明确的主指标
* 不在主表中直接展示展示多维细节指标

**交互与链接：**

* 支持基础筛选（时间等）


#### 3. Methodology（评测方法与规则说明页）

**功能定位：**

* 解释榜单的构建原则，提升网站的学术可信度

**主要内容：**

* 数据来源说明（基于论文公开结果）
* 排名与排序规则
* Benchmark 之间不可直接对比的声明
* 已知局限性与未来扩展方向

**链接关系：**

* 全站导航可访问
* 为榜单页面提供方法论支撑

### 四、页面之间的逻辑关系总结

* **主页**负责总览与导航
* **Benchmark 榜单页**是性能比较的核心入口
* **Methodology 页面**为所有榜单提供统一规则说明

### 五、页面的设计原则和要求

* 学术风格：清晰简洁，易于理解
* 视觉效果：简约、明快
* 交互性：用户友好，操作流畅简单
* 页面需要在github上进行部署
* 页面的默认语言应该是英语，但也要提供一个中文的版本。可以在页面的右上角提供一个切换语言的按钮。

### 六、页面的技术实现

* 使用 Next.js App Router
* 将要直接部署在github上
* 数据从本地 JSON 读取
* UI 使用 Tailwind CSS