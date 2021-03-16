 function makeScreenshot() {
        html2canvas(document.getElementById("right"), {scale: 1}).then(canvas => {
            document.body.appendChild(canvas);
        });
    }