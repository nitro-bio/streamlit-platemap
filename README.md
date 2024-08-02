# molecule3dplot

Streamlit component for 3D Plotly plot w/ custom Molecule overlay

## Dev

Start frontend build
```sh
cd src/molecule3dplot/frontend
pnpm i
pnpm build:watch
```

start backend
```sh
cd src/molecule3dplot/
# install deps
streamlit run __init__.py
```

## Installation instructions 

```sh
pip install molecule3dplot
```

## Usage instructions

```python
import streamlit as st

from molecule3dplot import molecule3dplot

value = molecule3dplot()

st.write(value)
