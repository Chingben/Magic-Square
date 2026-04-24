# 猫之家幻方实验 (Cat House Magic Square Lab)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A interactive web application for generating and exploring magic squares of various orders. Construct multiple valid magic squares using classical mathematical methods, visualize the construction process, and verify the results with detailed step-by-step explanations.

一个用于生成和探索各种阶数幻方的交互式 Web 应用程序。使用经典数学方法构造多种有效的幻方，可视化构造过程，并通过详细的分步解释验证结果。

## 🌟 Features / 功能特色

- **Multi-Order Support**: Generate magic squares for any order n > 2 (up to 99 for performance reasons)
- **Classical Construction Methods**:
  - Odd Order: Siamese (Star Leap) Method
  - Doubly Even Order: Mirror Method
  - Singly Even Order: Composite Method
- **Multiple Variations**: Automatically generate up to 20+ valid variations per order using rotations, reflections, complements, and symmetry swaps
- **Interactive Visualization**: 
  - Grid-based display with responsive design
  - Color-coded verification for rows, columns, and diagonals
  - Mini-boards for step-by-step construction lessons
- **Educational Mode**: Detailed "Teacher Mode" lessons explaining each construction method with visual aids
- **Copy Functionality**: Easily copy the current magic square as plain text
- **Random Generation**: Quick random order selection for inspiration
- **Responsive Design**: Works on desktop and mobile devices

- **多阶数支持**：为任何大于 2 的阶数 n 生成幻方（出于性能考虑，上限为 99）
- **经典构造方法**：
  - 奇数阶：暹罗法（星跃法）
  - 双偶阶：镜像法
  - 单偶阶：拼合法
- **多种变体**：使用旋转、反射、互补和对称交换自动生成每个阶数的 20+ 种有效变体
- **交互式可视化**：
  - 基于网格的响应式显示
  - 行、列和对角线的颜色编码验证
  - 分步构造课程的小型棋盘
- **教育模式**：详细的“教师模式”课程，使用视觉辅助解释每种构造方法
- **复制功能**：轻松将当前幻方复制为纯文本
- **随机生成**：快速随机阶数选择以获取灵感
- **响应式设计**：适用于桌面和移动设备

## 🚀 Usage / 使用方法

1. Open `index.html` in any modern web browser
2. Enter a magic square order (n) greater than 2 in the input field
3. Click "生成幻方" (Generate Magic Square) or "随机灵感" (Random Inspiration)
4. Browse through the generated solutions in the sidebar
5. View the verification details for each row, column, and diagonal
6. Click "详细讲解" (Detailed Explanation) to see step-by-step construction lessons

1. 在任何现代 Web 浏览器中打开 `index.html`
2. 在输入字段中输入大于 2 的幻方阶数 (n)
3. 点击“生成幻方”或“随机灵感”
4. 在侧边栏中浏览生成的解决方案
5. 查看每行、每列和对角线的验证详情
6. 点击“详细讲解”查看分步构造课程

### Magic Constant / 幻和

The magic constant (sum of each row, column, and diagonal) is calculated as:
```
S = n(n² + 1) / 2
```

幻和（每行、每列和对角线的总和）计算公式为：
```
S = n(n² + 1) / 2
```

## 🛠️ Technologies / 技术栈

- **HTML5**: Semantic structure and accessibility features
- **CSS3**: Custom properties, gradients, and responsive grid layouts
- **Vanilla JavaScript**: No frameworks or dependencies required
- **Math Algorithms**: Implementation of classical magic square construction methods

- **HTML5**：语义结构和无障碍功能
- **CSS3**：自定义属性、渐变和响应式网格布局
- **原生 JavaScript**：无需框架或依赖
- **数学算法**：经典幻方构造方法的实现

## 📚 Construction Methods / 构造方法

### Odd Order (n odd) / 奇数阶 (n 为奇数)
Uses the Siamese method: Start with 1 in the middle of the first row, then move diagonally up-right, wrapping around edges and dropping down when blocked.

使用暹罗法：从第一行中间开始放置 1，然后对角向上右移动，绕过边缘并在被阻挡时向下掉落。

### Doubly Even Order (n ≡ 0 mod 4) / 双偶阶 (n ≡ 0 mod 4)
Uses the mirror method: Fill sequentially, then swap numbers with their "mirror partners" (n² + 1 - x) in specific positions.

使用镜像法：顺序填充，然后在特定位置将数字与其“镜像伙伴”（n² + 1 - x）交换。

### Singly Even Order (n ≡ 2 mod 4) / 单偶阶 (n ≡ 2 mod 4)
Uses the composite method: Divide into four quadrants filled with scaled odd-order magic squares, then perform strategic row/column swaps.

使用拼合法：分成四个象限，用缩放的奇数阶幻方填充，然后进行策略性的行/列交换。

## 📱 Screenshots / 截图

*(Add actual screenshots here when publishing to GitHub)* / *(发布到 GitHub 时在此添加实际截图)*

- Main interface with order input and control panel / 带有阶数输入和控制面板的主界面
- Magic square grid with verification results / 带有验证结果的幻方网格
- Detailed lesson mode showing construction steps / 显示构造步骤的详细课程模式
- Multiple solution variations in sidebar / 侧边栏中的多种解决方案变体

## 🤝 Contributing / 贡献

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

欢迎贡献！请随时提交拉取请求。对于重大更改，请先打开问题讨论您想要更改的内容。

1. Fork the project / 分叉项目
2. Create your feature branch (`git checkout -b feature/AmazingFeature`) / 创建您的功能分支
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`) / 提交您的更改
4. Push to the branch (`git push origin feature/AmazingFeature`) / 推送到分支
5. Open a Pull Request / 打开拉取请求

## 📄 License / 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

本项目采用 MIT 许可证 - 详情请见 [LICENSE](LICENSE) 文件。

## 🙏 Acknowledgments / 致谢

- Inspired by classical recreational mathematics / 受经典娱乐数学启发
- Construction methods based on historical algorithms / 构造方法基于历史算法
- UI design inspired by modern data visualization tools / UI 设计受现代数据可视化工具启发