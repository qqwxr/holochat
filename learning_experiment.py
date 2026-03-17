"""
Python 学习实验代码：学生成绩管理系统
涵盖内容：变量、数据类型、列表、字典、函数、条件语句、循环、文件操作等
"""

# ==================== 1. 基础数据类型和变量 ====================
print("=" * 50)
print("1. 基础数据类型演示")
print("=" * 50)

# 字符串
name = "张三"
print(f"姓名: {name}")

# 数字
age = 20
score = 85.5
print(f"年龄: {age}, 类型: {type(age)}")
print(f"分数: {score}, 类型: {type(score)}")

# 布尔值
is_pass = score >= 60
print(f"是否及格: {is_pass}")

# ==================== 2. 列表和循环 ====================
print("\n" + "=" * 50)
print("2. 列表和循环演示")
print("=" * 50)

# 创建列表
students = ["张三", "李四", "王五", "赵六"]
print(f"学生列表: {students}")
print(f"第一个学生: {students[0]}")
print(f"列表长度: {len(students)}")

# 遍历列表
print("\n遍历每个学生:")
for i, student in enumerate(students, 1):
    print(f"  {i}. {student}")

# 列表推导式
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
print(f"\n平方数字: {squares}")

# ==================== 3. 字典 ====================
print("\n" + "=" * 50)
print("3. 字典演示")
print("=" * 50)

# 创建字典
student_info = {
    "name": "张三",
    "age": 20,
    "score": 85,
    "major": "计算机科学"
}

print(f"学生信息: {student_info}")
print(f"姓名: {student_info['name']}")
print(f"分数: {student_info['score']}")

# 遍历字典
print("\n学生详细信息:")
for key, value in student_info.items():
    print(f"  {key}: {value}")

# ==================== 4. 函数 ====================
print("\n" + "=" * 50)
print("4. 函数演示")
print("=" * 50)

def calculate_grade(score):                    # 函数功能：根据分数计算等级(A-F)
    """
    根据分数计算等级                             # 参数：score(分数值，整数或浮点数)
    90-100: A, 80-89: B, 70-79: C, 60-69: D, <60: F   # 返回值：等级字符串('A'/'B'/'C'/'D'/'F')
    """
    if score >= 90:                            # 如果分数>=90，返回A
        return "A"
    elif score >= 80:                          # 否则如果分数>=80，返回B
        return "B"
    elif score >= 70:                          # 否则如果分数>=70，返回C
        return "C"
    elif score >= 60:                          # 否则如果分数>=60，返回D
        return "D"
    else:                                       # 否则分数<60，返回F(不及格)
        return "F"

def calculate_average(scores):                 # 函数功能：计算一组分数的平均值
    """计算平均分"""                              # 参数：scores(分数列表)
    return sum(scores) / len(scores)          # 逻辑：所有分数相加 ÷ 分数个数 = 平均分

# 测试函数
test_scores = [85, 90, 78, 92, 88]
print(f"分数列表: {test_scores}")
print(f"平均分: {calculate_average(test_scores):.2f}")

print("\n各分数对应的等级:")
for score in test_scores:
    grade = calculate_grade(score)
    print(f"  {score} -> {grade}")

# ==================== 5. 条件语句 ====================
print("\n" + "=" * 50)
print("5. 条件语句演示")
print("=" * 50)

score = 75

if score >= 90:
    status = "优秀"
elif score >= 80:
    status = "良好"
elif score >= 70:
    status = "中等"
elif score >= 60:
    status = "及格"
else:
    status = "不及格"

print(f"分数: {score} -> 评价: {status}")

# ==================== 6. 文件操作 ====================
print("\n" + "=" * 50)
print("6. 文件操作演示")
print("=" * 50)

# 写入文件
data = [
    "班级成绩记录\n",
    "=" * 30 + "\n"
]

for name, score in [("张三", 85), ("李四", 92), ("王五", 78)]:
    data.append(f"{name}: {score}分 -> {calculate_grade(score)}等\n")

# 创建文件
with open("c:\\Users\\me\\Desktop\\py\\grades.txt", "w", encoding="utf-8") as f:
    f.writelines(data)

print("已写入文件: grades.txt")

# 读取文件
print("\n读取文件内容:")
with open("c:\\Users\\me\\Desktop\\py\\grades.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# ==================== 7. 综合练习 ====================
print("=" * 50)
print("7. 综合练习：成绩统计")
print("=" * 50)

class Student:                                  # 定义学生类：用来存储和处理学生信息
    """学生类"""                                   # 类属性：name(学生名字) scores(分数列表)
    def __init__(self, name, scores):              # 初始化函数：当创建Student对象时自动调用
        self.name = name                           # 将参数name赋值给对象的name属性
        self.scores = scores                       # 将参数scores赋值给对象的scores属性
    
    def get_average(self):                         # 方法功能：计算该学生的平均分数
        return sum(self.scores) / len(self.scores) if self.scores else 0  # 逻辑：如果存在分数则计算，否则返回0
    
    def get_max_score(self):                       # 方法功能：获取该学生的最高分数
        return max(self.scores) if self.scores else 0  # 逻辑：使用max()函数找出列表中的最大值
    
    def get_min_score(self):                       # 方法功能：获取该学生的最低分数
        return min(self.scores) if self.scores else 0  # 逻辑：使用min()函数找出列表中的最小值
    
    def display_info(self):                        # 方法功能：打印显示该学生的所有信息统计
        print(f"学生: {self.name}")                    # 打印学生名字
        print(f"  分数: {self.scores}")                # 打印所有分数列表
        print(f"  平均分: {self.get_average():.2f}")  # 打印平均分(保留2位小数)
        print(f"  最高分: {self.get_max_score()}")    # 打印最高分
        print(f"  最低分: {self.get_min_score()}")    # 打印最低分

# 创建学生对象
students_list = [
    Student("张三", [85, 90, 88, 92]),
    Student("李四", [78, 82, 79, 81]),
    Student("王五", [95, 98, 96, 97])
]

print("\n学生成绩统计:\n")
for student in students_list:
    student.display_info()
    print()

print("=" * 50)
print("实验代码执行完成！")
print("=" * 50)
