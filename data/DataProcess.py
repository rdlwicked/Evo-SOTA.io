"""
VLA SOTA 数据处理脚本
将 VLA_SOTA.csv 中的原始数据处理为适合网站展示的 JSON 格式
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


def process_libero_data(row: pd.Series) -> Dict[str, Any]:
    """
    处理 Libero benchmark 数据
    """
    result = {
        'spatial': parse_value(row.get('Libero Spatial')),
        'object': parse_value(row.get('Libero Object')),
        'goal': parse_value(row.get('Libero Goal')),
        'long': parse_value(row.get('Libero Long(10)')),
        'libero_90': parse_value(row.get('Libero 90')),
        'average': parse_value(row.get('Libero Average'))
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
    """
    result = {
        'easy': parse_value(row.get('Easy')),
        'medium': parse_value(row.get('Medium')),
        'hard': parse_value(row.get('Hard')),
        'very_hard': parse_value(row.get('Very Hard')),
        'average': parse_value(row.get('Meta-world \nAverage'))
    }
    
    # 如果 average 为空但有其他数据，计算平均值
    if result['average'] is None:
        valid_scores = [v for v in [result['easy'], result['medium'], 
                                     result['hard'], result['very_hard']] if v is not None]
        if len(valid_scores) >= 2:
            result['average'] = round(sum(valid_scores) / len(valid_scores), 2)
    
    return result


