# macOS 安装指南

由于 readiamond 是开源应用，没有 Apple 的代码签名证书，macOS 可能会因为安全限制阻止应用运行。请按照以下步骤安装和运行应用：

## 第一步：下载应用

1. 访问 [Releases](https://github.com/parsifal486/readiamond/releases) 页面
2. 下载最新的 `readiamond-Mac-*-Installer.dmg` 文件
3. 等待下载完成

## 第二步：允许所有来源的应用（一次性设置）

macOS 默认只允许来自 App Store 和已识别开发者的应用。由于 readiamond 是开源应用，你需要允许所有来源的应用：

1. 点击屏幕左上角的 **苹果菜单**（🍎）
2. 选择 **系统设置**（旧版 macOS 为 **系统偏好设置**）
3. 在顶部搜索栏输入 **"安全"** 或 **"隐私"**
4. 点击 **隐私与安全性**（或 **安全性与隐私**）
5. 向下滚动找到 **"允许从以下位置下载的应用："** 部分
6. 你会看到三个选项：
   - App Store
   - App Store 和被认可的开发者
   - **任何来源**（此选项可能被隐藏）
7. 如果看不到"任何来源"选项，需要通过终端启用：
   - 打开 **终端**（按 `Cmd + Space`，输入"终端"，按回车）
   - 复制并粘贴以下命令：
     ```bash
     sudo spctl --master-disable
     ```
   - 按回车
   - 输入你的 Mac 密码（输入时不会显示，这是正常的）
   - 再次按回车
8. 返回系统设置 → 隐私与安全性
9. 现在应该能看到 **"任何来源"** 选项了
10. 选择 **"任何来源"** 以允许所有应用

## 第三步：移除隔离属性

macOS 会给下载的文件添加"隔离"属性，这会阻止它们运行。移除它：

1. 打开 **终端**（按 `Cmd + Space`，输入"终端"，按回车）
2. 进入下载文件夹：
   ```bash
   cd ~/Downloads
   ```
3. 移除 DMG 文件的隔离属性：
   ```bash
   xattr -d com.apple.quarantine readiamond-Mac-*-Installer.dmg
   ```
   *（将 `*` 替换为实际版本号，例如 `readiamond-Mac-0.0.1-beta.4-Installer.dmg`）*
   
   **提示：** 你可以输入 `readiamond` 然后按 `Tab` 键自动补全文件名
4. 如果看到"No such xattr"错误，没关系 - 这表示文件没有隔离属性

## 第四步：安装应用

1. 双击下载文件夹中的 `readiamond-Mac-*-Installer.dmg` 文件
2. 会打开一个窗口，显示 readiamond 应用图标
3. 将 **readiamond** 图标拖拽到 **应用程序** 文件夹图标上
4. 等待复制完成
5. 弹出 DMG 磁盘映像（在 Finder 中点击旁边的弹出按钮，或拖到废纸篓）

## 第五步：移除已安装应用的隔离属性

1. 再次打开 **终端**
2. 移除已安装应用的隔离属性：
   ```bash
   xattr -d com.apple.quarantine /Applications/readiamond.app
   ```
3. 如果看到"No such xattr"错误，没关系 - 继续下一步

## 第六步：启动应用

1. 打开 **访达**（Finder）
2. 进入 **应用程序** 文件夹（按 `Cmd + Shift + A` 或点击侧边栏的应用程序）
3. 在列表中找到 **readiamond**
4. **右键点击**（或 `Ctrl + 点击`）readiamond
5. 从上下文菜单中选择 **打开**
6. 可能会看到安全警告 - 再次点击 **打开**
7. 应用应该会启动！

## 故障排除

### "readiamond 无法打开，因为无法验证开发者"

**解决方法：** 右键点击应用 → 打开 → 在对话框中点击打开

### "readiamond 已损坏，无法打开"

**解决方法：** 在终端运行以下命令：
```bash
sudo xattr -rd com.apple.quarantine /Applications/readiamond.app
```
然后再次尝试打开

### 安装后应用无法启动

- 确保你完成了第二步（允许所有来源的应用）
- 再次尝试移除隔离属性：`xattr -d com.apple.quarantine /Applications/readiamond.app`

---


[← 返回 README](../README.md)

