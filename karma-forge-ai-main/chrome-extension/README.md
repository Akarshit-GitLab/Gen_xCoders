# HabitForge Chrome Extension

This Chrome extension tracks digital habits and integrates with the HabitForge web application.

## Features

- **Tab Activity Tracking**: Monitors time spent on different websites
- **Tab Switch Counting**: Tracks how often you switch between tabs
- **Idle/Active Time Detection**: Distinguishes between active usage and idle time
- **Karma Score Display**: Shows your current karma score and level progress
- **Real-time Stats**: View session statistics in the popup
- **Auto-sync**: Automatically syncs data with your HabitForge account

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `chrome-extension` folder
4. The HabitForge extension should now appear in your extensions

## Setup

1. Click the HabitForge extension icon in your browser toolbar
2. Click "Login to HabitForge" to connect your account
3. Log in to your HabitForge account in the web app
4. The extension will automatically start tracking your digital habits

## Privacy

- All data is stored locally until synced with your HabitForge account
- No personal browsing data is shared with third parties
- You can view and manage your data through the HabitForge dashboard

## Permissions

- **tabs**: Monitor tab activity and switches
- **activeTab**: Track time spent on current tab
- **storage**: Store auth tokens and temporary data
- **idle**: Detect when user is inactive
- **host**: Communicate with HabitForge web app

## Development

The extension consists of:
- `manifest.json`: Extension configuration
- `background.js`: Service worker for tracking
- `content.js`: Injected script for activity detection
- `popup.html/css/js`: Extension popup interface