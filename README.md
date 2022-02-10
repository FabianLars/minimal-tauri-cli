# DEPRECATED

We rewrote `@tauri-apps/cli` with napi-rs and removed the icon command. Therefore it got rid of all the dependency bloat rendering `minimal-tauri-cli` useless, especially since we don't plan to release on https://github.com/tauri-apps/binary-releases anymore.

# minimal-tauri-cli

A minimal wrapper for a prebuilt version of tauri's cli, without any dependencies. Initially created for CI/CD to reduce installation time and size of the node_modules/ folder.

Downloads the cli from https://github.com/tauri-apps/binary-releases and forwards any calls like `npm tauri dev` to the binary.

## About Tauri

See: https://tauri.studio and https://github.com/tauri-apps/tauri

# Installation

This package is meant to be installed locally as a development dependency:

```
$ npm install --save-dev minimal-tauri-cli
$ yarn add --dev minimal-tauri-cli
$ pnpm install --dev minimal-tauri-cli
```

# Usage

### Example syntax:

```
$ pnpm tauri dev
```

### To forward arguments like `--debug` you might need to prefix them with an extra `--`:

```
$ pnpm tauri build -- --debug
```

### `tauri help`:

```
$ pnpm tauri help

USAGE:
    cargo tauri [SUBCOMMAND]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

SUBCOMMANDS:
    build    Tauri build.
    dev      Tauri dev.
    help     Prints this message or the help of the given subcommand(s)
    info     Shows information about Tauri dependencies
    init     Initializes a Tauri project
    sign     Tauri updates signer.
```

# Warnings:

-   Conflicts with `@tauri-apps/cli`.
-   Might have version mismatches with `@tauri-apps/cli`, because `minimal-tauri-cli`'s version is synced with its rust-based counterpart, see: https://github.com/tauri-apps/tauri/tree/dev/tooling/cli.rs
-   tauri-cli's version `1.0.0-beta.6` is wrapped in `0.0.0-beta.6`, because i had to publish it twice due to missing file permissions :(
-   Doesn't support `tauri icon` and `tauri deps` as long as they are not provided by tauri's rust-based cli.
-   There is only a bare minimum of error handling implemented.
-   The download function is pretty primitive and might fail on complex network setups.
