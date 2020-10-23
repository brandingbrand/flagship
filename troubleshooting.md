# Troubleshooting

This document contains solutions for certain issues our users encountered in the past while using
Flagship.

## Setup for Windows

This project utilizes symlinks for managing its TypeScript configurations. If you are developing on
windows, there are a few extra requirements.

1. Ensure that you are running git 2.28 or higher
    - Older versions of git either don't support or had bugs with symlinks
2. Enable git's symlink support
    - This can be done by editing your git config file or with `git config --global core.symlinks true`
3. Enable developer mode for Windows 10
    - By default, you must have administrator priviledges to create symlinks. Enabling developer
    mode allows non-admins to create these.
    - [Instructions and details](https://docs.microsoft.com/en-us/windows/uwp/get-started/enable-your-device-for-development)
