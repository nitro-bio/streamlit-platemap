from pathlib import Path
from typing import List, Union, Literal, TypedDict, Optional
import pandas as pd
import streamlit as st
import streamlit.components.v1 as components

# Tell streamlit that there is a component called molecule3dplot,
# and that the code to display that component is in the "frontend" folder
frontend_dir = (Path(__file__).parent / "frontend/dist").absolute()
_component_func = components.declare_component(
    "streamlit_platemap", path=str(frontend_dir)
)


# TODO: add args
def streamlit_platemap() -> List[int]:
    """
    Add a descriptive docstring
    """

    component_value = _component_func()
    if component_value is None:
        return []
    else:
        # TODO: add return value
        return [-1]
