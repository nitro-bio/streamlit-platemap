FROM python:3.11-slim
# Install curl
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

ADD --chmod=755 https://astral.sh/uv/install.sh /install.sh
RUN /install.sh && rm /install.sh

WORKDIR /usr/src/app

COPY dummy_data.csv ./
COPY *.zip ./
COPY requirements.txt ./
RUN /root/.cargo/bin/uv pip install --system --no-cache -r requirements.txt


COPY start.py ./

CMD ["streamlit", "run", "start.py","--server.port=5000", "--server.address=0.0.0.0", "--server.fileWatcherType", "none"]


