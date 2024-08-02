from pathlib import Path
from typing import List, Union, Literal, TypedDict, Optional
import pandas as pd
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    layout="wide",
)


# Tell streamlit that there is a component called molecule3dplot,
# and that the code to display that component is in the "frontend" folder
frontend_dir = (Path(__file__).parent / "frontend/dist").absolute()
_component_func = components.declare_component("molecule3dplot", path=str(frontend_dir))


class FilterColumn(TypedDict):
    key: str
    label: str
    values: List[str]
    filter_type: Union[Literal["number"], Literal["text"]]


def molecule3dplot(
    x: List[float],
    y: List[float],
    z: Optional[List[float]],
    xTitle: Optional[str],
    yTitle: Optional[str],
    zTitle: Optional[str],
    smiles: List[str],
    selectedPoints: List[int],
    hovertext: List[str],
    filterColumns: List[FilterColumn],
    colorBy: List[float],
    legendLabel: str,
    categorical: Optional[bool],
    marker=None,
    overlayClassName="",
) -> List[int]:
    """
    Add a descriptive docstring
    """

    component_value = _component_func(
        x=x,
        y=y,
        z=z,
        xTitle=xTitle,
        yTitle=yTitle,
        zTitle=zTitle,
        smiles=smiles,
        selectedDataIndices=selectedPoints,
        hovertext=hovertext,
        overlayClassName=overlayClassName,
        filterColumns=filterColumns,
        marker=marker,
        colorBy=colorBy,
        legendLabel=legendLabel,
        categorical=categorical,
    )
    if component_value is None:
        return []
    else:
        return component_value["selectedDataIndices"]
