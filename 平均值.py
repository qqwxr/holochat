print("Hello, 这是一个求平均值的程序。")

# 获取用户输入
numbers_input = input("请输入一些数字，用逗号分隔：").strip()

# 检查空输入
if not numbers_input:
    print("错误：输入不能为空！")
else:
    # 分割并清理输入（处理空格）
    raw_parts = numbers_input.split(",")
    cleaned_parts = [p.strip() for p in raw_parts if p.strip()]
    
    # 检查是否有输入内容
    if not cleaned_parts:
        print("错误：没有输入任何数字！")
    else:
        # 验证并转换数字
        valid_numbers = []
        invalid_inputs = []
        
        for part in cleaned_parts:
            try:
                num = float(part)
                valid_numbers.append(num)
            except ValueError:
                invalid_inputs.append(part)
        
        # 提示无效输入
        if invalid_inputs:
            print(f"注意：以下输入不是有效的数字，将被忽略：{invalid_inputs}")
        
        # 检查是否有有效数字
        if not valid_numbers:
            print("错误：没有有效的数字可以计算！")
        else:
            # 计算平均值
            total = sum(valid_numbers)
            count = len(valid_numbers)
            
            # 避免除零错误（这里已经确保count>0）
            average = total / count
            
            # 输出结果
            print(f"\n=== 计算结果 ===")
            print(f"有效数字：{valid_numbers}")
            print(f"数字个数：{count}")
            print(f"总和：{total}")
            print(f"平均值：{average}")
            print(f"平均值（保留2位小数）：{average:.2f}")