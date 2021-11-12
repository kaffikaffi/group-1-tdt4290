FROM python:3.8

COPY ./requirements.txt ./requirements.txt
RUN pip3 install -r requirements.txt
RUN pip3 install nltk
RUN pip3 install azure-storage-blob
COPY ./app /app
COPY ./config.py /config.py

EXPOSE 8080
ENTRYPOINT ["uvicorn","--host", "0.0.0.0", "--port", "8080", "app.main:app"]