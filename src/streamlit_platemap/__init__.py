from pathlib import Path
from typing import List, Union, Literal, Optional, Dict, Any
import pandas as pd
import streamlit as st
import streamlit.components.v1 as components
from dataclasses import dataclass
from typing import List, Optional, Union

COLOR = Union[
    Literal["red"],
    Literal["green"],
    Literal["blue"],
    Literal["yellow"],
    Literal["cyan"],
    Literal["fuchsia"],
]


@dataclass
class WellAnnotation:
    id: str
    wells: List[int]
    label: str
    color: COLOR


@dataclass
class RowAnnotation:
    id: str
    rows: List[int]
    label: str
    color: COLOR


@dataclass
class ColAnnotation:
    id: str
    cols: List[int]
    label: str
    color: COLOR


@dataclass
class StreamlitDataSchema:
    wells: Union[Literal[24], Literal[96], Literal[48], Literal[384]]
    rowAnnotations: List[RowAnnotation]
    colAnnotations: List[ColAnnotation]
    wellAnnotations: List[WellAnnotation]


# Tell streamlit that there is a component called streamlit_platemap,
# and that the code to display that component is in the "frontend" folder
frontend_dir = (Path(__file__).parent / "frontend/dist").absolute()
_component_func = components.declare_component(
    "streamlit_platemap", path=str(frontend_dir)
)


def streamlit_platemap(data: Dict[str, Any]) -> List[WellAnnotation]:
    """
    Add a descriptive docstring
    """
    parsed = StreamlitDataSchema(**data)
    back_to_dict = parsed.__dict__
    component_value = _component_func(**back_to_dict)
    if component_value is None:
        return []
    else:
        return component_value["wellAnnotations"]
