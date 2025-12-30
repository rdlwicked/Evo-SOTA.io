"""
VLA SOTA 数据处理脚本
将 VLA_SOTA.csv 中的原始数据处理为适合网站展示的 JSON 格式

新增功能：
- 处理开源情况字段
- 处理标准测试规则字段
- 生成三类数据：标准开源、标准闭源、非标准
- 新增 LIBERO Plus 榜单支持（包含 mix-sft 策略区分）
"""

import pandas as pd
import json
import re
from typing import Optional, Dict, Any, List


def parse_value(value: Any) -> Optional[float]:
    """
    解析单元格的值，将其转换为浮点数
    处理各种异常情况：空值、'-'、带括号注释的值等
    """
    if pd.isna(value) or value == '' or value == '-':
        return None
    
    # 转换为字符串处理
    str_value = str(value).strip()
    
    # 处理带括号注释的情况，如 "79(30个子任务）"
    if '(' in str_value or '（' in str_value:
        str_value = re.split(r'[（\(]', str_value)[0].strip()
    
    # 处理特殊标记
    if str_value in ['-', '', '(未写)', '未写', '有结果']:
        return None
    
    try:
        val = float(str_value)
        return val
    except ValueError:
        return None


def parse_date(date_str: Any) -> Optional[str]:
    """
    解析发布日期，格式化为 YYYY-MM 格式
    输入格式可能是 "24.10" 或 "2024.10" 等
    """
    if pd.isna(date_str) or date_str == '':
        return None
    
    str_date = str(date_str).strip()
    
    # 匹配 YY.MM 格式 (支持单位数月份)
    match = re.match(r'^(\d{2})\.(\d{1,2})$', str_date)
    if match:
        year = int(match.group(1))
        month = match.group(2).zfill(2)
        # 假设 20-30 是 2020-2030
        full_year = 2000 + year if year < 50 else 1900 + year
        return f"{full_year}-{month}"
    
    return str_date


def parse_paper_url(url: Any) -> Optional[str]:
    """
    解析论文链接，只保留有效的 URL
    """
    if pd.isna(url) or url == '':
        return None
    
    str_url = str(url).strip()
    
    # 检查是否是有效URL（以http开头）
    if str_url.startswith('http'):
        # 处理带注释的URL
        if '（' in str_url:
            str_url = str_url.split('（')[0].strip()
        return str_url
    
    # 如果是 "from xxx" 这样的引用来源，不作为论文链接
    if str_url.lower().startswith('from'):
        return None
    
    # 对于 "方法来自：xxx" 这样的格式，提取URL
    if 'http' in str_url:
        match = re.search(r'(https?://[^\s]+)', str_url)
        if match:
            return match.group(1)
    
    return None


def parse_opensource_url(value: Any) -> Optional[str]:
    """
    解析开源链接
    返回有效的 GitHub 等链接，如果是 '0' 或空则返回 None
    """
    if pd.isna(value) or value == '':
        return None
    
    str_value = str(value).strip()
    
    # 如果是 '0' 或 '1' 表示是否开源的标记
    if str_value in ['0', '1']:
        return None
    
    # 检查是否是有效URL
    if str_value.startswith('http'):
        return str_value
    
    return None


def is_opensource(value: Any) -> bool:
    """
    判断是否开源
    - 如果值是有效URL，返回 True
    - 如果值是 '1'，返回 True
    - 如果值是 '0' 或空，返回 False
    """
    if pd.isna(value) or value == '':
        return False
    
    str_value = str(value).strip()
    
    # '0' 表示未开源
    if str_value == '0':
        return False
    
    # '1' 或有效URL表示开源
    if str_value == '1' or str_value.startswith('http'):
        return True
    
    return False


