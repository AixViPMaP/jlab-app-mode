# @jupyterlab/aixvipmap-appmode

JupyterLab extension: Adds an on-off switch to notebook toolbar to enable "app mode" (run all cells and hide code) 

## Prerequisites

* [JupyterLab](https://github.com/jupyterlab)

## Installation

```bash
npm install
npm run build
npm pack ./
jupyter labextension install *.tgz
```

## Development

### Init

```bash
npm install
npm run build
jupyter labextension install .
```

### Rebuild

```bash
npm run build
jupyter lab build
```
