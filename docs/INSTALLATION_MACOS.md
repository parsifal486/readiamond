# macOS Installation Guide

Since readiamond is an open-source application without Apple's code signing certificate, macOS may block the app from running due to security restrictions. Follow these steps to install and run the app:

## Step 1: Download the Application

1. Go to the [Releases](https://github.com/parsifal486/readiamond/releases) page
2. Download the latest `readiamond-Mac-*-Installer.dmg` file
3. Wait for the download to complete

## Step 2: Allow Apps from All Sources (One-time Setup)

macOS by default only allows apps from the App Store and identified developers. Since readiamond is open-source, you need to allow apps from all sources:

1. Click the **Apple menu** (🍎) in the top-left corner of your screen
2. Select **System Settings** (or **System Preferences** on older macOS versions)
3. In the search bar at the top, type **"security"** or **"privacy"**
4. Click on **Privacy & Security** (or **Security & Privacy**)
5. Scroll down to find the section **"Allow applications downloaded from:"**
6. You'll see three options:
   - App Store
   - App Store and identified developers
   - **Anywhere** (this option may be hidden)
7. If you don't see "Anywhere", you need to enable it via Terminal:
   - Open **Terminal** (press `Cmd + Space`, type "Terminal", press Enter)
   - Copy and paste this command:
     ```bash
     sudo spctl --master-disable
     ```
   - Press Enter
   - Enter your Mac password (you won't see the password as you type, this is normal)
   - Press Enter again
8. Go back to System Settings → Privacy & Security
9. You should now see **"Anywhere"** as an option
10. Select **"Anywhere"** to allow all applications

## Step 3: Remove Quarantine Attribute

macOS adds a "quarantine" attribute to downloaded files, which prevents them from running. Remove it:

1. Open **Terminal** (press `Cmd + Space`, type "Terminal", press Enter)
2. Navigate to your Downloads folder:
   ```bash
   cd ~/Downloads
   ```
3. Remove the quarantine attribute from the DMG file:
   ```bash
   xattr -d com.apple.quarantine readiamond-Mac-*-Installer.dmg
   ```
   *(Replace `*` with the actual version number, e.g., `readiamond-Mac-0.0.1-beta.4-Installer.dmg`)*
   
   **Tip:** You can type `readiamond` and press `Tab` to auto-complete the filename
4. If you see "No such xattr" error, that's okay - it means the file doesn't have quarantine attribute

## Step 4: Install the Application

1. Double-click the `readiamond-Mac-*-Installer.dmg` file in your Downloads folder
2. A window will open showing the readiamond app icon
3. Drag the **readiamond** icon to the **Applications** folder icon
4. Wait for the copy to complete
5. Eject the DMG disk image (click the eject button next to it in Finder, or drag it to Trash)

## Step 5: Remove Quarantine from the Installed App

1. Open **Terminal** again
2. Remove quarantine from the installed application:
   ```bash
   xattr -d com.apple.quarantine /Applications/readiamond.app
   ```
3. If you see "No such xattr" error, that's fine - proceed to the next step

## Step 6: Launch the Application

1. Open **Finder**
2. Go to **Applications** folder (press `Cmd + Shift + A` or click Applications in the sidebar)
3. Find **readiamond** in the list
4. **Right-click** (or `Ctrl + Click`) on readiamond
5. Select **Open** from the context menu
6. You may see a security warning - click **Open** again
7. The application should launch!

## Troubleshooting

### "readiamond cannot be opened because it is from an unidentified developer"

**Solution:** Right-click the app → Open → Click Open in the dialog

### "readiamond is damaged and can't be opened"

**Solution:** Run this command in Terminal:
```bash
sudo xattr -rd com.apple.quarantine /Applications/readiamond.app
```
Then try opening again

### App won't launch after installation

- Make sure you completed Step 2 (Allow apps from all sources)
- Try removing quarantine again: `xattr -d com.apple.quarantine /Applications/readiamond.app`

---

[← Back to README](../README.md)

