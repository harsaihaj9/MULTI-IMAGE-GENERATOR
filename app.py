import os
import zipfile
import time
from flask import Flask, request, send_file, render_template
from icrawler.builtin import GoogleImageCrawler

app = Flask(__name__)

DOWNLOAD_FOLDER = "static/downloads"
ZIP_FILE = "static/images.zip"

def clear_old_images(folder):
    if os.path.exists(folder):
        for file in os.listdir(folder):
            os.remove(os.path.join(folder, file))

def download_images(query, num_images, folder=DOWNLOAD_FOLDER):
    clear_old_images(folder)
    os.makedirs(folder, exist_ok=True)
    
    crawler = GoogleImageCrawler(storage={"root_dir": folder})
    crawler.crawl(keyword=query, max_num=num_images)
    
    for i in range(1, num_images + 1):  # Simulate progress delay
        time.sleep(1)
        print(f"{i}/{num_images} images downloaded...")

def create_zip(folder=DOWNLOAD_FOLDER, zip_filename=ZIP_FILE):
    with zipfile.ZipFile(zip_filename, "w") as zipf:
        for file in os.listdir(folder):
            zipf.write(os.path.join(folder, file), file)
    return zip_filename

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/download", methods=["POST"])
def download():
    data = request.json
    keyword = data["keyword"]
    num_images = int(data["num_images"])

    download_images(keyword, num_images)
    zip_path = create_zip()

    return {"zip_url": "/" + zip_path}

@app.route("/get_zip")
def get_zip():
    return send_file(ZIP_FILE, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
