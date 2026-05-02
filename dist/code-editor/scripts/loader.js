function openHTMLFile() {
    document.getElementById("htmlFileInput").click();
}

document.getElementById("openHTMLFile").addEventListener("click", openHTMLFile);

document.getElementById("htmlFileInput").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const htmlContent = e.target.result;

        // put loaded code into the editor
        const htmlEditor = document.getElementById("htmlcode");
        htmlEditor.textContent = htmlContent;

        // load it into the preview iframe
        const iframe = document.getElementById("htmliframe");
        iframe.srcdoc = htmlContent;
    };

    reader.readAsText(file);
});