def is_standard_eval(value: Any) -> bool:
    """
    判断是否使用标准测试规则
    - 1 或 1.0 表示标准测试
    - 0 或空表示非标准测试
    """
    if pd.isna(value) or value == '':
        return False
    
    # 尝试转换为数值进行比较（处理 1.0 这样的浮点数）
    try:
        num_value = float(value)
        return num_value == 1.0
    except (ValueError, TypeError):
        # 如果无法转换为数值，检查字符串
        str_value = str(value).strip()
        return str_value == '1' or str_value == '1.0'


def process_libero_data(row: pd.Series) -> Dict[str, Any]:
    """
    处理 Libero benchmark 数据
    
    列索引:
    - 13: Libero Spatial
    - 14: Libero Object
    - 15: Libero Goal
    - 16: Libero Long(10)
    - 17: Libero 90
    - 18: Libero Average
    """
    result = {
        'spatial': parse_value(row.iloc[13]),
        'object': parse_value(row.iloc[14]),
        'goal': parse_value(row.iloc[15]),
        'long': parse_value(row.iloc[16]),
        'libero_90': parse_value(row.iloc[17]),
        'average': parse_value(row.iloc[18])
    }
    
    # 如果 average 为空但有其他数据，计算平均值
    if result['average'] is None:
        valid_scores = [v for v in [result['spatial'], result['object'], 
                                     result['goal'], result['long']] if v is not None]
        if len(valid_scores) >= 3:
            result['average'] = round(sum(valid_scores) / len(valid_scores), 2)
    
    return result


def process_metaworld_data(row: pd.Series) -> Dict[str, Any]:
    """
    处理 Meta-World benchmark 数据
    
    列索引:
    - 32: Easy
    - 33: Medium
    - 34: Hard
    - 35: Very Hard
    - 36: Meta-world Average
    """
    result = {
        'easy': parse_value(row.iloc[32]),
        'medium': parse_value(row.iloc[33]),
        'hard': parse_value(row.iloc[34]),
        'very_hard': parse_value(row.iloc[35]),
        'average': parse_value(row.iloc[36])
    }
    
    # 如果 average 为空但有其他数据，计算平均值
    if result['average'] is None:
        valid_scores = [v for v in [result['easy'], result['medium'], 
                                     result['hard'], result['very_hard']] if v is not None]
        if len(valid_scores) >= 2:
            result['average'] = round(sum(valid_scores) / len(valid_scores), 2)
    
    return result


def process_libero_plus_data(row: pd.Series) -> Dict[str, Any]:
    """
    处理 LIBERO Plus benchmark 数据
    包含 7 个子任务：Camera, Robot, Language, Light, Background, Noise, Layout
    以及 Total 分数
    
    列索引:
    - 22: Camera
    - 23: Robot
    - 24: Language
    - 25: Light
    - 26: Background
    - 27: Noise
    - 28: Layout
    - 29: Total
    """
    result = {
        'camera': parse_value(row.iloc[22]),
        'robot': parse_value(row.iloc[23]),
        'language': parse_value(row.iloc[24]),
        'light': parse_value(row.iloc[25]),
        'background': parse_value(row.iloc[26]),
        'noise': parse_value(row.iloc[27]),
        'layout': parse_value(row.iloc[28]),
        'total': parse_value(row.iloc[29])
    }
    
    # 如果 total 为空但有其他数据，计算平均值
    if result['total'] is None:
        valid_scores = [v for v in [
            result['camera'], result['robot'], result['language'],
            result['light'], result['background'], result['noise'], result['layout']
        ] if v is not None]
        if len(valid_scores) >= 4:
            result['total'] = round(sum(valid_scores) / len(valid_scores), 2)
    
    return result


def is_mix_sft(value: Any) -> bool:
    """
    判断是否使用 mix-sft 训练策略
    - 1 或 1.0 表示 mix-sft
    - 0 或空表示非 mix-sft
    """
    if pd.isna(value) or value == '':
        return False
    
    try:
        num_value = float(value)
        return num_value == 1.0
    except (ValueError, TypeError):
        str_value = str(value).strip()
        return str_value == '1' or str_value == '1.0'


