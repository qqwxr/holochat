import math

def solve_quadratic(a, b, c):
    """
    解一元二次方程 ax² + bx + c = 0
    返回根的列表，如果有实根的话
    """
    discriminant = b**2 - 4*a*c
    if discriminant > 0:
        root1 = (-b + math.sqrt(discriminant)) / (2*a)
        root2 = (-b - math.sqrt(discriminant)) / (2*a)
        return [root1, root2]
    elif discriminant == 0:
        root = -b / (2*a)
        return [root]
    else:
        # 虚根
        real_part = -b / (2*a)
        imag_part = math.sqrt(-discriminant) / (2*a)
        return [f"{real_part} + {imag_part}i", f"{real_part} - {imag_part}i"]

# 示例使用
if __name__ == "__main__":
    a = float(input("请输入a: "))
    b = float(input("请输入b: "))
    c = float(input("请输入c: "))
    roots = solve_quadratic(a, b, c)
    print("方程的根:", roots)
 