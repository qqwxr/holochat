def calculate_bmi(weight, height):
    """计算BMI值"""
    if height <= 0:
        raise ValueError("身高必须大于0")
    return weight / (height ** 2)

def get_bmi_category(bmi, gender):
    """根据BMI和性别返回分类"""
    if gender == "男":
        if bmi < 18.5:
            return "太瘦"
        elif bmi < 24:
            return "正常"
        elif bmi < 30:
            return "偏胖"
        else:
            return "肥胖"
    elif gender == "女":
        if bmi < 16:
            return "太瘦"
        elif bmi < 22:
            return "正常"
        elif bmi < 27:
            return "偏胖"
        else:
            return "肥胖"
    else:
        return None  # 无效性别

def main():
    try:
        # 输入验证
        height = float(input("请输入身高（m）："))
        weight = float(input("请输入体重（kg）："))
        gender = input("请输入性别（男/女）：").strip()  # 移除空格
        
        # 计算BMI
        bmi = calculate_bmi(weight, height)
        
        # 获取分类
        category = get_bmi_category(bmi, gender)
        if category is None:
            print("性别输入无效！请输入'男'或'女'。")
        else:
            print(f"BMI = {bmi:.2f}，分类：{category}")
    
    except ValueError as e:
        print(f"输入错误：{e}。请重新运行程序。")
    except Exception as e:
        print(f"发生未知错误：{e}")

if __name__ == "__main__":
    main()