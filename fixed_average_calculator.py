#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# 这是一个计算平均值的Python程序（增强版）
# 功能：接收用户输入的数字，计算平均值，并提供重复计算选项
# 作者：未知（原始代码），注释添加者：Roo
# 版本：增强版（包含错误处理和用户友好交互）

print("Hello, 这是一个求平均值的程序（增强版）。")
# 打印欢迎信息，告知用户程序功能

def calculate_average():
    """
    计算用户输入数字的平均值
    函数流程：
    1. 提示用户输入以逗号分隔的数字
    2. 验证输入是否为空
    3. 分割字符串并清理空白字符
    4. 检查是否有有效数字
    5. 将字符串转换为浮点数，过滤无效输入
    6. 计算平均值并输出结果
    7. 处理可能出现的异常
    """
    try:
        # 获取用户输入：使用input函数获取用户输入，strip()去除首尾空白字符
        numbers_input = input("请输入一些数字，用逗号分隔：").strip()
        
        # 处理空输入：如果用户直接按回车或输入全是空白，提示错误并退出函数
        if not numbers_input:
            print("错误：输入不能为空！")
            return
        
        # 分割输入，去除空白字符：
        # 1. 使用split(",")按逗号分割字符串
        # 2. 列表推导式遍历每个分割后的字符串，用strip()去除空白
        # 3. if s.strip() 过滤掉空字符串（例如连续逗号产生的空项）
        number_strings = [s.strip() for s in numbers_input.split(",") if s.strip()]
        
        # 检查是否有有效数字：如果列表为空，说明用户没有输入任何有效内容
        if not number_strings:
            print("错误：没有输入有效的数字！")
            return
        
        # 尝试转换字符串为浮点数：
        # 初始化两个列表，分别存储有效数字和无效输入
        number_list = []        # 存储成功转换为浮点数的数字
        invalid_inputs = []     # 存储无法转换的字符串（用于错误提示）
        
        # 遍历每个分割后的字符串，尝试转换为浮点数
        for s in number_strings:
            try:
                # 使用float()函数进行转换，如果转换成功则添加到number_list
                number_list.append(float(s))
            except ValueError:
                # 如果转换失败（例如输入"abc"、"12a"等），捕获ValueError异常
                # 将该字符串添加到invalid_inputs列表，以便后续提示用户
                invalid_inputs.append(s)
        
        # 如果有无效输入，提示用户：使用格式化字符串输出无效输入列表
        if invalid_inputs:
            print(f"警告：以下输入不是有效的数字，将被忽略：{invalid_inputs}")
        
        # 检查是否还有有效数字：如果所有输入都无效，number_list将为空
        # 此时无法计算平均值，提示错误并退出函数
        if not number_list:
            print("错误：没有有效的数字可以计算平均值！")
            return
        
        # 计算平均值：使用sum函数求和，除以列表长度得到平均值
        average = sum(number_list) / len(number_list)
        
        # 格式化输出（保留2位小数）：使用格式化字符串输出计算结果
        print(f"\n=== 计算结果 ===")
        print(f"输入的有效数字：{number_list}")   # 显示用户输入的有效数字列表
        print(f"数字个数：{len(number_list)}")      # 显示有效数字的数量
        print(f"总和：{sum(number_list)}")          # 显示所有数字的总和
        print(f"平均值：{average:.2f}")  # 保留2位小数，使用:.2f格式化
        
    except KeyboardInterrupt:
        # 处理用户按下Ctrl+C中断程序的情况
        print("\n\n程序被用户中断。")
    except Exception as e:
        # 捕获其他未知异常，防止程序崩溃，并打印错误信息
        print(f"发生未知错误：{e}")

def main():
    """
    主函数，提供重复计算选项
    功能：无限循环，每次循环执行一次平均值计算
          每次计算后询问用户是否继续，根据用户输入决定是否退出
    """
    while True:
        # 打印分隔线，使每次计算之间的界面更清晰
        print("\n" + "="*40)
        # 调用calculate_average函数执行核心计算逻辑
        calculate_average()
        
        # 询问是否继续：获取用户输入，转换为小写并去除空白
        choice = input("\n是否继续计算？(y/n): ").strip().lower()
        # 检查用户输入是否表示继续：如果输入不在继续列表中，则退出循环
        if choice not in ['y', 'yes', '是', '继续']:
            print("感谢使用，再见！")
            break

if __name__ == "__main__":
    # 程序入口：当直接运行此脚本时，执行main函数
    # 如果此脚本被导入为模块，则不会自动执行main函数
    main()

