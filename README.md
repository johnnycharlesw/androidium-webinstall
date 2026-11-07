# Androidium web installer

This is an easy-to-use web installer for Androidium that runs entirely in the browser. It uses WebUSB, which is supported by Chromium and its derivatives, and @kdrag0n's  [fastboot.js](https://github.com/kdrag0n/fastboot.js) library for flashing. This allows it to work on computers and Android devices with no additional software or command-line tools.

## Adapting for other variants of the ROM

You can start with the following Yarn commands:

- `yarn install`
- `yarn serve`
- `yarn build`
- `yarn lint`

All configuration is in `src/config.js`, and the release index at `public/releases/index.json` is fetched from the root of the domain hosting the installer.

## Contributing

Contributions are welcome! If you adapt this installer or make other improvements to it, please contribute the improvements back to this repository (to clarify, the upstream has not been maintained since 2022) instead of forking it and keeping the changes to yourself. There are many rough edges that need to be improved upon.