def process_calvin_setting(row: pd.Series, setting: str) -> Dict[str, Any]:
    """
    处理 Calvin 单个设置的数据
    setting: 'ABCD-D', 'ABC-D', 或 'D-D'
    
    列索引:
    - ABCD-D: 39-44 (Inst1-5, Avg. Len.)
    - ABC-D: 45-50 (Inst1-5, Avg. Len.)
    - D-D: 51-56 (Inst1-5, Avg. Len.)
    """
    if setting == 'ABCD-D':
        base_idx = 39
    elif setting == 'ABC-D':
        base_idx = 45
    elif setting == 'D-D':
        base_idx = 51
    else:
        return {}
    
    data = {
        'inst1': parse_value(row.iloc[base_idx]),
        'inst2': parse_value(row.iloc[base_idx + 1]),
        'inst3': parse_value(row.iloc[base_idx + 2]),
        'inst4': parse_value(row.iloc[base_idx + 3]),
        'inst5': parse_value(row.iloc[base_idx + 4]),
        'avg_len': parse_value(row.iloc[base_idx + 5])
    }
    return data


def has_calvin_setting_data(setting_data: Dict[str, Any]) -> bool:
    """
    检查 Calvin 某个设置是否有有效数据
    """
    return any(v is not None for v in setting_data.values())


def has_benchmark_data(benchmark_data: Dict[str, Any], benchmark_type: str) -> bool:
    """
    检查某个 benchmark 是否有有效数据
    """
    return any(v is not None for k, v in benchmark_data.items())


def sort_and_rank(data_list: List[Dict], sort_key: str, descending: bool = True) -> List[Dict]:
    """
    对数据列表排序并添加排名
    """
    # 排序
    data_list.sort(key=lambda x: x.get(sort_key) or 0, reverse=descending)
    
    # 添加排名
    for i, item in enumerate(data_list):
        item['rank'] = i + 1
    
    return data_list


def split_by_category(data_list: List[Dict]) -> Dict[str, List[Dict]]:
    """
    将数据按开源和标准测试情况分类
    返回三个列表：
    - standard_opensource: 标准测试 + 开源
    - standard_closed: 标准测试 + 未开源
    - non_standard: 非标准测试（附录）
    """
    standard_opensource = []
    standard_closed = []
    non_standard = []
    
    for item in data_list:
        if not item.get('is_standard', False):
            non_standard.append(item)
        elif item.get('is_opensource', False):
            standard_opensource.append(item)
        else:
            standard_closed.append(item)
    
    return {
        'standard_opensource': standard_opensource,
        'standard_closed': standard_closed,
        'non_standard': non_standard
    }


def split_libero_plus_by_category(data_list: List[Dict]) -> Dict[str, List[Dict]]:
    """
    将 LIBERO Plus 数据按开源、标准测试和 mix-sft 情况分类
    返回六个列表：
    - standard_opensource: 标准测试 + 开源 + 非 mix-sft
    - standard_opensource_mixsft: 标准测试 + 开源 + mix-sft
    - standard_closed: 标准测试 + 未开源 + 非 mix-sft
    - standard_closed_mixsft: 标准测试 + 未开源 + mix-sft
    - non_standard: 非标准测试 + 非 mix-sft（附录）
    - non_standard_mixsft: 非标准测试 + mix-sft（附录）
    """
    standard_opensource = []
    standard_opensource_mixsft = []
    standard_closed = []
    standard_closed_mixsft = []
    non_standard = []
    non_standard_mixsft = []
    
    for item in data_list:
        is_standard = item.get('is_standard', False)
        is_opensource = item.get('is_opensource', False)
        is_mixsft = item.get('is_mixsft', False)
        
        if not is_standard:
            if is_mixsft:
                non_standard_mixsft.append(item)
            else:
                non_standard.append(item)
        elif is_opensource:
            if is_mixsft:
                standard_opensource_mixsft.append(item)
            else:
                standard_opensource.append(item)
        else:
            if is_mixsft:
                standard_closed_mixsft.append(item)
            else:
                standard_closed.append(item)
    
    return {
        'standard_opensource': standard_opensource,
        'standard_opensource_mixsft': standard_opensource_mixsft,
        'standard_closed': standard_closed,
        'standard_closed_mixsft': standard_closed_mixsft,
        'non_standard': non_standard,
        'non_standard_mixsft': non_standard_mixsft
    }


