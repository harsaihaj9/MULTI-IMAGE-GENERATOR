function downloadImages() {
    let keyword = document.getElementById("keyword").value;
    let numImages = parseInt(document.getElementById("num_images").value);
    let progressBar = document.getElementById("progress-bar");
    let progressText = document.getElementById("progress-text");
    let progressContainer = document.getElementById("progress-container");

    if (!keyword || !numImages || numImages <= 0) {
        alert("Please enter a valid keyword and number of images.");
        return;
    }

    // Show progress indicator
    progressContainer.style.display = "block";
    progressText.innerText = "Starting download...";
    progressBar.style.width = "0%";

    fetch("/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword, num_images: numImages })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to start download.");
        }
        return response.json();
    })
    .then(data => {
        let interval = setInterval(() => {
            let progress = parseInt(progressBar.style.width) || 0;
            if (progress < 100) {
                progress += Math.floor(100 / numImages);
                progressBar.style.width = progress + "%";
                progressText.innerText = `${Math.min(progress, 100)}% - Downloading images...`;
            } else {
                clearInterval(interval);
                progressText.innerText = "Zipping files...";
            }
        }, 500);

        setTimeout(() => {
            let downloadLink = document.getElementById("download_link");
            downloadLink.href = data.zip_url;
            downloadLink.style.display = "block";
            progressText.innerText = "Completed!";
            progressBar.style.width = "100%";
        }, numImages * 1000);  // Simulate download delay
    })
    .catch(error => {
        alert("Error downloading images. Please try again.");
        console.error(error);
    });
}
