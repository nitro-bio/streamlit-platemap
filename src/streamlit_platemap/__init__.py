from pathlib import Path
from typing import List, Union, Literal, TypedDict, Optional
import pandas as pd
import streamlit as st
import streamlit.components.v1 as components
from dataclasses import dataclass
from typing import List, Optional, Union


@dataclass
class WellAnnotation:
    id: str
    wells: List[int]
    label: str


@dataclass
class RowAnnotation:
    id: str
    rows: List[int]
    label: str


@dataclass
class ColAnnotation:
    id: str
    cols: List[int]
    label: str


@dataclass
class PlateSelectionSchema:
    wells: List[int]
    className: Optional[str] = None


@dataclass
class StreamlitDataSchema:
    wells: Union[Literal[24], Literal[96], Literal[48], Literal[384]]
    rowAnnotations: List[RowAnnotation]
    colAnnotations: List[ColAnnotation]
    wellAnnotations: List[WellAnnotation]
    selection: PlateSelectionSchema


# Tell streamlit that there is a component called molecule3dplot,
# and that the code to display that component is in the "frontend" folder
frontend_dir = (Path(__file__).parent / "frontend/dist").absolute()
_component_func = components.declare_component(
    "streamlit_platemap", path=str(frontend_dir)
)


# TODO: add args
def streamlit_platemap(data: StreamlitDataSchema) -> List[WellAnnotation]:
    """
    Add a descriptive docstring
    """
    data_dict = data.__dict__
    component_value = _component_func(**data_dict)
    if component_value is None:
        return []
    else:
        # TODO: add return value
        print(f"{component_value=}")
        return component_value["wellAnnotations"]