def process_csv():
    """
    主处理函数：读取 CSV 并生成 JSON 文件
    
    重要的列索引：
    - 1: 模型名称
    - 2: 论文地址
    - 3: 发布时间
    - 4: 开源情况
    - 11: LIBERO Standard Evaluation Rule
    - 12: LIBERO Note
    - 19: LIBERO Plus Standard Evaluation Rule
    - 20: LIBERO Plus mix-sft
    - 21: LIBERO Plus Note
    - 30: Meta-World Standard Evaluation Rule
    - 31: Meta-World Note
    - 37: CALVIN Standard Evaluation Rule
    - 38: CALVIN Note
    """
    # 读取 CSV，跳过前两行（标题行）
    df = pd.read_csv('VLA_SOTA.csv', header=1)
    
    # 存储处理后的数据
    all_models = {}  # 按模型名称聚合
    # LIBERO Plus 需要特殊处理：同一模型的 mix-sft 和 non-mix-sft 版本分别存储
    libero_plus_entries = []  # 存储所有 LIBERO Plus 条目
    
    # 遍历每一行
    for idx, row in df.iterrows():
        # 跳过空行
        vla_name = row.iloc[1]  # VLA名称在第2列
        if pd.isna(vla_name) or str(vla_name).strip() == '':
            continue
        
        vla_name = str(vla_name).strip()
        paper_url = parse_paper_url(row.iloc[2])  # 论文地址在第3列
        pub_date = parse_date(row.iloc[3])  # 发布时间在第4列
        
        # 开源情况（第5列）
        opensource_value = row.iloc[4]
        opensource = is_opensource(opensource_value)
        opensource_url = parse_opensource_url(opensource_value)
        
        # 标准测试规则 - 使用 iloc 索引访问，因为列名包含换行符
        libero_standard = is_standard_eval(row.iloc[11])
        libero_plus_standard = is_standard_eval(row.iloc[19])
        metaworld_standard = is_standard_eval(row.iloc[30])
        calvin_standard = is_standard_eval(row.iloc[37])
        
        # LIBERO Plus 的 mix-sft 标记（列20）
        libero_plus_mixsft = is_mix_sft(row.iloc[20])
        
        # Note 字段 - 使用 iloc 索引
        libero_note = str(row.iloc[12]) if not pd.isna(row.iloc[12]) else ''
        libero_plus_note = str(row.iloc[21]) if not pd.isna(row.iloc[21]) else ''
        metaworld_note = str(row.iloc[31]) if not pd.isna(row.iloc[31]) else ''
        calvin_note = str(row.iloc[38]) if not pd.isna(row.iloc[38]) else ''
        
        # 检查是否是原文数据（而非引用自其他论文）
        url_str = str(row.iloc[2]) if not pd.isna(row.iloc[2]) else ''
        is_original = not url_str.lower().startswith('from')
        
        # 数据来源
        data_source = url_str if url_str.lower().startswith('from') else None
        
        # 处理各 benchmark 数据
        libero = process_libero_data(row)
        libero_plus = process_libero_plus_data(row)
        metaworld = process_metaworld_data(row)
        
        # Calvin 的三个设置分开处理
        calvin_abcd_d = process_calvin_setting(row, 'ABCD-D')
        calvin_abc_d = process_calvin_setting(row, 'ABC-D')
        calvin_d_d = process_calvin_setting(row, 'D-D')
        
        # === 处理 LIBERO Plus 数据（特殊处理：同一模型的 mix-sft 和 non-mix-sft 分开存储）===
        if has_benchmark_data(libero_plus, 'libero_plus'):
            source_info_lp = data_source if not is_original else 'from Libero-plus'
            # 为 LIBERO Plus 创建独立条目，使用 (name, is_mixsft) 作为唯一键
            lp_entry = {
                'name': vla_name,
                'paper_url': paper_url,
                'pub_date': pub_date,
                'is_opensource': opensource,
                'opensource_url': opensource_url,
                **libero_plus,
                'source': source_info_lp,
                'is_standard': libero_plus_standard,
                'is_mixsft': libero_plus_mixsft,
                'note': libero_plus_note
            }
            libero_plus_entries.append(lp_entry)
        
        # 更新或创建模型记录（用于其他 benchmarks）
        if vla_name not in all_models:
            all_models[vla_name] = {
                'name': vla_name,
                'paper_url': paper_url,
                'pub_date': pub_date,
                'is_opensource': opensource,
                'opensource_url': opensource_url,
                'libero': None,
                'libero_standard': None,
                'libero_note': '',
                # LIBERO Plus 已单独处理，不再存储在 all_models 中
                'metaworld': None,
                'metaworld_standard': None,
                'metaworld_note': '',
                'calvin_abcd_d': None,
                'calvin_abc_d': None,
                'calvin_d_d': None,
                'calvin_standard': None,
                'calvin_note': ''
            }
        
        # 更新基础信息（如果是原始数据行）
        if is_original:
            if paper_url:
                all_models[vla_name]['paper_url'] = paper_url
            if pub_date:
                all_models[vla_name]['pub_date'] = pub_date
            # 开源信息只从原始行更新
            all_models[vla_name]['is_opensource'] = opensource
            if opensource_url:
                all_models[vla_name]['opensource_url'] = opensource_url
        
        # 更新 benchmark 数据
        source_info = data_source if not is_original else 'original'
        
        if has_benchmark_data(libero, 'libero'):
            if all_models[vla_name]['libero'] is None or is_original:
                all_models[vla_name]['libero'] = {**libero, 'source': source_info}
                all_models[vla_name]['libero_standard'] = libero_standard
                all_models[vla_name]['libero_note'] = libero_note
        
        # LIBERO Plus 数据已在前面单独处理（存储到 libero_plus_entries）
        
        if has_benchmark_data(metaworld, 'metaworld'):
            if all_models[vla_name]['metaworld'] is None or is_original:
                all_models[vla_name]['metaworld'] = {**metaworld, 'source': source_info}
                all_models[vla_name]['metaworld_standard'] = metaworld_standard
                all_models[vla_name]['metaworld_note'] = metaworld_note
        
        # Calvin 三个设置分别处理
        if has_calvin_setting_data(calvin_abcd_d):
            if all_models[vla_name]['calvin_abcd_d'] is None or is_original:
                all_models[vla_name]['calvin_abcd_d'] = {**calvin_abcd_d, 'source': source_info}
                all_models[vla_name]['calvin_standard'] = calvin_standard
                all_models[vla_name]['calvin_note'] = calvin_note
        
        if has_calvin_setting_data(calvin_abc_d):
            if all_models[vla_name]['calvin_abc_d'] is None or is_original:
                all_models[vla_name]['calvin_abc_d'] = {**calvin_abc_d, 'source': source_info}
                if all_models[vla_name]['calvin_standard'] is None:
                    all_models[vla_name]['calvin_standard'] = calvin_standard
                    all_models[vla_name]['calvin_note'] = calvin_note
        
        if has_calvin_setting_data(calvin_d_d):
            if all_models[vla_name]['calvin_d_d'] is None or is_original:
                all_models[vla_name]['calvin_d_d'] = {**calvin_d_d, 'source': source_info}
                if all_models[vla_name]['calvin_standard'] is None:
                    all_models[vla_name]['calvin_standard'] = calvin_standard
                    all_models[vla_name]['calvin_note'] = calvin_note
    
    # 生成各 benchmark 的独立数据
    libero_data = []
    # LIBERO Plus 数据直接使用 libero_plus_entries（已包含 mix-sft 区分）
    metaworld_data = []
    calvin_abcd_d_data = []
    calvin_abc_d_data = []
    calvin_d_d_data = []
    
    for name, model in all_models.items():
        base_info = {
            'name': name,
            'paper_url': model['paper_url'],
            'pub_date': model['pub_date'],
            'is_opensource': model['is_opensource'],
            'opensource_url': model['opensource_url']
        }
        
        if model['libero'] is not None:
            entry = {
                **base_info, 
                **model['libero'],
                'is_standard': model['libero_standard'] or False,
                'note': model['libero_note']
            }
            libero_data.append(entry)
        
        # LIBERO Plus 数据已单独处理，不在此循环中
        
        if model['metaworld'] is not None:
            entry = {
                **base_info, 
                **model['metaworld'],
                'is_standard': model['metaworld_standard'] or False,
                'note': model['metaworld_note']
            }
            metaworld_data.append(entry)
        
        # Calvin 三个榜单独立，但共享 calvin_standard
        calvin_base = {
            **base_info,
            'is_standard': model['calvin_standard'] or False,
            'note': model['calvin_note']
        }
        
        if model['calvin_abcd_d'] is not None:
            entry = {**calvin_base, **model['calvin_abcd_d']}
            calvin_abcd_d_data.append(entry)
        
        if model['calvin_abc_d'] is not None:
            entry = {**calvin_base, **model['calvin_abc_d']}
            calvin_abc_d_data.append(entry)
        
        if model['calvin_d_d'] is not None:
            entry = {**calvin_base, **model['calvin_d_d']}
            calvin_d_d_data.append(entry)
    
    # 分类处理各 benchmark 数据
    def process_benchmark_data(data_list: List[Dict], sort_key: str) -> Dict:
        """处理单个 benchmark 的数据，分类并排序"""
        categories = split_by_category(data_list)
        
        # 分别对每个类别排序并添加排名
        result = {
            'standard_opensource': sort_and_rank(categories['standard_opensource'], sort_key),
            'standard_closed': sort_and_rank(categories['standard_closed'], sort_key),
            'non_standard': sort_and_rank(categories['non_standard'], sort_key)
        }
        
        return result
    
    def process_libero_plus_benchmark_data(data_list: List[Dict], sort_key: str) -> Dict:
        """处理 LIBERO Plus 的数据，分类并排序（包含 mix-sft 区分）"""
        categories = split_libero_plus_by_category(data_list)
        
        # 分别对每个类别排序并添加排名
        result = {
            'standard_opensource': sort_and_rank(categories['standard_opensource'], sort_key),
            'standard_opensource_mixsft': sort_and_rank(categories['standard_opensource_mixsft'], sort_key),
            'standard_closed': sort_and_rank(categories['standard_closed'], sort_key),
            'standard_closed_mixsft': sort_and_rank(categories['standard_closed_mixsft'], sort_key),
            'non_standard': sort_and_rank(categories['non_standard'], sort_key),
            'non_standard_mixsft': sort_and_rank(categories['non_standard_mixsft'], sort_key)
        }
        
        return result
    
    # 处理 Libero 数据
    libero_processed = process_benchmark_data(libero_data, 'average')
    
    # 处理 LIBERO Plus 数据（使用 libero_plus_entries，每个 mix-sft 状态单独记录）
    libero_plus_processed = process_libero_plus_benchmark_data(libero_plus_entries, 'total')
    
    # 处理 Meta-World 数据
    metaworld_processed = process_benchmark_data(metaworld_data, 'average')
    
    # 处理 Calvin 数据（三个设置）
    calvin_abcd_d_processed = process_benchmark_data(calvin_abcd_d_data, 'avg_len')
    calvin_abc_d_processed = process_benchmark_data(calvin_abc_d_data, 'avg_len')
    calvin_d_d_processed = process_benchmark_data(calvin_d_d_data, 'avg_len')
    
    # 保存 JSON 文件
    with open('libero.json', 'w', encoding='utf-8') as f:
        json.dump(libero_processed, f, indent=2, ensure_ascii=False)
    
    with open('liberoPlus.json', 'w', encoding='utf-8') as f:
        json.dump(libero_plus_processed, f, indent=2, ensure_ascii=False)
    
    with open('metaworld.json', 'w', encoding='utf-8') as f:
        json.dump(metaworld_processed, f, indent=2, ensure_ascii=False)
    
    # Calvin 保存为一个文件，包含三个榜单，每个榜单有三个分类
    calvin_data = {
        'abcd_d': calvin_abcd_d_processed,
        'abc_d': calvin_abc_d_processed,
        'd_d': calvin_d_d_processed
    }
    with open('calvin.json', 'w', encoding='utf-8') as f:
        json.dump(calvin_data, f, indent=2, ensure_ascii=False)
    
    # 生成汇总数据（用于主页展示）
    # 主页只展示 Calvin ABC-D 榜单的标准开源数据
    def get_top5(data_list: List[Dict], score_key: str) -> List[Dict]:
        return [{'name': m['name'], 'score': m.get(score_key), 'rank': m['rank']} 
                for m in data_list[:5]]
    
    # LIBERO Plus 需要合并 standard_opensource 和 standard_opensource_mixsft 来获取 top5
    libero_plus_all_opensource = (
        libero_plus_processed['standard_opensource'] + 
        libero_plus_processed['standard_opensource_mixsft']
    )
    libero_plus_all_opensource = sort_and_rank(libero_plus_all_opensource, 'total')
    
    summary = {
        'libero': {
            'total_models': len(libero_data),
            'standard_opensource_count': len(libero_processed['standard_opensource']),
            'standard_closed_count': len(libero_processed['standard_closed']),
            'non_standard_count': len(libero_processed['non_standard']),
            'primary_metric': 'Average Success Rate (%)',
            'top_5': get_top5(libero_processed['standard_opensource'], 'average')
        },
        'libero_plus': {
            'total_models': len(libero_plus_entries),
            'standard_opensource_count': len(libero_plus_processed['standard_opensource']),
            'standard_opensource_mixsft_count': len(libero_plus_processed['standard_opensource_mixsft']),
            'standard_closed_count': len(libero_plus_processed['standard_closed']),
            'standard_closed_mixsft_count': len(libero_plus_processed['standard_closed_mixsft']),
            'non_standard_count': len(libero_plus_processed['non_standard']),
            'non_standard_mixsft_count': len(libero_plus_processed['non_standard_mixsft']),
            'primary_metric': 'Total Success Rate (%)',
            'top_5': get_top5(libero_plus_all_opensource, 'total')
        },
        'metaworld': {
            'total_models': len(metaworld_data),
            'standard_opensource_count': len(metaworld_processed['standard_opensource']),
            'standard_closed_count': len(metaworld_processed['standard_closed']),
            'non_standard_count': len(metaworld_processed['non_standard']),
            'primary_metric': 'Average Success Rate (%)',
            'top_5': get_top5(metaworld_processed['standard_opensource'], 'average')
        },
        'calvin': {
            'total_models': len(calvin_abc_d_data),
            'standard_opensource_count': len(calvin_abc_d_processed['standard_opensource']),
            'standard_closed_count': len(calvin_abc_d_processed['standard_closed']),
            'non_standard_count': len(calvin_abc_d_processed['non_standard']),
            'primary_metric': 'Average Length (Avg. Len.)',
            'description': 'ABC-D Setting (Default)',
            'top_5': get_top5(calvin_abc_d_processed['standard_opensource'], 'avg_len'),
            'settings': {
                'abcd_d': len(calvin_abcd_d_data),
                'abc_d': len(calvin_abc_d_data),
                'd_d': len(calvin_d_d_data)
            }
        }
    }
    
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    # 打印统计信息
    print("=" * 60)
    print("数据处理完成！")
    print("=" * 60)
    print(f"总模型数: {len(all_models)}")
    print()
    print("Libero 榜单:")
    print(f"  - 标准开源: {len(libero_processed['standard_opensource'])} 个模型")
    print(f"  - 标准闭源: {len(libero_processed['standard_closed'])} 个模型")
    print(f"  - 非标准 (附录): {len(libero_processed['non_standard'])} 个模型")
    print()
    print("LIBERO Plus 榜单:")
    print(f"  - 标准开源 (非 mix-sft): {len(libero_plus_processed['standard_opensource'])} 个模型")
    print(f"  - 标准开源 (mix-sft): {len(libero_plus_processed['standard_opensource_mixsft'])} 个模型")
    print(f"  - 标准闭源 (非 mix-sft): {len(libero_plus_processed['standard_closed'])} 个模型")
    print(f"  - 标准闭源 (mix-sft): {len(libero_plus_processed['standard_closed_mixsft'])} 个模型")
    print(f"  - 非标准 (非 mix-sft): {len(libero_plus_processed['non_standard'])} 个模型")
    print(f"  - 非标准 (mix-sft): {len(libero_plus_processed['non_standard_mixsft'])} 个模型")
    print()
    print("Meta-World 榜单:")
    print(f"  - 标准开源: {len(metaworld_processed['standard_opensource'])} 个模型")
    print(f"  - 标准闭源: {len(metaworld_processed['standard_closed'])} 个模型")
    print(f"  - 非标准 (附录): {len(metaworld_processed['non_standard'])} 个模型")
    print()
    print("Calvin 榜单 (ABC-D):")
    print(f"  - 标准开源: {len(calvin_abc_d_processed['standard_opensource'])} 个模型")
    print(f"  - 标准闭源: {len(calvin_abc_d_processed['standard_closed'])} 个模型")
    print(f"  - 非标准 (附录): {len(calvin_abc_d_processed['non_standard'])} 个模型")
    print()
    print("Calvin 各设置总数:")
    print(f"  - ABCD-D: {len(calvin_abcd_d_data)} 个模型")
    print(f"  - ABC-D (主榜单): {len(calvin_abc_d_data)} 个模型")
    print(f"  - D-D: {len(calvin_d_d_data)} 个模型")
    print("=" * 60)
    print("\n生成的文件:")
    print("  - libero.json: Libero 榜单数据 (含三个分类)")
    print("  - liberoPlus.json: LIBERO Plus 榜单数据 (含六个分类，区分 mix-sft)")
    print("  - metaworld.json: Meta-World 榜单数据 (含三个分类)")
    print("  - calvin.json: Calvin 榜单数据 (三个设置 × 三个分类)")
    print("  - data.json: 汇总数据（用于主页）")
    print()
    print("数据分类说明:")
    print("  - standard_opensource: 使用标准测试规则 + 已开源（默认显示）")
    print("  - standard_opensource_mixsft: 使用标准测试规则 + 已开源 + mix-sft 策略 (仅 LIBERO Plus)")
    print("  - standard_closed: 使用标准测试规则 + 未开源（可选显示）")
    print("  - standard_closed_mixsft: 使用标准测试规则 + 未开源 + mix-sft 策略 (仅 LIBERO Plus)")
    print("  - non_standard: 未使用标准测试规则（附录）")
    print("  - non_standard_mixsft: 未使用标准测试规则 + mix-sft 策略 (仅 LIBERO Plus)")


if __name__ == '__main__':
    process_csv()
