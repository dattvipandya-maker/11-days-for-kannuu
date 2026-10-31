
// ===== PASSWORD SYSTEM =====

const passwordForm = document.getElementById("passwordForm");

if (passwordForm) {

    const passwordInput = document.getElementById("secretPassword");
    const message = document.getElementById("message");

    const welcomeScreen = document.getElementById("welcomeScreen");
    const dashboard = document.getElementById("dashboard");

    const correctPassword = "Kannu";

    passwordForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const enteredPassword = passwordInput.value.trim();

        if (enteredPassword === correctPassword) {

            message.textContent = "";

            welcomeScreen.hidden = true;
            dashboard.hidden = false;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            updateDashboard();

        } else {

            message.textContent =
                "Oops! Wrong password. Try again! 💜";

            passwordInput.value = "";
            passwordInput.focus();
        }
    });
}


// ===== INDIA DATE SYSTEM =====

function getIndiaDate() {

    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const values = {};

    parts.forEach(part => {
        values[part.type] = part.value;
    });

    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day)
    };
}


// ===== AVAILABLE DAY CALCULATION =====

function getAvailableDay() {

    const today = getIndiaDate();

    const startDate = Date.UTC(2026, 10, 1);

    const todayDate = Date.UTC(
        today.year,
        today.month - 1,
        today.day
    );

    if (todayDate < startDate) {
        return 0;
    }

    const difference = Math.floor(
        (todayDate - startDate) / 86400000
    );

    return Math.min(difference + 1, 11);
}


// ===== OPENED SURPRISE TRACKING =====

function getOpenedDays() {

    try {

        const saved = JSON.parse(
            localStorage.getItem("kannuOpenedDays") || "[]"
        );

        return Array.isArray(saved) ? saved : [];

    } catch (error) {

        return [];
    }
}


function saveOpenedDay(day) {

    const openedDays = getOpenedDays();

    if (!openedDays.includes(day)) {

        openedDays.push(day);

        localStorage.setItem(
            "kannuOpenedDays",
            JSON.stringify(openedDays)
        );
    }
}


// ===== OPEN SURPRISE SYSTEM =====

function openSurprise(day) {

    const availableDay = getAvailableDay();

    if (day > availableDay || day < 1 || day > 11) {
        return;
    }

    saveOpenedDay(day);

    if (day === 11) {

        window.location.href = "daily/day11.html";

    } else {

        window.location.href = "daily/day" + day + ".html";
    }
}


// ===== DASHBOARD SYSTEM =====

function updateDashboard() {

    const availableDay = getAvailableDay();

    const cards = document.querySelectorAll(".day-card");

    const openedDays = getOpenedDays();

    cards.forEach(card => {

        const day = Number(card.dataset.day);

        const button = card.querySelector(".day-button");

        if (!button) return;

        if (day <= availableDay) {

            button.disabled = false;

            if (openedDays.includes(day)) {

                button.textContent = "Reopen Surprise ↻";

            } else {

                button.textContent = "Open Surprise ✨";
            }

            button.onclick = function() {

                openSurprise(day);
            };

        } else {

            button.textContent = "Locked 🔒";

            button.disabled = true;

            button.onclick = null;
        }
    });


    // ===== PROGRESS TRACKING =====

    const progress = document.getElementById("progressFill");

    const progressText = document.getElementById("progressText");

    const totalOpened = openedDays.length;

    const percentage = (totalOpened / 11) * 100;

    if (progress) {

        progress.style.width = percentage + "%";
    }

    if (progressText) {

        progressText.textContent =
            totalOpened + " of 11 surprises opened";
    }
}


// ===== DAY 1 MYSTERY BOX =====

function revealHint() {

    const hint = document.getElementById("hintMessage");

    const button = document.getElementById("hintButton");

    if (!hint || !button) return;

    hint.hidden = false;

    button.textContent = "Hint revealed ✨";

    button.disabled = true;
}
