import streamlit as st
import pandas as pd
from pandas.api.types import (
    is_categorical_dtype,
    is_datetime64_any_dtype,
    is_numeric_dtype,
    is_object_dtype,
)
import numpy as np
from typing import Any, TypedDict, List, Union, Literal

import molecule3dplot

st.set_page_config(
    layout="wide",
)


class FilterColumn(TypedDict):
    key: str
    label: str
    values: List[str]
    filter_type: Union[Literal["number"], Literal["text"]]


def main():
    st.title("Visualize molecules in 3D scatter plots")
    df = pd.read_csv("dummy_data.csv")
    df.dropna(inplace=True)
    data: Any = df.to_dict(orient="records")

    st.header("Select points in 3D scatter plot")
    selectedPoints3D = []
    selectedPoints3D = selectedPointPlot(data, selectedPoints3D)
    selectedRows3D = [data[i] for i in selectedPoints3D]
    st.table(data=selectedRows3D)

    st.header("Selected points in 2D table")
    selectedPoints2D = []
    selectedPoints2D = selectedPointPlot(data, selectedPoints2D, hideZ=True)
    selectedRows2D = [data[i] for i in selectedPoints2D]
    st.table(data=selectedRows2D)

    # Combined view
    combinedPoints = set(selectedPoints3D).union(set(selectedPoints2D))

    # get selectedPoints rows from data
    combinedRows = [data[i] for i in combinedPoints]
    st.table(data=combinedRows)


def selectedPointPlot(data, selectedPoints, hideZ=False):
    z = [d["r3"] for d in data]
    zTitle = "r3"
    if hideZ:
        z = None
        zTitle = None
    return molecule3dplot.molecule3dplot(
        selectedPoints=selectedPoints,
        xTitle="r1",
        yTitle="r2",
        zTitle=zTitle,
        filterColumns=[
            {
                "key": "cpd_index",
                "label": "Compound Index",
                "values": [d["cpd_index"] for d in data],
                "filter_type": "text",
            },
            {
                "key": "r1",
                "label": "r1",
                "values": [d["r1"] for d in data],
                "filter_type": "number",
            },
            {
                "key": "r2",
                "label": "r2",
                "values": [d["r2"] for d in data],
                "filter_type": "number",
            },
            {
                "key": "r3",
                "label": "r3",
                "values": [d["r3"] for d in data],
                "filter_type": "number",
            },
            {
                "key": "mw",
                "label": "Molecular Weight",
                "values": [d["mw"] for d in data],
                "filter_type": "number",
            },
        ],
        x=[d["r1"] for d in data],
        y=[d["r2"] for d in data],
        z=z,
        hovertext=[
            [
                f"cpd_index: {d['cpd_index']}",
                f"r1: {d['r1']}",
                f"r2: {d['r2']}",
                f"r3: {d['r3']}",
                f"mw: {d['mw']}",
            ]
            for d in data
        ],
        smiles=[d["smiles"] for d in data],
        marker={
            "size": [8 for _ in data],
        },
        categorical=True,
        colorBy=["foo" if d["r2"] % 2 else "bar" for d in data],
        legendLabel="Color by foo/bar",
        overlayClassName="fixed top-0 left-0",
    )


if __name__ == "__main__":

    main()
