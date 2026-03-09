chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FETCH_API") {
    fetch(request.url, request.options)
      .then(async (response) => {
        if (!response.ok) {
          sendResponse({ success: false, status: response.status });
          return;
        }
        const data = await response.json();
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.toString() });
      });
    return true; // Keep the messaging channel open for the async response
  }

  if (request.type === "FETCH_IMAGEAsObjectUrl" || request.type === "FETCH_IMAGEAsBase64") {
    fetch(request.url)
      .then(async (response) => {
        if (!response.ok) {
          sendResponse({ success: false, status: response.status });
          return;
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          sendResponse({ success: true, base64: reader.result });
        }
        reader.onerror = () => {
          sendResponse({ success: false, error: "Failed to read blob" });
        }
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.toString() });
      });
    return true;
  }

  if (request.type === "UPLOAD_IMAGE_FROM_URL") {
    fetch(request.url)
      .then(async (response) => {
        if (!response.ok) throw new Error("Image fetch failed");
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("image", blob);
        
        const uploadResponse = await fetch(`https://api.recipesage.com/images?token=${request.token}`, {
          method: "POST",
          body: formData
        });
        
        if (!uploadResponse.ok) throw new Error("Upload failed");
        const data = await uploadResponse.json();
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.toString() });
      });
    return true;
  }
});