def process_calvin_setting(row: pd.Series, prefix: str) -> Dict[str, Any]:
    """
    处理 Calvin 单个设置的数据
    prefix: 'ABCD-D', 'ABC-D', 或 'D-D'
    注意：MTLC 列只是分项标记，没有实际评分，所以不处理
    """
    data = {
        'inst1': parse_value(row.get(f'Calvin {prefix}:\nLH-MTLC Inst1')),
        'inst2': parse_value(row.get(f'Calvin {prefix}:\nLH-MTLC Inst2')),
        'inst3': parse_value(row.get(f'Calvin {prefix}:\nLH-MTLC Inst3')),
        'inst4': parse_value(row.get(f'Calvin {prefix}:\nLH-MTLC Inst4')),
        'inst5': parse_value(row.get(f'Calvin {prefix}:\nLH-MTLC Inst5')),
        'avg_len': parse_value(row.get(f'Calvin {prefix}:\nLH-MTLC Avg. Len.'))
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


def process_csv():
    """
    主处理函数：读取 CSV 并生成 JSON 文件
    """
    # 读取 CSV，跳过前两行（标题行）
    df = pd.read_csv('VLA_SOTA.csv', header=1)
    
    # 存储处理后的数据
    all_models = {}  # 按模型名称聚合
    
    # 遍历每一行
    for idx, row in df.iterrows():
        # 跳过空行
        vla_name = row.iloc[1]  # VLA名称在第2列
        if pd.isna(vla_name) or str(vla_name).strip() == '':
            continue
        
        vla_name = str(vla_name).strip()
        paper_url = parse_paper_url(row.iloc[2])  # 论文地址在第3列
        pub_date = parse_date(row.iloc[3])  # 发布时间在第4列
        
        # 检查是否是原文数据（而非引用自其他论文）
        url_str = str(row.iloc[2]) if not pd.isna(row.iloc[2]) else ''
        is_original = not url_str.lower().startswith('from')
        
        # 数据来源
        data_source = url_str if url_str.lower().startswith('from') else None
        
        # 处理各 benchmark 数据
        libero = process_libero_data(row)
        metaworld = process_metaworld_data(row)
        
        # Calvin 的三个设置分开处理
        calvin_abcd_d = process_calvin_setting(row, 'ABCD-D')
        calvin_abc_d = process_calvin_setting(row, 'ABC-D')
        calvin_d_d = process_calvin_setting(row, 'D-D')
        
        # 更新或创建模型记录
        if vla_name not in all_models:
            all_models[vla_name] = {
                'name': vla_name,
                'paper_url': paper_url,
                'pub_date': pub_date,
                'libero': None,
                'metaworld': None,
                'calvin_abcd_d': None,
                'calvin_abc_d': None,
                'calvin_d_d': None
            }
        else:
            # 如果是原始数据行，更新论文URL和发布日期
            if is_original and paper_url:
                all_models[vla_name]['paper_url'] = paper_url
            if is_original and pub_date:
                all_models[vla_name]['pub_date'] = pub_date
        
        # 更新 benchmark 数据
        source_info = data_source if not is_original else 'original'
        
        if has_benchmark_data(libero, 'libero'):
            if all_models[vla_name]['libero'] is None or is_original:
                all_models[vla_name]['libero'] = {**libero, 'source': source_info}
        
        if has_benchmark_data(metaworld, 'metaworld'):
            if all_models[vla_name]['metaworld'] is None or is_original:
                all_models[vla_name]['metaworld'] = {**metaworld, 'source': source_info}
        
        # Calvin 三个设置分别处理
        if has_calvin_setting_data(calvin_abcd_d):
            if all_models[vla_name]['calvin_abcd_d'] is None or is_original:
                all_models[vla_name]['calvin_abcd_d'] = {**calvin_abcd_d, 'source': source_info}
        
        if has_calvin_setting_data(calvin_abc_d):
            if all_models[vla_name]['calvin_abc_d'] is None or is_original:
                all_models[vla_name]['calvin_abc_d'] = {**calvin_abc_d, 'source': source_info}
        
        if has_calvin_setting_data(calvin_d_d):
            if all_models[vla_name]['calvin_d_d'] is None or is_original:
                all_models[vla_name]['calvin_d_d'] = {**calvin_d_d, 'source': source_info}
    
    # 生成各 benchmark 的独立数据
    libero_data = []
    metaworld_data = []
    calvin_abcd_d_data = []
    calvin_abc_d_data = []
    calvin_d_d_data = []
    
    for name, model in all_models.items():
        base_info = {
            'name': name,
            'paper_url': model['paper_url'],
            'pub_date': model['pub_date']
        }
        
        if model['libero'] is not None:
            entry = {**base_info, **model['libero']}
            libero_data.append(entry)
        
        if model['metaworld'] is not None:
            entry = {**base_info, **model['metaworld']}
            metaworld_data.append(entry)
        
        # Calvin 三个榜单独立
        if model['calvin_abcd_d'] is not None:
            entry = {**base_info, **model['calvin_abcd_d']}
            calvin_abcd_d_data.append(entry)
        
        if model['calvin_abc_d'] is not None:
            entry = {**base_info, **model['calvin_abc_d']}
            calvin_abc_d_data.append(entry)
        
        if model['calvin_d_d'] is not None:
            entry = {**base_info, **model['calvin_d_d']}
            calvin_d_d_data.append(entry)
    
    # 按 average/avg_len 分数排序（降序）
    libero_data.sort(key=lambda x: x.get('average') or 0, reverse=True)
    metaworld_data.sort(key=lambda x: x.get('average') or 0, reverse=True)
    calvin_abcd_d_data.sort(key=lambda x: x.get('avg_len') or 0, reverse=True)
    calvin_abc_d_data.sort(key=lambda x: x.get('avg_len') or 0, reverse=True)
    calvin_d_d_data.sort(key=lambda x: x.get('avg_len') or 0, reverse=True)
    
    # 添加排名
    for i, item in enumerate(libero_data):
        item['rank'] = i + 1
    for i, item in enumerate(metaworld_data):
        item['rank'] = i + 1
    for i, item in enumerate(calvin_abcd_d_data):
        item['rank'] = i + 1
    for i, item in enumerate(calvin_abc_d_data):
        item['rank'] = i + 1
    for i, item in enumerate(calvin_d_d_data):
        item['rank'] = i + 1
    
    # 保存 JSON 文件
    with open('libero.json', 'w', encoding='utf-8') as f:
        json.dump(libero_data, f, indent=2, ensure_ascii=False)
    
    with open('metaworld.json', 'w', encoding='utf-8') as f:
        json.dump(metaworld_data, f, indent=2, ensure_ascii=False)
    
    # Calvin 保存为一个文件，包含三个榜单
    calvin_data = {
        'abcd_d': calvin_abcd_d_data,
        'abc_d': calvin_abc_d_data,
        'd_d': calvin_d_d_data
    }
    with open('calvin.json', 'w', encoding='utf-8') as f:
        json.dump(calvin_data, f, indent=2, ensure_ascii=False)
    
    # 生成汇总数据（用于主页展示）
    # 主页只展示 Calvin ABC-D 榜单
    summary = {
        'libero': {
            'total_models': len(libero_data),
            'primary_metric': 'Average Success Rate (%)',
            'top_5': [{'name': m['name'], 'score': m.get('average'), 'rank': m['rank']} 
                      for m in libero_data[:5]]
        },
        'metaworld': {
            'total_models': len(metaworld_data),
            'primary_metric': 'Average Success Rate (%)',
            'top_5': [{'name': m['name'], 'score': m.get('average'), 'rank': m['rank']} 
                      for m in metaworld_data[:5]]
        },
        'calvin': {
            'total_models': len(calvin_abc_d_data),
            'primary_metric': 'Average Length (Avg. Len.)',
            'description': 'ABC-D Setting (Default)',
            'top_5': [{'name': m['name'], 'score': m.get('avg_len'), 'rank': m['rank']} 
                      for m in calvin_abc_d_data[:5]],
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
    print("=" * 50)
    print("数据处理完成！")
    print("=" * 50)
    print(f"总模型数: {len(all_models)}")
    print(f"Libero 榜单模型数: {len(libero_data)}")
    print(f"Meta-World 榜单模型数: {len(metaworld_data)}")
    print(f"Calvin 榜单:")
    print(f"  - ABCD-D: {len(calvin_abcd_d_data)} 个模型")
    print(f"  - ABC-D (主榜单): {len(calvin_abc_d_data)} 个模型")
    print(f"  - D-D: {len(calvin_d_d_data)} 个模型")
    print("=" * 50)
    print("\n生成的文件:")
    print("  - libero.json: Libero 榜单数据")
    print("  - metaworld.json: Meta-World 榜单数据")
    print("  - calvin.json: Calvin 榜单数据 (包含 ABCD-D, ABC-D, D-D 三个子榜单)")
    print("  - data.json: 汇总数据（用于主页，Calvin 展示 ABC-D 榜单）")


if __name__ == '__main__':
    process_csv()
