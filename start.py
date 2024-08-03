import streamlit as st
from typing import Any, TypedDict, List, Union, Literal
import streamlit_platemap

st.set_page_config(layout="wide")
initial_data = {
    "wells": 96,
    "colAnnotations": [
        {
            "cols": [0, 1, 2, 3],
            "label": "Patient 1",
            "id": "Patient 1",
            "color": "blue",
        },
        {
            "cols": [4, 5, 6, 7],
            "label": "Patient 2",
            "id": "Patient 2",
            "color": "green",
        },
        {
            "cols": [8, 9, 10, 11],
            "label": "Patient 3",
            "id": "Patient 3",
            "color": "fuchsia",
        },
    ],
    "rowAnnotations": [
        {
            "rows": [0, 1],
            "label": "Antibody 1 μmol/L",
            "id": "Antibody 1 μmol/L",
            "color": "cyan",
        },
        {
            "rows": [3, 4],
            "label": "Antibody 2 μmol/L",
            "id": "Row Annotation 1",
            "color": "yellow",
        },
        {
            "rows": [6, 7],
            "label": "Antibody 3 μmol/L",
            "id": "Row Annotation 2",
            "color": "red",
        },
    ],
    "wellAnnotations": [
        {
            "id": "Treatment 1",
            "label": "Treatment 1",
            "wells": [
                0,
                12,
                36,
                48,
                72,
                84,
                4,
                16,
                40,
                52,
                76,
                88,
                8,
                20,
                44,
                56,
                80,
                92,
            ],
            "color": "blue",
            "metadata": {"foo": "bar"},
        },
        {
            "id": "Treatment 2",
            "label": "Treatment 2",
            "wells": [
                1,
                13,
                37,
                49,
                73,
                85,
                5,
                17,
                41,
                53,
                77,
                89,
                9,
                21,
                45,
                57,
                81,
                93,
            ],
            "color": "red",
            "metadata": {"foo": "bar"},
        },
        {
            "id": "Postive Control",
            "label": "Postive Control",
            "wells": [
                2,
                14,
                38,
                50,
                74,
                86,
                6,
                18,
                42,
                54,
                78,
                90,
                10,
                22,
                46,
                58,
                82,
                94,
            ],
            "color": "green",
            "metadata": {"foo": "bar"},
        },
        {
            "id": "Negative Control",
            "label": "Negative Control",
            "wells": [
                3,
                15,
                39,
                51,
                75,
                87,
                7,
                19,
                43,
                55,
                79,
                91,
                11,
                23,
                47,
                59,
                83,
                95,
            ],
            "color": "fuchsia",
            "metadata": {"foo": "bar"},
        },
    ],
}


def main():
    st.title("Custom Platemap")
    st.write("This is a custom platemap component")
    wells = initial_data["wells"]
    # add input for wells

    st.write("Initial Well Size")
    wells = st.selectbox("Wells", [24, 48, 96, 384], index=2)

    rowAnnotations = initial_data["rowAnnotations"]
    colAnnotations = initial_data["colAnnotations"]
    if "wellAnnotations" not in st.session_state:
        print("initializing wellAnnotations")
        st.session_state["wellAnnotations"] = initial_data["wellAnnotations"]
    updated_wellAnnotations = platemap(
        wells, rowAnnotations, colAnnotations, st.session_state["wellAnnotations"]
    )
    have_changes = len(updated_wellAnnotations) > 0
    if have_changes and updated_wellAnnotations != st.session_state["wellAnnotations"]:
        st.session_state["wellAnnotations"] = updated_wellAnnotations
        st.rerun()

    st.write("Updated Well Annotations")
    st.write(st.session_state["wellAnnotations"])


def platemap(wells, rowAnnotations, colAnnotations, wellAnnotations):
    return streamlit_platemap.streamlit_platemap(
        {
            "wells": wells,
            "rowAnnotations": rowAnnotations,
            "colAnnotations": colAnnotations,
            "wellAnnotations": wellAnnotations,
        }
    )


if __name__ == "__main__":
    main()
