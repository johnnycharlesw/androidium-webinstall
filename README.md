# Androidium web installer

This is an easy-to-use web installer for Androidium that runs entirely in the browser. It uses WebUSB, which is supported by Chromium and its derivatives, and @kdrag0n's  [fastboot.js](https://github.com/kdrag0n/fastboot.js) library for flashing. This allows it to work on computers and Android devices software with no additional software or command-line tools.

## Install process

The following screenshots show the entire installation process, from start to finish:

## Adapting for other ROMs

This installer was built for Androidium specifically, other ROMs may work but could require heavy tweaking for branding so you may as well [fork the upstream ProtonAOSP installer (Androidium is not built on ProtonAOSP, it just reuses installer code)](https://github.com/kdrag0n/android-webinstall)

You can start with the following Yarn commands:

- `yarn install`
- `yarn serve`
- `yarn build`
- `yarn lint`

All configuration is in `src/config.js` and `.env`, and the release index at `public/releases/index.json` is fetched from the root of the domain hosting the installer. You may also want to change the favicon at `public/favicon.png`.

## Contributing

Contributions are welcome! If you adapt this installer or make other improvements to it, please contribute the improvements back to the official repository instead of forking it and keeping the changes to yourself. There are many rough edges that need to be improved upon.
