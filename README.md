# 高中化学可视化平台

面向高中化学课堂的交互式可视化项目。第一个模块是 **电子云杂化实验室**：拖动进度条，观察未杂化的 s、p 电子云如何重组成 sp / sp² / sp³ 杂化轨道。

![电子云杂化实验室预览](preview.png)

## 在线访问

GitHub Pages 部署后地址为：

```text
https://chemleon6657.github.io/chemistry-visual-lab/
```

## 已收录模块

| 模块 | 内容 | 入口 |
| --- | --- | --- |
| 电子云杂化实验室 | sp / sp² / sp³ 杂化过程、键角、空间构型、典型分子 | `index.html` |

## 特点

- 单文件 HTML，无外部 CDN、无第三方框架，离线也能打开。
- 原生 WebGL 渲染半透明轨道曲面与粒子电子云。
- 支持手机、平板和桌面端；可拖动旋转、滚轮缩放、全屏观察。
- 支持 `?type=sp|sp2|sp3&t=0..1` 参数，便于课堂预设画面。

## 本地预览

直接双击 `index.html`，或在当前目录运行：

```powershell
py -m http.server 8000
```

然后打开 `http://localhost:8000/`。

## 添加新模块

1. 新建独立 HTML 页面，例如 `modules/periodic-trends.html`。
2. 在首页或模块索引中加入链接。
3. 保持单文件优先；如需资源，放在 `assets/` 下并使用相对路径。
4. 推送到 `main` 分支，GitHub Pages 会自动更新。

## 科学说明

杂化轨道由原子轨道线性组合而成。页面为了便于观察，将量子力学叠加过程连续化，轨道轮廓与粒子位置变化仅作教学示意，不代表电子真实运动轨迹。

## 技术

- HTML / CSS / JavaScript
- WebGL 1.0
- 无构建步骤，推送即发布
