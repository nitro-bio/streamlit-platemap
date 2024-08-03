# streamlit_platemap

Streamlit component for 3D Plotly plot w/ custom Molecule overlay

## Dev

Start frontend build
```sh
cd src/streamlit_platemap/frontend
pnpm i
pnpm build:watch
```

start backend
```sh
cd src/streamlit_platemap/
# install deps
streamlit run __init__.py
```

## Installation instructions 

```sh
pip install streamlit_platemap
```

## Usage instructions

```python
import streamlit as st

from streamlit_platemap import streamlit_platemap

value = streamlit_platemap()

st.write(value)
