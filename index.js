
const content = {
    about: {
        title: "Night - About me",
        text: `
            <h1 class="Title">Night</h1>
            <p>he/him/they/them</p>
            <p>17</p>
            <p>A neurodivergent person interested in front-end web-developing and having fun. :&gt;</p>

            <h2>Labels</h2>
            <p>Aro-spec, Allosexual</p>
            <p>Crosspronominal, Genderfluid, Non-binary.</p>

            <h2>Neurotype</h2>
            <p>Neurodivergent + PDA</p>
        `
    },

    interests: {
        title: "Night - Interests",
        text: `
            <h1 class="Title">Interests</h1>
            <p>Buses,</p>
            <p>Games,</p>
            <p>Military,</p>
            <p>Literature,</p>
            <p>LGBTQ microlabels,</p>
            <p>Hanging out together,</p>
            <p>Fanfictions,</p>
            <p>Character bashing / shipping,</p>
            <p>NCIS / Crime Thriller,</p>
            <p>HTTYD (films + RTTE),</p>
            <p>Dinosaurs,</p>
            <p>TV Shows,</p>
            <p>Rhythm Games,</p>
            <p>Animals,</p>
            <p>learning new things!</p>
        `
    },

    dni: {
        title: "Night - DNI",
        text: `
            <h1 class="Title">DNI</h1>
            <p>&lt;14, &gt;25</p>
            <p>Reform/Restore UK supporter.</p>
            <p>MAGA.</p>
            <p>"politics don't matter"</p>
            <p>Heavy Gen AI users - pls only use as a tool, don't let it replace ur humanity, ily</p>
            <p>Drama-filled - don't start drama w me pls im tired but idm giving advice</p>
            <p>Shit-talking abt me and not communicating ur problems to me</p>
            <p>If u use slurs, nty, not around me</p>
            <p>homophobic / transphobic / xenophobic - don't ask me how to say "bottle of water", it doesn't get funny after the 50th time hearing it.</p>
            <p>Expecting romance - im not in for dating sorry :&lt;</p>
            <p>self-centered - its ok to talk abt urself but let me have chances to talk abt myself too? :&gt;</p>
            <p>Pls don't expect me to be available all the time, mh and schl reasons.</p>
            <p>MAP / Zoo (it's okay to have paraphilias but please get treated w therapy and don't hurt anyone)</p>
        `
    },

    notes: {
        title: "Night - Notes",
        text: `
            <h1 class="Title">Notes</h1>
            <p>I love every friend of mine sm :><p>
            <p>P.S, we love github deposits helping with the drawing <33<p>
        `
    },

    friends: {
        title: "Night - Friends",
        text: `
            <h1 class="Title">Friends</h1>
            <p>Yuri</p>
            <p>Honey</p>
            <p>Phoebe</p>
            <p>Iris</p>
            <p>Dells</p>
            <p>Bwoi</p>
            <p>etc</p>
        `
    }
};



const navButtons = document.querySelectorAll(".nav-card");
const popupTitle = document.getElementById("popup-title");
const popupContent = document.getElementById("popup-content");
const popup = document.querySelector(".profile-popup");
const okButton = document.getElementById("popup-ok");

function showSection(section) {
    const selected = content[section];

    if (!selected) return;

    popupTitle.textContent = selected.title;
    popupContent.innerHTML = selected.text;

    popup.classList.remove("closed");
}

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        showSection(button.dataset.section);
    });
});

// Show About me when the website first loads
showSection("about");

// Close popup with OK
okButton.addEventListener("click", () => {
    popup.classList.add("closed");
});


const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("draw-color");
const brushSize = document.getElementById("brush-size");
const eraser = document.getElementById("eraser");
const clearButton = document.getElementById("clear-canvas");

let drawing = false;
let currentColor = "#000000";
let currentSize = 4;
let isErasing = false;


// Resize canvas while preserving existing drawing bc if this doesnt freaking work im gonna crash out

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) return;

    const oldCanvas = document.createElement("canvas");
    oldCanvas.width = canvas.width;
    oldCanvas.height = canvas.height;

    if (oldCanvas.width > 0 && oldCanvas.height > 0) {
        oldCanvas.getContext("2d").drawImage(canvas, 0, 0);
    }

    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (oldCanvas.width > 0 && oldCanvas.height > 0) {
        ctx.drawImage(
            oldCanvas,
            0, 0, oldCanvas.width, oldCanvas.height,
            0, 0, rect.width, rect.height
        );
    }
}

const canvasObserver = new ResizeObserver(resizeCanvas);
canvasObserver.observe(canvas);


// Get pointer position

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}


// Start drawing

function startDrawing(e) {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);

    const pos = getPosition(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}


// Draw

function draw(e) {
    if (!drawing) return;

    const pos = getPosition(e);

    ctx.lineWidth = currentSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (isErasing) {
        ctx.globalCompositeOperation = "destination-out";
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = currentColor;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}


// Stop drawing

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
    ctx.globalCompositeOperation = "source-over";
}


// Canvas events

canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);


// Colour picker

colorPicker.addEventListener("input", () => {
    currentColor = colorPicker.value;
    isErasing = false;
});


// Brush size

brushSize.addEventListener("input", () => {
    currentSize = Number(brushSize.value);
});


// Eraser

eraser.addEventListener("click", () => {
    isErasing = true;
});


// Clear canvas

clearButton.addEventListener("click", () => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
});


// discord thingy pls work asdijodhjas//

const submitButton = document.getElementById("submit-drawing");

submitButton.addEventListener("click", async () => {
    const drawing = await new Promise(resolve => {
        canvas.toBlob(resolve, "image/png");
    });

    if (!drawing) {
        alert("Couldn't create your drawing!");
        return;
    }

    const formData = new FormData();
    formData.append("drawing", drawing, "drawing.png");

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
const response = await fetch("https://lgdyngwuxmvbcyvkdieh.supabase.co/functions/v1/submit-drawing", {
    method: "POST",
    headers: {
        "apikey": "sb_publishable_-qAjxG_F6Z81NRShOw74Dg_MogSjO7y"
    },
    body: formData
});

        if (!response.ok) {
            throw new Error("Submission failed");
        }

        alert("Your drawing was sent! tysm <33");

    } catch (error) {
        console.error(error);
        alert("It couldn't send your drawing :( Please try again!");

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit drawing";
    }
});
