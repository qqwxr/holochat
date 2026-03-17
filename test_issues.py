# 测试原始代码的问题

def test_original_code():
    # 模拟原始代码的逻辑
    print("=== 测试原始代码的问题 ===")
    
    test_cases = [
        ("正常输入", "1,2,3,4,5"),
        ("带空格的输入", "1, 2, 3, 4, 5"),
        ("空字符串", ""),
        ("只有一个逗号", ","),
        ("非数字字符", "1,2,a,4"),
        ("小数输入", "1.5,2.7,3.9"),
        ("混合空格和数字", " 1 , 2 , 3 "),
    ]
    
    for name, input_str in test_cases:
        print(f"\n测试: {name}")
        print(f"输入: '{input_str}'")
        
        try:
            # 原始代码逻辑
            number_list = input_str.split(",")
            print(f"分割后列表: {number_list}")
            
            number_list = [float(x) for x in number_list]
            print(f"转换后列表: {number_list}")
            
            if len(number_list) > 0:
                average = sum(number_list) / len(number_list)
                print(f"平均值: {average}")
            else:
                print("错误: 列表为空，无法计算平均值")
                
        except ValueError as e:
            print(f"ValueError: {e} - 无法将某些元素转换为浮点数")
        except ZeroDivisionError as e:
            print(f"ZeroDivisionError: {e} - 列表长度为0，无法计算平均值")
        except Exception as e:
            print(f"其他错误: {type(e).__name__}: {e}")

if __name__ == "__main__":
    test_original_code()