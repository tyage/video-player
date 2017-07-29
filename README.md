# Video player for Atom

[![Build Status](https://travis-ci.org/tyage/video-player.svg?branch=master)](https://travis-ci.org/tyage/video-player)

![sample image](https://user-images.githubusercontent.com/177858/28745983-aa4bd1a8-74be-11e7-94cc-76632035ca7a.gif)

## Usage

### Play videos in background

1. `Video Player: Play In Background` or `Ctrl-Alt-P` to start
2. Select video files
3. `Video Player: Stop` or `Ctrl-Alt-S` to stop

### Play videos in new tab

1. `Video Player: Play In New Tab` to start
2. Select video files
3. Close tab to stop

## Requirements

- [vlc](http://www.videolan.org/vlc/) (VLC is used when the codecs are unsupported)

## Commands

### For videos that runs in new tab

#### `Video Player: Play In New Tab`

It plays the video in a new tab.

### For video that runs in background

#### `Video Player: Play In Background`

It plays the video in background.

#### `Video Player: Stop`

It stops background video.

#### `Video Player: Toggle back and forth`

It displays the background video to front (or back).

#### `Video Player: Toggle controller`

It shows (or hides) the background video controller.

#### `Video Player: Reload source`

It reload the source of background video.

This command is useful when video stops unexpectedly.

#### `Video Player: Pause`

It pauses the background video.

#### `Video Player: Resume`

It resumes the background video.

This command is useful when the video is paused.
